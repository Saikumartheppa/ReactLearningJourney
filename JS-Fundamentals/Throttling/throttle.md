# JavaScript Throttling — Complete Revision Notes

# What is Throttling?

Throttling ensures that a function executes at most once within a specified time interval.

In simple words:

> Allow the first call, then ignore all subsequent calls for a fixed period.

---

# Why Do We Need Throttling?

Without throttling:

```text
Click
Click
Click
Click
Click
```

Function executes:

```text
5 times
```

This can lead to:

* Excessive API calls
* Performance issues
* Unnecessary DOM updates
* Event flooding

---

# Common Use Cases

### Scroll Events

```javascript
window.addEventListener("scroll", handleScroll);
```

Without throttling, hundreds of events may fire per second.

---

### Mouse Move Events

```javascript
window.addEventListener("mousemove", handleMouseMove);
```

---

### Button Spam Prevention

```javascript
<button onclick="submitForm()">
```

Prevent users from triggering multiple submissions rapidly.

---

# Basic Throttle Implementation

```javascript
function throttle(func, delay) {
    let shouldCall = true;

    return function (...args) {

        if (!shouldCall) return;

        shouldCall = false;

        func.apply(this, args);

        setTimeout(() => {
            shouldCall = true;
        }, delay);
    };
}
```

---

# Usage

```javascript
const expensive = (value) => {
    console.log(
        "Expensive Operation:",
        value
    );
};

const throttledFunction =
    throttle(expensive, 3000);
```

HTML:

```html
<button
    onclick="throttledFunction('Clicked')"
>
    Click Me
</button>
```

---

# Execution Flow

Assume:

```javascript
throttle(fn, 3000);
```

Timeline:

```text
0ms    -> Click -> Executes
500ms  -> Click -> Ignored
1000ms -> Click -> Ignored
2000ms -> Click -> Ignored
3000ms -> Click -> Executes
```

Result:

```text
Maximum 1 execution every 3 seconds
```

---

# Understanding the Internal State

Initial state:

```javascript
shouldCall = true;
```

First click:

```javascript
if (!shouldCall) return;
```

passes.

Function executes.

```javascript
shouldCall = false;
```

Subsequent clicks:

```javascript
if (!shouldCall) return;
```

are ignored.

After delay:

```javascript
shouldCall = true;
```

Function becomes callable again.

---

# Why Use apply()?

Implementation:

```javascript
func.apply(this, args);
```

---

## Syntax

```javascript
function.apply(
    thisArg,
    argsArray
);
```

Example:

```javascript
greet.apply(
    user,
    ["Hyderabad", "India"]
);
```

---

# Why Not Directly Call the Function?

Instead of:

```javascript
func.apply(this, args);
```

you might think:

```javascript
func(...args);
```

Let's understand why that's not always enough.

---

# Rest Parameters Preserve Arguments Only

```javascript
(...args)
```

captures:

```javascript
fn(1, 2, 3);
```

as:

```javascript
[1, 2, 3]
```

Arguments are preserved.

---

# What About `this`?

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

## Problem

```javascript
const throttledGreet =
    throttle(
        user.greet,
        3000
    );

throttledGreet("Hello");
```

If throttle contains:

```javascript
func(...args);
```

the function becomes:

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

---

# Why apply() Fixes This

```javascript
func.apply(
    this,
    args
);
```

Preserves:

* Arguments
* Original `this` context

Equivalent to:

```javascript
user.greet("Hello");
```

when called appropriately.

---

# Rest Parameters vs apply()

| Feature                    | Preserves Arguments | Preserves this |
| -------------------------- | ------------------- | -------------- |
| `...args`                  | ✅                   | ❌              |
| `func(...args)`            | ✅                   | ❌              |
| `func.apply(this, args)`   | ✅                   | ✅              |
| `func.call(this, ...args)` | ✅                   | ✅              |

---

# Common Mistakes

## Mistake #1

Incorrect:

```javascript
func.apply([this, args]);
```

Correct:

```javascript
func.apply(this, args);
```

Reason:

```javascript
apply(thisArg, argsArray)
```

requires two separate arguments.

---

## Mistake #2

Thinking:

```javascript
3000
```

means:

```text
3 minutes
```

Actually:

```text
3000 ms = 3 seconds
```

For 3 minutes:

```javascript
3 * 60 * 1000
```

equals:

```javascript
180000
```

---

## Mistake #3

Using:

```html
<button
    onclick="betterExpensive(this.value)"
>
```

without defining a value.

Result:

```javascript
undefined
```

gets passed.

Better:

```html
<button
    value="Clicked"
    onclick="betterExpensive(this.value)"
>
```

or

```html
<button
    onclick="betterExpensive('Clicked')"
>
```

---

# Throttle vs Debounce

## Debounce

Execute only after the user stops triggering events.

Timeline:

```text
Click Click Click Click
                ↓
            Execute
```

Use Cases:

* Search bars
* Autosuggest
* Resize events

---

## Throttle

Execute immediately, then ignore events for a period.

Timeline:

```text
Click Click Click Click
↓         ↓
Execute Execute
```

Use Cases:

* Scroll events
* Mouse movement
* Button spam prevention

---

# Interview Questions

## Q1

Why use throttling?

Answer:

```text
To limit how frequently a function can execute.
```

---

## Q2

What is the difference between debounce and throttle?

Answer:

```text
Debounce waits for inactivity.

Throttle guarantees at most one execution per time window.
```

---

## Q3

Why use apply() inside throttle?

Answer:

```text
1. Preserve arguments.
2. Preserve original this context.
```

---

## Q4

If delay is 3000ms and the user clicks continuously for 10 seconds, how many executions occur?

Timeline:

```text
0s
3s
6s
9s
```

Answer:

```text
Approximately 4 executions.
```

---

# Edge Cases Worth Knowing

### Leading Edge Throttle

Current implementation:

```text
Execute immediately.
Ignore subsequent calls.
```

---

### Trailing Edge Throttle

```text
Execute first call.
Execute latest ignored call.
```

Useful for:

* Scroll tracking
* Analytics
* Auto-save

---

### Timestamp-Based Throttle

Alternative implementation:

```javascript
function throttle(fn, delay) {
    let lastExecution = 0;

    return function (...args) {
        const now = Date.now();

        if (
            now - lastExecution >= delay
        ) {
            lastExecution = now;

            fn.apply(this, args);
        }
    };
}
```

Interviewers sometimes ask:

> Can you implement throttle without using `setTimeout()`?

---

# Quick Revision

### Throttling

> Execute at most once per specified interval.

### Debouncing

> Execute only after events stop occurring.

### apply()

```javascript
fn.apply(thisArg, argsArray);
```

### Rest Parameter

```javascript
(...args)
```

Collects arguments into an array.

### Key Takeaway

> Rest parameters preserve arguments. `apply()` preserves both arguments and the original `this` context.
