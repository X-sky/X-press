---
outline: deep
title: "Iterator and Generator"
description: "Deep dive into JavaScript Iterators and Generators, including the Iterable Protocol, Iterator Protocol, and the yield keyword"
---

# Iterator and Generator

## Iteration

> The English word "iteration" comes from the Latin "itero," meaning "repeat" or "again." In software, iteration means **executing a piece of code repeatedly in sequence**, usually with a clear termination condition.

- A loop is a basic form of iteration that can specify the number of iterations (clear termination condition) and what operation to perform each time (repeatedly executing a piece of code)
- Iteration typically operates on an **ordered** collection where all items can be traversed in a predetermined order. Arrays are the most typical ordered collection in JS, so we often conflate iteration with array traversal. In reality, the two have a containment relationship — array traversal is one form of iteration.

### Iterator Pattern

> In early versions of ECMAScript, iteration had to rely on loops or other auxiliary structures. As code volume grew, structures became increasingly messy. Many languages solved this problem through native language constructs, allowing developers to perform iteration without knowing how to iterate beforehand. This solution is the Iterator Pattern.

#### Concept

> The Iterator Pattern describes a solution: Something can be described as "**iterable**" and can implement a formal **Iterable interface** and be consumed by an **Iterator**

Iterable can both describe an object as iterable and directly refer to an iterable object. An iterable object can be understood as an object with a specific data structure that satisfies two conditions:

1. The contained elements are finite
2. It has an unambiguous traversal order

Of course, the concept of iterability is not limited to the above structures — anything with similar behavior, such as counting loops, is iterable.

#### Iterable Protocol

> Implementing the Iterable Protocol requires two capabilities: self-identification and the ability to create an Iterator interface.
>
> ECMAScript exposes a [Symbol.iterator] property that points to an iterator factory function. Calling this factory function generates a new iterator.

Many built-in types implement the iteration interface, including: String, Array, Map, Set, arguments, NodeList, and other DOM Collections.

In practice, you don't necessarily need to explicitly call this factory function to generate an iterator. All types that implement the Iterable Protocol automatically support iterable objects:

1. for...of loop: `for (const x of [0, 1, 2]) console.log(x)`
2. Array destructuring: `const [a, b] = [0, 1, 2]`
3. Spread operator: `doSomeThing(...restArgs)`
4. Array.from
5. Creating Set: `const newSet = new Set([a, b, c])`
6. Creating Map
7. Promise.all(): `Promise.all([a, b, c])`
8. Promise.race()
9. yield \* operator (covered in the Generator section)

This compatibility can be traced along the prototype chain.

#### Iterator Protocol

> By checking the [Symbol.iterator] property, you can get this factory function. Calling it directly generates a one-time iterator.

An iterator is a **one-time use** **object** used to iterate over its associated iterable object.

- Progress is advanced by defining a next() method. next returns an object containing iteration progress (done) and iteration data (value). Once iteration reaches the done: true state, calling next is idempotent.
- There's an optional return method to define what happens when the iterator ends prematurely under special circumstances. It also needs to return an object containing iteration progress (done), which must be self-defined. Calling return doesn't force the iterator to close, but return will still be called. Special circumstances include:
  1. Exiting iteration in for...of via return/throw/break keywords
  2. Destructuring that doesn't consume all values: `const [a, b] = [0, 1, 2]`

```javascript
const list = [0, 1];
let iter = list[Symbol.iterator]();
iter.next(); //{done: false; value: 0}
iter.next(); //{done: false; value: 1}
iter.next(); //{done: true; value: undefined}
iter.next(); //{done: true; value: undefined}
```

Different iterators are unrelated to each other:

```javascript
const list = [0, 1];
let iter1 = list[Symbol.iterator]();
let iter2 = list[Symbol.iterator]();
iter1.next(); //{done: false; value: 0}
iter2.next(); //{done: false; value: 0}
iter2.next(); //{done: false; value: 1}
```

An iterator is a "black box" internally — you can neither know the current iteration position nor the data state of the iterable object. It doesn't save a snapshot of the data at creation time but tracks iteration progress through a pointer. This means if the iterable object changes, the iterator will reflect the change in real time:

```javascript
const list = [0, 1, 2];
const iter = list[Symbol.iterator]();
iter.next(); //{done: false; value: 0}
// Insert a new value
list.splice(1, 0, 'insert');
iter.next(); //{done: false; value: 'insert'}
iter.next(); //{done: false; value: 1}
```

⚠️ Note: Because the iterator internally maintains a reference to the iterable object, the iterator's existence prevents the garbage collector from reclaiming the iterable object.

### Custom Iterator

The Iterator Pattern makes structures that expect to iterate over data automatically compatible with the Iterable Protocol. Therefore, we can use [Symbol.iterator] in a class to expose an iterator factory function, creating custom iterators:

```javascript
class Counter {
  constructor(limit) {
    this.count = 1;
    this.limit = limit;
  }
  [Symbol.iterator]() {
    // Closure variables, enabling multiple iterations
    let count = 1,
      limit = this.limit;
    return {
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true, value: undefined };
        }
      },
      return() {
        console.log('I haven\'t finished iterating yet!');
        return { done: true, value: 'someValue' };
      }
    };
  }
}
let counter = new Counter(3);
for (let i of counter) console.log(i);
//1
//2
//3
for (let i of counter) {
  if (i === 2) break;
  console.log(i);
}
//1
//'I haven\'t finished iterating yet!'
const [a, b] = counter;
// (no output) a => 1; b => 2
// 'I haven\'t finished iterating yet!'
```

## Generator

> Generator is a powerful capability added in ES6, with the ability to **pause** and **resume** code execution within a function block.

A generator takes the form of a function with an asterisk (\*) before the function name indicating it's a generator (the asterisk ignores spaces). Generators can be defined anywhere a function can be defined: function declarations, function expressions, object literal methods, class instance/static methods. Arrow functions cannot be used as generator functions.

### Generator Object

Calling a generator produces a generator object. A generator object can be compared to an iterator — it also advances execution through next, containing iteration progress (done) and iteration data (value).

In fact, generator objects internally implement the Iterable Protocol. Their [Symbol.iterator] property's factory function call result points to themselves. In this sense, a generator object is itself a type of iterator.

A generator is **suspended upon invocation**. A generator object starts in a suspended execution state. Execution continues by calling its next method. When next reaches done: true, its value is the generator's return value.

```javascript
function* generatorFn() {
  console.log('Executed');
  return 'returnValue';
}
let gen = generatorFn();
// (no logs)
gen.next();
// 'Executed'
// {done: true; value: 'returnValue'}
gen[Symbol.iterator]() === gen; // true
```

Like iterators, each generator object produced by a generator has its own scope and doesn't affect others.

Generator objects can be iterated as iterable objects:

```javascript
function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}
for (const x of generatorFn()) {
  console.log(x); // 1 2 3
}
```

### The yield Keyword

> yield is the most useful aspect of generators. It gives functions the ability to pause and resume execution internally. A generator executes normally before yield. Upon encountering this keyword, execution pauses and the function's scope state is preserved.

yield can be compared to a "return inside a function." A function that exits via yield is in the done: false state, and the yielded value becomes the value in next's return.

```javascript
function* generatorFn() {
  yield '1st';
  yield '2nd';
  return 'finished';
}
let gen = generatorFn();
gen.next(); // {done: false, value: '1st'}
gen.next(); // {done: false, value: '2nd'}
gen.next(); // {done: false, value: 'finished'}
```

yield can serve as both input and output. The value passed to the first next() call is not used, because that call is meant to start the generator's execution:

```javascript
function* generatorFn() {
  console.log('function start');
  console.log(yield '1st');
  console.log(yield '2nd');
}
let gen = generatorFn();
gen.next('1st pass'); // 'function start' //'1st'
gen.next('2nd pass'); // '2nd' // '2nd pass'
gen.next('3rd pass'); // '3rd' // '3rd pass'
```

yield*iterates over an object, yielding one value at a time. Like the generator asterisk, the asterisk marker also ignores spaces. Unlike yield, yield* cannot be used as output:

```javascript
function* generatorFn() {
  // for (const x of [1,2,3]) {
  //   yield x;
  // }
  yield* [1, 2, 3];
}
```
