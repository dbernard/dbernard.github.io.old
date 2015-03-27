---
layout: post
title: Playing with Fire(base)
description: I talk about Firebase, a powerful API for storing and syncing data in real time.
---

## {{ page.title }}

I recently attended a Google Developer Group meetup in DC for a talk about
[Firebase](https://www.firebase.com/), a cloud-based backend for application
developers. Despite only being an hour of information, I couldn't believe how
simple Firebase was to use, and how powerful it could potentially be for
developers.

### What is Firebase?

Firebase is currently used by over 160,000 developers including CBS, Atlassian,
Twitch, Citrix, and InVision and has recently [joined
Google](https://www.firebase.com/blog/2014-10-21-firebase-joins-google.html)! It
describes itself as, "A powerful API to store and sync data in realtime." With
Firebase you can implement a backend platform to store data for your
applications and sync that data across all devices in real time. Imagine a chat
service, for example - Firebase could be used to sync chat messages across user
devices seamlessly.

Firebase is cloud based and utilizes NoSQL, allowing data to be stored as simple
JSON. The API itself is RESTFul, providing the user with simple URL formats for
storing and accessing data.

For me, the primary selling point of Firebase was the ability to focus on
building quality front-end applications without needing to worry about
provisioning, managing, and scaling backend infrastructure on my own. Firebase
is there to handle all of that for you.

### What does Firebase offer?

Firebase allows developers to focus on developing quality applications without
worrying about the hassle of building their own backend platform to handle data
and security.

#### Instant data synchronization

Apps built using Firebase update instantly across all devices when data changes.
If connectivity is lost, apps using Firebase will continue to work and data
synchronization will continue when the connection is reestablished.

#### Portability

Firebase has APIs available for development on all major web and mobile
platforms. This includes Web (JavaScript), iOS (Objective C), and Android
(Java), as well as a REST Client for server-side platforms.

#### Security

Firebase uses highly secure connections to transfer data which is then stored
and backed up in multiple secure locations. Read/write access to the backend can
be manipulated through access controls and custom authentication methods,
including Twitter, Facebook, and Google+ authentication.

#### Hosting

Thats right, you can even host your application with Firebase! Firebase will
deliver your content over an SSL connection to be served on a global content
delivery network (CDN) where content is cached on solid state drives, ensuring
fast delivery to your users.

#### And more

With a multitude of other convenient features, including custom domains, command
line deployment, seamless scalability, and multiple developer tiers (including
free and paid plans), Firebase has a lot to offer in such a simple to deploy
package.

### How I used Firebase

After attending the GDC meetup about Firebase I was really excited to get my
hands on the tool. At the meetup our presenter threw together a chatroom-style
app and deployed it for the audience to use in minutes. I was amazed at how
straight forward it was, so I decided to play with a similar idea for my
website. Thats how I came up with the idea of "my whiteboard".

#### "The whiteboard"

Although my primary goal for this experiment was to get a little experience with
Firebase, a byproduct of this was "my whiteboard". My intention for the
whiteboard is for it to be a place where people can communicate with me directly
**on the site** - essentially a small chat service or message board.

After creating a Firebase account and following the simple steps to get it
registered with my app, the rest of the work was amazingly easy.

First, we need to set up references to our chat form, message field, message
button, and login button, as well as a reference to our Firebase account and
what will be our authenticated user account.

```javascript
// Relevant page elements
var wboard = document.getElementById('whiteboard');
var msgTxt = document.getElementById('msgTxt');
var msgBtn = document.getElementById('msgBtn');
var loginBtn = document.getElementById('loginBtn');

// Firebase ref and user init
var ref = new Firebase('[FIREBASE_ACCT_URL]');
var usr = null;
```

Next, we'll add a listener to the login button that will redirect the user to
authenticate with their twitter account. This helps control who has access to
our whiteboard in a sense that we can limit anonymous trolls and potentially set
us up to ban or restrict certain users (preparing for the worst).

```javascript
// Twitter login
loginBtn.addEventListener('click', function() {
  ref.authWithOAuthRedirect('twitter', function() {});
});
```

After that, we'll set up a function to listen for authentication and
enable/disable the appropriate buttons and set our user variable.

```javascript
// Listen for authentication
ref.onAuth(function(authData) {
  if (authData) {
    msgBtn.disabled = false;
    loginBtn.disabled = true;
    usr = authData;
  }
});
```

Now, lets add a listener to the message posting button to grab user messages and
post them along with their user name (in our case, their twitter handle).

```javascript
// Add messages to whiteboard
msgBtn.addEventListener('click', function() {
  ref.push(usr.twitter.username + ': ' + msgTxt.value);
  msgTxt.value = '';
});
```

Finally, we'll sync our data with Firebase so that new data will appear
automatically on the whiteboard.

```javascript
// Sync data with Firebase
ref.on('child_added', function(snap) {
  var msg = $.trim(snap.val()) + "\n";
  wboard.value += msg
});
```

Thats it. Thats (basically) all there is to it. Easy right? Of course, I have
added a bit more flavor of my own to the application, but that code along with
the appropriate HTML on top of it is all it takes to build your own chat service
with Firebase.

Now that you've seen how its built, head over to [my
whiteboard](http://dylanbernard.com/whiteboard/) and try it out! Let me know you
stopped by, what you think of Firebase, ask me some questions, or even just say
"hi"!

I had a lot of fun working with Firebase, and I plan to see what other features
I can squeeze out of it in the future.

Thanks for reading! For more information on Firebase or to check out the docs,
head over to the [Firebase](https://www.firebase.com/) website.

