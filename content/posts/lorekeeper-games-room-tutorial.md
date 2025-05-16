---
title: Developing for the Lorekeeper Games Room Extension
description: How to create games for the Lorekeeper Games Room extension.
date: 2025-05-15
tags: ["lorekeeper"]
---

### Basic Format

A game is comprised of several parts:

- A block with the name in `config\lorekeeper\game_options.php`
- A blade file in `resources\views\admin\games\data` which embeds into the admin panel for editing the game data
- A service in `app\Services\Game` which handles editing game data
- A blade file in `resources\views\games\games` which hosts the game itself and will be embedded into `resources\views\games\game.blade.php`
- A directory in `public\gamefiles` which contains the assets and scripts for the game itself

If you're not sure what framework to use for creating your games, I highly recommend [Phaser](https://phaser.io)! It's fast, highly active/supported, and integrates extremely well with some of the systems Games Room has in place.

### Handling Score Submission

By default, `resources\views\games\game.blade.php` includes three async methods as constants: `submitScore(score)`, `canSubmit()`, and `chargeCurrency(currencyID, amount)`.

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

### Preparing the Game for Release

**Do NOT include the Games Room extension in your branch.** Your game should be on a completely vanilla version of the most recent core v3. This is to prevent merge errors if I update the extension in the future. 

If all works as planned, there should be close to zero merge errors when installing a game. The only expected exception is a potential merge error in `config\lorekeeper\game_options.php` if multiple games are installed -- a similar problem happens with item tags (which that functionality is based off of).