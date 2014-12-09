---
layout: post
title: Version Control and Murphy's Law
description:
      The story about the day I learned just how important version control is.
---

# {{ page.title }}

*Anything that can go wrong, will go wrong.*

That's what [Murphy's Law][murphyslaw] states. We've all come face to face with
this at some point (I guess by definition, anytime something goes wrong!) This is
the story of the day I learned just how important version control is thanks to
Murphy's Law.

## The Project

By the time my Senior Computer Science project had come around, I had learned
about version control. I learned why it was used, different workflows and
version control software. Despite learning all this, for some reason or another
I still hadn't processed **just** how important version control is for any (and
every) project.

My CS degree Senior project was a virtual tour video game for the Admissions
Office. The game was a top-down RPG style game where the player would start as a
prospective student showing up to visit campus. The player would be guided around
campus by a series of short "quests" given by non-player character students and
professors to collect *X* object or visit *Y* building on campus.

At the very beginning I had done a decent job backing up my work, but things
started changing, I ended up completely reworking code and neglecting backups.
I had done almost all of the art by hand and wrote extensive code for the game
as the end of my last semester approached.

Then Murphy's Law hit me like a bus.

## The Day I Learned My Lesson

There was just over a week left until my Senior Project presentation. I was
polishing up some details and squashing minor code bugs when my laptop silently
and unexpectedly just shut off. *Strange*. Horror set in when I realized what
had caused this unexpected shutdown.

My hard drive was dead.

You don't have to be a Software Engineer or a CS undergrad to imagine the
horrible sinking feeling you would get when months of work vanish in the blink
of an eye. I rushed my laptop to IT to see if they could at least recover some
of my data, but no luck.

*Everything* was gone.

Well, not exactly everything. I had been emailing the artwork to myself, so I
had that, but I had been slacking on my backups since very early in the project.
I had a week until my presentation, and I had to start over.

I spent the next week rewriting my code and not sleeping, but by the day of my
presentation I actually had a presentable game. It wasn't quite as polished or
robust as the version I had spent a semester building, but it would do. I got
through my presentation, the Admissions Office enjoyed what they saw, and I
received a surprisingly good grade for my project. In the end my story had a
happy ending, but none of the trouble was necessary.

## The Calm After The Storm

When the dust settled and I had a chance to reflect on the whole ordeal, I
realized just how much pain consistent and serious version control could have
saved me. Tools like [Github][github] and [Subversion][svn] should be the first
tool in a Software Engineer's tool belt. It took a harsh encounter with
Murphy's Law for that fact to truly hit home with me.

In the end, all this trouble was probably the best thing that has happened to me
as an Engineer. I learned first hand just how important version control can be
to the development process and it has made me so much better at what I do. Not
to mention I'll always have that little mental scar reminding me that *anything
that can go wrong, will go wrong*, and to be as prepared as possible for that.

Thanks, Murphy's Law!

[murphyslaw]: http://en.wikipedia.org/wiki/Murphy%27s_law
[github]: https://github.com/
[svn]: https://subversion.apache.org/
