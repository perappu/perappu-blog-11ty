---
title: MariaDB Galera Cluster with Load Balancing via HAProxy
description: How to set up a MariaDB Galera Cluster with load balancing
date: 2025-11-24
tags: ["mariadb", "sysadmin"]
---

For my [hosting services](/commission/lorekeeper/), I've been in the process of making them slowly more and more scalable. My latest endeavour to do that was to move from one DB server to a MariaDB Galera cluster.

In short, I wanted multiple DB servers that could semi-intelligently split the server load. Galera clusters automatically replicate the data across all servers within them.

## Setting Up The Cluster

I use Hetzner for my servers. I started by creating 3 separate Hetzner VPSs -- each named some variant of galera-1, etc. **Make sure they are all on the same private network, as we will be using private IP addresses where possible.** No matter how many you set up, make sure it's an odd number, in order to avoid this thing called the ["split-brain scenario"](https://en.wikipedia.org/wiki/Split-brain_(computing)).

Follow whatever steps you prefer for setting up and securing a Linux VPS. I will be using Ubuntu in this guide, and we will be setting up the firewall as part of it, so you can skip that.

In theory, you could containerize all of these, but I decided not to because I wanted to utilize Hetzner's placement groups. This will try to place the VPSs away from eachother, so that if one goes down, it's less likely the others will as well.

> I will also be assuming that you are using the latest version of MariaDB (or at least 10.4+) for everything. Please view their documentation if you require compatibility with old versions.

Mercifully, the [MariaDB docs](https://mariadb.com/docs/galera-cluster/galera-cluster-quickstart-guides/mariadb-galera-cluster-guide) are pretty decent when it comes to how to configure a Galera cluster, so this is mostly pulled from there.

### 1. Synchronize Clocks 
Firstly, you will need to synchronize the clocks on the servers. This is done via something called NTP.
Setting up NTP as the time synchronization on Ubuntu is very easy:

```
sudo timedatectl set-ntp no

# Verify output of below command shows 'NTP service: inactive'
timedatectl

sudo apt install ntp

# Verify it works
ntpq -p
```

### 2. Galera Installation

You will perform the following actions on **each node**.

As MariaDB recommends, use their package repositories:

```
sudo apt update
sudo apt install dirmngr software-properties-common apt-transport-https ca-certificates curl -y
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash
sudo apt update
```

Then install all the Galera packages:
```
sudo apt install mariadb-server mariadb-client galera-4 -y
```

And perform a secure installation:
```
sudo mariadb-secure-installation
```

I personally set a different root password for each node. The root account is **not** replicated.

Answer YES to:
- Remove anonymous users
- Disable remote root login
- Remove test database
- Reload privilege tables

Then `sudo systemctl stop mariadb` on **all nodes**.

**DON'T DO ANYTHING ELSE** to these servers yet. Don't start migrating data over, nothing. We need to set up replication first.

### 3. Configure Firewall

Instead of using UFW, I used Hetzner's firewall service. It's free and I can apply it to all nodes at the same time. The main advantage is that it's very easy limit those ports to only being accessible via the private network, where you'd otherwise need to try to keep one billion UFW rules consistent.

> Please note that you will still need to use UFW for the proxy server, due to some issues that will be elaborated on later.

Here are the ports needed for Galera, associated with various private IP addresses:
[<img src="/content/img/hetzner-galera-ports.png" alt="list of ports associated with private IP addresses">](/content/img/hetzner-galera-ports.png){data-fslightbox data-type="image"}

Make sure to allow all Galera servers to connect to eachother on 3306 TP, 4567 TCP **and** UDP, 4568 TCP, and 4444 TCP. Include the IP address of the future proxy server as being able to also connect on 3306.

If you want to use UFW instead or you're on a VPS that doesn't provide a firewall service, here are the ufw commands:

```
sudo ufw allow OpenSSH # for obvious reasons, if you haven't already
sudo ufw allow 3306/tcp  # MariaDB client connections
sudo ufw allow 4567/tcp  # Galera replication (multicast and unicast)
sudo ufw allow 4567/udp  # Galera replication (multicast)
sudo ufw allow 4568/tcp  # Incremental State Transfer (IST)
sudo ufw allow 4444/tcp  # State Snapshot Transfer (SST)
sudo ufw reload
sudo ufw enable # If firewall is not already enabled
```

### 4. Configure Galera

On each node server, create a config file with `nano /etc/mysql/conf.d/galera.cnf`.

Include these contents in the file:

```
[mysqld]
# Basic MariaDB settings
binlog_format=ROW
default_storage_engine=InnoDB
innodb_autoinc_lock_mode=2
bind-address=0.0.0.0 # Binds to all network interfaces. Adjust if you have a specific private IP for cluster traffic.

# Galera Provider Configuration
wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so # Adjust path if different (e.g., /usr/lib64/galera-4/libgalera_smm.so)

# Galera Cluster Configuration
wsrep_cluster_name="CLUSTERNAME" # A unique name for your cluster

# IP addresses of ALL nodes in the cluster, comma-separated.
# Use private IPs if available for cluster communication.
wsrep_cluster_address="gcomm://IPADDRESSES"

# This node's specific configuration
wsrep_node_name="NODENAME" # Must be unique for each node (e.g., node1, node2, node3)
wsrep_node_address="NODEIPADDRESS" # This node's own private IP address
```

These are the values you need to change:
- `wsrep_cluster_name` - The name of your cluster. This must be identical on all nodes.
- `wsrep_cluster_address` - More or less a comma separated list of your nodes. Example value: `wsrep_cluster_address="gcomm://10.1.0.4,10.1.0.6,10.1.0.7"`
- `wsrep_node_name` - A unique name for this node. "node1", "node2", etc is sufficient.
- `wsrep_node_address` - The private IP address of the node, such as "10.1.0.4".

Save this file.

On **each node**, you will also want to change the server bind address.

Open `nano /etc/mysql/mariadb.conf.d/50-server.cnf` and change the `bind_address` value to `0.0.0.0` instead of `127.0.0.1`.

[<img src="/content/img/mariadb-bindaddress.png" alt="changing the bind_address value in 50-server.cnf">](/content/img/mariadb-bindaddress.png){data-fslightbox data-type="image"}

Save the file, and once you have filled it out on each server, move onto the next step.

### 5. Start the Cluster

Stop all nodes with `sudo systemctl stop mariadb` if you haven't already.

Then, on the **first node only**, start the cluster with:
```
sudo galera_new_cluster
```

Next, on all other nodes, start the service **normally**:
```
sudo systemctl start mariadb
```

The cluster should be started and nodes will automatically connect to it.

To verify the cluster, login to any node with `sudo mariadb -u root -p`.

After entering the MariaDB shell, execute the command `SHOW STATUS LIKE 'wsrep_cluster_size';`.

You should see an output like this, with the size of your cluster:
![output of SHOW STATUS LIKE wsrep_cluster_size command](/content/img/wsrepclustersize.png)

You can further test replication if you'd like by creating test users or databases.

## Setting up HAProxy

Now for the... _exciting_ part, and by that I mean the part that gave me the most headache.

HAProxy is a very powerful yet obtuse piece of software, which we will be configuring to forward connections to our three databases in a round-robin pattern.

> We don't use a Hetzner load balancer here because the Hetzner load balancer has no way of polling the SQL server specifically. HAProxy isn't very intelligent, but it contains a "sql-check" function that will at the very least check if the server is ready for connections before forwarding the traffic.

Create a new VPS, and secure it in your preferred manner. It can be very small, because all it'll be doing is routing traffic.

### 1. HAProxy DB User

First, we're actually going to go back to one of our node servers. Connect to any node and access the database with `sudo mariadb -u root -p`.

Now, we are going to add a DB user for HAProxy. This user does not need and absolutely should not have **any permissions**. It needs to be configured **without a password**. Hence, execute a simple:

```
CREATE USER 'haproxy'@'PRIVATEPROXYSERVERIP';
```

Replace the IP address with the private IP of your proxy server.

### 2. HAProxy Firewall

Switch back to your proxy server. We're going to configure the firewall on it.

If you plan to connect to your DB via a domain name (such as sql.yourdomain.com), then you **can not** use Hetzner's firewall. It will prevent the domain name from resolving correctly.

These are the UFW rules which worked for me:
```
sudo ufw allow OpenSSH
sudo ufw allow from WEBSERVERIPADDRESS to any port 3306
sudo ufw allow from PRIVATEWEBSERVERIPADDRESS to any port 3306
```

Replace the web server IP address with whatever IP will be connecting to the DB.

### 2. HAProxy Config

Install HAProxy with:

```
sudo apt-get install haproxy
sudo systemctl start haproxy
```

Next, we will edit the HAProxy config file:
```
sudo nano /etc/haproxy/haproxy.cfg
```

At the **bottom of the file**, we will be adding these lines. Edit with your private IP addresses for each node:
```
frontend galera_cluster_frontend
        mode tcp
        bind *:3306
        option tcplog
        default_backend galera_cluster_backend

backend galera_cluster_backend
        mode tcp
        balance roundrobin
        option tcpka
        option mysql-check user haproxy
        server node1 PRIVATEIPONE:3306 check weight 1
        server node2 PRIVATEIPTWO:3306 check weight 1
        server node3 PRIVATEIPTHREE:3306 check weight 1
```

Save this file, and restart HAProxy to make the changes:
```
sudo systemctl start haproxy
```

Many guides will now configure stats for HAProxy. I decided not to, because I didn't want everyone on the internet to be able to see the stats of my load balancer.

## Conclusion

In your web application, you should now be able to use the IP address of your HAProxy server just as if it were a normal database on port 3306. 

Optionally, you can set the DNS records of a domain to point towards the HAProxy server and connect that way. If your web server is in the same private network, you could also simply use the private IP address of the HAProxy server to connect. Since we bound a wildcard to 3306, the sky's the limit.

As an aside, I also investigated utilizing ProxySQL instead of HAProxy for a more "intelligent" load balancing. Unfortunately, ProxySQL requires knowledge of _all_ database users, so if you're like me and using it in a circumstance where new DB users are being added all the time, you'd need something to synchronize new accounts into ProxySQL. Someone did [create a script](https://github.com/xeonvs/ProxySQL-User-Sync) but I struggled to make it work. It also would have required me to set up the proxy server to be listening on a port other than 3306, and I wanted to keep everything as compatible as possible.

Hope this quick guide saved you some digging through documentation. :] Thanks for reading!