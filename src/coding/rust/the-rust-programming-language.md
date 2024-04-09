# The Rust Programming Language

> reading notes of [The Rust Programming Language](https://rust-book.cs.brown.edu/ch03-00-common-programming-concepts.html) from the official site of Rust.

## Common Concepts

Discuss some common concepts and their conventions around using them in the context of Rust. Mainly in:

- variables
- basic types
- functions
- comments
- control flow

::: tip about keywords

before you learn, you should look through a set of [_keywords_](https://rust-book.cs.brown.edu/appendix-01-keywords.html) in Rust. You can not use keywords as variable names in ANY kind of languages.

:::

### Variables

Variables are **IMMUTABLE** by default, but it can be marked as mutable by adding the keyword `mut`

```rust
fn main() {
  let x = 5;
  x = 6; // error[E0384]: cannot assign twice to immutable variable `x`
  let mut y = 5;
  y = 6; // it's ok!
}
```

Also, variables can only be used in a function

```rust
let x = 1; // Syntax Error: expected an item
fn main() {
  let y = 5; // it's ok!
}
```

#### Constants

like immutable variables, _constants_ are not allowed to change. However, there are a few differences:

1. `const` not allowed to use `mut`.
2. the _type_ of `const` must be annotated.
3. `const` can be used in the **global scope**, while `let` can **only** be used in a function
4. `const` can only be set to a constant expression instead of the result of a value computed at runtime.
5. Rust’s naming convention for `const` is to use all **UPPER_CASE** with underscores between words

#### Shadowing

> While variables are immutable by default, you can declare a new variable with the same name as a previous variable. It is normally called _shadowing_.

The key concept of shadowing is that it means overriding inside a scope instead of actually affecting the variables, which means:

1. the use of `let` in shadowing can not be neglected. Variables will still be immutable when out of scope.
2. shadowing can change the type of variables while `mut` can not.

```rust
fn main() {
    let x = 5;
    let x = x + 1; // it's ok! And `x` will be shadowing as 6;
    {
        let x = x * 2; // it's ok and `x` will be shadowing as 12
        {
          let x = 'c'; // it's ok and type of `x` will be shadowing as String
        }
    }
    println!("The value of x is: {x}"); // still 6;
}
```

### Data Types

> Rust is a statically-typed language. In a word, Rust must know exact types of every single variable at compile time.[See other statically-typed language here](https://en.wikipedia.org/wiki/Category:Statically_typed_programming_languages)

Rust usually _infer_ what type we want to use based on the value and how we use it. In cases _many_ types are possible, we must add a type annotation.

```rust
let guess = "42".parse().expect("Not a number!"); // error[E0282]: type annotations needed
let guess: i8 = "42".parse().expect("Not a number!"); // it's ok.
```

#### Scalar Types

> A scalar type represents a single value.

Rust has 4 primary scalar types:

- integers
- floating-point numbers
- Booleans
- characters

##### Integer Types

Like other programming languages, different integer types meas difference allocation in the computer memory and different number ranges.

| Length  | Signed | Unsigned |
| ------- | ------ | -------- |
| 8-bit   | i8     | u8       |
| 16-bit  | i16    | u16      |
| 32-bit  | i32    | u32      |
| 64-bit  | i64    | u64      |
| 128-bit | i128   | u128     |
| arch    | isize  | usize    |

Additionally, isize and usize are two special integer types in Rust. They depend on the architecture of the machine the program **RUNNING** on. It will be 64 bits if you’re on a 64-bit architecture and 32 bits if you’re on a 32-bit architecture. Normally, it will be used for pointer or memory related actions.

Integer literals can be in any of the forms below. And also can be visually separated by `_` for easier reading.

| Number literals | Example     |
| --------------- | ----------- |
| Decimal         | 98_222      |
| Hex             | 0xff        |
| Octal           | 0o77        |
| Binary          | 0b1111_0000 |
| Byte (u8 only)  | b'A'        |

::: warning Be careful of the Integer Overflow

Rust will **only** check integer overflow and _panics_ in debug mode. Which means overflow does not count as a compiling error.

Say you have a variable of type `u8` that holds values between 0 - 255. If that variable was assigned to 256, in debug mode, the program panics. However with `--release` flag, the program will be fine and Rust performs so-called [_two's complement wrapping_](https://en.wikipedia.org/wiki/Two%27s_complement), and thus the value 256 will become 0.

To explicitly handle the possible overflow:

1. Wrap in all modes with the wrapping\_\* methods, such as wrapping_add.
2. Return the None value if there is overflow with the checked\_\* methods.
3. Return the value and a boolean indicating whether there was overflow with the overflowing\_\* methods.
4. Saturate at the value’s minimum or maximum values with the saturating\_\* methods.

```rust

fn main() {
    let a: u8 = 255; // u8 max value

    // wrapping_add wraps around on overflow
    let wrap_result = a.wrapping_add(1);
    println!("wrapping_add: {}", wrap_result); // Outputs 0

    // checked_add returns None on overflow
    match a.checked_add(1) {
        Some(x) => println!("checked_add: {}", x),
        None => println!("checked_add: Overflow occurred"),
    }

    // overflowing_add returns a tuple (result, is_overflow)
    let (overflow_result, is_overflow) = a.overflowing_add(1);
    println!("overflowing_add: {}, overflowed: {}", overflow_result, is_overflow); // Outputs 0, true

    // saturating_add saturates at the maximum value
    let saturate_result = a.saturating_add(1);
    println!("saturating_add: {}", saturate_result); // Outputs 255
}

```

:::

:::details number ranges

Each signed variant can store numbers from -(2n - 1) to 2n - 1 - 1 inclusive, where n is the number of bits that variant uses. So an i8 can store numbers from -(27) to 27 - 1, which equals -128 to 127. Unsigned variants can store numbers from 0 to 2n - 1, so a u8 can store numbers from 0 to 28 - 1, which equals 0 to 255.

:::

##### Floating-Point Types

- f32 32-bits single-precision float
- f64 64-bits double-precision float

`f64` is roughly the same speed as `f32` but capable of more precision. They are represented according to the [IEEE-754 standard](https://en.wikipedia.org/wiki/IEEE_754)

##### The Boolean Type

The Boolean type in Rust is specified using `bool`. The main way to use Boolean values is through conditionals

```rust
fn main() {
  let t: bool = true;
}
```

##### The Character Type

Rust's `char` literal is specified with single quotes, as opposed to string literals, which use double quotes.

The `char` type is 4 bytes in size and represents Unicode Scalar Value and thus differs from `char` type in `C++` which is only 1 byte in size.

#### Compound Types

Compound types can group multiple values into one type. Rust has two primitive compound types:

- tuples
- arrays

##### The Tuple Type

Tuples have a fixed length: once declared, they cannot grow or shrink in size.

A tuple value can be accessed though `dot` operator.

```rust
fn main() {
  let tup: (i32, f64, u8) = (500, 6.4, 1);

  println!("The value of the first el of tup is: {}", tup.0)
}
```

A tuple can be destructured just like `python` or `javascript`. `let (x, y, z) = tup;`.

A tuple without any values has a special name `unit`. Consider `()` as `void` in other languages. Expressions implicitly return the unit value if they don’t return any other value.

##### The Array Type

Unlike tups, every element of an array must have the **SAME** type. `let x = ["string", 2]` cause a syntax error.

And unlike arrays in some other language, arrays have a _fixed_ length. If you’re unsure whether the collection has a fixed number of elements, chances are you should use a vector, a similar collection type provided by the standard library that is allowed to grow or shrink in size.

```rust
fn main() {
  let list = [1, 2, 3];
  let list: [i32; 3] = [1, 2, 3];
  let list = [3; 2]; // [3, 3]
}
```

::: warning Invalid Array Element Access

Similar to the number range panic, if you try to access an element of an array that is past the end of the array, you will get a runtime error, though the code may be compiled successfully.

This kind of runtime error may not occur in many other languages like C++, which may be confusing to get an invalid memory.

However, if you declare an array with explicit numbers and also try to access with explicit number past the end of the array, Rust will fail to compile as usual.

:::
