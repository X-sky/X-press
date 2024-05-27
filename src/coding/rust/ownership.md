# Ownership

> Ownership is Rust’s most unique feature and has deep implications for the rest of the language.

Ownership is a discipline for ensuring the safety of Rust programs.

In brief:

1. Ownership permits _moving_
2. References are _non-owning_ pointers

## Understanding Safety in Rust

A foundational goal of Rust is to ensure that your programs never have undefined behavior. And **ANY UNDEFINED BEHAVIOR** will be checked by Rust at compile-time. For example, the memory corruption.

The compile-time checking has two motivations over run-time checking:

1. Avoiding bugs in production will improve the reliability of your software.
2. Fewer run-time checks will improve the performance.

Conclusively, safety is _the absence of undefined behavior_.

## Ownership as a Discipline for Memory Safety

Since ownership is about safety, the absence of undefined behavior, we need to understand ownership in terms of WHAT undefined behaviors it prevents.

From a large list of ["Behavior considered undefined"](https://doc.rust-lang.org/reference/behavior-considered-undefined.html) The Rust Reference maintains, we will focus on one category: operations on memory.

::: info about memory

Memory is the space where data is stored during the execution of a program, some respected as `RAM`, some `malloc`, and others as other forms, but NONE of them is a useful way to think about how Rust works.

:::

## Variables Live in the Stack

Variables live in **frames**. A frame is a mapping from variables to values within a single scope, such as a function.

![Stack](./the-rust-programming-language/assets/stack.png)

The diagram above shows the contents of memory during the program's execution at the three marked points `L1` `L2` and `L3`.

Frames are organized into a stack of currently-called-functions:

1. `fn main` is called, a variable stack (aka what we call frame) of `main` is allocated from memory. And this frame hold `n=5`
2. `fn plus_one` is called, a frame B holds `x=5` is allocated.
3. `fn plus_one` is finished, frame B will be _deallocated_(also known as freed or dripped) and the frame for main will hold another variable

Note that this memory model does not fully describe how Rust actually works! Only a simpler case for understanding the safety in Rust.

## Boxes Live in the Heap

However，copying data can take up a lot of memory. For example, the `copy` behavior below causes the `main` frame to contain 2 million elements.

```rust
let a = [0; 1_000_000];
let b = a;
```

To transfer access to data without copying it, Rust uses pointers. A pointer is a value that describes a location in memory. The value that a pointer points-to is called its pointee.

One common way to make a pointer is to allocate memory in the heap. Head data is NOT tied to a specific stack frame.

Rust provides a construct called `Box` for putting data on the heap like this.

![Stack](./the-rust-programming-language/assets/heap.png)

Note that `a` is now grayed because it has been moved because of the [Box Deallocation Principle]#box-deallocation-principle) we'll talk about later.

## Collections Use Boxes

Boxes are used by Rust data structures like Vec, String, and HashMap to hold a variable number of elements.

These data structures don't use the literal Box type. For example, String is implemented with Vec, and Vec is implemented with RawVec rather than Box. But types like RawVec are still box-like: they own memory in the heap.

```rust
fn main() {
    let first = String::from("Ferris");
    let full = add_suffix(first);
    println!("{full}");
    rintln!("first"); //[!#code error] variables cannot be used after being moved
}

fn add_suffix(mut name: String) -> {
    name.push_str(" Jr.");
    name
}
```

### Box Deallocation Principle

> (almost correct) If a variable is bound to a box, when Rust deallocate the variable's frame, then Rust deallocates the box's heap memory.

The [codes above]#boxes-live-in-the-heap) has a boxed array bound to both `a` and `b`. However by the "almost correct" principle, Rust would try to free the heap memory _twice_ on behalf of both variables, which is undefined behavior too! To avoid this, we finally arrive ownership.

> (fully correct): If a variable OWNS a box, when Rust deallocates the variable's frame, then Rust deallocates the box's heap memory.

::: info heap and stack

- Frames in the stack are associated with a specific function, and are deallocated when the function returns, which is automatically managed by Rust while data on the heap can live **INDEFINITELY**.
- Both data can be MUTABLE and COPYABLE.
- Both allowed to contain pointers

:::

### Moved Heap Data Principle

> if a variable `x` moves ownership of heap data to another variable `y`, then `x` cannot be used after the move.

You may notice that there is an error line in the [example]#collections-use-boxes). That's because variables cannot be used after being moved due to memory safety.

Reading `first` pointing to deallocated memory is a violation of memory safety. It is NOT the pointing itself but the USING/READING of the variable, an undefined behavior. See this example

```rust
fn main() {
    let b = Box::new(0);
    let b2 = b;
    println!("{}", b);
    move_a_box(b2);
}
fn move_a_box(b: Box<i32>) {
  // This space intentionally left blank
}
```

Just doing `let b2 = b;` and then print it is not an undefined behavior, though `b` is moved but its data is NOT deallocated until `move_a_box` is called.

Therefore if we comment the `move_a_box(b2)`, the program is _technically safe_, although still rejected by Rust and won't compile.

One way to avoid moving data is to `clone` it using `.clone()` method.

```rust
fn main() {
    let first = String::from("Ferris");
    let full = add_suffix(first.clone());
    println!("{full}");
    println!("first"); // it's alright!
}

fn add_suffix(mut name: String) -> {
    name.push_str(" Jr.");
    name
}
```

## References and Borrowing

So far, Rust provides boxes and moves for safely programming with the heap. However, move-only APIs can be inconvenient to use. Strings, for instance, are very common in programs to be used for more than once.

An alternate solution is to `return` the ownership of the strings.

```rust
fn main() {
    let s = String::from("Hello");
    let s_again = greet(s);
    println!("{s_again}")
}
fn greet(s: String) -> String {
    println!("inside greet {s}");
    s
}
```

This style of program is quite verbose. Therefore Rust provides a concise style of reading and writing without moves. References.

> References are non-owning pointers (again, a pointer is a value that describes a location in memory). The do not OWN the data they point to.

References make it easier to write the program in a more convenient manner.

```rust
fn main() {
    let m1 = String::from("Hello");
    let m2 = String::from("world");
    greet(&m1, &m2);
    let s = format!("{m1}, {m2}");
}
fn greet(g1: &String, g2: &String) {
    println!("inside greet {g1}, {g2}")
}
```

## Dereference

The previous example has not shown how Rust "follows" a pointer to data. The `println!` macro has mysteriously worked for both _owned strings_ and for _string references_. The underlying mechanism is the **dereference** operator.

```rust
fn main() {
    let mut x: Box<i32> = Box::new(1);
    let a: i32 = *x;         // *x reads the heap value, so a = 1
    *x += 1;                 // *x on the left-side modifies the heap value,
                            //     so x points to the value 2

    let r1: &Box<i32> = &x;  // r1 points to x on the stack
    let b: i32 = **r1;       // two dereferences get us to the heap value

    let r2: &i32 = &*x;      // r2 points to the heap value directly
    let c: i32 = *r2;    // so only one dereference is needed to read it
}
```

`**` is pretty common in `C++`, as we call it `a pointer to the pointer`. Here is an example to help understanding.

```rust
fn main() {
    let x = Box::new(0);
    let y = Box::new(&x);
    // need there dereference operators to get a copy of number 0 out of Box.
    let copy_0 = ***y;
}
```

::: tip

Here's a quick tips for `references` and `dereferences`:

1. `&` means `create`: create a pointer
2. `*` means `read`. read the actual value

:::

## Pointer Safety Principle

> data should never be aliased and mutated at the same time.

Aliasing itself is harmless but combined with mutation is a recipe for disaster.

- Once the aliased data deallocated, the variable would point to deallocated memory.
- Once the aliased data mutated, another variable would have invalidating runtime properties.
- Concurrently mutating the aliased data will cause a data race condition.

```rust
fn main() {
  let mut v: Vec<i32> = vec![1, 2, 3];
  let num: &i32 = &v[2];
  v.push(4);
  println!("Third element is {}", *num); // undefined behavior, for v was reallocated after `push`, the pointee of num has been freed
}
```

To avoid these issues, Rust follows a basic principle: Pointer Safety Principle.

### borrow checker

By design, references are meant to temporarily create aliases. Rust ensures the safety of references through the **borrow checker**.

The core idea behind the borrow checker is that variables have three kinds of permissions on their data:

- Read (R): data can be copied to another location (by default).
- Write (W): data can be mutated in-place (by default with `mut`).
- Own (O): data can be moved or dropped (by default).

Permissions are defined on **paths** and not just variables.

```rust
let x = 0; // x gained R and O
let mut x_ref= &x; // x_ref gained R and W and O; *x_ref gained R
```

A path is anything you can put on the left-hand side of an assignment. Paths include:

1. Variables like `a`
2. Dereferences like `*a`
3. Array accesses of paths like `a[0]`
4. Fields of paths like `a.0`
5. Any combination of the above

Rust expects that path to have certain permissions depending on the operation.

For the codes above, let's go through what will happen by borrow checker.

```rust
fn main() {
  let mut v: Vec<i32> = vec![1, 2, 3];
  let num: &i32 = &v[2]; // requires v to have permission R
  // `num` borrows v. Temporarily remove permission W and O from v
  // `num` gains R and O
  // `*num` gains R
  v.push(4); // requires v to have permission R and W and thus will cause an unsafe operation, an error occurs.
  println!("Third element is {}", *num);
}
```

### Mutable References

The references we have seen so far are **immutable references** (also called **shared references**) and immutable references permit aliasing but disallow mutation.

However, `&mut` operator means a mutable reference is created. Mutable references will make the `pointee` loses all permissions including `R`.

```rust
fn main() {
  let mut v: Vec<i32> = vec![1, 2, 3];
  let num: &mut i32 = &mut v[2]; // requires v to have permission R and W
  // `num` borrows v. Temporarily remove all permissions R, W and O from v
  // `num` gains R and O
  // `*num` gains R and W
  *num += 1; // requires `*num` to have R and W
  println!("Third element is {}", *num); // requires *num to have R
  // v gains permission back
  println!("Vector is now {:?}", v); // requires v to have R
}
```

Mutable references can also be temporarily "downgraded" to read-only references

```rust
let mut v: Vec<i32> = vec![1, 2, 3];

let num: &mut i32 = &mut v[2]; // requires v to have R and W
// num borrows v, temporarily remove all permissions from v
// num gains R and O
// *num gains R and W
let num2: &i32 = &*num; // require *num to have R
// num2 borrows *num, temporarily remove W from *num
// num2 gains R and O
// *num2 gains R
println!("{} {}", *num, *num2); // requires *num to have R and *num2 to have R
```

### F permission

The borrow checker enforces that **data must outlive any references to it**.

The easier case is that when borrows and references are in the same scope. However there are cases when Rust doesn't know how long a reference lives. Specifically, when references are either input to a function, or output from a function.

In these cases, Rust introduces a new kind of permission `F`(abbv for flow)

```rust
fn first_or(strings: &Vec<string>, default: &String) -> &string {
  if strings.len() > 0 {
    &strings[0] // requires strings to have R and F
  } else {
    default // requires default to have R and F
  }
}
```

The codes above will panic. For now it's enough to know that:

1. input/output references are treated differently than references within a function body
2. Rust uses a different mechanism, the `F` permission, to check the safety of those references.

We will explain in Chapter 10.3 "Validating References with Lifetimes"

### Fixing Ownership Errors

[not noted yet](https://rust-book.cs.brown.edu/ch04-03-fixing-ownership-errors.html)
