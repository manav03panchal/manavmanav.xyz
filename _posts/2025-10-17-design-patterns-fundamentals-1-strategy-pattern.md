---
layout: post
title: "Design Patterns Fundamentals #1: Strategy Pattern"
date: 2025-10-17 15:01:06 -0600
categories: general
---

# Design Patterns Fundamentals #1: Strategy Pattern

<!--toc:start-->
- [Strategy Pattern](#strategy-pattern)
  - [Understanding Strategy Pattern](#understanding-strategy-pattern)
    - [Key Concepts](#key-concepts)
    - [UML Class Diagram](#uml-class-diagram)
  - [Components](#components)
  - [Benefits](#benefits)
  - [Use Case Example](#use-case-example)
  - [Summary](#summary)
<!--toc:end-->

This pattern is a behavioral design pattern used to define a family of algorithms,
encapsulate each one, and make them interchangeable. It lets you change the algorithm
independently from the client that uses it.

## Understanding Strategy Pattern

Think of the Strategy Pattern as a tool belt. Each tool in the belt is a different
algorithm or behavior you can use. Depending on the task at hand, you select the
appropriate tool without changing the entire tool belt.

### Key Concepts

- **Encapsulation**: Each behavior or algorithm is wrapped in its own class, like
tools in a toolbox.

- **Interchangeability**: You can switch tools (algorithms) easily,
just as you'd pick a different screwdriver for a specific screw.

- **Decoupling**: The main object does not need to know the details of how each
tool works, only how to use them.

### UML Class Diagram

The following diagram illustrates the Strategy Pattern implementation from our
duck simulation example:

<pre class="mermaid">
classDiagram
    %% Strategy Interfaces
    class QuackBehavior {
        &lt;&lt;interface&gt;&gt;
        +quack() void
    }

    class FlyBehavior {
        &lt;&lt;interface&gt;&gt;
        +fly() void
    }

    %% Concrete Strategy Implementations
    class Quack {
        +quack() void
    }

    class Squeak {
        +quack() void
    }

    class FlyWithWings {
        +fly() void
    }

    class NoFly {
        +fly() void
    }

    %% Context (Base Class)
    class Duck {
        &lt;&lt;abstract&gt;&gt;
        #QuackBehavior* quackBehavior
        #FlyBehavior* flyBehavior
        +performQuack() void
        +performFly() void
        +display() void*
        +setQuackBehavior(QuackBehavior*) void
        +setFlyBehavior(FlyBehavior*) void
    }

    %% Concrete Duck Classes
    class MallardDuck {
        +MallardDuck()
        +display() void
    }

    class RubberDuck {
        +RubberDuck()
        +display() void
    }

    %% Relationships
    QuackBehavior &lt;|.. Quack : implements
    QuackBehavior &lt;|.. Squeak : implements
    FlyBehavior &lt;|.. FlyWithWings : implements
    FlyBehavior &lt;|.. NoFly : implements

    Duck o-- QuackBehavior : has-a
    Duck o-- FlyBehavior : has-a

    Duck &lt;|-- MallardDuck : extends
    Duck &lt;|-- RubberDuck : extends
</pre>

**Key relationships in the diagram:**

- **Implements**: Concrete strategies implement their respective interfaces
- **Has-a (Composition)**: Duck has QuackBehavior and FlyBehavior (composition over
inheritance)
- **Extends**: MallardDuck and RubberDuck extend the Duck base class

## Components

1. **Strategy Interface**
   - Think of it as a user manual that defines how each tool should be used.

2. **Concrete Strategies**
   - These are the actual tools. Each one implements the actions described in the
   user manual but behaves uniquely.

3. **Context**
   - The tool belt carrier. This is the class that uses the tools (strategies) and
   decides which one to apply based on the situation.

## Benefits

- **Flexibility**: Like swapping tools, you can change behaviors at runtime without
modifying the client.
  
- **Maintainability**: Just as adding a new tool to a toolbox does not require
changing all tools, adding new algorithms does not disrupt existing code.

## Use Case Example

Imagine a duck simulation. Each duck can have different flying and quacking behaviors,
akin to different tools:

- **Interchangeability**: You can give a rubber duck a squeak tool while a mallard
has a quack tool.
- **Adaptability**: Change a duck's flying method by swapping its current flying
tool (algorithm) with a new one.

## Summary

The Strategy Pattern provides a flexible alternative to sub-classing, promoting
composition over inheritance. By using this pattern, you gain higher code flexibility,
similar to having a varied toolbox at your disposal for different tasks without
needing to rebuild the entire setup
