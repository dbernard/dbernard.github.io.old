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

```
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

### The Code

```python
```

