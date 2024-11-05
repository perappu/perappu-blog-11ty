---
title: ASA Modding - Adding Buffs to Dinos on Spawn
description: How to add a custom buff to a dino on spawn for Ark Survival Ascended.
date: 2024-06-22
tags: ["asa modding", "ue5"]
---

### Introduction

Kind of a weird choice for my first blog post, but I've been spending a lot of time trying to mod Ark Survival Ascended lately. The written documentation is exceptionally lacking, so I figured I'd try to pass on what I've learned. I'm by no means an expert, and I highly recommend reaching out to the Ark modding discord if you run into any issues.

Onwards!

### 

My initial concept for this mod was to add the functionality of the DynamicColorset dynamic config option.

My first thought was to use the "pre-spawn dino" event. This, apparently, used to work on ASE.

However, it appears the timing of this event was changed from ASA to ASE. A dino's colors are determined _after_ the pre-spawn event in ASA, but _before_ the pre-spawn event in ASE.

Someone in the Ark Modding discord, among other things, recommended attaching a buff to a dino on spawn.