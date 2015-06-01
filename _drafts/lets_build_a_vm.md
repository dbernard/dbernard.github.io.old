---
layout: post
title: Let's Build a Virtual Machine (Part I)
description: I walk through building a virtual machine (VM) capable of executing
             a binary file from the Synacor Challenge.
---

## {{ page.title }}



### The Goal

### Let's Get Started

Let's start off by defining the general structure of our VM. Create a new file
in the same directory as your ```challenge.bin``` file called ```vm.py```. In
this new file, we'll define some characteristics we anticipate we will need from
our VM.

We can start with a few key parts:
1) A ```VirtualMachine``` class - the brains of our VM.
2) A couple custom exceptions - for now we'll create ```VmInvalidInstruction```
and ```VmHalted``` to cover bad instructions and halting the VM.
3) An entry point - to create a VM object and execute the binary when we run the
script.

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
the size 2^15, or 32768. We'll represent this in hexadecimal format when we
define our memory in code in a minute.

Second, eight registers, or simply eight storage regions outside of the memory
we defined above.

Third, an unbound stack. We will represent this as a Python list where the last
element to go on the stack will be the first to be "popped" off (LIFO).

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
op code? We need to be able to pair functions with an op code string that we
pulled from memory. We'll come back to the ```step()``` function we started
above, but first let's set up a data structure that will define all of our op
codes.

### Defining The Op Codes

The specifications we received along with our binary from the Synacor Challenge
define all of the opcodes we need:

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
of arguments with a ```VirtualMachine``` class method that performs that opcode
instruction.

First, lets build a data structure that maps the operation code number (i.e. 0
is halt, 1 is set, 2 is push, etc.) to the op code name and argument count:

```python
# None of this code changes
...

# Put this section of code above the VirtualMachine class.
# Each opcode ID pairs with a tuple containing its name and the number of
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

As you can see, each opcode ID pairs with a tuple containing its name and the
number of arguments it takes. We will use the name to pair op code IDs to
methods.

Since our plan is to pair these names with functions, let's set that up now too.
To do this, lets first define a couple methods (leaving them empty for now) for
our op codes.

```python
```

### The Code

```python
```

