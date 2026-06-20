# Dynamic (Computed) Property Keys — Complete Deep Dive

---

## What Is It?

This builds on the brief mention in the object shorthand notes — this is the dedicated deep dive on that specific feature.

Dynamic keys (officially "computed property names," ES6) let you use an **expression**, not a literal identifier, as an object key — evaluated at the time the object is built.

```js
const key = "role";
const obj = {
  [key]: "admin"
};
console.log(obj); // { role: "admin" }
```

Without brackets, `key` would be the literal string `"key"`. With brackets, JS evaluates `key` as an expression first, then uses the **result** as the property name.

```js
const obj1 = { key: "admin" };   // { key: "admin" } — literal text "key"
const obj2 = { [key]: "admin" }; // { role: "admin" } — value of variable `key`
```

This single distinction — brackets present vs absent — is where most confusion lives. Get this automatic before anything else.

---

## PART 1 — WHY THIS EXISTS

Before ES6, if you needed a key determined at runtime, you had no choice but to build the object first, then assign:

```js
// Pre-ES6 way
function makeFlag(name) {
  const obj = {};
  obj["is" + name] = true;
  return obj;
}

makeFlag("Active"); // { isActive: true }
```

Bracket notation assignment (`obj[expr] = value`) already let you use dynamic keys — that part isn't new. What ES6 added is doing this **inline, inside the object literal itself**, without the two-step build-then-assign dance.

```js
// ES6 way
function makeFlag(name) {
  return { [`is${name}`]: true };
}
```

Same capability, collapsed into a single expression.

---

## PART 2 — THE EXPRESSION CAN BE ANYTHING

Not just a variable. Any valid JS expression goes inside the brackets.

```js
const obj = {
  [1 + 1]: "two",
  [`prefix_${"value"}`]: "templated",
  [Math.random() > 0.5 ? "a" : "b"]: "conditional key",
  [Symbol("id")]: "symbol key"
};
```

```js
const obj2 = {
  [2 + 2]: "four"
};
console.log(obj2); // { "4": "four" }
```

Notice the key becomes `"4"`, a string — because object keys are always strings (or Symbols). Even though you computed a number, it gets coerced. This isn't special to computed keys — it's how object keys always work — but it's more visible here because you're clearly doing arithmetic to produce it.

---

## PART 3 — KEY COERCION RULES (Important Gotcha)

Object property keys can only be **strings or Symbols**. Anything else gets coerced to a string via `toString()`.

```js
const obj = {};
obj[true] = "yes";
obj[42] = "number";
obj[{}] = "object";

console.log(Object.keys(obj));
// ["true", "42", "[object Object]"]
```

This applies identically to computed keys in object literals:

```js
const key1 = { id: 1 };
const key2 = { id: 2 };

const obj2 = {
  [key1]: "first",
  [key2]: "second"
};

console.log(obj2);
// { "[object Object]": "second" }
```

**Both objects collapse to the same key** because they both stringify to `"[object Object]"`. The second assignment silently overwrites the first. This is a real bug source when people try to use objects as map keys — and the actual fix is using a `Map`, not a plain object, when keys need to be non-string values.

```js
const map = new Map();
map.set(key1, "first");
map.set(key2, "second");
console.log(map.get(key1)); // "first" — Map preserves object identity as keys
```

---

## PART 4 — DYNAMIC KEYS WITH METHOD SHORTHAND

```js
const eventName = "click";

const handlers = {
  [`on${eventName}`]() {
    console.log("handling click");
  }
};

handlers.onclick(); // "handling click"
```

Combines computed key + method shorthand in one declaration. Very common in event-handling and reducer-style code.

---

## PART 5 — REAL-WORLD PATTERN: BUILDING LOOKUP/MAP OBJECTS

This is the single most common production use case.

```js
function arrayToLookup(items, keyField) {
  return items.reduce((acc, item) => {
    acc[item[keyField]] = item;
    return acc;
  }, {});
}

const users = [
  { id: "u1", name: "Arun" },
  { id: "u2", name: "Kumar" }
];

const lookup = arrayToLookup(users, "id");
console.log(lookup);
// { u1: { id: "u1", name: "Arun" }, u2: { id: "u2", name: "Kumar" } }
```

This isn't computed keys inside a literal — it's bracket assignment — but conceptually identical, and it's the bread-and-butter use case: turning an array into a fast-lookup object keyed by some dynamic field.

The literal-syntax version of the same idea:

```js
function makeEntry(id, name) {
  return { [id]: { name } };
}

makeEntry("u1", "Arun"); // { u1: { name: "Arun" } }
```

---

## PART 6 — REAL-WORLD PATTERN: DYNAMIC STATE UPDATES (React)

```js
function handleChange(field, value, setState) {
  setState(prev => ({
    ...prev,
    [field]: value
  }));
}

handleChange("email", "arun@test.com", setState);
```

One single change handler updates **whichever field name is passed in** — instead of writing a separate handler per form field. This pattern (computed key + spread) is everywhere in form-handling code.

```js
// Without computed keys you'd need this ugly repetition:
function handleEmailChange(value, setState) {
  setState(prev => ({ ...prev, email: value }));
}
function handleNameChange(value, setState) {
  setState(prev => ({ ...prev, name: value }));
}
// ...one per field, forever
```

---

## PART 7 — REAL-WORLD PATTERN: GROUPING DATA

```js
function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

const people = [
  { name: "Arun", city: "Chennai" },
  { name: "Kumar", city: "Chennai" },
  { name: "Priya", city: "Mumbai" }
];

console.log(groupBy(people, p => p.city));
// {
//   Chennai: [{name: "Arun", ...}, {name: "Kumar", ...}],
//   Mumbai: [{name: "Priya", ...}]
// }
```

Bracket assignment with a dynamically computed key, used repeatedly to build a grouped structure. This pattern shows up constantly in data-processing interview questions — and they're testing whether you instinctively reach for `obj[key] = ...` instead of overcomplicating it with `Map` or nested conditionals.

---

## PART 8 — COMPUTED KEYS VS DESTRUCTURING WITH DYNAMIC KEYS

This connects back to the destructuring notes — worth seeing explicitly since it's the *reverse* operation.

```js
const data = { score: 95 };
const field = "score";

// Writing with a dynamic key (computed property)
const obj = { [field]: 100 };

// Reading with a dynamic key (destructuring)
const { [field]: value } = data;
console.log(value); // 95
```

Computed property names handle the **write/construct** side. Computed destructuring handles the **read/extract** side. Same underlying idea — "the key isn't known until runtime" — applied to opposite directions of data flow.

---

## PART 9 — EVALUATION ORDER AND TIMING

The expression inside brackets is evaluated **immediately**, at the moment the object literal is constructed — not lazily, not deferred.

```js
let counter = 0;
function nextKey() {
  return `key${counter++}`;
}

const obj = {
  [nextKey()]: "a",
  [nextKey()]: "b"
};

console.log(obj); // { key0: "a", key1: "b" }
```

Each computed key expression runs exactly once, in the order it appears in the literal, left to right — same order as the rest of object construction.

---

## PART 10 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
const a = "x";
const obj = { a: 1 };
const obj2 = { [a]: 1 };
console.log(obj, obj2);
```
Answer: `{ a: 1 }` and `{ x: 1 }`. First uses literal key `"a"`. Second evaluates variable `a`, whose value is the string `"x"`, and uses that as the key.

---

**Q2. What's the output?**
```js
const obj = {};
const key1 = {};
const key2 = {};
obj[key1] = "first";
obj[key2] = "second";
console.log(obj);
console.log(Object.keys(obj).length);
```
Answer: `{ "[object Object]": "second" }` and `1`. Both object keys stringify to the same thing, so the second write overwrites the first. Classic computed-key gotcha — proves objects can't be used as distinct plain-object keys without coercion collapsing them.

---

**Q3. What's the output?**
```js
let i = 0;
const obj = {
  [`item${i++}`]: "a",
  [`item${i++}`]: "b",
  [`item${i++}`]: "c"
};
console.log(obj);
```
Answer: `{ item0: "a", item1: "b", item2: "c" }` — confirms left-to-right, eager evaluation of each computed key expression as the literal is built.

---

**Q4. What's the output?**
```js
const sym = Symbol("id");
const obj = {
  [sym]: 123,
  regular: "value"
};
console.log(Object.keys(obj));
console.log(obj[sym]);
```
Answer: `["regular"]` and `123`. Symbol keys are **excluded** from `Object.keys()`, `for...in`, and `JSON.stringify()` — they're "hidden" from normal enumeration but still directly accessible if you have a reference to the symbol. Computed keys are how you get a Symbol into an object literal at all, since `{ sym: 123 }` would just use the literal string `"sym"`.

---

**Q5. What's the output?**
```js
const obj = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
  }
};

console.log([...obj]);
```
Answer: `[1, 2]`. Computed keys are also how you implement well-known Symbols (like `Symbol.iterator`) on plain objects to make them iterable — this is genuinely how custom iterables get built in real code, not just a toy example.

---

**Q6. Why does this fail to do what's intended?**
```js
function groupBy(items, keyFn) {
  const groups = {};
  items.forEach(item => {
    groups[keyFn(item)].push(item); // bug here
  });
  return groups;
}
```
Answer: `groups[keyFn(item)]` is `undefined` on the first encounter of any new key — you can't `.push()` onto `undefined`. Needs `groups[key] = groups[key] || []` (or `??=`) before pushing. This question tests whether dynamic key familiarity translates into catching a very common real bug.

---

## PART 11 — THINGS PEOPLE GET WRONG

1. **Brackets change everything.** `{ key: val }` uses the literal text "key". `{ [key]: val }` evaluates the variable. Confusing these is the #1 mistake.
2. **All non-Symbol keys get coerced to strings**, including computed ones. `{ [42]: "x" }` produces key `"42"`, not number `42`.
3. **Objects used as computed keys collapse to `"[object Object]"`** — they don't retain identity. Use a `Map` if you need real object keys.
4. **Computed expressions evaluate immediately and in order**, left to right, at object construction time — not lazily.
5. **Symbol keys need computed syntax to get into an object literal** — `{ [mySymbol]: value }` — and once there, they're invisible to `Object.keys()`/`for...in`/`JSON.stringify`.
6. **Don't forget to initialize before mutating** — `groups[dynamicKey].push(x)` crashes if that key doesn't exist yet; needs `groups[dynamicKey] ??= []` first.
7. **Computed property names and computed destructuring are mirror operations** — one writes with a dynamic key, the other reads with one. Don't treat them as unrelated features.

---

## Mental Model

A normal key in an object literal is **text you typed**, taken literally.
A computed key is **an instruction to evaluate something first**, then use whatever comes out as the key.

```js
{ a: 1 }    // key is the text "a"
{ [a]: 1 }  // key is "whatever the variable `a` currently holds, stringified"
```

Every gotcha in this topic — coercion to string, object keys collapsing, Symbol invisibility, evaluation timing — falls directly out of that one sentence. The brackets are JavaScript saying "don't take this literally, go compute it first."