---
layout: post
title: Regular Expressions - Text Parsing "Cheat Codes"
description: I talk a bit about regular expressions and why they are such an
             incredible tool.
---

## {{ page.title }}

*Up, up, down, down, left, right, left, right, B, A.*

You know that cheat by heart, don't you? Well if you don't, that is known as
the ["Konami Code"](http://en.wikipedia.org/wiki/Konami_Code). It was a cheat
code for various old school NES games and is still used in some modern games
today.

Regardless of the code, (most) cheats like the Konami Code are essentially quick
combinations of symbols that make a given task easier. Enter, regular
expressions.

### What are Regular Expressions?

Regular expressions, or Regex, are patterns useful for parsing structured data,
executing "find and replace" type actions, and various other seemingly simple
but often complex or tedious daily tasks involving data. If you are new to
regular expressions, they can look a bit "hieroglyphic" - for example,
"\d+\s(\w+\s)+(St|Rd|Cir|Blvd)" would be a regex patterns matching street
addresses.

As you can see, regex patterns are built using symbols. These symbols are
generally pretty universal among regex engines, but some may or may not be
supported by a given engine. These symbols include:

* abc...xyz - Match a specific LETTER
* 123...789 - Match a specific NUMBER
* (...) - Capture a group
* [abc] - Match "a", "b" OR "c"
* [123] - Match 1, 2, OR 3
* [^abc] - NOT "a", "b", or "c"
* \d - Matches any DIGIT
* \w - Matches any ALPHANUMERIC character
* \s - Matches any WHITESPACE (tab, CR, newline, single space)
* \d{n} - Match n REPETITIONS of the character or group
* \d{n,m} - Matches n through m REPETITIONS of the character or group
* . - Match ANY character
* ? - The character or group this follows is OPTIONAL
* + - 1 OR MORE of the character or group this follows
* \D, \W, \S - Matches any NON-digit, NON-alphanumeric, or NON-whitespace
* And more...

### How Are They Implemented?

*WARNING: We're about to get technical!*

The implementation of regular expression engines can be a bit hard to digest if
you aren't familiar with many Computer Science concepts. Without delving too
deeply into the definitions behind some of these terms, I'll explain the basics
and link Wiki pages to the more complex stuff for you to dig into on your own.

Regex engines are implemented using
[Automata](en.wikipedia.org/wiki/Automata_theory). Automata essentially
represent "state machines" which help us solve specific problems by
transitioning logically through states based on input.

Many regex engines will begin by building a [Nondeterministic Finite Automaton
(or NFA)](en.wikipedia.org/wiki/Nondeterministic_finite_automaton) and convert
it to a [Deterministic Finite Automaton (or DFA)
](en.wikipedia.org/wiki/Deterministic_finite_automaton), which is then run over
your search text to execute pattern matching (I know I'm being vague here, but
there is so much involved in this step that it would warrant it's own post).

A simple visual example here might look like the following.

```
   +------------------<<(no match)<<---------------------+
   |               ^                  ^                  ^
   V               |                  |                  |
   NEXT        +---+              +---+              +---+
   INPUT ----> | D | --(match)--> | O | --(match)--> | G | --(match)--> DONE
               +---+              +---+              +---+
```

In the figure above, we are using automata to try to match input with the word
"DOG". Given an input, we check if the first character matches "D". If it does,
check if the next character matches "O". If that matches as well, check if the
final character matches "G". If we have a match there as well, we exit the state
machine and are finished. If at any point in the process we do NOT match, we
exit and check any remaining input the same way.

Thats it. Thats the general overview. Now, things may differ from engine to
engine, and there is a LOT under the surface level of this VERY brief
explanation, but for the most part regex engines can essentially be summed up as
big finite state machines used to match characters.

Whew. That was exhausting. Let's look at an example or two.

### An Example

*For these examples we're going to be looking at regular expressions in Python,
but the concepts and results should universal to regular expressions.*

Let's say you are dealing with some type of user information that involves phone
numbers. Something terrible happens with your data and you are tasked with
recovering a set of phone numbers from the following file:

```
Loremipsumdolor301-438-2831sitamet,consecteturadipiscingelit.219-398-2837Etiamve
limperdietarcu,idefficiturlor439-282-4939em.Integersitametnullametus.Donec329-49
3-2890tinciduntnuncneque,commodoconsequatanteultriceset.Nammaximusnullan439-943-
3289ecrisusvulputate,velfeugiatmetusposuere.Vestibulumpharet483-292-3855ramauris
sitametcursusfringilla.Aliquameuscelerisqueante.Aeneane348-432-9103uismodutmauri
spulvinargravida.Pellentesquepo483-594-8329rta,ligulavehiculasagi432-329-9876tti
sporttitor,leonequeegestasmassa,quistrist323-439-9812iqueligulanullaetmauris.Int
erdumetmales324-582-0921uadafamesacanteipsumprimisinfaucibus.Maecenasconvallisnu
llavitae765-239-1290tellusmattis,atluctuseratbibendum.Maecenastemporiacu432-988-
0909lisipsum.Sedconguevelitnonfelisru219-483-9210trum,apharetradolorelementum.
```

I've kept it kind of short here, but imagine **10 times** this mess... or **100
times** this mess... or **1000 ti-** (ok we get it). How would you do it?

Well, reading and recording each phone number by hand is out or the question,
since we said we could expect the above block to potentially be *many* times that
size. You could maybe write a script to read through the file and any time we
encounter an integer, check if the next 11 characters look like a phone number,
but that sounds like a lot of work for both you and your computer, especially
for very big data, and imagine if we had random non-phone-number integers
floating around the data... *ick*.

This is a time where regular expressions could save us a lot of time and effort.
Here is a short Python script that would extract all of the phone numbers out of
the above file:

```python
# Import the Python Regex library.
import re

# The pattern we need to match (a phone number)
pattern = r"(\d{3}-\d{3}-\d{4})"

# Find every substring that matches the pattern we provided.
result = re.findall(pattern, file_contents)

# Output the result.
print result
```

This script would print:

```python
['301-438-2831', '219-398-2837', '439-282-4939', '329-493-2890',
'439-943-3289', '483-292-3855', '348-432-9103', '483-594-8329', '432-329-9876',
'323-439-9812', '324-582-0921', '765-239-1290', '432-988-0909', '219-483-9210']
```

Which is every phone number in our example file above. Pretty cool, right? Let's
deconstruct our pattern in English to see whats happening.

The pattern...

```python
(\d{3}-\d{3}-\d{4})
```

...can be read broken up in English as,

```
start capture   --> (
3 digit number  --> \d{3}
dash            --> -
3 digit number  --> \d{3}
second dash     --> -
4 digit number  --> \d{4}
end capture     --> )
```

So, as you can see above, we enclose our desired pattern within capture
parenthesis, ```(``` and ```)```. The first symbol, ```\d{3}```, tells our
expression to match any sequence of three digits. The next symbol, ```-``` says
that the previous three digits should be followed by a dash. The dash should be
followed again by three digits and a dash, and the final symbol, ```\d{4}```
should match four sequential digits at the end.

Let's look at another short example.

Earlier I used an example pattern that would match street addresses. Let's say
we use that pattern to collect all street addresses found in a file.

That pattern was:

```text
\d+\s(\w+\s)+(St|Rd|Cir|Blvd)
```

Let's check how that works against some sample data.

```
1) 123 Apple St - YES
2) 4567 Regular Expression Blvd - YES
3) 9 Super Awesome Happy Funtime Rainbow Rd - YES
4) Center St - NO
5) 404 Not Found - NO
6) 86 Cir - NO
7) 987 Grove Pkwy - NO
```

Can you see why these do or don't match? Based on our pattern, we are looking
for one or more digits (\d+), followed by a space, followed by 1 or more
characters and a space, one or more times, and ending with specifically "St",
"Rd", "Cir", or "Blvd".

Numbers 1 through 3 match that criteria. Number 4 fails because there is no
street number. Number 5 fails because it does not end with "St", "Rd", "Cir", or
"Blvd". Number 6 fails because there is no street name. Finally, number 7 fails
because it ends with "Pkwy", and not one of the 4 street endings we expect.

Pretty simple, right?

### Conclusion

Regular expressions can be hard to pick up at first, but once you get a feel for
whats going and how pattern matching works, they can be a very beneficial tool
to learn. If you are frequently coding or working with the command line or Vim,
you may find your day to day tasks made easier with the use of simple regular
expressions.

Data validation, parsing formatted data, find and replace, and many other common
tasks can be made easier with the use of regular expressions, but its important
to note that there are many situations where regular expressions may simply not
be realistic or optimal to use, so you must be aware of your requirements and
the scope of your problem.

For more on regular expressions or for practical exercises, check out
[RegexOne](www.regexone.com).

