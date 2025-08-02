---
title: Developing for the Lorekeeper Games Room Extension
description: How to create games for the Lorekeeper Games Room extension.
date: 2025-05-15
tags: ["lorekeeper"]
---

### Extension Overview

There are two types of games that can be added -- "Link" which simply adds a link to another page (such as if you wanted to list something like Higher or Lower in your games room) and "Game" which is a full-fledged game that allows utilization of the score submission features.

Steps to follow for installing a game:
1. Merge in the core games room extension
2. Merge in game you wish to install
3. In the Admin Panel, go to Data -> Games and create a new game.
4. Select the "Game" type and click save.
5. Scroll down to the bottom and select the game you have installed from the dropdown, then click save.
6. Configure the game within the presented form.

You can only have ONE copy of a game installed at a time, as all versions will share the same files.

### Basic Format

A game is comprised of several parts:

- A block with the name in `config\lorekeeper\game_options.php`
- A blade file in `resources\views\admin\games\data` which embeds into the admin panel for editing the game data
- A service in `app\Services\Game` which handles editing game data
- A blade file in `resources\views\games\games` which hosts the game itself and will be embedded into `resources\views\games\game.blade.php`
- A directory in `public\gamefiles` which contains the assets and scripts for the game itself

If you're not sure what framework to use for creating your games, I highly recommend [Phaser](https://phaser.io)! It's fast, highly active/supported, and integrates extremely well with some of the systems Games Room has in place.

### Handling Score Submission

By default, `resources\views\games\game.blade.php` includes three async functions as constants: `submitScore(score)`, `canSubmit()`, and `chargeCurrency(currencyID, amount)`.

You don't have to use these, but they are provided for convenience, as calling them will include the necessary CSRF token and PHP variables passed to the page.

If you are using Phaser, it's extremely simple to create a score submission block! Here is an example:

```
//add score submission text to the screen
const submitScoreText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'Submit Score', {
    fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff',
    stroke: '#000000', strokeThickness: 8,
    align: 'center'
}).setOrigin(0.5,-5);

//make it clickable
submitScoreText.setInteractive();

//add event to click the button once
submitScoreText.once('pointerup', async function ()
{
    submitScoreText.text = "Submitting score...";

    //using the submitScore embedded in the game page
    var result = await submitScore(this.score);

    submitScoreText.text = "Score submitted!";
}, this);
```

As an example, you can view [this repo](https://github.com/perappu/lorekeeper/tree/ext-dev/games/flappy) where one of Phaser's demo games (a Flappy Bird clone) was adapted to the Games Room extension.

### Handling the CSRF Token

Vanilla JS/JQuery or something like Phaser will not run into an issue with requesting a CSRF token, because you can leverage the functions built into game.blade.php, or otherwise use `csrf_token()` to send the `X-CSRF-Token` header with your POST request.

If you are using something like Godot or Unity, you may run into issues. There are several ways to circumvent this. Godot allows you to [bridge to Javascript](https://docs.godotengine.org/en/stable/tutorials/platform/web/javascript_bridge.html) so you can call the `submitScore()` function from there. Unity will likely require the use of API routes, as to my understanding it can't interface with the JS on the webpage.

API routes are debatably out of scope for this extension. You have a lot of options for pure HTML5/JS games -- but if API support is desired for things like Unity, then please let me know.

### Preparing the Game for Release

**Do NOT include the Games Room extension in your branch.** Your game should be on a completely vanilla version of the most recent core v3. This is to prevent merge errors if I update the extension in the future. 

If all works as planned, there should be close to zero merge errors when installing a game. The only expected exception is a potential merge error in `config\lorekeeper\game_options.php` if multiple games are installed -- a similar problem happens with item tags (which that functionality is based off of).