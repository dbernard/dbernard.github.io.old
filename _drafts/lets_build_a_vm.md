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

### The Code

```python
```

