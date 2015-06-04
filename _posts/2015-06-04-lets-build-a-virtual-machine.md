---
layout: post
title: Let's Build a Virtual Machine (Part I)
description: I walk through building a virtual machine (VM) capable of executing
             a binary file from the Synacor Challenge.
---

## {{ page.title }}

If you haven't worked with
[assembly code](http://en.wikipedia.org/wiki/Assembly_language) before, it can
be a bit intimidating, and in today's programming world you aren't necessarily
presented with many real opportunities to do so.

Regardless, assembly code and understanding how memory works are essential
skills for any developer, so in this post I'm going to walk through building a
Virtual Machine capable of executing a real binary file from a project called
the [Synacor Challenge](https://challenge.synacor.com/).

I was lucky enough to work under probably the smartest engineer I've ever met at
my first job who introduced me to this challenge, and it was an awesome
experience.

Alright, enough talk - if you're interested in trying this challenge or
following along, head to
[the Synacor Challenge website](https://challenge.synacor.com/) and download the
project material.

<div class="alert alert-info" role="alert">
<b>Before you start!</b> I recommend any serious developer try this exercise on
their own first. This post and my next will get you through the first step of
this challenge, but your best bet to truly understanding this topic is to give
it a shot yourself!
</div>

Once you've downloaded the project materials, extract them to the location where
you'll be writing your code and read the ```arch-spec``` file carefully!

### Let's Get Started

Let's start off by defining the general structure of our VM. Create a new file
in the same directory as your ```challenge.bin``` file called ```vm.py```. In
this new file, we'll define some characteristics we anticipate we will need from
our VM.

We can start with a few key parts:
<ol>
<li> A ```VirtualMachine``` class - the brains of our VM.
<li> A couple custom exceptions - for now we'll create ```VmInvalidInstruction```
and ```VmHalted``` to cover bad instructions and halting the VM.
<li> An entry point - to create a VM object and execute the binary when we run the
script.
</ol>

In your new ```vm.py``` file, let's go ahead and define these pieces:

```python
class VmInvalidInstruction(Exception):
    pass


class VmHalted(Exception):
    pass


class VirtualMachine(object):
    pass


if __name__ == '__main__':
    pass
```

This defines the basic top level structure of our VM code. For the next step we
should get the memory architecture out of the way.

### Memory Architecture

The Synacor Challenge project that we are building our VM for defines the
following memory architecture:

```
== architecture ==
- three storage regions
  - memory with 15-bit address space storing 16-bit values
  - eight registers
  - an unbounded stack which holds individual 16-bit values
- all numbers are unsigned integers 0..32767 (15-bit)
- all math is modulo 32768; 32758 + 15 => 5
```

I know, its a bit overwhelming, so let's break it down.

First, let's take a look at the three storage regions. First, ```memory with
15-bit address space```. If we have 15-bit address space, then our memory is of
the size 2^15, or 32768.

Second, eight registers, or simply eight storage regions outside of the memory
we defined above.

Third, an unbound stack. We will represent this as a Python list where the last
element to go on the stack will be the first to be "popped" off [(LIFO)](http://en.wikipedia.org/wiki/LIFO).

We'll also initialize a "program counter", or a register that will hold the
address of the current instruction being executed. This program counter (I'll
refer to it as "PC" from now on) will be incremented as the binary executes.

Now that we've defined those, its surprisingly simple to put them into code.
We'll initialize these components in the ```__init__()``` method of our
```VirtualMachine``` class.

```python
# Add these imports to the top of your file
import itertools
from array import array

...

class VirtualMachine(object):
    def __init__(self):
        # Memory as hex value 0x8000 == 32768, the size we defined.
        self.mem = array('H', itertools.repeat(0, 0x8000))
        # Eight registers, or simply 8 storage locations outside of memory.
        self.reg = array('H', itertools.repeat(0, 8))
        # The stack - a simple python list we will 'push' to and 'pop' from.
        self.stack = []
        # Program counter - execution will start at address 0
        self.pc = 0
```

Now that we have our memory architecture defined in code, we can move on to
loading the Synacor Challenge binary into our new memory structure.

### Loading The Binary

To run our VM, we'll need to load the provided binary file into that new memory
structure we created in the last step.

To do this, we're going to utilize the ```struct``` library. The ```struct```
library performs conversions between Python values and C structs represented as
Python strings, and will be helpful to us as a way to handle binary data.
Specifically, we'll utilize ```struct.unpack()``` to unpack our binary file into
something Python can understand.

We can go ahead and create a new method in our ```VirtualMachine``` class called
```load_image()``` to handle this:

```python
# Add the following import to the top of your file
import struct

...

class VirtualMachine(object):
    def __init__(self):
        # Nothing changes in this method
        ...

    def load_image(self, filename, address=0):
        # Open and read data from the binary file into a variabe
        with open(filename, 'rb') as f:
            image = f.read()

        # Unpack the binary data, converting from hex to decimal values.
        # struct.unpack() takes a format as an argument that defines how the
        # data is unpacked.
        struct.unpack('%dH' % (len(image) >> 1), image)

        # Load the unpacked data into memory, starting at the address provided
        # as an argument to the method (in the default case, address 0)
        self.mem[address:address + len(image)] = array('H', image)
```

Ok, so now we have our binary loaded into memory, but its worthless if we can't
execute it! Our next step will be to write some methods to execute and the
binary by stepping through memory.

### Executing The Binary

Now that the binary contents are loaded into memory and ready to run, we need to
be able to execute the code. We can start with two new methods, ```execute()```
and ```step()```:

```python
# Nothing outside of the VirtualMachine class changes
...

class VirtualMachine(object):
    # No changes to existing code
    ...

    def execute(self):
        try:
            # Do this until halted
            while True:
                # Step through instructions in memory.
                # We'll write this method next.
                self.step()
        except (VmHalted, KeyboardInterrupt):
            # On a halt, spit out some info about where we left off.
            print 'HALTED: Stopped at address %d (%04X)' % (self.pc, self.pc)

    def step(self):
        # Fetch the op code, args, and program counter from the next instruction.
        # We'll write fetch_instruction later.
        op, args, pc = self.fetch_instruction()
        # Execute the op code we just pulled out of the instruction.
        # TODO: Uh... now what?
```

Ok, we pulled the relevant instruction info, but how do we actually execute an
op code? We need to be able to pair methods with an op code string that we
pulled from memory. We'll come back to the ```step()``` method we started
above, but first let's set up a data structure that will define all of our op
codes.

### Defining The Op Codes

The specifications we received along with our binary from the Synacor Challenge
define all of the op codes we need:

```
== opcode listing ==
halt: 0
  stop execution and terminate the program
set: 1 a b
  set register <a> to the value of <b>
push: 2 a
  push <a> onto the stack
pop: 3 a
  remove the top element from the stack and write it into <a>; empty stack = error
eq: 4 a b c
  set <a> to 1 if <b> is equal to <c>; set it to 0 otherwise
gt: 5 a b c
  set <a> to 1 if <b> is greater than <c>; set it to 0 otherwise
jmp: 6 a
  jump to <a>
jt: 7 a b
  if <a> is nonzero, jump to <b>
jf: 8 a b
  if <a> is zero, jump to <b>
add: 9 a b c
  assign into <a> the sum of <b> and <c> (modulo 32768)
mult: 10 a b c
  store into <a> the product of <b> and <c> (modulo 32768)
mod: 11 a b c
  store into <a> the remainder of <b> divided by <c>
and: 12 a b c
  stores into <a> the bitwise and of <b> and <c>
or: 13 a b c
  stores into <a> the bitwise or of <b> and <c>
not: 14 a b
  stores 15-bit bitwise inverse of <b> in <a>
rmem: 15 a b
  read memory at address <b> and write it to <a>
wmem: 16 a b
  write the value from <b> into memory at address <a>
call: 17 a
  write the address of the next instruction to the stack and jump to <a>
ret: 18
  remove the top element from the stack and jump to it; empty stack = halt
out: 19 a
  write the character represented by ascii code <a> to the terminal
in: 20 a
  read a character from the terminal and write its ascii code to <a>; it can be assumed that once input starts, it will continue until a newline is encountered; this means that you can safely read whole lines from the keyboard and trust that they will be fully read
noop: 21
  no operation
```

Now we just need to define these op codes in our VM code. We'll need to be able
to map op code strings pulled from our memory as well as the appropriate number
of arguments with a ```VirtualMachine``` class method that performs that op code
instruction.

First, lets build a data structure that maps the operation code number (i.e. 0
is halt, 1 is set, 2 is push, etc.) to the op code name and argument count:

```python
# None of this code changes
...

# Put this section of code above the VirtualMachine class.
# Each op code ID pairs with a tuple containing its name and the number of
# arguments it takes. We will use the name to pair op code IDs to methods.
opcodes = {
    0: ('halt', 0),
    1: ('set', 2),
    2: ('push', 1),
    3: ('pop', 1),
    4: ('eq', 3),
    5: ('gt', 3),
    6: ('jmp', 1),
    7: ('jt', 2),
    8: ('jf', 2),
    9: ('add', 3),
    10: ('mult', 3),
    11: ('mod', 3),
    12: ('and', 3),
    13: ('or', 3),
    14: ('not', 2),
    15: ('rmem', 2),
    16: ('wmem', 2),
    17: ('call', 1),
    18: ('ret', 0),
    19: ('out', 1),
    20: ('in', 1),
    21: ('noop', 0)
}


class VirtualMachine(object):
    # None of this code changes
    ...

```

As you can see, each op code ID pairs with a tuple containing its name and the
number of arguments it takes. We will use the name to pair op code IDs to
methods.

Since our plan is to pair these names with methods, let's set that up now too.
To do this, lets first define a couple methods (leaving them empty for now) for
our op codes.

One of the hints that the Synacor Challenge architecture specification gives us
is to start with op codes 0, 19, and 21, or ```halt```, ```out``` and ```noop```.

```python
# None of the existing code needs to change
...

class VirtualMachine(object):
    # Add these new methods at the bottom of the class
    ...

    def op_halt(self):
        ''' Halt operation '''
        pass

    def op_out(self, a):
        ''' Write character represented by ascii code <a> to terminal '''
        pass

    def op_noop(self):
        ''' Do... nothing! '''
        pass

```

So as you can see, our op codes are going to map to methods in the form,
```op_(NAME)```. Let's go back to our ```step()``` method and work out how we
will execute op code methods pulled out of instructions.

```python
...

class VirualMachine(object):
    # Just update the step() method
    ...

    def step(self):
        # Fetch the op code, args, and program counter from the next instruction.
        # We'll write fetch_instruction later.
        op, args, pc = self.fetch_instruction()

        # NEW: Execute the op code we just pulled out of the instruction.
        # Get reference to the method matching the op code for this instruction
        fn = getattr(self, 'op_' + opcodes[op][0])

        # Execute the function with the arguments for this instruction
        fn(*args)
```

So, let's say we fetch an instructions, and the ```op``` variable is ```21```.
In the specifications and our op codes data structure, op code 21 is ```noop```.

The line

```python
fn = getattr(self, 'op_' + opcodes[op][0])
```

would translate to:

```python
fn = getattr(self, 'op_noop')
```

This sets variable ```fn``` to a call to the method ```op_noop()``` that we just
created, which is executed in the last line, ```fn(*args)``` which is equivalent
to ```op_noop(*args)``` when ```fn``` is set.

Next step, actually fetching instructions!

### Fetching Instructions

Are you still with me? We're getting very close to a functioning Virtual
Machine! Let's hit the last **really** technical piece of code for Part I of
this project and start pulling instructions out of memory.

We're going to do this in two pieces - one very simple method called
```fetch_instruction()``` that will simply interface to a second more complex
method that does the heavy lifting called ```fetch_instruction_mem()```. This
isn't entirely necessary, but its good practice in decoupling the *structure* of
the information we know we need based on the specifications (in this case, the
op code, arguments, and new program counter values) from the *method* we use to
extract that information (which *could* change).

Let's go ahead and write these methods:

```python
...

class VirtualMachine(object):
    # Add these methods, nothing else needs to change
    ...

    def fetch_instruction(self):
        # Call our heavy lifter and pull all relevant instruction info
        op, args, pc = self.fetch_instruction_mem(self.mem, self.pc)

        # Set the next pc value here. This opens the door later for some error
        # recovery/rollbacks, but I'll leave that up to you!
        self.pc = pc

        return op, args, pc

    def fetch_instruction_mem(self, mem, pc):
        # Pull the next operation from memory
        op = mem.pc

        # Increment the program counter within the bounds of memory (remember,
        # all math is modulo 32768)
        pc = (pc + 1) % 32768

        # Get the required argument count for this operation - error if its an
        # invalid operation
        try:
            nargs = opcodes[op][1]
        except IndexError:
            raise VmInvalidInstruction("Unknown opcode %d" % (op))

        # Now pull the actual args from memory
        args = []
        try:
            for i in xrange(nargs):
                args.append(mem[pc])
                # Keep the program counter moving to the next instruction
                pc = (pc + 1) % 32768
        except IndexError:
            # If we hit an index error, we ran off the memory block
            raise VmInvalidInstruction("Ran off the memory block while decoding")

        return op, args, pc

```

That'll do it. With those code in place, we have a *technically* functioning VM!
Of course, we need to actually start implementing our op code methods.

### Expanding The Op Codes

Let's follow the hints in the architecture specifications and flesh out those
three op code methods we started earlier. Before that, let's review the layout
of our memory and registers:

```
- numbers 0..32767 mean a literal value
- numbers 32768..32775 instead mean registers 0..7
- numbers 32776..65535 are invalid
```

We'll need a helper method to determine if a value is a literal value or a
register. We'll call this method ```value()``` and it will take a value ```v```
and determine if that is a literal or a register, returning that value if it is
a literal or the contents of that register if it is a register.

```python
# Add this to our existing imports
import sys

...

class VirtualMachine(object):
    ...

    # New helper methods to convert values and read registers
    def read_reg(self, r):
        ''' Convert r into a register and return the contents of that register '''
        return self.reg[r - 32768]

    def value(self, v):
        '''
        If v is between 0 and 32767 (inclusive), return it, otherwise return
        the value at register v mod 32768
        '''
        if v >= 0 and v <= 32767:
            return v

        return self.read_reg(v)

    # Update the op code methods with the below code

    def op_halt(self):
        ''' Halt operation '''
        raise VmHalted()

    def op_out(self, a):
        ''' Write character represented by ascii code <a> to terminal '''
        v = self.value(a)
        sys.stdout.write(chr(v))

    def op_noop(self):
        ''' Do... nothing! '''
        pass

```

### "Ok so, how does it work?"

That's a wonderful question, I'm glad you asked. I have no idea.

No, I'm kidding - the architecture specification file gives us a good example.

We can look at a short "program", which would be an example of something that
our VM would pull from memory as it executes. Heres the program:

```
9,32768,32769,4,19,32768
```

Let's break it down... 9 is the op code ```add```, which takes three arguments.
The next three items in memory, a) ```32768```, b) ```32769```, and c) ```4```,
are our three arguments.

The op code for add is supposed to store **into** ```a``` the **sum** of ```b```
and ```c``` (modulo 32768). Remember, our ```value()``` method does this modulo
conversion for us, so this further breaks down to:

```
store into register 0 the sum of 4 and the value contained in register 1
```

The last part of this program, ```19,32768``` breaks down to op code ```19```
(out) with the argument ```32768``` (```value()``` converts that to register 0).
In plain English this reads:

```
output the character with the ascii code contained in register 0
```

Throw this all together and out original program...

```
9,32768,32769,4,19,32768
```

can be broken down to...

```
store into register 0 the sum of 4 and the value contained in register 1, then
output the character with the ascii code contained in register 0
```

### Final Step

Let's write the main entry point for our Virtual Machine then give it a test
run!

You'll remember at the beginning we defined a ```__main__```. We can go ahead
and write out the code to initialize our VM, load the binary, and execute.

```python
...

# Update this code at the very bottom of the file

if __name__ == '__main__':
    vm = VirtualMachine()
    vm.load_image(sys.argv[1])
    vm.execute()

```

To run your VM now, we'll call our script with a path to the ```challenge.bin```
file from the Synacor Challenge as the first argument:

```
python vm.py challenge.bin
```

If all went well and you have no errors in your code, you should see something
like the following:

```bash
:: python vm2.py challenge.bin
Welcome to the Synacor Challenge!
Please record your progress by putting codes like
this one into the challenge website: tYMuFRDGigHH

Executing self-test...

Traceback (most recent call last):
  File "vm2.py", line 155, in <module>
    vm.execute()
  File "vm2.py", line 96, in execute
    self.step()
  File "vm2.py", line 104, in step
    fn = getattr(self, 'op_' + opcodes[op][0])
AttributeError: 'VirtualMachine' object has no attribute 'op_jmp'
```

*WHAT? ERRORS?!* **Yes**, relax. You'll see the first thing the binary does is
execute some self tests to make sure you're coding all the op codes correctly.
The hints told us to start with op codes 0, 19, and 21, and you'll see we
**passed** these and failed at ```op_jmp``` because we haven't implemented the
jump operation yet.

If you saw a different error, check your code and make sure everything looks
right. I'll add the full code at the bottom of this post as well.

### What's Next?

Writing and understanding a Virtual Machine can be overwhelming, but once you
understand the core concepts of simulating, memory it's really not too complex
(and **very** interesting).

If you've been coding along, go ahead and try to write the rest of the op code
methods to get past the binary's self tests! I'll add a "Part II" to this post
later with my implementations of the op code methods.

Head to [my whiteboard](http://www.dylanbernard.com/whiteboard/) and let me know
what you think of my implementation, ask me questions, or just let me know if
you enjoyed the read!

Happy coding!

### The Code

```python
import itertools
import struct
import sys
from array import array


class VmInvalidInstruction(Exception):
    pass


class VmHalted(Exception):
    pass


opcodes = {
    0: ('halt', 0),
    1: ('set', 2),
    2: ('push', 1),
    3: ('pop', 1),
    4: ('eq', 3),
    5: ('gt', 3),
    6: ('jmp', 1),
    7: ('jt', 2),
    8: ('jf', 2),
    9: ('add', 3),
    10: ('mult', 3),
    11: ('mod', 3),
    12: ('and', 3),
    13: ('or', 3),
    14: ('not', 2),
    15: ('rmem', 2),
    16: ('wmem', 2),
    17: ('call', 1),
    18: ('ret', 0),
    19: ('out', 1),
    20: ('in', 1),
    21: ('noop', 0)
}

class VirtualMachine(object):
    def __init__(self):
        # Initialize memory
        self.mem = array('H', itertools.repeat(0, 0x8000))
        # Initialize registers
        self.reg = array('H', itertools.repeat(0, 8))
        # Initialize stack
        self.stack = []
        # Initialize program counter
        self.pc = 0

    def load_image(self, filename, address=0):
        with open(filename, 'rb') as f:
            image = f.read()
        image = struct.unpack('%dH' % (len(image) >> 1), image)
        self.mem[address:address + len(image)] = array('H', image)

    def fetch_instruction_mem(self, mem, pc):
        # Get the next operation from memory
        op = mem[pc]
        # Increment the program counter (within the bounds of memory)
        pc = (pc + 1) % 32768

        # Get the args count from the new instruction, error if new opcode isn't
        # in our set of codes
        try:
            nargs = opcodes[op][1]
        except IndexError:
            raise VmInvalidInstruction("Unknown opcode %d" % (op))

        # Now get the actual arguments from memory
        args = []
        try:
            for i in xrange(nargs):
                args.append(mem[pc])
                # Keep the program counter moving
                pc = (pc + 1) % 32768
        except IndexError:
            # If we hit an index error, we ran off the memory block
            raise VmInvalidInstruction("Ran off the memory block while decoding")

        return op, args, pc


    def fetch_instruction(self):
        op, args, pc = self.fetch_instruction_mem(self.mem, self.pc)
        # Set the program counter to the next specified pc value
        self.pc = pc
        return op, args, pc

    def execute(self):
        try:
            while True:
                self.step()
        except (VmHalted, KeyboardInterrupt):
            print 'HALTED: Stopped at address %d (%04X)' % (self.pc, self.pc)

    def step(self):
        # Fetch the op code, args, and program counter from the next instruction
        op, args, pc = self.fetch_instruction()
        # Execute the op code operation from the instruction
        fn = getattr(self, 'op_' + opcodes[op][0])
        fn(*args)

    def read_reg(self, r):
        '''
        Convert r into a register and return the contents of that register
        '''
        return self.reg[r - 32768]

    def value(self, v):
        '''
        If v is between 0 and 32767 (inclusive), return it, otherwise return the
        value at register v mod 32768
        '''
        if v >= 0 and v <= 32767:
            return v

        return self.read_reg(v)

    def op_halt(self):
        '''
        Halt operation
        '''
        raise VmHalted()

    def op_out(self, a):
        '''
        Write character represented by ascii code <a> to terminal
        '''
        v = self.value(a)
        sys.stdout.write(chr(v))

    def op_noop(self):
        '''
        Do... nothing!
        '''
        pass


if __name__ == '__main__':
    vm = VirtualMachine()
    vm.load_image(sys.argv[1])
    vm.execute()

```

