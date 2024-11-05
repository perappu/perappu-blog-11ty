---
title: Lorekeeper Sysadmin Quest
description: How I developed my infrastructure for running 10+ unique Laravel environments.
date: 2024-11-02
tags: ["lorekeeper", "laravel", "sysadmin"]
---

### Introduction

Lorekeeper is a weird project, even barring the whole "what is a closed species masterlist" thing. 

It's designed to be as friendly as possible to people who have never hosted a website before, and in the current maintainer's own words, "it isn't actually one project, it's one project with a thousand forks and you have to keep downstream in mind at all times".

Because it's designed to be as simple as possible, most Lorekeeper servers (including mine) are just straight up locally installed on either Dreamhost or an Ubuntu droplet. No containers, no nothing, just old fashioned serving out of /var/www (or the home directory, in the case of Dreamhost) with a really basic git hook deployment setup.

I manage over a dozen ubuntu servers for my Lorekeeper managed hosting service. As a solo dev, I’ve really started to struggle with scale -- individually SSHing into each server to execute bespoke commands isn’t cutting it anymore. Every time you do a deployment for Lorekeeper, you have to run a slew of commands (composer update, artisan migrate, add-site-settings, optimize usually twice, whatever other special commands required).

It sucks and it's consuming all of my free time. I like providing this service, though, so I want to make it suck less. 

Here's the tale of me attempting that.

#### What I Needed
First, I had to solidify my actual needs. I needed a way to:
- **Control all my servers from one place** (maintenance stuff like apt update & upgrade).
- **Deploy my code** and execute all necessary deployment commands with (functionally) one or two button presses.
- A safe and secure database solution with **regular backups** that I can easily access from one place.
- A way to **serve transactional emails** for all sites in one place, rather than disparate (and fragile) Sendgrid/Mailersend/etc accounts.

Also, for any of these solutions, I need it to be:
- **Accessible from any of my computers**, and to anyone I might hire in the future to help me with my work.
- **Self-hosted and open source/free** (I'm on a budget, and I want everything to be as centrally located as possible)

#### What I Did

I’m going to break this article apart into a series on how I set up each aspect of the structure specifically:

- **Security:** Cloudflare Tunnels & Access Groups
- **Server Control/CI:** Rundeck
- **Code Storage (and some CI):** Forgejo & GitHub
- **Mail Service:** Mailcow

---

### Securing Infrastructure (Cloudflare Tunnels)

Let's address the security concern first. There's a lot of complicated solutions out there for private VPN proxy nonsense. I'm not going to pretend to understand any of them, and I don't trust myself to do any of them correctly. I'm not a cybersecurity expert.

So, I settled on securing all of my services with [Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/). Basically, that allows me to put everything behind a login page where I can specify whatever authentication requirements I want.

**Prerequisites:**
- A Cloudflare account
- A domain name that you either purchased via Cloudflare or is set up to use the Cloudflare nameservers

**First, we need to create a Cloudflare tunnel with the services we want to access.** You can either install the Cloudflare service locally, or use a container. **I opted to use the container solution**, and just make all my infrastructure containerized in general. The problem with using it locally is that there wasn't really an easy way to stop access to the outside world via IP (I experimented with Nginx reverse proxies for about six hours before giving up). So I just opted to containerize everything.

Here's the basic structure of a docker-compose file for Cloudflare tunnels:



Create an .env file in the same directory as this docker-compose:

Basically we only serve the app "locally" on the docker network, so it's only accessible within the docker network. The Cloudflare tunnel then exposes that stuff to the greater internet, and the Cloudflare access group. You did it correctly if you go to [your IP]:[your port] and the connection times out, but you can still access it via the URL defined in the Cloudflare tunnel.

By the way: if you just spun up the container and you're getting a 502 Bad Gateway, just give it a bit. Sometimes it takes a while for everything inside the containers to spin up (especially Rundeck, which will come up later).

Next, you need to set up the access group. This is what does the actual securing — adds the “login” page in front of your application.



And now we have to actually find services to connect to the tunnel. So here we go...

### Control Server (Ansible, Rundeck)

The one thing I knew before going into this adventure was that [Ansible](https://www.ansible.com) was probably going to be the solution to a lot of my problems. It's essentially a thing that reads a .yaml file of instructions, and performs those instructions on a remote server.

I installed Ansible directly onto a droplet and found it... useful, but clunky. Ansible is more or less just a python library to read yaml files. I realized I wanted visuals -- something with a GUI and buttons.

So I tried [Semaphore](https://semaphoreci.com). In short, it took forever to get work, and I hated it. You can't run ad-hoc commands, which is a big thing I wanted. It's basically just a visual playbook repository, which is cool, but still not what I actually wanted.

Then I finally tried what was in front of my face the entire time, because I use it at my day job -- [Rundeck](https://www.rundeck.com).

#### Configuring Rundeck

There is a lot of ways to get Rundeck going. The target audience is more Big Corporate than one solo developer, so most of the guides you'll find are completely with that in mind, aka, more or less useless.

To save any future people 3-4 days of guesswork, I have a "cloudflare-ansible-rundeck-postgres” dockerfile and docker-compose available at [my GitHub here](https://github.com/perappu/rundeck-ansible-postgres). Configure the relevant environment variables in an .env file next to the docker-compose.yml.

I ran Rundeck on its own droplet. I recommend you do the same. Rundeck hogs a lot of RAM, and adding additional services alongside it can complicate the tunnel setup. There's no downside and it can share the same access group as any of your other services. I have it on the $18/month Regular Intel from DigitalOcean, but you might be able to get away with less.

Now for the fun part: adding nodes and writing jobs!

### Emails (Mailcow)

When all I really need to do is send the occasional transactional (registration/verification) email, having a different SendGrid/Mailersend/etc for each website is both a) overkill and b) deeply annoying. I think SendGrid has insta-banned me at least four times now.

I went with [Mailcow](https://mailcow.email) for my mail solution. Dockerized Mailcow is pretty brainless to set up by itself. The hard part is:

- Finding an IP that isn't blacklisted by all the spam lists out there
- Setting up the DNS records so your domain name doesn't get abused by spam bots
- Understanding what the hell is going on with various email-related lingo

Notably, mailcow is the only thing I didn’t put behind a Cloudflare tunnel (for now). The networking for email is fragile enough as-is, and Mailcow comes preloaded with a lot of the security things I'd be concerned about.

#### Getting an IP
Don't even bother with DigitalOcean, Linode, or any of the other big players. They're all blacklisted already. I personally ended up using [Lunanode](https://www.lunanode.com) because it was suggested by some random dude on Reddit, but I know others who have used [Mythic Beasts](https://www.mythic-beasts.com) to great success. 

Basically, spin up the VPS and check the IP at [SpamRATS](https://www.spamrats.com). If it's blacklisted, either destroy the VPS and try again, or attempt a different provider.

#### Mail DNS Records
For the DNS records, I followed [this tutorial](https://hatembentayeb.hashnode.dev/mailcow-setting-up-a-full-featured-self-hosted-mail-server). Just in case that gets deleted at some point, I'll also document it here.

**Note:** if your domain name is through Cloudflare, disable the proxy on ALL of these records. You want it to show the gray cloud “DNS only” next to it.

The domain name I’m using in my examples is `placeholder.com` and an IP of `1.2.3.4`. Replace with your own domain and IP!

##### Standard Records:

| Type | Name | TTL | Value | Preference/Priority |
| ---- | ---- | ---- | ----- | ----------------- |
| A | mail | `default` | `1.2.3.4` | N/A |
| CNAME | `autoconfig` | `default` | `mail.placeholder.com` | N/A |
| CNAME |   `autodiscover`    |   `default`      | `mail.placeholder.com` |   N/A   |
| MX | @ | `default` | `mail.placeholder.com` | 10 |

##### Security Records:

| Type | Name | TTL | Value |
| ---- | ---- | ---- | ----- |
| TXT | `@` | default | `v=spf1 ip4:1.2.3.4 -all` |
| TXT | `dkim._domainkey` | default | **We will update this later after Mailcow gives us the value.** |
| TXT | `_dmarc` | default | See below. |

##### DMARC Records

I think you only really need one DMARC record, but you can collect them like Pokémon if you want. My logic was that verifying my domain through a lot of different methods can’t hurt.

- It’s a pain but you should sign up for [Dmarcian]("https://dmarcian.com/"). It might complain about your SPF records (it keeps complaining about mine…) but as long as you get the DMARC record from there, you’re good. 
- [Postmark’s DMARC service](https://dmarc.postmarkapp.com/) is extremely easy to get rolling. 
- I saw a dude on reddit suggest that adding things like Google’s [Postmaster tools](https://www.gmail.com/postmaster/) and Microsoft's [(SNDS) Smart Network Data Services](https://sendersupport.olc.protection.outlook.com/snds/) can help them trust your mail server, so I went ahead and signed up for those too. 
  - SNDS doesn’t actually add a DMARC record, but it’s similar purpose so that’s why I mentioned it here. You’ll need to set up a postmaster@yourdomain.com account, so you can set up SNDS at the end.

#### Installing Mailcow

Honestly, you should just check out their official documentation (or the above link I sent). I might write up a more detailed tutorial at a later date, but this is getting long enough as-is.

Some notes:
- I lump everything under the same domain name. By default a single domain has 10 mailboxes, but you can increase that.
- Make sure to update your DKIM record! It’s under System -> Configuration -> Options -> ARC/DKIM keys. Copy/paste the entire value into the DKIM record (starts with   `v=DKIM1;`) that we set up previously.

### The Deployment Saga
