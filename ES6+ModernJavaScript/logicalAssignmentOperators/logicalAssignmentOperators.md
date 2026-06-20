# Logical Assignment Operators — Complete Deep Dive

(`||=`, `&&=`, `??=`)

---

## What Are They?

Compound assignment operators that combine a logical check with a conditional assignment. ES2021. Each one only assigns the right-hand value **if the left-hand value passes a specific condition** — they're not unconditional like `=`.

```js
a ||= b;  // assign b to a, only if a is currently falsy
a &&= b;  // assign b to a, only if a is currently truthy
a ??= b;  // assign b to a, only if a is currently null/undefined
```

You already met `??=` in the nullish coalescing notes. This note covers all three as a family, with focus on `||=` and `&&=`.

---

## PART 1 — THE MENTAL MODEL FIRST

Each operator is shorthand for an `if`-guarded assignment:

```js
a ||= b;
// equivalent to:
if (!a) { a = b; }
// NOT the same as: a = a || b — see Part 3 for why this distinction matters

a &&= b;
// equivalent to:
if (a) { a = b; }

a ??= b;
// equivalent to:
if (a === null || a === undefined) { a = b; }
```

The key word in all three is **conditional**. Unlike `a = b`, which always runs, these may do nothing at all depending on the current value of `a`.

---

## PART 2 — `||=` — LOGICAL OR ASSIGNMENT

Assigns only when the current value is **falsy**.

```js
let username = "";
username ||= "Guest";
console.log(username); // "Guest" — "" is falsy, assignment happens
```

```js
let count = 5;
count ||= 10;
console.log(count); // 5 — already truthy, assignment skipped
```

```js
let active = false;
active ||= true;
console.log(active); // true — false is falsy, gets overwritten
```

This last example is exactly the trap you'd expect — `false` being treated the same as "missing," because `||=` operates on truthiness, not presence. If you wanted to preserve an explicit `false`, `||=` is the wrong tool. That's `??=`'s job.

### Real use case — setting a fallback only if truly empty/falsy is desired

```js
function configure(options) {
  options.label ||= "Untitled";
  return options;
}

configure({ label: "" });   // { label: "Untitled" } — "" treated as "no label"
configure({ label: "Hi" }); // { label: "Hi" } — kept as-is
```

Here `||=` is the *correct* choice because an empty string label genuinely should be treated as "no label was given." Compare this to a numeric or boolean field, where `||=` would be wrong (see boolean example above).

---

## PART 3 — `||=` vs `a = a || b` — ARE THEY IDENTICAL?

Mostly, but there's a subtle and important difference involving **getters/setters and short-circuiting of the assignment itself**.

```js
const obj = {
  get value() {
    console.log("getter called");
    return this._value;
  },
  set value(v) {
    console.log("setter called");
    this._value = v;
  },
  _value: "something"
};

obj.value = obj.value || "default";
// "getter called" — reads current value
// "something" || "default" → "something" is truthy, but...
// "setter called" — STILL RUNS, because `=` always assigns regardless

obj.value ||= "default";
// "getter called" — reads current value
// value is truthy, condition fails
// setter is NEVER called — assignment is skipped entirely
```

`a = a || b` **always triggers the setter**, even when the value doesn't actually change, because `=` unconditionally assigns.

`a ||= b` **skips the assignment entirely** when the condition fails — the setter never runs.

This matters in real code: reactive frameworks (Vue, MobX, Proxies) often hook into setters to trigger re-renders or side effects. `a = a || b` can cause unnecessary re-renders/triggers even when nothing changed. `a ||= b` avoids that because it's a true conditional assignment, not just shorthand for the same operation.

This is a strong interview differentiator — most people think these are 100% interchangeable. They aren't.

---

## PART 4 — `&&=` — LOGICAL AND ASSIGNMENT

Assigns only when the current value is **truthy**.

```js
let user = { name: "Arun", isVerified: true };
user.isVerified &&= checkStillValid();
```

If `isVerified` is already `false`, `checkStillValid()` is **never called** — short-circuited, and the assignment is skipped. If `isVerified` is `true`, the function runs and its result gets assigned.

```js
let session = null;
session &&= refreshSession(session);
console.log(session); // null — refreshSession() never called, assignment skipped
```

```js
let session2 = { id: 1 };
session2 &&= refreshSession(session2);
// refreshSession runs because session2 is truthy
```

### Real use case — conditional cleanup/transformation only if a value exists

```js
let errorMessage = getError();
errorMessage &&= errorMessage.trim();
```

Only trims if there actually is an error message. If `errorMessage` is `null`/`""`/`undefined`, skip the operation entirely — no wasted call, no risk of calling `.trim()` on something that doesn't support it.

This is essentially a safer, more declarative version of:
```js
if (errorMessage) {
  errorMessage = errorMessage.trim();
}
```

---

## PART 5 — SHORT-CIRCUIT EVALUATION OF THE RIGHT SIDE

All three operators short-circuit — the right-hand expression **only evaluates when the condition is met**. This isn't just an assignment optimization; it changes whether side effects happen at all.

```js
function expensiveCall() {
  console.log("called");
  return "computed";
}

let a = "exists";
a ||= expensiveCall(); // "called" never logged — a is already truthy

let b = null;
b ??= expensiveCall(); // "called" logged — b is null, right side evaluated
```

This is identical in spirit to how `&&` and `||` short-circuit in normal boolean expressions — these compound assignment operators inherit that exact behavior.

---

## PART 6 — ALL THREE SIDE BY SIDE

```js
let a = 0;
let b = 0;
let c = 0;

a ||= 99; // 0 is falsy → assigns → a = 99
b &&= 99; // 0 is falsy → condition fails → b stays 0
c ??= 99; // 0 is not null/undefined → condition fails → c stays 0

console.log(a, b, c); // 99 0 0
```

```js
let x = null;
let y = null;
let z = null;

x ||= 99; // null is falsy → assigns → x = 99
y &&= 99; // null is falsy → condition fails → y stays null
z ??= 99; // null IS null → assigns → z = 99

console.log(x, y, z); // 99 null 99
```

This pair of examples is the cleanest way to see all three diverge based on the exact same starting values. Walk through both mentally until the differences are automatic, not something you have to calculate.

---

## PART 7 — WORKING ON OBJECT PROPERTIES AND ARRAYS

These operators work the same way on properties and array elements, not just bare variables.

```js
const config = { retries: 0, timeout: null, label: "" };

config.retries ||= 3;   // 0 is falsy → becomes 3 (might be wrong if 0 retries was intentional!)
config.timeout ??= 5000; // null → becomes 5000
config.label ||= "Untitled"; // "" is falsy → becomes "Untitled"

console.log(config); // { retries: 3, timeout: 5000, label: "Untitled" }
```

Notice `retries: 0 ||= 3` — if "0 retries" was a deliberate, meaningful setting (meaning "don't retry at all"), `||=` just silently destroyed that. This should have been `??=` instead.

```js
const arr = [0, null, undefined, false, ""];

arr[0] ??= "x"; // 0 is not nullish → stays 0
arr[1] ??= "x"; // null → becomes "x"
console.log(arr); // [0, "x", undefined, false, ""]
```

---

## PART 8 — WHAT THEY CANNOT DO

### No chaining shortcuts across multiple variables in one statement

```js
a ||= b ||= c; // works syntactically as a ||= (b ||= c), but rarely a good idea — hard to read
```

Technically valid (right-associative), but avoid this in real code. Clarity loses.

### Doesn't work on `const`

```js
const a = 0;
a ||= 5; // TypeError: Assignment to constant variable.
```

Obvious once you think about it — these are still assignments under the hood. `const` blocks any reassignment, conditional or not.

### Doesn't replace validation logic

```js
config.port ||= 3000; // looks like validation, isn't
```

This doesn't check if `port` is a valid port number — it only checks if it's falsy. `"abc" ||= 3000` would leave `port` as `"abc"` because a non-empty string is truthy. Don't mistake these operators for type or range validation.

---

## PART 9 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
let a = false;
a ||= true;
console.log(a);
```
Answer: `true` — `false` is falsy, so the assignment runs.

---

**Q2. What's the output?**
```js
let a = false;
a &&= true;
console.log(a);
```
Answer: `false` — `false` is falsy, condition for `&&=` requires truthy, so assignment is skipped.

---

**Q3. What's the output?**
```js
let count = 0;
count ??= 100;
console.log(count);
```
Answer: `0` — `0` is not `null`/`undefined`, so `??=` does nothing.

---

**Q4. Is `a ||= b` always identical to `a = a || b`?**
Answer: **No.** They produce the same final value, but `a ||= b` skips the assignment entirely (and any associated setter) when the condition fails. `a = a || b` always performs the assignment, always triggers a setter if one exists, even when the value doesn't change. Matters for reactive systems and objects with getters/setters.

---

**Q5. What's the output?**
```js
function sideEffect() {
  console.log("ran");
  return 10;
}

let x = 5;
x &&= sideEffect();
console.log(x);
```
Answer: `"ran"` then `10`. `x` is truthy (`5`), so the condition for `&&=` is met, `sideEffect()` runs, and `x` becomes its return value.

---

**Q6. What's the output?**
```js
let x = null;
let y = 0;

x ||= y ||= 5;
console.log(x, y);
```
Answer: `5 5`. Evaluates right-associatively: `y ||= 5` runs first (`y` is `0`, falsy, so `y` becomes `5` — and the expression evaluates to `5`). Then `x ||= 5` — `x` is `null`, falsy, so `x` becomes `5` too.

---

**Q7. What's wrong with this code?**
```js
function setDiscount(order) {
  order.discount ||= 0.1; // default 10% discount
}

setDiscount({ discount: 0 }); // order with explicit 0% discount
```
Answer: If `discount: 0` was intentional (no discount), `||=` overwrites it to `0.1` because `0` is falsy. Should be `??=` to only apply the default when discount is genuinely missing (`null`/`undefined`), not when it's deliberately `0`.

---

**Q8. Can these operators be used with `const`?**
Answer: No — `TypeError`. They're still assignments under the hood, so they obey the same reassignment rules as `=`.

---

## PART 10 — CHOOSING THE RIGHT ONE (Decision Framework)

Ask yourself: **what condition should trigger the default?**

- "Assign if the current value is **missing/absent**" (don't care about `0`, `false`, `""` being valid) → **`??=`**
- "Assign if the current value is **any falsy value**, including legitimate-looking ones I want overridden" → **`||=`**
- "Run/assign something **only if a value already exists**" (guard against running on null/undefined) → **`&&=`**

```js
config.timeout ??= 5000;   // 0 timeout is a weird but valid choice — preserve it
input.name ||= "Anonymous"; // "" name is meaningless — replace it
user.session &&= refresh(user.session); // only refresh if a session exists
```

Most real bugs in this area come from defaulting to `||=` out of habit when `??=` was the actually correct operator. Same root issue as `||` vs `??` from the nullish coalescing topic — these aren't new rules, they're the same philosophy applied to assignment.

---

## PART 11 — THINGS PEOPLE GET WRONG

1. **`a ||= b` is not always equivalent to `a = a || b`** — the compound form skips the assignment (and setter trigger) entirely when the condition fails.
2. **`||=` treats `0`, `false`, `""` as "needs replacing."** If those are valid values in your domain, you wanted `??=`.
3. **`&&=` short-circuits the right side** — side-effect-producing expressions on the right won't run if the left is already falsy.
4. **These don't validate data**, they only check truthiness/nullishness. A non-empty garbage string still passes `||=`'s check.
5. **Doesn't work on `const`** — same reassignment restriction as any other assignment operator.
6. **Chaining (`a ||= b ||= c`) is valid but hurts readability** — avoid in real code even though it parses fine.
7. **All three short-circuit just like their non-assignment counterparts** (`||`, `&&`, `??`) — this isn't new behavior, it's inherited.

---

## Mental Model

These three operators answer the same question every time: **"should I bother updating this variable at all?"**

- `||=` → update if the current value isn't good enough to be considered *present* in a loose sense (falsy)
- `&&=` → update (transform) only if there's already *something* there to act on
- `??=` → update only if the current value is *genuinely absent* (null/undefined), preserving every other real value including falsy ones

They're not three unrelated operators — they're the same shorthand pattern (`if (condition) { a = b }`) applied with three different definitions of "should I assign." Once you can recite the exact condition for each without hesitating, the rest is just object/array mechanics you already know from regular assignment.