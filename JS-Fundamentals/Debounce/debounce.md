# Debouncing in JavaScript — Complete Revision Notes

---

# Table of Contents

1. What is Debouncing?
2. Why Do We Need Debouncing?
3. Basic Debounce
4. Preserving `this` and Arguments
5. `cancel()`
6. `flush()`
7. Leading Debounce
8. Trailing Debounce
9. Leading + Trailing Debounce
10. Lodash-Like Debounce
11. `maxWait`
12. Why Multiple Timers?
13. Common Interview Questions
14. Debounce vs Throttle
15. Key Takeaways

---

# What is Debouncing?

Debouncing is a technique used to delay function execution until a certain amount of time has passed since the last event occurred.

Instead of executing a function repeatedly for every event:

```text
h
he
hel
hell
hello
```

Debouncing waits for the user to stop typing.

Output:

```text
hello
```

Only one API call is made.

---

# Why Do We Need Debouncing?

Without debouncing:

```text
User Types
↓
h
he
hel
hell
hello
```

API Calls:

```text
5 API Calls
```

With Debouncing:

```text
User Types
↓
Wait
↓
Execute Once
```

API Calls:

```text
1 API Call
```

Benefits:

- Better performance
- Reduced API calls
- Lower server load
- Better user experience

---

# Basic Debounce

## Implementation

```javascript
function debounce(func, delay) {

    let timerId;

    return function (...args) {

        clearTimeout(timerId);

        timerId = setTimeout(() => {

            func.apply(this, args);

        }, delay);
    };
}
```

---

## How It Works

### First Keypress

```text
Timer Created
```

### Second Keypress

```text
Old Timer Cleared
New Timer Created
```

### Third Keypress

```text
Old Timer Cleared
New Timer Created
```

### User Stops Typing

```text
Timer Completes
↓
Function Executes
```

---

# Why Use apply()?

Consider:

```javascript
const user = {
    name: "Sai",

    greet(msg) {
        console.log(msg, this.name);
    }
};
```

If debounce uses:

```javascript
func(...args);
```

then:

```javascript
this
```

is lost.

Output:

```text
Hello undefined
```

---

Using:

```javascript
func.apply(this, args);
```

preserves:

- Arguments
- Original `this`

---

# Why Not call()?

`call()` requires individual arguments.

```javascript
func.call(this, arg1, arg2);
```

Inside debounce:

```javascript
args
```

can contain any number of values.

Therefore:

```javascript
func.apply(this, args);
```

is more convenient.

---

# cancel()

## Problem

Suppose:

```javascript
search("hello");
```

is scheduled.

User navigates away.

We no longer want:

```javascript
search("hello");
```

to execute.

---

## Implementation

```javascript
debounced.cancel = function () {

    clearTimeout(timerId);

    timerId = null;
};
```

---

## Why clearTimeout()?

Without:

```javascript
clearTimeout(timerId);
```

the scheduled execution still happens.

---

## Use Cases

### Page Navigation

```javascript
window.onbeforeunload = () => {
    search.cancel();
};
```

---

### React Component Unmount

```javascript
useEffect(() => {

    return () => {
        search.cancel();
    };

}, []);
```

---

### Modal Close

```javascript
saveDraft.cancel();
```

---

# flush()

## Problem

Normally:

```javascript
search("hello");
```

waits.

Sometimes we want:

```javascript
search.flush();
```

to execute immediately.

---

## Why Store Arguments?

When:

```javascript
search("hello");
```

is called:

```javascript
lastPendingArgs = ["hello"];
lastPendingContext = this;
```

are stored.

---

## Implementation

```javascript
debounced.flush = function () {

    clearTimeout(timerId);

    if(lastPendingArgs){

        func.apply(
            lastPendingContext,
            lastPendingArgs
        );
    }
};
```

---

## Use Cases

### Immediate Save

```javascript
saveDraft.flush();
```

before closing the page.

---

### Immediate Search

```javascript
search.flush();
```

when user presses Enter.

---

# Leading Debounce

## Behavior

Execute immediately.

Ignore future calls until inactivity period completes.

---

## Example

```text
Input:

I
IP
IPO
IPOO
```

Output:

```text
I
```

Only the first call executes.

---

## Implementation

```javascript
function leadingDebounce(func, delay) {

    let timerId;

    return function (...args) {

        const callNow = !timerId;

        clearTimeout(timerId);

        timerId = setTimeout(() => {

            timerId = null;

        }, delay);

        if(callNow){

            func.apply(this, args);
        }
    };
}
```

---

## Use Cases

### Activity Tracking

```text
User Started Scrolling
```

Track only the first event.

---

### Show Loading State

```javascript
showLoader();
```

immediately.

---

# Trailing Debounce

This is the classic debounce.

---

## Behavior

Wait for inactivity.

Execute once.

---

## Example

```text
Input:

I
IP
IPO
IPOO
```

Output:

```text
IPOO
```

---

## Use Cases

### Search Bars

```javascript
searchApi();
```

---

### Autosuggest

```javascript
fetchSuggestions();
```

---

### Validation

```javascript
checkEmailAvailability();
```

---

# Leading + Trailing Debounce

## Behavior

Execute:

```text
First Call
+
Last Call
```

---

## Example

Input:

```text
I
IP
IPO
```

Output:

```text
I
IPO
```

---

## Why?

Sometimes:

### Immediate Feedback

```javascript
showLoader();
```

and

### Final Action

```javascript
searchApi();
```

are both needed.

---

## Use Cases

### Search with Loader

Leading:

```javascript
showLoader();
```

Trailing:

```javascript
searchApi();
```

---

### Activity Tracking

Leading:

```text
User Started Scrolling
```

Trailing:

```text
User Stopped Scrolling
```

---

### Auto Save

Leading:

```text
Saving...
```

Trailing:

```javascript
saveDocument();
```

---

# Lodash-Like Debounce

Supports:

```text
✓ Leading
✓ Trailing
✓ Cancel
✓ Flush
✓ Context Preservation
✓ Argument Preservation
```

---

# Why Store These Variables?

```javascript
let lastPendingArgs;
let lastPendingContext;
```

Required for:

```javascript
flush()
```

and

```javascript
maxWait
```

because execution may happen later.

---

# Why Assign null?

After execution:

```javascript
lastPendingArgs = null;
lastPendingContext = null;
```

---

Benefits:

### State Cleanup

```text
No Pending Invocation
```

---

### Easier Debugging

```javascript
if(lastPendingArgs)
```

clearly shows whether work is pending.

---

### Garbage Collection

Large objects become eligible for cleanup.

---

# maxWait

## Problem

Without maxWait:

```text
User Types Forever
```

Debounce timer keeps resetting.

Function may never execute.

---

## Example

Delay:

```javascript
300ms
```

User types every:

```javascript
200ms
```

Result:

```text
Never Executes
```

---

# Solution

```javascript
maxWait = 2000
```

Guarantee execution at least once every 2 seconds.

---

## Example

```text
0s
1s
2s
3s
4s
```

Output:

```text
2s -> Execute
4s -> Execute
6s -> Execute
```

---

# Why Need Two Timers?

## Debounce Timer

Responsible for:

```text
User Stopped Typing
```

---

## MaxWait Timer

Responsible for:

```text
Don't Wait Forever
```

---

Debounce timer:

```javascript
clearTimeout(debounceTimer);
```

resets constantly.

---

MaxWait timer:

```javascript
maxWaitTimer
```

must NOT reset.

---

Therefore:

```javascript
Two Independent Timers
```

are required.

---

# Common Interview Questions

## Why Use Debounce?

To reduce unnecessary function executions.

---

## Difference Between Debounce and Throttle?

### Debounce

Wait until events stop.

```text
Click Click Click
          ↓
       Execute
```

---

### Throttle

Execute at fixed intervals.

```text
Click Click Click Click
↓      ↓      ↓
Run    Run    Run
```

---

## Why Use apply()?

Preserve:

```javascript
this
```

and

```javascript
args
```

---

## Why Store lastPendingArgs?

Needed for:

```javascript
flush()
```

and

```javascript
maxWait
```

---

## Why clearTimeout() Inside flush()?

Without:

```javascript
clearTimeout()
```

the scheduled call executes later again.

Result:

```text
Duplicate Execution
```

---

# Real World Use Cases

| Scenario | Debounce Type |
|-----------|--------------|
| Search Bar | Trailing |
| Autosuggest | Trailing |
| API Search | Trailing |
| Save Draft | Leading + Trailing |
| Activity Tracking | Leading + Trailing |
| Analytics | Leading |
| Show Loader | Leading |
| Form Validation | Trailing |
| Scroll Finished Event | Trailing |
| User Started Scrolling | Leading |

---

# Key Takeaways

### Debounce

> Execute only after inactivity.

---

### Leading Debounce

> Execute immediately.

---

### Trailing Debounce

> Execute after inactivity.

---

### Leading + Trailing

> Execute first and last call.

---

### cancel()

> Remove pending execution.

---

### flush()

> Execute pending invocation immediately.

---

### maxWait

> Guarantee execution even if events never stop.

---

### Golden Rule

```text
Debounce Timer
=
Wait Until User Stops

MaxWait Timer
=
Don't Wait Forever
```

Understanding this distinction is the key to implementing a production-grade debounce utility.