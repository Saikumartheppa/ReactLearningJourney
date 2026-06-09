# JavaScript Default Parameters — Complete Deep Dive

## What Are Default Parameters?

Before ES6, if a function was called without an argument, the parameter became `undefined`.

### Pre-ES6 Approach

```javascript
function greet(name) {
    name = name || "stranger";
    console.log("Hello", name);
}
```

### ES6 Approach

```javascript
function greet(name = "stranger") {
    console.log("Hello", name);
}
```

Benefits:

* Cleaner syntax
* Intent is explicit
* No guard logic inside the function body

---

# Part 1: The Basics

## Simple Default Value

```javascript
function multiply(a, b = 2) {
    return a * b;
}

multiply(5);    // 10
multiply(5, 3); // 15
```

---

## Default Parameters Trigger Only for `undefined`

This is the most important rule.

```javascript
function test(x = 99) {
    console.log(x);
}

test(undefined); // 99
test(null);      // null
test(0);         // 0
test("");        // ""
test(false);     // false
```

### Key Takeaway

Only `undefined` triggers the default value.

These values do NOT trigger defaults:

* `null`
* `0`
* `""`
* `false`
* `NaN`

---

## Skipping Parameters with `undefined`

```javascript
function createUser(name = "Anonymous", role = "user") {
    return { name, role };
}

createUser(undefined, "admin");
```

Output:

```javascript
{
    name: "Anonymous",
    role: "admin"
}
```

This is the only way to skip a positional argument.

---

# Part 2: Defaults Are Expressions

Default values are not limited to literals.

They can be any valid JavaScript expression.

---

## Function Call as a Default

```javascript
function getTimestamp() {
    return Date.now();
}

function log(message, time = getTimestamp()) {
    console.log(time, message);
}

log("first");
log("second");
```

Each call generates a new timestamp.

### Important

Default expressions are evaluated at **call time**, not definition time.

---

## Referencing Earlier Parameters

```javascript
function createRect(width = 10, height = width) {
    return { width, height };
}

createRect();       // { width: 10, height: 10 }
createRect(5);      // { width: 5, height: 5 }
createRect(5, 20);  // { width: 5, height: 20 }
```

Parameters are evaluated from **left to right**.

---

## Invalid Right-to-Left Reference

```javascript
function broken(a = b, b = 5) {}
```

Output:

```text
ReferenceError
```

Because `b` is not initialized when `a` is evaluated.

---

## Arbitrary Expressions

```javascript
function tag(
    label = "item",
    id = label.toUpperCase() + "_" + Math.random()
) {
    return { label, id };
}
```

Any valid expression can be used as a default.

---

# Part 3: Scope of Default Parameters

Default parameters have their own scope.

Think of it as:

```text
Global Scope
      ↓
Parameter Scope
      ↓
Function Body Scope
```

---

## Example

```javascript
const value = "outer";

function test(x = value) {
    const value = "inner";
    console.log(x);
}

test();
```

Output:

```text
outer
```

Why?

The default value is evaluated before the function body runs.

---

## Another Example

```javascript
function test(x = y) {
    var y = 5;
    console.log(x);
}

test();
```

Output:

```text
ReferenceError
```

Because parameter scope cannot access variables declared in the function body.

---

# Part 4: Default Parameters and `arguments`

When default parameters are used, the `arguments` object reflects only what was actually passed.

---

## Example 1

```javascript
function test(a = 10) {
    console.log(a);
    console.log(arguments[0]);
}

test();
```

Output:

```text
10
undefined
```

---

## Example 2

```javascript
function test(a = 10) {
    console.log(a);
    console.log(arguments[0]);
}

test(5);
```

Output:

```text
5
5
```

---

## Key Takeaway

`arguments` shows:

* Actual arguments passed
* Not the resolved parameter values

---

# Part 5: Destructuring + Defaults

This is where default parameters are most commonly used in production code.

---

## Object Destructuring with Defaults

```javascript
function connect(
    {
        host = "localhost",
        port = 3000,
        ssl = false
    } = {}
) {
    console.log(host, port, ssl);
}

connect();
connect({ port: 8080 });
connect({ host: "prod.io", ssl: true });
```

---

## Why `= {}` Is Important

Without it:

```javascript
function connect({
    host = "localhost",
    port = 3000
}) {}

connect();
```

Output:

```text
TypeError
```

Because JavaScript cannot destructure `undefined`.

---

## Two Levels of Defaults

```javascript
function setup(
    {
        theme = "light",
        font = {
            size: 14,
            family: "sans"
        }
    } = {}
) {
    console.log(theme, font);
}
```

### Important

```javascript
setup({
    font: {
        size: 18
    }
});
```

Output:

```javascript
{
    size: 18
}
```

Not:

```javascript
{
    size: 18,
    family: "sans"
}
```

Defaults do NOT deep merge objects.

---

## Array Destructuring with Defaults

```javascript
function first([a = 0, b = 0] = []) {
    return a + b;
}

first();        // 0
first([5]);     // 5
first([5, 10]); // 15
```

---

# Part 6: Common Interview Questions

## Q1

```javascript
function add(a, b = a * 2) {
    return a + b;
}

console.log(add(3));
console.log(add(3, 4));
```

Output:

```text
9
7
```

---

## Q2

```javascript
function test(a = 1, b = 2) {
    console.log(arguments.length);
}

test(undefined, undefined);
```

Output:

```text
2
```

Because two arguments were passed.

---

## Q3

```javascript
let count = 0;

function increment() {
    return ++count;
}

function test(x = increment()) {
    console.log(x);
}

test();
test();
test(99);
```

Output:

```text
1
2
99
```

---

## Q4

```javascript
function test(a = b, b = 2) {
    console.log(a, b);
}

test();
```

Output:

```text
ReferenceError
```

Temporal Dead Zone (TDZ).

---

## Q5

```javascript
function test(x = 10) {
    var x = 20;
    console.log(x);
}

test();
```

Output:

```text
20
```

The default only provides the initial value.

---

## Q6: Design Smell

```javascript
function fetch(url, options = {}, callback = null) {
    if (!callback)
        throw new Error("callback required");
}
```

Technically valid.

But if a parameter is required, it shouldn't have a default value.

---

## Q7

```javascript
function test({ a = 1 } = { a: 5 }) {
    console.log(a);
}

test();
test({});
test({ a: 10 });
```

Output:

```text
5
1
10
```

This demonstrates two levels of defaults.

---

## Q8

```javascript
function test(a = 1, b) {
    console.log(a, b);
}

test(undefined, 5);
```

Output:

```text
1 5
```

Valid syntax, but poor API design.

---

# Things People Get Wrong

### ❌ Mistake 1

Thinking `null` triggers defaults.

```javascript
test(null);
```

It does not.

---

### ❌ Mistake 2

Thinking defaults run once.

Defaults are evaluated every call.

---

### ❌ Mistake 3

Referencing parameters right-to-left.

```javascript
function test(a = b, b = 10) {}
```

ReferenceError.

---

### ❌ Mistake 4

Forgetting `= {}` during destructuring.

```javascript
function test({ x }) {}
```

Calling `test()` throws.

---

### ❌ Mistake 5

Assuming nested defaults merge objects.

They don't.

---

### ❌ Mistake 6

Assuming `arguments` contains resolved values.

It only contains passed values.

---

# Mental Model

Think of:

```javascript
function test(x = 10) {}
```

as roughly:

```javascript
function test(x) {
    x = x === undefined ? 10 : x;
}
```

But remember:

* Real defaults execute in parameter scope
* Not function body scope
* Can reference earlier parameters
* Cannot reference later parameters

---

# Quick Revision Notes

### Default Parameters

* Introduced in ES6
* Provide fallback values
* Trigger only for `undefined`

### Evaluation

* Evaluated at call time
* Re-evaluated on every function call

### Parameter Order

* Left → Right
* Earlier parameters can be referenced
* Later parameters cannot

### Destructuring

Always use:

```javascript
function fn({ a = 1 } = {}) {}
```

instead of:

```javascript
function fn({ a = 1 }) {}
```
# Why Should Default Parameters Come After Required Parameters?

A common convention in JavaScript (and most programming languages) is:

> Put required parameters first and default/optional parameters last.

For example:

```javascript
function test(a = 1, b) {
    console.log(a, b);
}
```

At first glance, this seems fine.

But consider the following requirement:

> "I want to use the default value for `a` and provide a value only for `b`."

### Problem

Because JavaScript maps arguments to parameters by position, you cannot do this:

```javascript
test(5);
```

Output:

```javascript
a = 5;
b = undefined;
```

The value `5` goes into the first parameter slot (`a`), not `b`.

You also cannot skip a parameter position:

```javascript
test(, 5);
```

Output:

```text
SyntaxError
```

JavaScript does not allow empty argument positions in function calls.

---

## The Only Working Solution

```javascript
test(undefined, 5);
```

Output:

```javascript
a = 1;
b = 5;
```

This works because default parameters are triggered only when the argument is `undefined`.

However, this creates a usability problem:

* The caller must know that `a` has a default value.
* The caller must intentionally pass `undefined`.
* The API becomes less intuitive.

This is generally considered an API design smell.

---

## Better Design

Place required parameters first and optional parameters last.

```javascript
function test(b, a = 1) {
    console.log(b, a);
}
```

Now the API is much cleaner:

```javascript
test(5);
```

Output:

```javascript
b = 5;
a = 1;
```

And if the caller wants to override the default:

```javascript
test(5, 10);
```

Output:

```javascript
b = 5;
a = 10;
```

No placeholder values required.

---

## Real Rule

The actual rule is not:

> "Default parameters must be last."

The real rule is:

> Required parameters first, optional parameters last.

Default values make a parameter optional, so they naturally belong at the end of the parameter list.

This principle exists in many languages:

* JavaScript
* Python
* C++
* Kotlin
* Swift

and many others.

---

## What If an Optional Parameter Needs to Be in the Middle?

This is usually a sign that positional arguments are the wrong tool.

Instead, use an object parameter.

```javascript
function createUser({
    name,
    role = "user",
    age
}) {
    console.log(name, role, age);
}
```

Usage:

```javascript
createUser({
    name: "Arun",
    age: 25
});
```

Output:

```javascript
name = "Arun";
role = "user";
age = 25;
```

Benefits:

* Order doesn't matter.
* Easy to skip optional fields.
* Better readability.
* Scales well as parameters grow.

---

## Interview Takeaway

### Bad Design

```javascript
function test(a = 1, b) {}
```

Caller must use:

```javascript
test(undefined, 5);
```

---

### Better Design

```javascript
function test(b, a = 1) {}
```

Caller can simply write:

```javascript
test(5);
```

---

## One-Line Summary

> Put default parameters at the end so callers can stop passing arguments whenever they want to use defaults. Putting defaults before required parameters forces callers to pass `undefined` placeholders, which makes APIs harder to use.

### Interview One-Liner

> A default parameter is a conditional assignment that happens before the function body executes.

```
```
