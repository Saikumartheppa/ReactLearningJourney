# Debouncing in JavaScript — Complete Notes

## What is Debouncing?

Debouncing is a technique used to delay the execution of a function until a certain amount of time has passed since the last event occurred.

It is commonly used to:

* Search boxes
* Auto suggestions
* Resize events
* Scroll events
* API calls

### Problem

Suppose a user types:

```text
h
he
hel
hell
hello
```

Without debouncing:

```text
API Call #1 -> h
API Call #2 -> he
API Call #3 -> hel
API Call #4 -> hell
API Call #5 -> hello
```

5 API calls are made.

This wastes:

* Network bandwidth
* Server resources
* Browser resources

---

## Solution

Wait until the user stops typing.

For example:

```text
Debounce Delay = 300ms
```

If the user keeps typing before 300ms expires:

```javascript
clearTimeout(timer);
```

cancels the previously scheduled execution.

Only the final input triggers the function.

Result:

```text
API Call #1 -> hello
```

---

# Basic Example

```javascript
let count = 0;

const getData = () => {
    console.log("Fetching data", ++count);
};
```

---

# Debounce Implementation

```javascript
function debounce(fn, delay) {
    let timer;

    return function (...args) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
```

Usage:

```javascript
const betterFunction =
    debounce(getData, 300);
```

HTML:

```html
<input
    type="text"
    onkeyup="betterFunction(this.value)"
/>
```

---

# Understanding the Flow

### User Typing

```text
0ms    -> h
100ms  -> he
200ms  -> hel
300ms  -> hell
400ms  -> hello
```

Each key press:

```javascript
clearTimeout(timer);
```

cancels the previous timer.

Final timeline:

```text
400ms -> hello typed
700ms -> getData() executes
```

Only one execution occurs.

---

# Your Original Implementation

```javascript
const addDebounce = function(fn, delay) {
    let timer;

    return function() {
        let context = this,
            args = arguments;

        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply([context, args]);
        }, delay);
    };
};
```

---

# Bug #1: Incorrect apply Syntax

You wrote:

```javascript
fn.apply([context, args]);
```

### Why it is wrong

`apply()` expects:

```javascript
function.apply(
    thisArg,
    argsArray
);
```

Correct:

```javascript
fn.apply(context, args);
```

Wrong:

```javascript
fn.apply([context, args]);
```

Because now JavaScript treats:

```javascript
[context, args]
```

as the `thisArg`.

---

# Understanding apply()

## Syntax

```javascript
fn.apply(
    thisArg,
    argsArray
);
```

Example:

```javascript
function greet(city, country) {
    console.log(
        this.name,
        city,
        country
    );
}

const user = {
    name: "Sai"
};

greet.apply(
    user,
    ["Hyderabad", "India"]
);
```

Output:

```text
Sai Hyderabad India
```

---

# Why Use apply() Inside Debounce?

Suppose:

```javascript
betterFunction(
    "hello",
    "world"
);
```

Inside debounce:

```javascript
args =
{
    0: "hello",
    1: "world"
}
```

We don't know beforehand:

* How many arguments exist
* What they are

Could be:

```javascript
0 arguments
2 arguments
10 arguments
```

`apply()` allows dynamic argument forwarding.

```javascript
fn.apply(
    context,
    args
);
```

Equivalent to:

```javascript
fn(
    arg1,
    arg2,
    arg3
);
```

but works regardless of argument count.

---

# Why Not call()?

`call()` requires explicit arguments.

```javascript
fn.call(
    context,
    arg1,
    arg2,
    arg3
);
```

But inside debounce we don't know:

```javascript
arg1
arg2
arg3
...
```

ahead of time.

Therefore:

```javascript
apply()
```

is a natural fit.

---

# Modern Alternative Using Spread

Instead of:

```javascript
fn.apply(
    context,
    args
);
```

you can write:

```javascript
fn.call(
    context,
    ...args
);
```

or

```javascript
fn(...args);
```

But there is an important distinction.

---

# Rest Parameters Preserve Arguments Only

```javascript
return function (...args) {
    fn(...args);
};
```

This preserves:

```javascript
args
```

but NOT:

```javascript
this
```

---

# Understanding the Difference

## Arguments

```javascript
function test(...args) {
    console.log(args);
}

test(1, 2, 3);
```

Output:

```javascript
[1, 2, 3]
```

Arguments are preserved.

---

## What About `this`?

Consider:

```javascript
const user = {
    name: "Sai",

    greet(msg) {
        console.log(
            msg,
            this.name
        );
    }
};
```

---

# Problem

```javascript
const debouncedGreet =
    debounce(
        user.greet,
        300
    );

debouncedGreet("Hello");
```

Suppose debounce contains:

```javascript
fn(...args);
```

When timer executes:

```javascript
greet("Hello");
```

NOT:

```javascript
user.greet("Hello");
```

Therefore:

```javascript
this
```

is lost.

Output:

```text
Hello undefined
```

or

```text
TypeError
```

depending on mode.

---

# Preserving `this`

```javascript
fn.apply(
    this,
    args
);
```

or

```javascript
fn.call(
    this,
    ...args
);
```

preserves:

* arguments
* original context

---

# Why Arrow Function Works Here

```javascript
setTimeout(() => {
    fn.apply(this, args);
}, delay);
```

Arrow functions do not create their own `this`.

Instead they inherit `this` from the surrounding scope.

Example:

```javascript
return function (...args) {
    setTimeout(() => {
        console.log(this);
    });
};
```

The arrow remembers the `this` of the returned function.

---

# Interview Question

## What Does Rest Parameter Preserve?

```javascript
(...args)
```

Preserves:

```text
Arguments
```

Does NOT preserve:

```text
this
```

---

# Interview Question

## Why Use apply() in Debounce?

Answer:

```text
1. Forward unknown number of arguments.
2. Preserve original this context.
```

---

# Modern Production Version

```javascript
function debounce(fn, delay) {
    let timer;

    return function (...args) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
```

---

# Quick Revision Table

| Feature                  | Preserves Arguments | Preserves this |
| ------------------------ | ------------------- | -------------- |
| `...args`                | ✅                   | ❌              |
| `fn(...args)`            | ✅                   | ❌              |
| `fn.apply(this, args)`   | ✅                   | ✅              |
| `fn.call(this, ...args)` | ✅                   | ✅              |

---

# One-Line Definitions

### Debouncing

> Execute a function only after a specified delay has passed since the last event.

### apply()

> Invokes a function with a specific `this` value and arguments provided as an array or array-like object.

### Rest Parameter

```javascript
(...args)
```

> Collects all incoming arguments into an array.

### Key Interview Takeaway

> Rest parameters preserve arguments. `apply()` and `call()` preserve both arguments and the original `this` context.
