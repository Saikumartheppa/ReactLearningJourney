# Object Shorthand — Complete Deep Dive

---

## What Is It?

ES6 syntax that lets you skip repeating yourself when building object literals — for property values that match a variable name, and for method definitions.

```js
const name = "Arun";
const age = 25;

// Old way
const user1 = { name: name, age: age };

// Shorthand
const user2 = { name, age };
```

Both produce the identical object: `{ name: "Arun", age: 25 }`. This is purely a writing convenience — no new runtime behavior, no new capability. That's worth saying plainly because people sometimes treat it like it does more than it does.

There are actually **two distinct shorthands** bundled under this name. Don't blur them together.

---

## PART 1 — PROPERTY SHORTHAND

When the property key and the variable name are identical, you can write it once.

```js
function createUser(name, age, city) {
  return { name, age, city };
}

createUser("Arun", 25, "Chennai");
// { name: "Arun", age: 25, city: "Chennai" }
```

### The hard rule

The variable name **becomes** the key, exactly as written. There's no renaming option in shorthand form.

```js
const userName = "Arun";
const obj = { userName };
console.log(obj); // { userName: "Arun" } — key is "userName", not "name"
```

If you want a different key, you're forced back to explicit form:

```js
const obj2 = { name: userName }; // key is "name", value comes from userName
```

Shorthand only works when key and variable name match exactly, including case.

```js
const Name = "Arun";
const obj3 = { Name }; // { Name: "Arun" } — capital N preserved exactly
```

---

### Mixing shorthand and explicit properties freely

```js
const id = 1;
const name = "Arun";

const user = {
  id,
  name,
  role: "admin",       // explicit, no matching variable
  active: true
};
```

No restriction on mixing. Use shorthand wherever a variable name happens to match, explicit form everywhere else.

---

### Common pattern — returning multiple values from a function

This is the single most frequent real-world use.

```js
function getDimensions() {
  const width = 100;
  const height = 200;
  return { width, height };
}

const { width, height } = getDimensions();
```

Notice the symmetry — shorthand to build the object on the way out, destructuring to unpack it on the way in. These two features are constant partners in real code.

---

## PART 2 — METHOD SHORTHAND

Before ES6, defining a function as an object property required the `key: function` syntax.

```js
// Old way
const obj1 = {
  greet: function() {
    console.log("hello");
  }
};

// Shorthand
const obj2 = {
  greet() {
    console.log("hello");
  }
};
```

Drop `function` and the colon. Same result, less typing — but there's a real semantic difference underneath, not just cosmetics. See Part 4.

---

### Works with parameters normally

```js
const calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  }
};

calculator.add(3, 4); // 7
```

---

### Works with generators

```js
const obj = {
  *generate() {
    yield 1;
    yield 2;
  }
};

const gen = obj.generate();
console.log(gen.next().value); // 1
```

The `*` goes right before the method name, no `function` keyword involved at all.

---

### Works with async

```js
const api = {
  async fetchUser(id) {
    const res = await fetch(`/users/${id}`);
    return res.json();
  }
};
```

---

### Getters and setters — related but technically separate feature

These existed in ES5 already, not introduced by ES6 shorthand, but they live in the same "concise object syntax" family and are worth knowing alongside it.

```js
const person = {
  firstName: "Arun",
  lastName: "Kumar",
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(" ");
  }
};

console.log(person.fullName);   // "Arun Kumar" — accessed like a property, not called
person.fullName = "Kumar Raj";
console.log(person.firstName);  // "Kumar"
```

Notice `fullName` is accessed without `()` — getters/setters look like properties from the outside but run code underneath.

---

## PART 3 — COMPUTED PROPERTY NAMES (Often Grouped With Shorthand)

Not strictly "shorthand," but it's an ES6 object literal feature that almost always shows up in the same breath. Full deep dive in the Dynamic Keys notes — here's the connection to shorthand specifically.

```js
const key = "role";
const obj = {
  [key]: "admin"
};
console.log(obj); // { role: "admin" }
```

The brackets mean "evaluate this expression and use the result as the key," instead of using the literal text as the key.

### Computed keys work with method shorthand too

```js
const actionType = "FETCH_USER";

const handlers = {
  [actionType]() {
    console.log("handling fetch");
  }
};

handlers.FETCH_USER(); // "handling fetch"
```

### Combining all three: property shorthand, method shorthand, computed keys

```js
function createAction(type, payload) {
  return {
    type,                          // property shorthand
    payload,                       // property shorthand
    [`is${type}`]: true,           // computed key
    execute() {                    // method shorthand
      console.log(`Executing ${type}`);
    }
  };
}
```

This is realistic production code — Redux-style action creators look almost exactly like this.

---

## PART 4 — THE SEMANTIC DIFFERENCE PEOPLE MISS

Method shorthand isn't just shorter `function` syntax. There's an actual behavioral difference: **shorthand methods are not constructible.**

```js
const obj1 = {
  greet: function() {}
};
new obj1.greet(); // works — produces an empty object instance

const obj2 = {
  greet() {}
};
new obj2.greet(); // TypeError: obj2.greet is not a constructor
```

Function expressions assigned the old way can be used with `new`. Shorthand methods explicitly cannot — the spec defines them as "method" syntax, not generic function syntax, and methods don't get a `[[Construct]]` internal slot.

This rarely matters in everyday code (you shouldn't be doing `new someObjectMethod()` regardless) but it's a real, testable distinction and proves shorthand isn't *purely* cosmetic.

---

### Another real difference — `super` is only available in shorthand/method syntax

```js
const parent = {
  greet() { return "parent greet"; }
};

const child = {
  __proto__: parent,
  greet() {
    return super.greet() + " and child greet"; // works
  }
};

const child2 = {
  __proto__: parent,
  greet: function() {
    return super.greet(); // SyntaxError — super not allowed here
  }
};
```

`super` is only valid inside method-shorthand definitions, not inside `function` expressions assigned as properties. This is a direct consequence of the same spec distinction — shorthand methods carry a `[[HomeObject]]` binding that regular function expressions don't get.

---

## PART 5 — REAL-WORLD PATTERNS

### Factory functions

```js
function createPoint(x, y) {
  return { x, y };
}
```

### API request bodies

```js
function updateUser(id, name, email) {
  return fetch(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name, email })
  });
}
```

### Module-like object exports

```js
const userId = 1;
const userName = "Arun";

function login() { /* ... */ }
function logout() { /* ... */ }

export default { userId, userName, login, logout };
```

### Configuration objects from destructured params

```js
function buildConfig({ host, port }) {
  const timeout = 5000;
  return { host, port, timeout };
}
```

---

## PART 6 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
const value = 10;
const obj = { value: value, value: value * 2 };
console.log(obj);
```
Answer: `{ value: 20 }` — duplicate keys in an object literal aren't an error; the **last one silently wins**. This isn't a shorthand-specific rule, but it's commonly tested right alongside shorthand questions because people assume duplicate keys throw.

---

**Q2. Can you rename a property using shorthand syntax directly?**
```js
const userName = "Arun";
const obj = { name: userName }; // is this "shorthand"?
```
Answer: No — that's explicit syntax with a different key than the variable name. True shorthand requires the **same name** for both: `{ userName }`. Renaming always requires the explicit `key: value` form.

---

**Q3. What's the output?**
```js
const obj = {
  greet: function() { return this; }
};
const fn = obj.greet;
console.log(fn() === obj);
```
Answer: `false` (or in strict mode, would throw on access). `this` is determined by **how a function is called**, not how it's defined. Detached from `obj`, calling `fn()` loses the `this` binding. This applies identically whether you used shorthand or `function` — it's a `this`-binding question wearing a shorthand costume.

---

**Q4. Can method shorthand be used with `new`?**
```js
const obj = { greet() {} };
new obj.greet();
```
Answer: **TypeError.** Shorthand methods lack a `[[Construct]]` slot — they cannot be used as constructors, unlike `function` expressions.

---

**Q5. What's the output?**
```js
const key = "name";
const obj = { key: "Arun" };
console.log(obj);

const obj2 = { [key]: "Arun" };
console.log(obj2);
```
Answer: `{ key: "Arun" }` then `{ name: "Arun" }`. Without brackets, `key` is treated as the literal string key "key." With brackets, `key` is evaluated as a variable, and its value "name" becomes the actual key. This is the most common shorthand-adjacent confusion — bracket presence completely changes meaning.

---

**Q6. Is `{ name, age }` valid if `name` isn't declared anywhere in scope?**
```js
const age = 25;
const obj = { name, age };
```
Answer: **ReferenceError: name is not defined.** Shorthand isn't magic — it still requires the variable to exist in scope, exactly like writing `name: name` would.

---

**Q7. Does shorthand work for class fields/methods?**
Answer: Class method syntax already uses shorthand-style by default — `class X { greet() {} }` — there's no `greet: function(){}` form inside classes at all. Object literal shorthand and class method syntax converge on the same concise form, though they're defined by separate parts of the spec.

---

## PART 7 — THINGS PEOPLE GET WRONG

1. **Shorthand key always equals the exact variable name**, case and all. No renaming possible in shorthand form — switch to explicit syntax for that.
2. **Property shorthand still throws `ReferenceError` if the variable doesn't exist.** It's not forgiving — it's identical resolution rules to a normal variable reference.
3. **Method shorthand and `function` property assignment are not 100% equivalent** — shorthand methods can't be used with `new`, and only shorthand methods support `super`.
4. **Computed property names (`[expr]`) are a separate feature from shorthand**, often taught together but mechanically distinct — brackets mean "evaluate as key," shorthand means "reuse variable name as key."
5. **Duplicate keys in any object literal (shorthand or not) don't throw — last write wins**, silently.
6. **Getters/setters predate ES6** — they're not part of "shorthand" technically, but they live in the same concise-object-syntax neighborhood and get bundled into these discussions.
7. **`this` behavior inside shorthand methods is identical to `function` methods** — shorthand changes nothing about binding rules. Don't let the shorter syntax make you think `this` behaves differently.

---

## Mental Model

Object shorthand isn't a feature with its own rules — it's a **compression of syntax you already understand**.

- Property shorthand: `{ name }` is literally `{ name: name }` with the redundant half removed. The variable resolution rules underneath are completely unchanged.
- Method shorthand: `{ greet() {} }` is mostly `{ greet: function() {} }` with `function` and the colon removed — except for two real exceptions (no `[[Construct]]`, `super` access) that exist because the spec defines shorthand methods as a genuinely distinct grammar production, not just a typing shortcut.

If you can already reason about variable scoping, function calls, and `this` binding, shorthand adds zero new mental machinery — except those two specific edge cases worth remembering by name when asked.