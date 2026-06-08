# JavaScript `call()`, `apply()`, and `bind()`

## Why Do We Need Them?

In JavaScript, the value of `this` depends on **how a function is invoked**, not where it is defined.

`call()`, `apply()`, and `bind()` allow us to explicitly control what `this` refers to.

---

# 1. `call()`

The `call()` method invokes a function immediately and allows us to specify the value of `this`.

### Syntax

```javascript
functionName.call(thisArg, arg1, arg2, arg3);
```

### Example

```javascript
const printFullName = function (homeTown, country) {
    console.log(
        this.firstName +
        " " +
        this.lastName +
        " from " +
        homeTown +
        ", " +
        country
    );
};

const person1 = {
    firstName: "Virat",
    lastName: "Kohli"
};

const person2 = {
    firstName: "Alex",
    lastName: "Hales"
};

printFullName.call(person1, "Delhi", "India");
printFullName.call(person2, "London", "England");
```

### Output

```text
Virat Kohli from Delhi, India
Alex Hales from London, England
```

---

## Function Borrowing

One common use case of `call()` is **Function Borrowing**.

Instead of duplicating methods across objects, one object can borrow another object's function.

```javascript
const person1 = {
    firstName: "Virat",
    lastName: "Kohli",
    printFullName() {
        console.log(this.firstName + " " + this.lastName);
    }
};

const person2 = {
    firstName: "Alex",
    lastName: "Hales"
};

person1.printFullName.call(person2);
```

### Output

```text
Alex Hales
```

---

# 2. `apply()`

`apply()` works exactly like `call()`.

The only difference is **how arguments are passed**.

### Syntax

```javascript
functionName.apply(thisArg, [arg1, arg2, arg3]);
```

### Example

```javascript
printFullName.apply(person1, ["Delhi", "India"]);
printFullName.apply(person2, ["London", "England"]);
```

### Output

```text
Virat Kohli from Delhi, India
Alex Hales from London, England
```

---

## When Should We Use `apply()`?

Use `apply()` when arguments are already available as an array.

```javascript
const args = ["Delhi", "India"];

printFullName.apply(person1, args);
```

---

# 3. `bind()`

Unlike `call()` and `apply()`, `bind()` does **not execute** the function immediately.

Instead, it creates and returns a **new function** with:

* `this` permanently bound
* optional pre-filled arguments

### Syntax

```javascript
const newFunction = originalFunction.bind(thisArg, arg1, arg2);
```

---

## Example 1: Binding `this`

```javascript
const printMyName = printFullName.bind(person1);

printMyName("Delhi", "India");
```

### Output

```text
Virat Kohli from Delhi, India
```

---

## Example 2: Partial Application

Arguments can be pre-filled while binding.

```javascript
const printMyName = printFullName.bind(
    person1,
    "Delhi",
    "India"
);

printMyName();
```

### Output

```text
Virat Kohli from Delhi, India
```

This technique is called **Partial Application**.

---

# Important Interview Question

## Why Doesn't `call()` Override a Bound Function?

```javascript
const printMyName = printFullName.bind(
    person1,
    "Delhi",
    "India"
);

printMyName.call(person2);
```

### Output

```text
Virat Kohli from Delhi, India
```

### Why?

Once a function is created using `bind()`, its `this` value becomes permanently fixed.

Later calls using:

```javascript
call()
apply()
bind()
```

cannot change that bound `this`.

Think of it as:

```javascript
const lockedFunction = printFullName.bind(person1);
```

The reference to `person1` is now locked.

---

# Passing Arguments After `bind()`

### Example

```javascript
const printMyName = printFullName.bind(person1);

printMyName("Delhi", "India");
```

Works because the remaining arguments are supplied during invocation.

---

## What Happens Here?

```javascript
printMyName(["Delhi", "India"]);
```

### Output

```text
Virat Kohli from Delhi,India , undefined
```

### Why?

Because your function expects:

```javascript
(homeTown, country)
```

but you're passing:

```javascript
["Delhi", "India"]
```

which becomes:

```javascript
homeTown = ["Delhi", "India"];
country = undefined;
```

To support array arguments, you would need:

```javascript
const printFullName = function ([homeTown, country]) {
    console.log(
        `${this.firstName} ${this.lastName} from ${homeTown}, ${country}`
    );
};
```

---

# Real World Use Case: Callback Functions

A common issue in JavaScript is losing the value of `this`.

### Problem

```javascript
const user = {
    name: "Alice",
    greet() {
        console.log(`Hi, ${this.name}`);
    }
};

setTimeout(user.greet, 1000);
```

### Output

```text
Hi, undefined
```

or

```text
TypeError
```

depending on strict mode.

### Why?

`setTimeout()` executes the function independently.

The original object (`user`) is no longer the caller.

So `this` is lost.

---

## Solution Using `bind()`

```javascript
setTimeout(
    user.greet.bind(user),
    1000
);
```

### Output

```text
Hi, Alice
```

This is one of the most practical uses of `bind()`.

---

# Quick Comparison

| Feature                       | call() | apply() | bind() |
| ----------------------------- | ------ | ------- | ------ |
| Executes immediately          | ✅      | ✅       | ❌      |
| Returns new function          | ❌      | ❌       | ✅      |
| Sets `this`                   | ✅      | ✅       | ✅      |
| Arguments passed individually | ✅      | ❌       | ✅      |
| Arguments passed as array     | ❌      | ✅       | ❌      |
| Useful for callbacks          | ❌      | ❌       | ✅      |

---

# Memory Trick

### `call`

> Call now.

```javascript
fn.call(obj, a, b);
```

---

### `apply`

> Apply array.

```javascript
fn.apply(obj, [a, b]);
```

---

### `bind`

> Bind now, execute later.

```javascript
const newFn = fn.bind(obj);
newFn();
```

---

# Summary

* `call()` → invokes function immediately and passes arguments individually.
* `apply()` → invokes function immediately and passes arguments as an array.
* `bind()` → returns a new function with a permanently bound `this`.
* `bind()` is commonly used when passing functions as callbacks (`setTimeout`, event listeners, promises, etc.).
* A bound function's `this` cannot be overridden by `call()` or `apply()`.
* `bind()` also supports partial application by pre-filling arguments.
* Function borrowing is a common use case for `call()` and `apply()`.
* Remember:

```text
call  -> Call now
apply -> Apply array
bind  -> Bind now, invoke later
```
