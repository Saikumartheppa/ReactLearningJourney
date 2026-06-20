# Optional Chaining (`?.`) — Complete Deep Dive

---

## What Is It?

A way to safely access deeply nested properties without manually checking every level for `null`/`undefined` first.

```js
const user = { address: { city: "Chennai" } };

// Old way — manual guard at every level
const city1 = user && user.address && user.address.city;

// Optional chaining
const city2 = user?.address?.city;
```

If any link in the chain is `null` or `undefined`, the expression **short-circuits and returns `undefined`** instead of throwing a `TypeError`.

```js
const user2 = {};
console.log(user2?.address?.city); // undefined — no error
console.log(user2.address.city);   // TypeError: Cannot read properties of undefined
```

That's the whole point: stop crashes from `Cannot read property 'x' of undefined`.

---

## PART 1 — WHAT IT ACTUALLY CHECKS

This is the first thing people get wrong. Optional chaining checks for **`null` or `undefined` only** — nothing else.

```js
const a = { val: 0 };
console.log(a?.val); // 0 — not skipped, 0 is a real value

const b = { val: false };
console.log(b?.val); // false — not skipped

const c = null;
console.log(c?.val); // undefined — short-circuited

const d = undefined;
console.log(d?.val); // undefined — short-circuited

const e = { val: "" };
console.log(e?.val); // "" — not skipped
```

It does **not** check for falsy values in general. `0`, `false`, `""`, `NaN` all pass through untouched. Only `null` and `undefined` trigger the short-circuit. This is the same rule family as default parameters and destructuring defaults — consistent across the language.

---

## PART 2 — THE THREE FORMS

Optional chaining isn't just for object properties. There are three distinct syntaxes.

### 1. Property access

```js
user?.address?.city
```

### 2. Method calls

```js
user?.greet?.();
```

This checks if `greet` exists before calling it. Without the `?.` before `()`, if `greet` is undefined, you'd get `TypeError: greet is not a function`.

```js
const user = { name: "Arun" };
user.greet();   // TypeError: user.greet is not a function
user.greet?.(); // undefined — no crash, greet doesn't exist so the call is skipped
```

**Critical distinction**: `?.()` checks if the thing being called exists. It does NOT check if the call will succeed or catch errors thrown inside the function.

```js
const user = { greet: () => { throw new Error("boom"); } };
user.greet?.(); // still throws — greet exists, so it gets called, and it throws
```

### 3. Bracket notation / computed access

```js
const key = "city";
user?.address?.[key];
```

Used when the property name is dynamic, or when working with arrays.

```js
const arr = null;
console.log(arr?.[0]); // undefined — no crash
```

---

## PART 3 — SHORT-CIRCUITING BEHAVIOR (The Subtle Part)

This is where real interview depth lives. Once `?.` hits a `null`/`undefined`, the **entire rest of the chain is skipped** — not just the next property.

```js
const user = null;
console.log(user?.address.city.zip.code);
```

You might think this throws partway through because `address` is accessed on `null`. It doesn't. The moment `user?.` sees `null`, it **bails out the entire expression immediately**. `undefined` is returned without ever attempting `.city`, `.zip`, or `.code`.

```js
let count = 0;
function track() { count++; return { val: 1 }; }

const obj = null;
obj?.[track()];

console.log(count); // 0 — track() was never called
```

This proves the short-circuit happens **before** evaluating what comes after `?.`. The whole chain dies at the first `null`/`undefined`, including function calls and computed expressions further down the chain.

---

### Mixing optional and non-optional links

```js
const a = { b: null };
console.log(a.b?.c.d);
```

`a.b` is `null`. `?.c` short-circuits there. `.d` after that is never evaluated even though it doesn't have its own `?.`. Once the chain "goes optional" at any point, everything after inherits that short-circuit — you don't need `?.` at every single link if one upstream link already has it.

But this only protects what comes **after** the `?.`, not before:

```js
const a = null;
console.log(a.b?.c); // TypeError — a itself is accessed without ?. first
```

`a.b` crashes immediately because `a` is `null` and you tried `.b` on it directly, without `?.`. The optional chaining on `b?.c` never even gets a chance to run.

**Rule: put `?.` at every point where the value before it might actually be null/undefined.** You don't need it everywhere, but you need it at the right break point.

---

## PART 4 — COMBINING WITH NULLISH COALESCING (`??`)

These two operators are designed to work together. `?.` prevents the crash, `??` supplies the fallback.

```js
const user = {};

const city = user?.address?.city ?? "Unknown City";
console.log(city); // "Unknown City"
```

Without `??`, you'd get `undefined` printed directly — `??` converts that into something usable.

```js
const city2 = user?.address?.city || "Unknown City";
```

**Don't default to `||` here.** Same trap as before:

```js
const settings = { darkMode: false };
console.log(settings?.darkMode ?? true); // false — correct, preserves real value
console.log(settings?.darkMode || true); // true — WRONG, false is falsy so || overrides it
```

`??` only falls back on `null`/`undefined`. `||` falls back on **any falsy value**, which silently destroys legitimate `false`, `0`, or `""` values. This combo (`?.` + `??`) is the modern standard precisely because both operators share the same null/undefined-only philosophy — they're built to be used together.

---

## PART 5 — OPTIONAL CHAINING WITH FUNCTION ARGUMENTS

A subtlety: short-circuiting affects evaluation order in ways that matter when arguments have side effects.

```js
function logAndReturn(val) {
  console.log("called with", val);
  return val;
}

const obj = null;
obj?.method(logAndReturn(5));
```

`logAndReturn(5)` is **never called** — no console output at all. The short-circuit happens before arguments are evaluated, because the entire expression `obj?.method(...)` bails immediately once `obj` is found to be `null`. JS doesn't evaluate function arguments before checking if the call itself should happen.

---

## PART 6 — WHAT IT CANNOT DO

### Cannot be used on the left side of an assignment

```js
user?.name = "Arun"; // SyntaxError
```

Optional chaining is for **reading**, not writing. It doesn't make sense semantically either — "maybe assign this" isn't a coherent operation the way "maybe read this" is.

### Delete actually works fine with optional chaining

```js
delete user?.address?.city; // valid — delete works for optional chaining reads
```

This one is actually fine syntactically — `delete` can operate on an optional chain. The misconception is thinking it's banned like assignment. It's not.

### Doesn't replace existence checks for arrays before iteration

```js
const list = null;
list?.forEach(item => console.log(item)); // safe — forEach is just skipped, no error
```

This works because `forEach` itself isn't called when `list` is `null`. But people sometimes think `?.` makes an array "iterable safely" in a `for...of` loop — it doesn't help there, because `for...of` isn't a method call:

```js
for (const item of list?.) {} // SyntaxError — this isn't valid syntax at all
```

If you need a safe default for iteration, you need nullish coalescing alongside it:

```js
for (const item of list ?? []) { console.log(item); }
```

---

## PART 7 — REAL-WORLD PATTERNS

### API response handling

```js
function getUserCity(response) {
  return response?.data?.user?.address?.city ?? "Not provided";
}
```

This is the single most common real use case — API responses are unpredictable, fields may or may not exist, and you don't want defensive `if` chains everywhere.

### Optional callback props (React)

```js
function Button({ onClick, onHover }) {
  return (
    <button
      onClick={() => onClick?.()}
      onMouseEnter={() => onHover?.()}
    >
      Click
    </button>
  );
}
```

Caller doesn't have to pass every callback. If `onHover` isn't provided, `onHover?.()` just does nothing instead of throwing.

### Safe array element access

```js
const users = [];
console.log(users[0]?.name ?? "No user"); // "No user"
```

---

## PART 8 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
const obj = { a: { b: 0 } };
console.log(obj?.a?.b ?? "default");
```
Answer: `0` — `0` is a real value, not null/undefined, so `??` doesn't override it.

---

**Q2. What's the output?**
```js
let calls = 0;
const fn = () => { calls++; return {}; };

const obj = undefined;
obj?.x?.[fn()];

console.log(calls);
```
Answer: `0` — the chain short-circuits at `obj?.` before `fn()` is ever evaluated.

---

**Q3. What's the output?**
```js
const a = { b: { c: null } };
console.log(a.b.c?.d?.e);
```
Answer: `undefined` — `a.b.c` resolves to `null` without error (no optional chaining needed yet since `a` and `a.b` are real objects). Then `?.d` short-circuits because `c` is `null`.

---

**Q4. What's wrong with this code?**
```js
function process(user) {
  if (user?.isActive) {
    sendEmail(user.email);
  }
}
```
Answer: Nothing is *broken*, but it's slightly inconsistent — if `user` can be null/undefined for the check, it can also be null/undefined for `user.email`, yet only the first access is guarded. Should be `user?.email` too, or restructure to check `user` existence once at the top.

---

**Q5. What's the output?**
```js
const obj = { greet: null };
console.log(obj.greet?.());
```
Answer: `undefined` — `greet` is `null`, so `?.()` skips the call entirely instead of throwing `TypeError: greet is not a function`.

---

**Q6. Can you assign through optional chaining?**
```js
const obj = {};
obj?.name = "test";
```
Answer: **SyntaxError**. Optional chaining is read-only syntax — it cannot appear on the left-hand side of an assignment.

---

**Q7. What's the output?**
```js
const arr = [1, 2, 3];
console.log(arr?.[10]);
console.log(arr?.[10]?.toString());
```
Answer: `undefined` and `undefined`. `arr[10]` doesn't exist (out of bounds), giving `undefined` — not because the array is null, but because the index is out of range. Then `?.toString()` on that `undefined` short-circuits, no crash.

---

**Q8. True or false: optional chaining catches errors thrown inside a function call.**
```js
const obj = { run: () => { throw new Error("fail"); } };
obj.run?.();
```
Answer: **False.** `run` exists, so `?.()` executes it normally. The thrown error propagates exactly as it would without `?.`. Optional chaining only guards against the *call itself* not happening — it is not a try/catch substitute.

---

## PART 9 — THINGS PEOPLE GET WRONG

1. **Only `null`/`undefined` trigger short-circuiting** — not `0`, `false`, `""`, `NaN`. Same family of rules as defaults and destructuring.
2. **The short-circuit kills the entire rest of the chain**, including function calls with side effects — those arguments never even get evaluated.
3. **`?.` protects what's after it, not before it.** `a.b?.c` still crashes if `a` itself is null.
4. **`?.()` doesn't catch thrown errors** — it only skips the call if the function reference itself is missing.
5. **Can't assign through optional chaining.** Read-only operation, syntactically enforced.
6. **`?.` + `||` is the wrong combo for fallback values** in most cases — use `?.` + `??` to avoid losing legitimate falsy values.
7. **Doesn't help with `for...of` directly** — you still need `?? []` for safe iteration over a possibly-null array.
8. **Out-of-bounds array access already returns `undefined` without needing `?.`** — `?.` on arrays mainly helps when the *array itself* might be null/undefined, not when the index might be out of range.

---

## Mental Model

Optional chaining is a **circuit breaker**, not a null-checker that fixes the data.

It doesn't make `null` go away. It doesn't validate your data. It just stops the **program from crashing** when it hits `null`/`undefined` mid-chain, and hands you back `undefined` so you can decide what to do next — usually by pairing it with `??` for a real fallback.

If you rely on `?.` everywhere instead of fixing why your data is inconsistently shaped, you're masking a data integrity problem with syntax. Interviewers sometimes probe this directly: *"Is sprinkling `?.` everywhere good practice?"* The honest answer is no — it's a safety net for genuinely optional data (API responses, user-controlled config), not a substitute for validating your data model.