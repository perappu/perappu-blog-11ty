---
title: Battling Bots with Iocaine, Firehol, and NGINX Reverse Proxy
description: How I combat bots with Iocaine and Firehol
date: 2026-11-10
tags: ['nginx', 'firehol', 'iocaine']
---

Anubis has been my tried and true for preventing bots... until about last week. There's been a lot of literature lately regarding the effectiveness of Anubis. While it definitely still works for combating a lot of traffic, I had a site's php-fpm crash due to a slew of bots that managed to make it through.

Which obviously meant I needed to find a different solution. I decided to try Iocaine and the "feed them garbage forever" strategy. This worked! Except I had some particularly stubborn bots that -- for some reason -- were continually throwing themselves at 404ing URLs. It was filling up my nginx access log so badly that it was causing the entire VPS to slow down.

That's where Firehol came in. Firehol is the friendlist, most flexible firewall option I was able to find. Most importantly, however, the team there maintains a tool with an `update-ipsets` command that facilitates your firewall being updated live with even the minute-by-minute changes available from respected IP blocklist sources (spamhaus, dshield, etc).

I know almost everyone except dinosaurs like me use Docker to run all their stuff now. I run everything natively, however. So if you're also a dinosaur who wants to keep everything as old school simple as possible, then this guide is for you!

In short, we will be **installing Iocaine to trap bots, the bot handler Nam-Shub of Enki to detect them, and Firehol to drop known bad IPs outright**. This guide will be rather straightforward and prescriptivist, as it is both a record of exactly what I did for myself and a guide for others who'd like to do the same.

> TODO: Setting up metrics with Grafana or Rybbit or something. I do the basic Prometheus server here, but it doesn't feed anywhere right now.

This guide is written for Iocaine v3. I'll try to update this when Iocaine v4 releases, but it's likely I will be quite late, so here's a [link to the v3 -> v4 migration tool](https://git.madhouse-project.org/iocaine/inconceivable) for when the time comes. Firehol is very stable production software, so it's unlikely the directions will change there.

### Installing Iocaine

I am using Ubuntu/Debian for this guide. If you're using something else, you'll need to find the equivalent command for your distro.

> Run everything in this guide as `sudo` (you can use `sudo su` for convenience).

Iocaine can be installed via apt:

```bash
curl -s https://iocaine.madhouse-project.org/_/debian/iocaine.sources -o /etc/apt/sources.list.d/iocaine.sources
```

```bash
apt install -y iocaine
```

That's it! If you want to start it up to make sure it works, use systemctl to start the service:

```bash
systemctl enable --now iocaine
```

### Installing Nam-Shub of Enki

> I will not be covering the default bot handler (QMK), since I was more interested in Nam-Shub of Enki, and (in an altered fashion) it's going to be the default in Iocaine v4 anyways. If you're interested, you can view the documentation on QMK [here](https://git.madhouse-project.org/iocaine/iocaine/src/branch/iocaine-3.x/iocaine-powder/embeds/defaults#user-content-configuring-qmk).

Nam-Shub of Enki is my bot handler of choice and will drive a lot of our Iocaine config. So let's just download it right off the bat:

```bash
cd /etc/iocaine
curl -OJ https://git.madhouse-project.org/api/packages/iocaine/generic/nam-shub-of-enki/latest/nam-shub-of-enki-latest.tar.zst
tar -xf nam-shub-of-enki-latest.tar.zst
```

This will create the folder `nam-shub-of-enki` in your `/etc/iocaine` directory.

### Configuring Iocaine

Iocaine stores its files in the rather sensible location `/etc/iocaine`. By default, this folder contains a `config.kdl` file and not much else.

The systemctl iocaine service is by default configured to also read configs from a `/etc/iocaine/config.d/` folder. So let's start by creating that folder:

```
mkdir /etc/iocaine/config.d/
```

> Iocaine has a command, `iocaine show`, that is supposed to show you its current config. Note that, as of this writing, it does **not** show configs loaded from /config.d/.

We will also want a folder to download our corpuses to feed the bots:

```
mkdir /etc/iocaine/corpus/
```

First, let's get an updated version of `ai.robots.txt`, so that Iocaine knows which bots to block. I put mind directly in `/etc/iocaine` because that made the most sense (not quite a config, definitely not a corpus):

```
curl -L https://github.com/ai-robots-txt/ai.robots.txt/raw/refs/heads/main/robots.json -o /etc/iocaine/ai.robots.txt-robots.json
```

Next, we'll need a list of words for iocaine to use for building urls and whatever else (note that this link won't work if you open it in a browser, but it'll download through curl just fine):

```
curl -L https://git.savannah.gnu.org/cgit/miscfiles.git/plain/web2 -o /etc/iocaine/corpus/words.txt
```

And finally, some text for Iocaine's Markov models. I highly recommend scrolling [Project Gutenberg](https://www.gutenberg.org) and picking whatever calls to you. Or, as is tradition, feed the AI bots the [Bee Movie script](https://dn760004.eu.archive.org/0/items/bee-movie-2007_202405/8-Bee%20Movie%20Script.txt). Pick your poison, here's mine:

```
curl -L https://archive.org/download/GeorgeOrwells1984/1984_djvu.txt -o data/corpus/1984.txt
curl -L https://archive.org/download/ost-english-brave_new_world_aldous_huxley/Brave_New_World_Aldous_Huxley_djvu.txt -o data/corpus/brave-new-world.txt
curl -L https://www.gutenberg.org/cache/epub/2130/pg2130.txt -o /etc/iocaine/corpus/utopia.txt
curl -L https://dn760004.eu.archive.org/0/items/bee-movie-2007_202405/8-Bee%20Movie%20Script.txt -o /etc/iocaine/corpus/beemovie.txt
```

We have our external files needed. Let's get to actually editing the configuration.

> You may want to edit these files on your local machine and use `rsync` to send them over to your server. .kdl files are extremely picky about whitespace, and the wrong arrangement of leading/trailing whitespace can cause Iocaine to fail ambiguously.

We will be editing the main `config.kdl` first. I think you can move this into `config.d` if you'd like, but I just kept it where it is.

Here is mine, configured for Nam-Shub of Enki:

```

```

We will create some extra configs in `config.d` now.

```
nano /etc/iocaine/config.d/00-
```

>If Iocaine is failing to start for ambiguous .kdl file related reasons, and you're certain you've got all your brackets closed properly, it's probably a whitespace issue with the .kdl file. I personally fixed this by opening up the config in Notepad++ and using Edit -> Blank Operations -> Trim Leading and Trailing Space to get everything normalized, then manually re-indenting everything. YMMV on how you choose to solve the problem.

### NGINX Configuration

## Setting Up Firehol

### Configuring Firehol

### Blocking IPs

Now that we're set up with Firehol, let's block some bad actors.

Blocking an ASN is the nuclear option, but it's one I had to do. I used [this site](https://hackertarget.com/as-ip-lookup/) to look up the ASN associated with the IPs that were slamming my site over and over.

### Further Reading

These were immensely helpful in figuring out how to set this up. Thank you!

- [Iocaine's documentation](https://iocaine.madhouse-project.org/documentation/3/getting-started/)
- [Nam-Shub of Enki's documentation](https://3.nam-shub-of-enki.iocaine.madhouse-project.org/)
- [WinnerWind's tutorial](https://winnerwind.in/tutorial/server/iocaine)
