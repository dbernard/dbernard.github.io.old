---
layout: post
title: Introducing Pyckaxe
description: A Twitter Data Mining Tool
---

## {{ page.title }}: {{ page.description }}

Hello everyone! In this post I'd like to talk about a new tool I've been working
on called [Pyckaxe](https://github.com/dbernard/Pyckaxe).

Pyckaxe is a flexible Python based tool for data mining the Twitter public
stream, with multiple ways to parse and graph data. As of this post, Pyckaxe
provides scripts to calculate the most frequently used words, generate word
clouds, and even analyze sentiment for your collection of tweets!

This tool is still in **very** early stages, but the hope is that more parsing
and graphing capabilities will be added in the future.


### About Pyckaxe

Pyckaxe started as a series of functions I wrote over Thanksgiving to play
around with data collection and Twitter data mining. From there it evolved into
a more object oriented approach with hopes that it could be imported into other
projects.

Under the hood Pyckaxe uses [Tweepy](https://github.com/tweepy/tweepy), a
Twitter API for Python. There is a default `StreamListener` provided that
collects and stores tweet data in a local (sqlite) database. You also have the
option of providing Pyckaxe with your own custom listeners to collect and store
data based on your personal requirements (provided that your listener inherits
from the Tweepy `StreamListener`).

These design decisions were made in an effort to make Pyckaxe flexible. I wanted
Pyckaxe to be straightforward and very simple when it can be, but also
extensible enough to be able to fulfill different requirements when it needs to.


### Using Pyckaxe

Pyckaxe may be run as a standalone script from the command line or imported into
another application. Using Pyckaxe on its own will use the default listener and
sqlite databases for storage. You can also import Pyckaxe into an existing
project and collect tweets asynchronously.

The parsing and graphing tools follow the same mindset - they can be executed
independently or as part of another application. For more complete details on
how to use Pyckaxe, check out the [documentation](https://github.com/dbernard/Pyckaxe/blob/master/README.md)!


### The Results

Even in the these early stages, the results I've been able to get out of Pyckaxe
have been beautiful. Here are some examples:

1. Word Frequencies - The top 10 words in tweets about North Korea (after the
   drama around The Interview)

   <div class="well">
      north - 1937
      <br>korea - 1330
      <br>internet - 681
      <br>korea's - 535
      <br>sony - 334
      <br>offline - 204
      <br>hack - 170
      <br>us - 129
      <br>interview - 128
      <br>china - 89
   </div>

2. Word Clouds - A word cloud of the most frequently used words in tweets about
   Thanksgiving

   <a href="/img/posts/thanksgiving.jpg" title="Thanksgiving Word Cloud">
      <img src="/img/posts/thanksgiving.jpg" width="460">
   </a>

3. Sentiment Analysis - Analyzing the sentiment of tweets about the upcoming
   movie, Star Wars: The Force Awakens

   <a href="/img/posts/swtfasentiment.png" title="SW:TFA Sentiment Analysis">
      <img src="/img/posts/swtfasentiment.png" width="460">
   </a>


### The Goal

As I mentioned at the beginning of this post, Pyckaxe is still in very early
stages, and there is a lot to be done (just check out the issue tracker) to
clean things up and improve performance.

My end goal for Pyckaxe is for it to become a handy package for data mining and
parsing. I've always had an interest in data, so a single tool for mining and
visualizing data was the driving force behind my motivation.

Ultimately I hope that this tool will grow and be of use to others. If you're
interested in contributing, please feel free! Thanks for reading!

[Pyckaxe repository](https://github.com/dbernard/Pyckaxe)


