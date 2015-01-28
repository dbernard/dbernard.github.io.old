---
layout: post
title: How I Plan To Data Mine The Super Bowl
description: I talk about my plans to mine tweet data on Super Bowl 49.
---

## {{ page.title }}

If you've visited my site before you've probably seen me talk about my Python
data mining project, [Pyckaxe]({% post_url 2014-12-25-introducing-pyckaxe %}).
This tool, while still in its early stages, has been a very interesting and
effective tool for collecting data from twitter and parsing it into informative
results. Now it's time to see if Pyckaxe is up for a bigger challenge - Super
Bowl 49.

The Super Bowl's social media presence is a gold mine of data ripe for
processing. When did major plays or calls happen? What advertisements had people
talking? What did people think of the halftime show? Social media data can give
us a pretty good idea of how to answer these questions, and to help with this
I'd like to introduce a new Pyckaxe script - the Timeline.

### The Timeline

The Timeline is a new data parsing script that plots the tweet rate over time
for a given data set. This script will generate a [Plotly](https://plot.ly) time
series graph with tweet counts (on the y-axis) over time (on the x-axis).

So what can the Timeline tell us about our data set? Well, the graph will
increase as the rate os incoming tweets increases (and vice versa), which could
potentially tell us a lot about the series of events that led to that peak or
valley.

Incredible touchdown play? Expect the tweet rate to skyrocket.

Boring game? The rate will probably level off overall.

Amazing halftime show? The Timeline will reflect that.

Did a particular ad have everyone talking? We'll be able to find it on graph.

Major events should be visible to us as spikes in our data set's tweet rate.

### Why does this matter?

As far as the game itself goes, the Timeline graph will be able to tell us not
only when major events happened, but will allow us to make assumptions about
public opinion.

Generally we can probably assume that people will tweet **more** when their
team is doing well or the game is going how they want it to. Therefore, if we
see a massive spike in the tweet rate, we can assume something big happened and
there is probably some dramatic sentiment behind it (one way or the other).

Other than the game itself, the advertisements are the next biggest event. This
is where our data becomes a marketer's dream.

Certain ads catch the public eye - just look at how many people felt they needed
to "#humpday" EVERY Wednesday after Geico came out with that hump day camel
commercial (seriously, like 70% of my friends list wouldn't stop for a solid
month). So, if we follow huge spikes in the tweet rate that occur during
commercial breaks, we can pin point which commercials had the biggest effect.

Parsing Super Bowl tweet data can tell us all of this and more with the help of
the new Timeline script.

### So, How Does It Work?

The Timeline script is very simple. The main purpose of this script is to track
the tweet rate over time for the dataset given a specific ```timedelta```
parameter.

For example, given a ```timedelta``` of ```10```, the graph will depect tweets
per 10 seconds on the Timeline. Below is an example of the tweet rate per 10
seconds for about two hours of SAG Awards tweets:

<a href="/img/posts/sag.png" title="Tweet Rate Timeline of SAG Awards">
  <img src="/img/posts/sag.png" width="460">
</a>

Time data can be added to a Timeline object in the form of Python ```datetime```
objects. Twitter gives us time data for each tweet in the form,

```
DAY MONTH DATE HH:MM:SS TIMEZONE YEAR
```

For example,

```
Mon Jan 26 01:15:34 +0000 2015
```

This date format can be processed into data usable by the Python
[datetime.strptime()]
(https://docs.python.org/2/library/datetime.html#strftime-strptime-behavior)
method. For developers looking to do this, the following code block explains how
the standalone Timeline script uses regular expressions to format the
```created_at``` date given to us by Twitter into something we can more easily
input into ```.strptime()```.

```python
t = 'Mon Jan 26 01:15:34 +0000 2015'
ptrn = r"(\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2}) (?:[\+|\-]\d{4}) (\d{4})"
time = re.findall(ptrn, t)
converted_time = datetime.strptime(' '.join(time[0]), '%a %b %d %H:%M:%S %Y')
```

The resulting ```datetime``` object is added to our Timeline object via the
```.add_time()``` method.

Once all time data is added to the Timeline object, a call to
```.get_results()``` with a desired timedelta passed in will iterate through
each ```datetime``` object and generate a tweet tweet rate per (timedelta)
seconds to graph via Plotly.

### What To Expect

The first thing I need to keep in mind about data mining the Super Bowl is the
sheer volume of data thats going to be flooding Pyckaxe. This will absolutely be
the largest stream of data I've thrown at this tool yet, and I'm anxious to see
how Pyckaxe handles it.

At first glance I can't imagine that the load will be too heavy - especially
with the recent updates to allow asynchronous, threaded tweet collection.

Another potential issue is the cons associated with the Pyckaxe default
database. Pyckaxe's default listener uses sqlite3 as its database library which,
while great for rapid prototyping and ease of use, doesn't generally scale well
and isn't particularly performant.

While I do expect a **massive** collection, I don't imagine 4 to 5 hours of
collection filling my hard drive (although I will be clearing things out, just
in case!), and I don't care too much about how long it takes to generate my
results (realistically) as much as I care about how clean and informative my
results are.

In the end, I expect a very interesting and informative test of Pyckaxe this
weekend, as well as a very exciting game of Football.

Go Seahawks!
