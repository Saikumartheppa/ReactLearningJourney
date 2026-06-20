# The Spread Operator — Complete Deep Dive

---

## First, Lock In The Contrast

You already know rest collects. Spread does the opposite.

```js
const arr = [1, 2, 3];
const [a, ...rest] = arr;  // REST  — [2, 3] pulled INTO a variable
const copy = [...arr];     // SPREAD — arr expanded OUT into a new array
```

Same `...` syntax. If it's on the **left side** of assignment or in a function parameter → rest. If it's on the **right side** → spread.

Spread takes **one iterable or object and expands it in place**.

---

## PART 1 — SPREAD IN ARRAYS

### Copying an array

```js
const original = [1, 2, 3];
const copy = [...original];

copy.push(4);
console.log(original); // [1, 2, 3] — untouched
console.log(copy);     // [1, 2, 3, 4]
```

Top-level copy is new. But nested objects inside are still references — same shallow copy caveat as rest.

---

### Merging arrays

```js
const a = [1, 2];
const b = [3, 4];
const merged = [...a, ...b];
console.log(merged); // [1, 2, 3, 4]
```

Order matters. What you spread first comes first.

```js
const withExtra = [0, ...a, ...b, 5];
console.log(withExtra); // [0, 1, 2, 3, 4, 5]
```

You can intersperse literals freely. This is cleaner than `concat`.

---

### Spread vs concat

```js
const merged1 = a.concat(b);       // old way
const merged2 = [...a, ...b];      // spread way
```

Both produce the same result. Spread is more readable when mixing literals and arrays:

```js
[0, ...a, 99, ...b]           // spread — clean
[0].concat(a).concat([99]).concat(b) // concat — ugly
```

---

### Spreading a string into an array

```js
const chars = [..."hello"];
console.log(chars); // ["h", "e", "l", "l", "o"]
```

Spread works on **anything iterable** — arrays, strings, Sets, Maps, NodeLists, generator results. If it has `[Symbol.iterator]`, spread can expand it.

---

### Spreading a Set to deduplicate

```js
const nums = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(nums)];
console.log(unique); // [1, 2, 3, 4]
```

One of the most used real-world patterns. `new Set` removes duplicates, spread converts it back to an array.

---

### Spreading into function arguments

```js
function add(a, b, c) {
  return a + b + c;
}

const args = [1, 2, 3];
add(...args); // 6
```

Before ES6, this was `add.apply(null, args)`. Spread replaced `apply` for this use case entirely.

```js
Math.max(...[3, 1, 4, 1, 5, 9]); // 9
Math.min(...[3, 1, 4, 1, 5, 9]); // 1
```

`Math.max` doesn't accept an array. Spread unpacks it into individual arguments.

---

## PART 2 — SPREAD IN OBJECTS

Object spread was introduced in **ES2018** — later than array spread (ES2015). Know this distinction for interviews.

### Copying an object

```js
const user = { name: "Arun", age: 25 };
const copy = { ...user };

copy.age = 30;
console.log(user.age); // 25 — top level is safe
```

Same shallow copy rule. Nested objects are still shared references.

---

### Merging objects

```js
const defaults = { theme: "light", lang: "en", fontSize: 14 };
const userPrefs = { theme: "dark", fontSize: 16 };

const config = { ...defaults, ...userPrefs };
console.log(config);
// { theme: "dark", lang: "en", fontSize: 16 }
```

**Last one wins.** When keys conflict, the rightmost spread overwrites. This is the core mental model for object spread merging.

---

### Order is everything

```js
const a = { x: 1, y: 2 };
const b = { y: 99, z: 3 };

console.log({ ...a, ...b }); // { x: 1, y: 99, z: 3 }
console.log({ ...b, ...a }); // { y: 2, z: 3, x: 1 }
```

`y` ends up as 99 in the first case, 2 in the second. The order you spread in determines which value survives.

---

### Overriding specific properties cleanly

```js
const user = { name: "Arun", age: 25, role: "user" };

// Promote to admin
const admin = { ...user, role: "admin" };
console.log(admin); // { name: "Arun", age: 25, role: "admin" }
```

Spread the base object, then override what you need. This is immutable update pattern — original is untouched.

Putting the override **before** spread is a common mistake:

```js
const wrong = { role: "admin", ...user };
console.log(wrong.role); // "user" — spread overwrote your override
```

**Override after spread, not before.**

---

### Adding properties while copying

```js
const base = { a: 1, b: 2 };
const extended = { ...base, c: 3, d: 4 };
console.log(extended); // { a: 1, b: 2, c: 3, d: 4 }
```

---

### Spreading into function call (object)

Not directly applicable like arrays since functions don't accept object spread as named params automatically — but in practice you'll see it in React:

```js
const props = { onClick: fn, className: "btn" };
<Button {...props} />  // JSX spread — expands into individual props
```

This is the JSX equivalent of function argument spread.

---

## PART 3 — SHALLOW COPY — THE THING THAT WILL BITE YOU

This deserves its own section because it causes real bugs.

```js
const original = {
  name: "Arun",
  address: {
    city: "Chennai"
  }
};

const copy = { ...original };
copy.name = "Kumar";          // safe — primitive, own property
copy.address.city = "Mumbai"; // UNSAFE — nested object is shared

console.log(original.name);         // "Arun" — safe
console.log(original.address.city); // "Mumbai" — mutated through copy
```

The spread created a new object at the top level. But `address` inside both `original` and `copy` **point to the exact same object in memory**.

For a true deep clone:

```js
// Simple but lossy (loses functions, dates become strings, etc.)
const deep = JSON.parse(JSON.stringify(original));

// Modern, proper way
const deep2 = structuredClone(original);
```

Spread is NOT a substitute for deep cloning. Know when you need which.

---

## PART 4 — SPREAD WITH ITERABLES — WHAT WORKS AND WHAT DOESN'T

Array spread works on **any iterable**:

```js
[...new Set([1,2,2,3])]      // ✅ [1, 2, 3]
[...new Map([["a",1]])]      // ✅ [["a", 1]]
[..."abc"]                   // ✅ ["a", "b", "c"]
[...document.querySelectorAll("div")] // ✅ converts NodeList to array
[...arguments]               // ✅ converts arguments object to array
```

Object spread works on **plain objects and anything that can be treated as one**:

```js
{ ...{ a: 1 } }    // ✅
{ ..."hello" }     // ✅ { 0: "h", 1: "e", 2: "l", 3: "l", 4: "o" }
{ ...[1, 2, 3] }   // ✅ { 0: 1, 1: 2, 2: 3 }
{ ...null }        // ✅ {} — silently ignored, no error
{ ...undefined }   // ✅ {} — silently ignored, no error
```

This is a crucial difference from array spread:

```js
[...null]      // TypeError — null is not iterable
[...undefined] // TypeError — undefined is not iterable

{ ...null }    // {} — no error
```

Object spread is forgiving with null/undefined. Array spread is not.

---

## PART 5 — COMMON REAL-WORLD PATTERNS

### Immutable state updates (React / Redux)

```js
// Updating nested state immutably
const state = {
  user: { name: "Arun", age: 25 },
  settings: { theme: "dark" }
};

const newState = {
  ...state,
  user: { ...state.user, age: 26 }  // only age changes
};

console.log(state.user.age);    // 25 — original intact
console.log(newState.user.age); // 26
```

This pattern is everywhere in React. You spread each level you need to update.

---

### Conditional properties

```js
const isAdmin = true;

const user = {
  name: "Arun",
  ...(isAdmin && { role: "admin", permissions: ["read", "write"] })
};

console.log(user);
// { name: "Arun", role: "admin", permissions: ["read", "write"] }
```

If `isAdmin` is false, `false && {...}` evaluates to `false`, and `{ ...false }` gives `{}`. Nothing gets added. Clean way to conditionally include properties.

---

### Passing all args forward (forwarding pattern)

```js
function wrapper(...args) {
  console.log("before");
  return original(...args);
}
```

Capture with rest, forward with spread. This combo appears in decorators, middleware, and HOFs constantly.

---

### Converting iterables to arrays (replacing Array.from)

```js
const set = new Set([1, 2, 3]);

const arr1 = Array.from(set); // old way
const arr2 = [...set];         // spread way — same result
```

Both work. Spread is shorter. `Array.from` has more power (accepts a map function), but for simple conversion spread wins.

---

## PART 6 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
const a = [1, 2, 3];
const b = [...a];
b.push(4);
console.log(a.length);
```
Answer: `3` — spread creates a new array. Mutations to `b` don't affect `a`.

---

**Q2. What's the output?**
```js
const obj = { a: 1 };
const copy = { ...obj, ...null, ...undefined };
console.log(copy);
```
Answer: `{ a: 1 }` — spreading null and undefined in object context is silently ignored. No error.

---

**Q3. What's the output?**
```js
const a = { x: 1 };
const b = { x: 2, y: 3 };
const c = { ...a, ...b, x: 99 };
console.log(c.x);
```
Answer: `99` — last write wins. The literal `x: 99` comes after both spreads.

---

**Q4. What's the output?**
```js
const arr = [1, 2, 3];
const obj = { ...arr };
console.log(obj);
```
Answer: `{ 0: 1, 1: 2, 2: 3 }` — spreading an array into an object uses indices as keys.

---

**Q5. What's the difference between these?**
```js
const a = Object.assign({}, obj);
const b = { ...obj };
```
Answer: Mostly the same — both shallow copy own enumerable properties. Key differences:
- `Object.assign` triggers setters on the target. Spread doesn't.
- `Object.assign` returns the target object. Spread creates a new one inline.
- For most everyday use: treat them as equivalent. For setter-heavy code: they diverge.

---

**Q6. Does spread copy prototype methods?**
```js
class Animal {
  speak() { return "roar"; }
}
const dog = new Animal();
dog.name = "Rex";

const copy = { ...dog };
console.log(copy.speak); // ?
```
Answer: `undefined` — spread only copies own enumerable properties. Prototype methods are excluded. Same rule as rest.

---

**Q7. What's the output?**
```js
function test(a, b, ...rest) {
  console.log(rest);
}
const args = [1, 2, 3, 4, 5];
test(...args);
```
Answer: `[3, 4, 5]` — spread expands the array into individual arguments. `a` gets 1, `b` gets 2, rest collects `[3, 4, 5]`. Rest and spread working together in one call.

---

**Q8. What's wrong with this?**
```js
const merged = Object.assign(target, source);
// vs
const merged = { ...target, ...source };
```
Answer: `Object.assign` **mutates** `target`. Spread creates a **new object**. If you don't want to mutate, spread is safer. Using `Object.assign({}, target, source)` matches spread behavior.

---

## PART 7 — THINGS PEOPLE GET WRONG

1. **Spread is not a deep clone.** Ever. For nested objects it's still references. Don't use it as a safety net for mutation.
2. **Last spread wins** in object merging. Order is not cosmetic — it determines the result.
3. **Override must come after spread**, not before. `{ role: "admin", ...user }` means `user` wins.
4. **Array spread throws on null/undefined. Object spread doesn't.** This asymmetry is tested.
5. **Prototype properties are excluded** — same as rest. Spread copies own enumerable only.
6. **Spread inside a function call is not rest** — `fn(...arr)` is spread, `function fn(...args)` is rest. Same syntax, different sides.
7. **Object spread is ES2018**, not ES2015. Array spread came first. In very old codebases or environments, object spread might not be available.

---

## The Mental Model

Rest = **funnel**. Many things go in, one container comes out.
Spread = **explosion**. One container goes in, many things come out.

When you spread, you're saying: *"take everything inside this thing and place it here, one by one, as if I typed them manually."*

```js
Math.max(...[3,1,4]) 
// is literally the same as
Math.max(3, 1, 4)
```

That's all it is. An in-place expansion. The context — array literal, object literal, function call — decides what form those expanded values take.