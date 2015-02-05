---
layout: post
title: What I Learned From Data Mining The Super Bowl
description: I present the results from my Super Bowl 49 data mining experiment.
---

## {{ page.title }}

Three million, two hundred forty one thousand, four hundred and forty one
tweets.

Averaging over 11,373 tweets per minute.

Pyckaxe plowed through that much Twitter data over the course of Super Bowl
XLIX. And that's **with** the limitations of the Twitter Streaming API. Let me
explain by transitioning to our first discussion topic.

### What Went Wrong

So as I alluded to a second ago, there are some limitations built into the
Twitter Streaming API. The first, and I was aware of this ahead of time, is that
Twitter only gives you about 1% of the total firehose (all global tweets).

This isn't necessarily a bad thing as 1% of all tweets should still give an
accurate representation, and 99% of use cases don't have the need, storage
and/or computational power to handle all that data.

What I **didn't** anticipate was that there appears to be a limit to the number
of tweets Twitter will send you, which hovers somewhere around 200 tweets per
second. Below is a Timeline graph of the entire data set I collected as tweets
per 30 seconds:

(tweets per 30s graph)

### What Went Right

So my first mistake was tracking **too many** terms - I collected tweets that
contained any of the terms, "superbowl", "nfl", "#superbowl", "#superbowl49",
"#superbowlxlix", "#seahawks", "#patriots", or "#sb49". However, I'm a firm
believer that too much data (if there is such a thing) is better than not enough
data, and as a result I was able to salvage the Timeline graph by reducing the
data set by focusing on only one term.

Below is the corrected graph (time is in GMT +5):

(superbowlxlix graph with markings)

If we take a look at this graph we can see exactly where major events happened
in the game. The markings on the graph correspond to the events listed below (in
EST):

1. 6:00 - Just after official start time
2. 6:10 - Teams take the field
3. 6:16 - During national anthem
4. 6:25 - Seattle wins coin toss
5. 6:31 - Kickoff
6. 6:52 - Seattle interception in the end zone
7. 7:11 - First touchdown of the game (7 - 0 New England)
8. 7:33 - Seattle's first touchdown (7 - 7)
9. 7:47 - New England touchdown (14 - 7 New England)
10. 7:58 - Last second Seattle touchdown before halftime (14 - 14)
11. 8:00 - Halftime / halftime show
12. 8:53 - Seattle touchdown (24 - 14 Seattle)
13. 9:27 - New England touchdown (24 - 21 Seattle)
14. 9:46 - New England touchdown (28 - 24 New England)
15. 9:57 - (My personal favorite) [INCREDIBLE catch by Seattle's J. Kearse](http://youtu.be/fKOLqM-LnA0)
16. 9:59 - New England interception on the 1 yard line to guarantee win

Pretty cool, huh? The biggest moments in the game are clearly visible in our
data set.

But you expected that right? Obviously events that excited people the most over
the course of the game will be tweeted about more. You probably don't find that
very surprising, and you're right, it isn't really. What this shows us though is
that data can tell us a LOT about what people are paying attention to or talking
about.

If our data can really tell us this much, lets take a look at our advertisement
data set.

### The Ads

Ok marketers, buckle up.

I'll cut right to the chase - here's the Timeline graph for all tweets we
collected about commercials:

(commercials graph)

We have some serious peaks going on, and I already did the leg work and
documented which commercials ran at times leading up to these peaks. Check it
out:

1. [Be More Human (Reebok)](http://youtu.be/UDb-7DY3CjU)
2. [Sorta Your Mom (Esurance)](http://youtu.be/SGoVVrqe2t8)
3. [Tomorrowland Trailer (Disney)](http://youtu.be/8TTgS1ew50c)
4. [Brady Bunch (Snickers, featuring my boy Danny Trejo)](http://youtu.be/rqbomTIWCZ8)
5. [Settle It The Usual Way (Skittles)](http://youtu.be/JDwRN2GBUj8)
6. [Lost Dog #BestBuds (Budweiser, you knew this one was coming)](http://youtu.be/xAsjRRMMg_Q)
7. [#RealStrength (Dove Men +Care)](http://youtu.be/devSIrBqC1Y)
8. [With Dad (Nissan)](http://youtu.be/Bd1qCi5nSKw)
9. [Make Safe Happen (Nationwide... featuring a dead kid...)](http://youtu.be/Bd1qCi5nSKw)
10. [Sorta Greg (Esurance and Breaking Bad)](http://youtu.be/zLNsdP228LM)
11. [The FIAT Blue Pill (FIAT)](http://youtu.be/YAcLViTHDOo)
12. [Braylon O'Neill (Microsoft)](http://youtu.be/wLXRt-qRBfU)
13. Honda Fit (Honda)
14. [My Bold Dad (Toyota)](http://youtu.be/Un6uP6cykgo)
15. [Liam's Revenge (Clash of Clans, I loved this one)](http://youtu.be/GC2qk2X3fKA)
16. [Wisdom (Dodge, another good one)](http://youtu.be/JKKlqMs19tU)
17. [Heroes Reborn (NBC)](http://youtu.be/C6zVQXpUe_0)
18. [Beautiful Lands (Jeep)](http://youtu.be/j7LbPdzYrrE)
19. [Together We Make Football (NFL)](http://youtu.be/4Ul29X69UJA)
20. [Making Headlines - The Royals (E!)](http://youtu.be/yaH3Qz0nj8Y)
21. [Real Life PacMan #UpForWhatever (Bud Light)](http://youtu.be/g9A1NowrnGI)
22. [Fifty Shades of Grey Trailer](http://youtu.be/ey7joQ10fZk)
23. [Victoria's Secret (oh my)](http://youtu.be/8lZgpaVpKQk)

I'm no marketing or advertising professional, but I can use our data to make
some assumptions about who the big advertising winners were.

Based on our data, we can see that the obvious winner was Nationwide's "Make
Safe Happen" commercial... you know... the one with the dead kid. Well, whether
that was positive or negative attention, it certainly had twitter talking!

Next, and less surprising, was Budweiser's "Lost Dog (#BestBuds)" commerical.

Dads had a big night, with Nissan's "With Dad" and Toyota's "My Bold Dad"
commercial rounding out the top 4, and Dove's "#RealStrength" dad commercial not
far behind.

Feel free to compare the rest of the markers with the commercials above or find
the commercials you thought were the best and compare them to the graph.

### The Beauty of Big Data

I love data.

With just over four hours of collection, I've been able to outline
one of the most popular sporting and advertising events of the year. Using
Pyckaxe to collect and parse Twitter data on the Super Bowl and the high value
advertising spots that go along with it I've been able to create a visual
representation of public reaction and make assumptions about the success of
commercial spots compared to each other.

Although [MY personal favorite](http://youtu.be/mjwUVZHBcoY) didn't make the
graph, this sort of information can be very valuable to companies that are
dropping this much dough on advertising spots.

[Tweet me your favorite commercial or Super Bowl moment](http://twitter.com/home?status=@dtbernard).
Thanks for reading!

