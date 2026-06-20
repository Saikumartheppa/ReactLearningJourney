# JavaScript Destructuring — Master Notes

---

## What Is Destructuring?

Destructuring is a syntax that lets you **unpack values from arrays or properties from objects into distinct variables**. It's not a new data structure — it's a shorthand for assignment. Introduced in ES6.

Before destructuring:
```js
const user = { name: "Arun", age: 25 };
const name = user.name;
const age = user.age;
```

After destructuring:
```js
const { name, age } = user;
```

Same result. Less noise.

---

## PART 1 — OBJECT DESTRUCTURING

### Basic syntax

```js
const person = { name: "Arun", city: "Chennai", age: 25 };

const { name, city, age } = person;
console.log(name); // "Arun"
```

The variable name **must match the key name** unless you rename it (see below).

---

### Renaming variables (aliasing)

```js
const { name: fullName, age: years } = person;
console.log(fullName); // "Arun"
console.log(name);     // ReferenceError — `name` was never declared
```

The syntax is `key: newVariableName`. The key on the left is what you're pulling from the object. The right is what you call it locally.

---

### Default values

```js
const { name, country = "India" } = person;
console.log(country); // "India"  — because it didn't exist on the object
```

Default only kicks in when the value is **undefined**. Not null, not 0, not "". Only undefined.

```js
const { age = 30 } = { age: null };
console.log(age); // null — default did NOT apply
```

This is a very common interview trap.

---

### Combining rename + default

```js
const { country: nation = "India" } = person;
console.log(nation); // "India"
```

---

### Nested object destructuring

```js
const user = {
  name: "Arun",
  address: {
    city: "Chennai",
    pin: 600001
  }
};

const { address: { city, pin } } = user;
console.log(city); // "Chennai"
console.log(address); // ReferenceError — address is NOT declared, it's a pattern
```

`address` here is just the path, not a variable. If you want both:
```js
const { address, address: { city } } = user;
```

---

### Destructuring in function parameters

This is extremely common in real code and interviews.

```js
function greet({ name, age = 18 }) {
  console.log(`Hi ${name}, you are ${age}`);
}

greet({ name: "Arun", age: 25 }); // Hi Arun, you are 25
greet({ name: "Kumar" });          // Hi Kumar, you are 18
```

Without destructuring you'd write `greet(user)` and then `user.name` inside. Parameter destructuring keeps the function signature clean and self-documenting.

---

### Destructuring with rest (`...rest`)

```js
const { name, ...rest } = { name: "Arun", age: 25, city: "Chennai" };
console.log(name); // "Arun"
console.log(rest); // { age: 25, city: "Chennai" }
```

`rest` collects everything that wasn't explicitly destructured. It's always a plain object.

---

### Destructuring null or undefined — the danger zone

```js
const { name } = null;     // TypeError: Cannot destructure property 'name' of null
const { name } = undefined; // TypeError
```

Always guard:
```js
const { name } = user || {};
```

---

## PART 2 — ARRAY DESTRUCTURING

### Basic syntax

```js
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;
console.log(first); // "red"
```

Position matters here, not name. You can call variables anything.

---

### Skipping elements

```js
const [, second, , fourth] = [10, 20, 30, 40];
console.log(second); // 20
console.log(fourth); // 40
```

Empty commas act as placeholders to skip indices.

---

### Default values (same rule as objects)

```js
const [a = 1, b = 2] = [10];
console.log(a); // 10
console.log(b); // 2 — default applied because index 1 is undefined
```

---

### Swapping variables — the clean trick

```js
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1
```

No temp variable needed. You'll see this in almost every destructuring interview.

---

### Rest in arrays

```js
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]
```

Rest must always be the **last** element. This is enforced by the language.

```js
const [...all, last] = [1, 2, 3]; // SyntaxError
```

---

### Nested array destructuring

```js
const matrix = [[1, 2], [3, 4]];
const [[a, b], [c, d]] = matrix;
console.log(a, b, c, d); // 1 2 3 4
```

---

### Destructuring function return values

```js
function getCoords() {
  return [12.97, 80.24];
}

const [lat, lng] = getCoords();
```

This is how libraries like React's `useState` work under the hood:

```js
const [count, setCount] = useState(0);
// useState returns an array. You're destructuring position 0 and 1.
```

---

## PART 3 — MIXED & ADVANCED PATTERNS

### Object with array inside

```js
const user = {
  name: "Arun",
  scores: [90, 85, 78]
};

const { name, scores: [first, second] } = user;
console.log(name);   // "Arun"
console.log(first);  // 90
console.log(scores); // ReferenceError
```

---

### Array with object inside

```js
const data = [{ id: 1, label: "Home" }, { id: 2, label: "About" }];
const [{ label: firstLabel }, { label: secondLabel }] = data;
console.log(firstLabel); // "Home"
```

---

### Destructuring in loops

```js
const entries = [["name", "Arun"], ["city", "Chennai"]];

for (const [key, value] of entries) {
  console.log(`${key}: ${value}`);
}
```

This is exactly what `Object.entries()` returns. A very common pattern in real code.

---

### Dynamic key destructuring (computed property)

```js
const key = "name";
const { [key]: value } = { name: "Arun" };
console.log(value); // "Arun"
```

Brackets let you use a runtime expression as the key.

---

## PART 4 — INTERVIEW QUESTIONS (HONEST LIST)

**Q1. What's the output?**
```js
const { a: x = 10, b: y = 20 } = { a: undefined, b: 5 };
console.log(x, y);
```
Answer: `10 5` — `a` is undefined so default applies, `b` is 5 so it doesn't.

---

**Q2. What's the output?**
```js
const [a, b, ...c] = [1, 2];
console.log(c);
```
Answer: `[]` — rest gives an empty array, not undefined.

---

**Q3. What's the output?**
```js
const { a = 5 } = { a: null };
console.log(a);
```
Answer: `null` — default only applies for `undefined`, not `null`. This trips people up constantly.

---

**Q4. What's the output?**
```js
const obj = { x: 1, y: 2 };
const { x, ...rest } = obj;
rest.z = 3;
console.log(obj);
```
Answer: `{ x: 1, y: 2 }` — rest creates a **shallow copy**. Mutating rest doesn't affect the original (for top-level primitive properties).

---

**Q5. Is this valid?**
```js
let a, b;
{ a, b } = { a: 1, b: 2 };
```
Answer: **No**. `{` at the start of a statement is a block, not an object literal. Fix:
```js
({ a, b } = { a: 1, b: 2 });
```

---

**Q6. Can you destructure a string?**
```js
const [a, b, c] = "hello";
console.log(a, b, c); // "h" "e" "l"
```
Answer: Yes. Strings are iterable so array destructuring works on them.

---

**Q7. What happens here?**
```js
const { length } = "hello";
console.log(length); // 5
```
Answer: Object destructuring works on any value that isn't null/undefined — including primitives that get auto-boxed. Strings have a `length` property so this works.

---

**Q8. How does useState work conceptually?**
```js
function useState(init) {
  let state = init;
  const setState = (val) => { state = val; };
  return [state, setState];
}
const [count, setCount] = useState(0);
```
Array destructuring is exactly how the hook API is designed to give you a clean, name-free interface.

---

**Q9. Destructure only the second element of an array returned from a function**
```js
const [, secondItem] = getItems();
```

---

**Q10. What's the difference between rest in object vs array destructuring?**
- Object rest: `{ a, ...rest }` — rest is a plain object of remaining own enumerable properties
- Array rest: `[a, ...rest]` — rest is an array of remaining elements
- Both create **shallow copies**
- Both must be **last** in the pattern

---

## PART 5 — THINGS MOST PEOPLE GET WRONG

1. **Default values don't protect against null.** Only undefined. Memorize this.
2. **The alias key is not declared.** `const { a: b } = obj` — only `b` exists, not `a`.
3. **Nested patterns don't declare intermediate variables.** `const { a: { b } } = obj` — only `b` is declared.
4. **Rest always gives you a new object/array** — never undefined or null even if there's nothing left.
5. **Standalone destructuring assignment needs parentheses** when the line starts with `{`.
6. **Order matters in arrays, names matter in objects.** These are the two fundamental rules.
7. **Destructuring doesn't deep-clone.** Nested objects inside rest are still references.

---

## PART 6 — MENTAL MODEL TO CARRY

Object destructuring = **pull by name**
Array destructuring = **pull by position**

Everything else — defaults, aliases, rest, nesting — is just these two rules extended.

When you see `=` on the left side of an assignment with `{}` or `[]`, it's a pattern, not a value. The pattern describes what to extract and where to put it.

---

This covers everything from zero to the edge cases that actually get asked. The trap questions in Part 4 are the ones that separate people who "know destructuring" from people who actually understand it.