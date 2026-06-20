# The Rest Operator — Complete Deep Dive

---

## First, Get This Clear Upfront

There are **two different things** that use `...` syntax:

- **Rest operator** — *collects* multiple things into one
- **Spread operator** — *expands* one thing into multiple

Same syntax. Opposite jobs. Context tells you which is which. This note is about **rest only**.

> Simple rule: If `...` is on the **left side** of an assignment or in a **function parameter**, it's rest. If it's on the **right side**, it's spread.

```js
const [a, ...rest] = [1, 2, 3];     // REST — collecting
const arr = [...[1, 2], ...[3, 4]]; // SPREAD — expanding
```

---

## PART 1 — REST IN ARRAYS

### Basic

```js
const [first, ...remaining] = [10, 20, 30, 40];
console.log(first);     // 10
console.log(remaining); // [20, 30, 40]
```

`remaining` is always a **new array**. Always. Even if there's nothing left.

```js
const [a, b, ...rest] = [1, 2];
console.log(rest); // [] — not undefined, not null. Empty array.
```

---

### Position Rule — Non-Negotiable

Rest **must be last**. No exceptions.

```js
const [...all, last] = [1, 2, 3]; // SyntaxError
const [a, ...mid, b] = [1, 2, 3]; // SyntaxError
```

The reason is logical — if rest collects "everything remaining," there can be nothing after it. The language enforces this at parse time, not runtime.

---

### Skipping + Rest Together

```js
const [, , ...rest] = [10, 20, 30, 40, 50];
console.log(rest); // [30, 40, 50]
```

Skipped positions are just holes. Rest still collects what's left after all explicit patterns.

---

### Rest on a String (Important Edge Case)

```js
const [first, ...rest] = "hello";
console.log(first); // "h"
console.log(rest);  // ["e", "l", "l", "o"]
```

Strings are iterable. Array destructuring (including rest) works on anything iterable. Rest gives you an **array of characters**, not a string.

---

## PART 2 — REST IN OBJECTS

### Basic

```js
const user = { name: "Arun", age: 25, city: "Chennai", role: "dev" };

const { name, age, ...others } = user;
console.log(name);   // "Arun"
console.log(age);    // 25
console.log(others); // { city: "Chennai", role: "dev" }
```

`others` collects all **own enumerable properties** that weren't explicitly destructured.

---

### Same Position Rule Applies

```js
const { ...rest, name } = user; // SyntaxError
```

Rest must be last in object patterns too.

---

### What "Own Enumerable" Actually Means

This is where most people have gaps.

```js
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {};

const p = new Person("Arun");
const { name, ...rest } = p;

console.log(rest); // {} — prototype properties are NOT collected
```

Rest only grabs **own** properties — properties directly on the object, not inherited through the prototype chain.

```js
const obj = Object.defineProperty({ a: 1 }, "b", {
  value: 2,
  enumerable: false
});

const { a, ...rest } = obj;
console.log(rest); // {} — non-enumerable properties are NOT collected
```

Rest skips non-enumerable properties too. Both conditions must hold: own **and** enumerable.

---

### Rest Gives a Shallow Copy

This is the most important thing to understand about object rest, and where bugs hide.

```js
const user = {
  name: "Arun",
  address: { city: "Chennai" }
};

const { name, ...rest } = user;

rest.address.city = "Mumbai"; // Mutating nested object
console.log(user.address.city); // "Mumbai" — original is affected
```

The top-level object `rest` is new. But nested objects inside it are **still references** to the same thing in memory. Rest is not deep clone.

```js
rest.newProp = "test";
console.log(user.newProp); // undefined — top level is a new object, safe
```

Top-level mutations are safe. Nested mutations are not.

---

## PART 3 — REST IN FUNCTION PARAMETERS

This is the most practically used form of rest.

### Basic

```js
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3, 4); // 10
```

`numbers` is a real **Array**. Not an array-like. Not arguments object. A proper array with all array methods.

---

### Rest vs `arguments` — Know This Cold

```js
function old() {
  console.log(arguments);        // array-like object, has indices and length
  console.log(Array.isArray(arguments)); // false
  // no .map(), .filter(), etc. directly
}

function modern(...args) {
  console.log(args);             // actual array
  console.log(Array.isArray(args)); // true
  args.map(x => x * 2);         // works fine
}
```

Key differences:

| | `arguments` | rest (`...args`) |
|---|---|---|
| Type | array-like object | real Array |
| Arrow functions | not available | available |
| Named params | captures everything | captures only the unnamed remainder |
| Modern code | avoid | prefer |

`arguments` doesn't exist in arrow functions at all:

```js
const fn = () => {
  console.log(arguments); // ReferenceError in strict mode / undefined behavior
};
```

Rest works in arrow functions without any issue.

---

### Named Params + Rest Together

```js
function log(level, timestamp, ...messages) {
  console.log(`[${level}] ${timestamp}:`, messages);
}

log("ERROR", "10:00AM", "Disk full", "Retry failed", "Alert sent");
// [ERROR] 10:00AM: ["Disk full", "Retry failed", "Alert sent"]
```

Named parameters take what they need. Rest captures the remainder. Position rule holds — rest is last.

---

### Practical Pattern — Omitting a prop cleanly

A real-world use case you'll see constantly in React:

```js
function Button({ onClick, className, ...props }) {
  return <button onClick={onClick} className={className} {...props} />;
}
```

You grab what you need explicitly. Everything else (`...props`) gets forwarded. This is one of the main reasons object rest exists in the React ecosystem.

---

## PART 4 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
const [a, ...b, c] = [1, 2, 3, 4];
console.log(b);
```
Answer: **SyntaxError**. Rest must be last. This doesn't even run.

---

**Q2. What's the output?**
```js
const [x, ...y] = [1];
console.log(y);
```
Answer: `[]` — empty array, not undefined. Rest always produces an array.

---

**Q3. What's the output?**
```js
const { a, ...rest } = { a: 1, b: 2, c: 3 };
rest.b = 99;
const { a: a2, ...rest2 } = { a: 1, b: 2, c: 3 };
console.log(rest.b);  // ?
console.log(rest2.b); // ?
```
Answer: Both `99` and `2`. `rest.b = 99` only mutates `rest`, not the original object. `rest2` is a fresh copy from a fresh destructure. This tests whether you understand rest creates a new object at the top level.

---

**Q4. Does rest collect prototype properties?**
```js
const proto = { inherited: true };
const obj = Object.create(proto);
obj.own = "yes";

const { ...rest } = obj;
console.log(rest);
```
Answer: `{ own: "yes" }` — inherited properties are excluded. Only own enumerable.

---

**Q5. What's the difference between these two?**
```js
function a(...args) {}
function b() { const args = Array.from(arguments); }
```
Answer: Same result in non-arrow functions, but `a` is cleaner, works in arrow functions, and `args` is a real array directly. `b` requires manual conversion and won't work in arrow functions.

---

**Q6. What's the output?**
```js
const { ...a } = null;
```
Answer: **TypeError**. You can't destructure null. Rest doesn't protect you from this. Guard with `|| {}`.

---

**Q7. What's the output?**
```js
function test(first, ...rest) {
  console.log(rest.length);
}
test(1);
```
Answer: `0` — `rest` is an empty array when no extra arguments are passed.

---

**Q8. Is rest a deep clone?**

Always answer: No. It's a **shallow copy** of own enumerable properties. Nested objects are still shared references.

---

## PART 5 — THINGS PEOPLE GET WRONG

1. **Rest ≠ spread.** Same syntax, completely different operation. Left side = rest, right side = spread.
2. **Rest always produces an array (in arrays/params) or plain object (in objects).** Never undefined.
3. **Must be last.** No exceptions. SyntaxError if you try.
4. **Shallow copy only.** Nested objects are references. Don't assume you got a safe clone.
5. **Prototype chain is excluded** from object rest. Only own enumerable properties.
6. **`arguments` is not rest.** Don't confuse them. In modern code, rest replaces `arguments`.
7. **Rest in object destructuring doesn't work in nested patterns** in some older environments — always test if targeting old browsers.

---

## Mental Model

Think of rest as a **vacuum** that sits at the end of a pattern. After all the named slots take what they need, rest **sucks up everything that's left** into a single container — array for positional patterns, plain object for key-based ones.

That's it. One job. Collect the remainder.