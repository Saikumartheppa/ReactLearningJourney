# Default Parameters — Complete Deep Dive

---

## What Is It?

Before ES6, if you called a function without passing an argument, that parameter was `undefined` inside the function. You had to guard manually.

```js
// Old way
function greet(name) {
  name = name || "stranger";
  console.log("Hello", name);
}
```

ES6 gave you a cleaner way to declare fallback values directly in the function signature.

```js
// ES6 way
function greet(name = "stranger") {
  console.log("Hello", name);
}
```

Same result. But the intent is clear, the logic is in the right place, and you're not polluting the function body with guard code.

---

## PART 1 — THE BASICS

### Simple default

```js
function multiply(a, b = 2) {
  return a * b;
}

multiply(5);    // 10 — b used default
multiply(5, 3); // 15 — b used passed value
```

---

### Default only triggers for `undefined`

This is rule number one. Burn it in.

```js
function test(x = 99) {
  console.log(x);
}

test(undefined); // 99 — default triggers
test(null);      // null — default does NOT trigger
test(0);         // 0 — default does NOT trigger
test("");        // "" — default does NOT trigger
test(false);     // false — default does NOT trigger
```

`null`, `0`, `""`, `false` are all valid values. The default only steps in when the argument is **explicitly `undefined`** or **not passed at all** (which is the same thing — missing arguments are `undefined`).

This is the single most tested thing about default parameters in interviews.

---

### Explicitly passing undefined to trigger default

```js
function createUser(name = "Anonymous", role = "user") {
  return { name, role };
}

createUser(undefined, "admin");
// { name: "Anonymous", role: "admin" }
```

You can skip a parameter in the middle by passing `undefined`. There's no other way to skip positional arguments — you can't just leave a gap.

---

## PART 2 — DEFAULTS ARE EXPRESSIONS, NOT JUST VALUES

This is where most people's mental model breaks. Default values aren't limited to literals. They're **evaluated at call time**, every time the function is called.

### Function calls as defaults

```js
function getTimestamp() {
  return Date.now();
}

function log(message, time = getTimestamp()) {
  console.log(time, message);
}

log("first");  // timestamp at time of first call
log("second"); // different timestamp — re-evaluated
```

The default expression runs fresh on every call where the argument is missing. It is not computed once at definition time.

---

### This means defaults can reference other parameters

```js
function createRect(width = 10, height = width) {
  return { width, height };
}

createRect();        // { width: 10, height: 10 }
createRect(5);       // { width: 5, height: 5 }
createRect(5, 20);   // { width: 5, height: 20 }
```

Parameters are evaluated **left to right**. `height` can reference `width` because `width` is already resolved by the time `height` is processed.

The reverse doesn't work:

```js
function broken(a = b, b = 5) {} // ReferenceError — b not yet initialized when a's default runs
```

---

### Default can be any expression

```js
function tag(label = "item", id = label.toUpperCase() + "_" + Math.random()) {
  return { label, id };
}
```

Arbitrary computation. Any valid JS expression works.

---

## PART 3 — SCOPE OF DEFAULT PARAMETERS

This is the most subtle part and almost nobody understands it fully.

Default parameter expressions have their **own scope** — between the outer scope and the function body scope.

```js
const value = "outer";

function test(x = value) {
  const value = "inner";
  console.log(x);
}

test(); // "outer" — default resolved in parameter scope, not function body
```

The default `value` refers to the outer `value` because at the time the default is evaluated, the function body hasn't started executing yet. The inner `const value` doesn't exist yet.

```js
function test(x = y) {  // ReferenceError at call time if y isn't in outer scope
  var y = 5;
  console.log(x);
}

test(); // ReferenceError — var y is in function body scope, not parameter scope
```

`var y` inside the function body is not accessible to the default expression of `x`. Parameter scope sits above function body scope.

---

## PART 4 — DEFAULT PARAMETERS AND `arguments`

When you use default parameters, the `arguments` object **stops reflecting** the actual parameter values and only reflects what was literally passed.

```js
function test(a = 10) {
  console.log(a);            // 10
  console.log(arguments[0]); // undefined — nothing was passed
}

test();
```

```js
function test(a = 10) {
  console.log(a);            // 5
  console.log(arguments[0]); // 5 — was explicitly passed
}

test(5);
```

In sloppy mode without defaults, `arguments` and named params stay in sync. With defaults, they decouple. In strict mode and with defaults, `arguments` always reflects what was passed, not what the parameter resolved to.

In modern code this rarely matters because you shouldn't be using `arguments` — but it's an interview question waiting to happen.

---

## PART 5 — DESTRUCTURING + DEFAULTS COMBINED

This is where real-world usage lives. These two features are almost always used together.

### Object parameter with defaults

```js
function connect({ host = "localhost", port = 3000, ssl = false } = {}) {
  console.log(host, port, ssl);
}

connect();                          // "localhost" 3000 false
connect({ port: 8080 });            // "localhost" 8080 false
connect({ host: "prod.io", ssl: true }); // "prod.io" 3000 true
```

The `= {}` at the end is critical. Without it:

```js
function connect({ host = "localhost", port = 3000 }) {
  // ...
}

connect(); // TypeError: Cannot destructure property 'host' of undefined
```

If you call with no argument, the parameter is `undefined`, and you can't destructure `undefined`. The `= {}` gives the destructuring a fallback object to work against.

---

### Two levels of defaults

```js
function setup({ theme = "light", font = { size: 14, family: "sans" } } = {}) {
  console.log(theme, font);
}
```

Here there are two levels:
- The whole parameter defaults to `{}`
- Individual properties default to their values

But if you pass `{ font: { size: 18 } }`, you get `{ size: 18 }` — not `{ size: 18, family: "sans" }`. The nested default is **all or nothing**. Property-level defaults on nested objects don't merge automatically.

---

### Array parameter with defaults

```js
function first([a = 0, b = 0] = []) {
  return a + b;
}

first();           // 0
first([5]);        // 5
first([5, 10]);    // 15
```

Same pattern — destructured parameter with a fallback for when nothing is passed.

---

## PART 6 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
function add(a, b = a * 2) {
  return a + b;
}

console.log(add(3));
console.log(add(3, 4));
```
Answer: `9` and `7`. First call: `b` defaults to `3 * 2 = 6`, so `3 + 6 = 9`. Second call: `b` is `4`, so `3 + 4 = 7`.

---

**Q2. What's the output?**
```js
function test(a = 1, b = 2) {
  console.log(arguments.length);
}

test(undefined, undefined);
```
Answer: `2` — two arguments were passed (both `undefined`). `arguments.length` counts what was actually passed, not what the parameters resolved to.

---

**Q3. What's the output?**
```js
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
Answer: `1`, `2`, `99`. Default expression runs fresh each call. Third call passes a value so default doesn't run, count stays at 2.

---

**Q4. What's the output?**
```js
function test(a = b, b = 2) {
  console.log(a, b);
}

test();
```
Answer: **ReferenceError**. `a`'s default tries to read `b` before `b` is initialized. Parameters are in a temporal dead zone until their own default is evaluated — same as `let`/`const`.

---

**Q5. What's the output?**
```js
function test(x = 10) {
  var x = 20;
  console.log(x);
}

test();
```
Answer: `20`. Inside the function body, `var x = 20` redeclares and reassigns `x`. Default only determines the initial value of `x` entering the function. Once inside, it's a normal variable.

---

**Q6. What's wrong here?**
```js
function fetch(url, options = {}, callback = null) {
  if (!callback) throw new Error("callback required");
}
```
Answer: Nothing syntactically. But the design is flawed — if callback is required, it shouldn't have a default. Defaults imply optional. Required parameters should come first, without defaults. This is a design smell interview conversations dig into.

---

**Q7. What's the output?**
```js
function test({ a = 1 } = { a: 5 }) {
  console.log(a);
}

test();          // ?
test({});        // ?
test({ a: 10 }); // ?
```
Answer:
- `test()` → `5` — no argument, so the whole-parameter default `{ a: 5 }` is used. Then `a` is pulled from it as `5`. The property-level default `= 1` is not used because `a` is defined as `5`.
- `test({})` → `1` — an empty object is passed, so the parameter default is skipped. Now destructuring `{}` for `a` gets `undefined`, so property-level default `= 1` kicks in.
- `test({ a: 10 })` → `10` — `a` is explicitly provided.

This question trips up almost everyone. Two levels of defaults, each with different trigger conditions.

---

**Q8. Can you use a default parameter before a non-default one?**
```js
function test(a = 1, b) {
  console.log(a, b);
}

test(undefined, 5);
```
Answer: Syntactically valid. Output is `1 5`. But it's bad design. You're forced to pass `undefined` explicitly to skip `a`. Convention: always put parameters with defaults **after** required parameters.

---

## PART 7 — THINGS PEOPLE GET WRONG

1. **Only `undefined` triggers the default. Not null, not 0, not false, not "".** This is the number one mistake.
2. **Defaults are evaluated at call time**, not at definition time. Every call gets a fresh evaluation.
3. **Parameters reference each other left to right only.** Right-to-left reference is a TDZ error.
4. **The `= {}` on a destructured parameter is not optional** if you want the function to be callable without arguments.
5. **Two-level defaults don't merge nested objects.** If you pass a partial nested object, the property-level defaults for that nested object don't apply — only the whole nested object's default does.
6. **`arguments` reflects what was passed, not what was resolved.** With defaults, these can diverge.
7. **Required parameters should come first** without defaults. Putting defaults before required params creates unusable APIs.

---

## PART 8 — WHY DEFAULTS GO AFTER REQUIRED PARAMETERS

JavaScript assigns arguments to parameters **by position**.

```js
function test(a = 1, b) {
  console.log(a, b);
}
```

You want to call this and pass `b = 5` while letting `a` use its default.

You can't do this:
```js
test(5);        // a gets 5, b is undefined. You passed to the wrong slot.
test(, 5);      // SyntaxError. Empty slots aren't allowed in function calls.
```

The **only** way to skip `a` and reach `b` is:
```js
test(undefined, 5); // a = 1 (default), b = 5
```

You're forced to explicitly pass `undefined` as a placeholder — ugly, and not obvious to the caller why they're doing it. That's an API design failure.

Flip it:

```js
function test(b, a = 1) {
  console.log(b, a);
}

test(5);     // b = 5, a = 1 (default). Clean.
test(5, 10); // b = 5, a = 10. Also clean.
```

Required first, optional last. The caller fills required slots, then simply stops passing arguments once they run out of things they care about — no placeholder juggling.

**The Real Rule: Required parameters first, optional parameters last.** This isn't JS-specific — it's a universal API design principle across most languages with default parameters (Python, C++, etc).

### When you need "optional in the middle" — use destructuring instead

```js
function createUser({ name, role = "user", age }) {
  console.log(name, role, age);
}

createUser({ name: "Arun", age: 25 });
// name = "Arun", role = "user" (default), age = 25
```

Now order doesn't matter — each argument is addressed by name, not position. Skip `role` cleanly without touching anything else.

---

## Mental Model

A default parameter is a **conditional assignment that happens before the function body runs**.

```js
function test(x = 10) {}

// Conceptually equivalent to:
function test(x) {
  x = x === undefined ? 10 : x;
}
```

Except the real version evaluates in parameter scope, not function body scope — which is why it can't see `var` declarations inside the function, and why parameter-to-parameter references go left to right.

The default is the **contract you're making**: "if the caller doesn't care about this argument, here's what I'll use." That contract only activates on `undefined` — the explicit signal of "nothing was provided."