# Nullish Coalescing (`??`) — Complete Deep Dive

---

## What Is It?

A logical operator that returns the right-hand value **only when the left-hand value is `null` or `undefined`**. For every other value — including all falsy ones like `0`, `false`, `""` — it returns the left-hand value as-is.

```js
const a = null ?? "default";
console.log(a); // "default"

const b = 0 ?? "default";
console.log(b); // 0 — not overridden
```

It exists for exactly one reason: `||` was being misused for default values, and it silently breaks on legitimate falsy data. `??` was introduced in ES2020 to fix that specific gap.

---

## PART 1 — THE PROBLEM IT SOLVES

Before `??`, the common pattern for "use this value, or fall back if it's missing" was:

```js
function setVolume(level) {
  const vol = level || 50;
  console.log(vol);
}

setVolume(0); // 50 — WRONG. User explicitly wanted volume 0 (mute), but got 50.
```

`||` checks for **truthiness**. `0` is falsy. So `||` treats "the user passed 0" the same as "the user passed nothing," and overrides it. That's a real bug, not a theoretical one — volume sliders, page numbers, discount percentages, all break this way constantly.

```js
function setVolume(level) {
  const vol = level ?? 50;
  console.log(vol);
}

setVolume(0); // 0 — correct
setVolume();  // 50 — correct, nothing was passed
```

`??` only cares about one question: **is this null or undefined?** Not "is this falsy?" That's the entire reason this operator exists.

---

## PART 2 — EXACT TRIGGER CONDITIONS

Memorize this list. This is what gets tested.

```js
null ?? "x"      // "x" — triggers
undefined ?? "x" // "x" — triggers

0 ?? "x"         // 0 — does NOT trigger
false ?? "x"     // false — does NOT trigger
"" ?? "x"        // "" — does NOT trigger
NaN ?? "x"       // NaN — does NOT trigger
[] ?? "x"        // [] — does NOT trigger (empty array is truthy, but irrelevant here — even if it were falsy, it's not null/undefined)
```

Only two values in the entire language trigger `??`: `null` and `undefined`. Nothing else. Not "falsy" — specifically those two.

---

## PART 3 — `??` VS `||` — KNOW THIS COLD

This comparison is asked in almost every interview that touches modern JS.

| Value | `value \|\| "default"` | `value ?? "default"` |
|---|---|---|
| `null` | `"default"` | `"default"` |
| `undefined` | `"default"` | `"default"` |
| `0` | `"default"` (wrong, usually) | `0` (correct) |
| `false` | `"default"` (wrong, usually) | `false` (correct) |
| `""` | `"default"` (wrong, usually) | `""` (correct) |
| `NaN` | `"default"` | `NaN` |
| `"text"` | `"text"` | `"text"` |

`||` answers: *"is this falsy?"*
`??` answers: *"is this missing (null/undefined)?"*

These are different questions. Use `||` when you genuinely want to replace any falsy value. Use `??` when you only want to replace missing data and preserve legitimate falsy values.

```js
// You DO want || here — empty string should be replaced with placeholder text
const display = userInput || "No input provided";

// You DO want ?? here — 0 is a valid score, shouldn't become "N/A"
const score = apiResponse.score ?? "N/A";
```

Both have valid use cases. The bug isn't "using `||`" — it's using `||` **by default without thinking about whether falsy values are valid data** in your specific case.

---

## PART 4 — SHORT-CIRCUIT EVALUATION

Like `&&` and `||`, `??` short-circuits — the right side is only evaluated if needed.

```js
function expensive() {
  console.log("called");
  return "computed";
}

const a = "value" ?? expensive();
console.log(a); // "value" — "called" never printed, expensive() never ran
```

```js
const b = null ?? expensive();
console.log(b); // "called" printed, then "computed"
```

This matters for performance and for side effects — don't assume the right-hand expression always runs.

---

## PART 5 — CHAINING `??`

You can chain multiple fallbacks.

```js
const config = null;
const userPref = undefined;
const systemDefault = "light";

const theme = config ?? userPref ?? systemDefault;
console.log(theme); // "light"
```

Evaluates left to right, returns the first value that isn't `null`/`undefined`.

---

## PART 6 — THE SYNTAX RESTRICTION THAT TRIPS PEOPLE UP

This is a genuinely odd rule and a strong interview trap.

**You cannot directly mix `??` with `&&` or `||` without parentheses.**

```js
const x = true || false ?? "default"; // SyntaxError
```

```js
const x = (true || false) ?? "default"; // valid — parentheses required
```

This isn't a style preference — it's a **hard syntax error**, enforced because mixing them without parentheses is ambiguous about precedence, and JS designers decided not to guess on your behalf. They forced explicit grouping instead of picking a default precedence rule that could silently misbehave.

```js
const a = null ?? true && false; // SyntaxError — even though no || is present
```

Any direct mixing of `??` with `&&` or `||` at the same expression level needs parentheses, no exceptions.

```js
const a = null ?? (true && false); // valid → false
const b = (null ?? true) && false; // valid → false
```

---

## PART 7 — `??` WITH OPTIONAL CHAINING (THE STANDARD COMBO)

These two were designed together and almost always appear as a pair.

```js
const user = { settings: { notifications: false } };

const notif = user?.settings?.notifications ?? true;
console.log(notif); // false — correctly preserves the real value
```

If you used `||` here instead:

```js
const notif2 = user?.settings?.notifications || true;
console.log(notif2); // true — WRONG, overrides the user's explicit "off" setting
```

This exact pattern — explicit `false` setting getting silently flipped to `true` by sloppy `||` defaulting — is a real production bug class. Feature flags, boolean settings, and numeric thresholds are the most common victims.

---

## PART 8 — NULLISH ASSIGNMENT (`??=`)

A compound assignment operator, also ES2020, built directly on `??`.

```js
let config = { timeout: null };

config.timeout ??= 5000;
console.log(config.timeout); // 5000 — was null, got assigned

config.retries ??= 3;
console.log(config.retries); // 3 — didn't exist, got assigned

let count = 0;
count ??= 10;
console.log(count); // 0 — already a real value, NOT reassigned
```

`a ??= b` is shorthand for:
```js
a = a ?? b;
```

But only evaluates `b` and performs the assignment if `a` is currently `null`/`undefined`. It's an actual conditional assignment, not just sugar that always runs.

Compare with the sibling operators:
```js
a ||= b; // assign if a is falsy
a &&= b; // assign if a is truthy
a ??= b; // assign if a is null/undefined
```

Same family, different trigger conditions. `??=` is the one to reach for when initializing config defaults without clobbering legitimate falsy values. (Full deep dive on all three in the Logical Assignment Operators notes.)

---

## PART 9 — REAL-WORLD PATTERNS

### Config/options defaulting

```js
function createServer(options = {}) {
  const port = options.port ?? 3000;
  const verbose = options.verbose ?? false;
  // if options.verbose is explicitly false, it stays false — not flipped by a default
}
```

### API data normalization

```js
function formatUser(apiUser) {
  return {
    name: apiUser.name ?? "Unknown",
    age: apiUser.age ?? "Not specified",
    isVerified: apiUser.isVerified ?? false,
  };
}
```

If `isVerified` comes back as `false` from the API, it must stay `false`. With `||` this would silently become whatever the default after `||` is, if that default happened to be truthy — a serious data integrity bug.

### Lazy-initializing a cache

```js
let cache;

function getData() {
  cache ??= computeExpensiveData();
  return cache;
}
```

Only computes once. Subsequent calls reuse the cached value, because once `cache` is a real value (even an empty array or `0`), `??=` won't touch it again.

---

## PART 10 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
console.log(0 ?? "fallback");
console.log(0 || "fallback");
```
Answer: `0` then `"fallback"`. This is the single question that tests whether you actually understand why `??` exists.

---

**Q2. What's the output?**
```js
let a = false;
a ??= true;
console.log(a);
```
Answer: `false` — `a` is already a real value (not null/undefined), so `??=` does nothing.

---

**Q3. Is this valid syntax?**
```js
const x = a || b ?? c;
```
Answer: **No, SyntaxError.** Mixing `??` with `||` directly requires parentheses: `(a || b) ?? c`.

---

**Q4. What's the output?**
```js
function log() { console.log("evaluated"); return "fallback"; }
const result = "value" ?? log();
```
Answer: Just `"value"` is returned — `"evaluated"` is never printed. `??` short-circuits; the right side isn't evaluated when the left side is already non-nullish.

---

**Q5. What's the output?**
```js
const settings = { darkMode: false, fontSize: null };
const dark = settings.darkMode ?? true;
const size = settings.fontSize ?? 14;
console.log(dark, size);
```
Answer: `false 14`. `darkMode` is a real value (`false`), preserved. `fontSize` is `null`, so the default `14` kicks in.

---

**Q6. What does `??=` do differently from `=`?**
Answer: `a ??= b` only assigns `b` to `a` if `a` is currently `null` or `undefined`. Plain `=` always overwrites regardless of the current value.

---

**Q7. What's the output?**
```js
let x;
console.log(x ?? "default");
```
Answer: `"default"` — an uninitialized variable is `undefined`, which triggers `??`.

---

**Q8. Rewrite this buggy code using `??`:**
```js
function getDiscount(percent) {
  return percent || 10; // default discount is 10%
}
getDiscount(0); // returns 10 — WRONG, user explicitly set 0% discount, got overridden
```
Fix:
```js
function getDiscount(percent) {
  return percent ?? 10;
}
getDiscount(0); // 0 — correct
```
This question checks whether you understand that the bug depends on the *relationship* between the real value and the default, not just on `||` existing in the code.

---

## PART 11 — THINGS PEOPLE GET WRONG

1. **`??` checks for null/undefined only — never "falsy."** This is the entire point of the operator. If you can't explain why `0 ?? "x"` returns `0`, you don't actually understand it yet.
2. **Mixing `??` with `&&`/`||` without parentheses is a syntax error**, not a style warning. Code won't run at all.
3. **`??=` doesn't always run the assignment** — it's conditional, not unconditional sugar. If the left side already holds a real value, the right side isn't even evaluated.
4. **`||` isn't "wrong" — it's the wrong tool for a specific job.** Using it to replace falsy values is fine when that's actually what you want (e.g., replacing empty strings with placeholder text).
5. **`??` short-circuits just like `&&`/`||`.** The right-hand expression doesn't run unless needed — don't assume side effects in the fallback always execute.
6. **Empty array/object don't trigger `??`** — they're not null/undefined, they're real (truthy) values, even though they might "feel empty."

---

## Mental Model

`??` asks one question and one question only: **"does this slot actually have something in it, or is it empty (null/undefined)?"**

It does not ask "is this useful," "is this truthy," or "is this meaningful." Those are different questions answered by `||` and `&&`. The reason `??` exists as a separate operator instead of people just "being careful with `||`" is that `0`, `false`, and `""` are **valid, meaningful data** in countless real systems — volumes, counts, flags, percentages — and conflating "empty" with "falsy" was producing real bugs at scale. `??` draws a hard line between **absence of data** and **falsy-but-present data**, which `||` was never designed to distinguish.