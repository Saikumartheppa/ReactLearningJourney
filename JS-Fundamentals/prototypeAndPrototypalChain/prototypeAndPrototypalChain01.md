# 🔗 JavaScript Prototype Chain — Interview-Ready Notes

> **One-liner to remember:** When JS can't find a property on an object, it keeps walking up linked objects (the chain) until it finds it or hits `null`.

---

## 🧠 The Big Picture

```
myObject  →  myObject.__proto__  →  Object.prototype  →  null
  ↑                ↑                       ↑                ↑
Check here     Check here             Check here       Return undefined
```

JavaScript never just checks one object. It follows the chain **top-down** until the property is found or the chain ends.

---

## 📋 How Property Lookup Works (Step by Step)

| Step | What happens |
|------|-------------|
| 1 | Check the **object itself** (own properties) |
| 2 | Not found? Go to `__proto__` (the prototype) |
| 3 | Not found there? Go to the prototype's prototype |
| 4 | Keep going until `null` is reached |
| 5 | If `null` → return `undefined` (no error thrown) |

### Code Walkthrough

```js
// Step 1: Found on own object — chain stops immediately
const user = { name: 'Jalen', age: 28 };
console.log(user.name); // 'Jalen' ✅ — no chain traversal

// Step 2: Found one level up
const animal = { moves: true };
const dog = Object.create(animal); // dog.__proto__ === animal
dog.barks = true;
console.log(dog.moves); // true ✅ — found on animal (1 hop)

// Step 3: Multi-level chain
const base = { active: true };
const mid  = Object.create(base);
const top  = Object.create(mid);
console.log(top.active); // true ✅ — found on base (2 hops)

// Step 5: Reaches null → undefined
const empty = Object.create(null); // no prototype at all
console.log(empty.toString); // undefined (no Object.prototype)
```

---

## 🔑 Own vs Inherited Properties

```js
const animal = { legs: 4 };
const cat = Object.create(animal);
cat.name = 'Whiskers';

// Own property
cat.hasOwnProperty('name');  // true  ✅
cat.hasOwnProperty('legs');  // false ❌ — it's inherited

// Both accessible via dot notation
console.log(cat.name);  // 'Whiskers' (own)
console.log(cat.legs);  // 4 (inherited via chain)

// for...in loops inherited too; Object.keys() only own
for (let key in cat) console.log(key); // 'name', 'legs'
Object.keys(cat);                      // ['name']
```

> **Interview tip:** Always distinguish `hasOwnProperty()` from a property being accessible. An inherited property is *accessible* but not *own*.

---

## 🏗️ How the Chain Gets Built

### 1. Object Literals → `Object.prototype`
```js
const obj = {};
// obj.__proto__ === Object.prototype
// That's why {} has .toString(), .hasOwnProperty() etc.
```

### 2. `Object.create(proto)` → explicit prototype
```js
const proto = { greet() { return 'hello'; } };
const child = Object.create(proto);
// child.__proto__ === proto
child.greet(); // 'hello'
```

### 3. Constructor Functions → `Constructor.prototype`
```js
function Car(make) {
  this.make = make;
}
Car.prototype.honk = function() { return 'Beep!'; };

const myCar = new Car('Mazda');
// myCar.__proto__ === Car.prototype
myCar.honk(); // 'Beep!' — found on Car.prototype

// Chain: myCar → Car.prototype → Object.prototype → null
```

### 4. ES6 Classes (syntactic sugar over #3)
```js
class Animal {
  speak() { return 'sound'; }
}
class Dog extends Animal {
  bark() { return 'woof'; }
}
const d = new Dog();
// Chain: d → Dog.prototype → Animal.prototype → Object.prototype → null
d.speak(); // walks up two hops to Animal.prototype
```

---

## 🔍 Inspecting the Chain

```js
// Modern way (preferred in interviews)
Object.getPrototypeOf(obj);         // returns the prototype
Object.getPrototypeOf(Object.prototype); // null — end of all chains

// Legacy (avoid in production, fine in interviews to explain)
obj.__proto__;

// Check own vs inherited
obj.hasOwnProperty('key');          // true = own, false = inherited

// See all own properties
Object.keys(obj);                   // enumerable own only
Object.getOwnPropertyNames(obj);    // all own (including non-enumerable)
```

---

## 🧬 Built-in Types & Their Chains

```
Array instance → Array.prototype → Object.prototype → null
String (boxed) → String.prototype → Object.prototype → null
Function       → Function.prototype → Object.prototype → null
```

```js
const list = [1, 2, 3];
list.__proto__ === Array.prototype;             // true
Array.prototype.__proto__ === Object.prototype; // true

// That's why arrays have .map(), .filter() etc. (Array.prototype)
// AND .toString(), .hasOwnProperty() etc. (Object.prototype)
```

> **String primitives** are auto-boxed to String objects during property access, so `'hello'.toUpperCase()` works — JS temporarily wraps the primitive, finds the method on `String.prototype`, calls it, then discards the wrapper.

---

## ⚠️ Common Gotchas

### 1. Missing property returns `undefined`, not an error
```js
const person = {};
console.log(person.name);              // undefined — no error
console.log(person.name.toUpperCase()); // 💥 TypeError — calling on undefined
```
**Fix:** use optional chaining `person.name?.toUpperCase()`

### 2. Shadowing (own property hides inherited)
```js
const proto = { type: 'animal' };
const dog = Object.create(proto);
dog.type = 'dog'; // shadows proto.type

console.log(dog.type); // 'dog' — own property wins
```

### 3. `Object.create(null)` — no prototype at all
```js
const map = Object.create(null);
map.toString; // undefined — no Object.prototype!
// Useful for pure key-value stores (no inherited methods to worry about)
```

### 4. Replacing `Constructor.prototype` breaks existing instances
```js
function Person(name) { this.name = name; }
const a = new Person('Zara');

Person.prototype = { sayHi() { return 'Hi!'; } }; // ← replaced entirely

const b = new Person('Leo');
b.sayHi(); // works ✅
a.sayHi(); // 💥 TypeError — `a` still points to the OLD prototype
```

---

## 🎯 Interview Questions & Answers

**Q: What is the prototype chain?**
> A linked series of objects where each object has a hidden `[[Prototype]]` reference to another. When a property isn't found on an object, JS walks this chain until it finds the property or reaches `null`.

**Q: What's the difference between `__proto__` and `prototype`?**
> `__proto__` is a property on *every object* pointing to its prototype (the object it inherits from). `prototype` is a property only on *functions*, used to set up the `__proto__` of objects created with `new`. Use `Object.getPrototypeOf()` instead of `__proto__` in real code.

**Q: How does `new` work with the prototype chain?**
> `new Foo()` creates a fresh object, sets its `__proto__` to `Foo.prototype`, runs the constructor with `this` pointing to the new object, then returns it.

**Q: Why does `[].hasOwnProperty` work on an array?**
> Arrays don't define `hasOwnProperty` themselves. The chain goes: `[]` → `Array.prototype` → `Object.prototype` — and `hasOwnProperty` lives on `Object.prototype`.

**Q: What does `Object.create(null)` give you?**
> An object with no prototype at all — no `toString`, no `hasOwnProperty`, nothing inherited. Useful as a pure dictionary/map with zero risk of key collisions with inherited properties.

**Q: `hasOwnProperty` vs `in` operator?**
```js
'legs' in cat;                // true — checks own + inherited
cat.hasOwnProperty('legs');   // false — own only
```

---

## ⚡ Quick Reference Cheat Sheet

```
Property lookup order:
  obj (own) → obj.__proto__ → obj.__proto__.__proto__ → ... → null

Key methods:
  Object.getPrototypeOf(obj)       → get the prototype
  obj.hasOwnProperty('key')        → is it own?
  Object.create(proto)             → create with explicit prototype
  Object.keys(obj)                 → own enumerable keys only

Chain ends:
  Object.getPrototypeOf(Object.prototype) === null

Prototype vs __proto__:
  Function.prototype  → template for instances (only on functions)
  instance.__proto__  → actual link to the prototype (on all objects)

null prototype:
  Object.create(null) → totally bare object, no inherited methods
```

---

## 🗺️ Visual Chain Map

```
// const d = new Dog() where Dog extends Animal

d
├── (own props: e.g. name)
└── [[Prototype]] → Dog.prototype
    ├── bark()
    └── [[Prototype]] → Animal.prototype
        ├── speak()
        └── [[Prototype]] → Object.prototype
            ├── hasOwnProperty()
            ├── toString()
            └── [[Prototype]] → null  ← END
```

---

*Source: [JavaScript Prototype Chain Lookup Explained — Alexander Obregon](https://medium.com/@AlexanderObregon/javascript-prototype-chain-lookup-explained-4372ff8786c1)*
 