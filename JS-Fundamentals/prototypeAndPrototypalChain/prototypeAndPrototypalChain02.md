# Prototype & Prototypal Inheritance — Complete Deep Dive

---

## PART 0 — THE BASELINE PICTURE

Every object in JavaScript has a hidden internal link — `[[Prototype]]` — pointing to another object (or `null`). This link is used for property lookup: if a property isn't found directly on an object, JS looks at the linked object, then the next one, and so on, until it finds the property or reaches `null`.

```js
const arr = [1, 2, 3];
arr.map(x => x * 2); // .map() isn't "on" arr directly — it's found via the chain on Array.prototype
```

`.map()` isn't copied onto every array. It lives once on `Array.prototype`, and every array's hidden link points to that same shared object. This is why it's memory-efficient — one shared prototype object, not a copy per instance.

### `__proto__` vs `.prototype` — the distinction that confuses everyone

- **`[[Prototype]]`** — the actual internal slot every object has, pointing to its prototype (or `null`).
- **`__proto__`** — the **legacy accessor property** that exposes that internal slot for reading/writing. It exists on object *instances*.
- **`.prototype`** — a perfectly ordinary object that sits on **functions** (specifically, functions usable as constructors), waiting to be handed out as the `[[Prototype]]` of whatever `new` creates next.

```js
function Person(name) { this.name = name; }
const p = new Person("Arun");

console.log(p.__proto__ === Person.prototype); // true — same object in memory
```

Modern code prefers the standardized methods over the legacy accessor:

```js
Object.getPrototypeOf(p);        // read — equivalent to p.__proto__
Object.setPrototypeOf(p, someObj); // write — equivalent to p.__proto__ = someObj
```

### A note on primitives

Primitives (numbers, strings, booleans) don't carry a prototype directly. When you call a method on one, JS temporarily **autoboxes** it into a wrapper object (`String`, `Number`, `Boolean`), and that wrapper has the prototype.

```js
const s = "hello";
console.log(s.__proto__); // String.prototype — accessible only via autoboxing, not owned by the primitive itself
```

### Prototype chaining and where it ends

```js
console.log(Object.prototype.__proto__); // null — the chain terminates here
```

Lookup walks: `obj` → `obj.__proto__` → `obj.__proto__.__proto__` → ... → `Object.prototype` → `null`. Once `null` is reached, the search stops and returns `undefined` (for property reads).

### Prototypal vs classical inheritance

JavaScript doesn't copy a "blueprint" into each instance the way classical OOP languages conceptually do. Instead, objects **link directly to other objects** and borrow their properties/methods live, through that link. `class` syntax in JS doesn't change this — it's sugar over the same linking mechanism (proven explicitly in Part 2).

---

## PART 1 — THE `new` KEYWORD INTERNALS

### What `new Fn()` actually does, step by step

```js
function Person(name) {
  this.name = name;
}

const p = new Person("Arun");
```

Internally, `new` does exactly four things:

```js
// Pseudocode of what `new Person("Arun")` does:
const obj = {};                              // 1. create a brand new plain object
Object.setPrototypeOf(obj, Person.prototype); // 2. link obj's [[Prototype]] to Person.prototype
const result = Person.call(obj, "Arun");      // 3. run the constructor with `this` = obj
// 4. if the function returned an object explicitly, use THAT instead of obj
//    otherwise, return obj
```

Step 4 is the part almost nobody knows. Watch this:

```js
function Weird() {
  this.a = 1;
  return { b: 2 }; // explicit object return
}

const w = new Weird();
console.log(w); // { b: 2 } — the explicit object WINS, `this` is discarded
```

```js
function Normal() {
  this.a = 1;
  return 42; // primitive return — ignored
}

const n = new Normal();
console.log(n); // Normal { a: 1 } — primitive return is discarded, `this` object is used
```

**Rule: if the constructor explicitly returns an object, `new` uses that object instead of the freshly created one. If it returns a primitive (or nothing), the freshly created `this` object is used.** This is a real interview trap — most people assume `return` inside a constructor is meaningless. It isn't, conditionally.

---

### The critical link this creates

```js
console.log(p.__proto__ === Person.prototype); // true
console.log(Object.getPrototypeOf(p) === Person.prototype); // true, same thing, modern syntax
```

This single line is the entire bridge between `.prototype` and `__proto__`:

- `Person.prototype` is an object that **sits waiting** on the function, ready to be assigned.
- `new` is the **only** common mechanism that takes that waiting object and assigns it as the new instance's `[[Prototype]]`.
- After that, `p.__proto__` and `Person.prototype` are literally **the same object in memory** — not a copy.

```js
Person.prototype.greet = function() { console.log("hi"); };
p.greet(); // "hi" — works even though greet was added AFTER p was created

// Why? Because p.__proto__ IS Person.prototype, not a snapshot of it.
```

This is a frequently asked "what happens if I add a method after creating instances" question. Answer: **existing instances still get it**, because they hold a live reference to the same prototype object, not a copy taken at creation time.

---

### What happens without `new` (common bug source)

```js
function Person(name) {
  this.name = name;
}

const broken = Person("Arun"); // forgot `new`
console.log(broken); // undefined
console.log(window.name); // "Arun" — `this` defaulted to global object (non-strict) and polluted it!
```

Without `new`:
- No new object is created
- `this` inside the function falls back to whatever the calling context's `this` is — in non-strict mode, the global object; in strict mode (and ES modules, by default), `undefined`, which would throw `TypeError: Cannot set properties of undefined`
- The function's return value (here, `undefined`, since nothing is explicitly returned) is what you get

This is exactly why some people add a defensive check:

```js
function Person(name) {
  if (!(this instanceof Person)) {
    throw new Error("Person must be called with new");
  }
  this.name = name;
}
```

Modern code mostly avoids this entire problem by using `class`, which **throws automatically** if called without `new`:

```js
class Person2 {
  constructor(name) { this.name = name; }
}
Person2("Arun"); // TypeError: Class constructor Person2 cannot be invoked without 'new'
```

---

### `instanceof` — how it actually checks

```js
console.log(p instanceof Person);
```

`instanceof` walks `p`'s prototype chain and checks: does `Person.prototype` appear anywhere in it?

```js
// Conceptually:
function instanceOfCheck(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

This means `instanceof` can be fooled if you manually reassign `.prototype` after instances already exist:

```js
function A() {}
const a = new A();

function B() {}
A.prototype = B.prototype; // reassigning AFTER `a` was created

console.log(a instanceof A); // false! a's actual __proto__ never changed, only A.prototype did
console.log(a instanceof B); // true
```

`a.__proto__` still points to the **original** object that used to be `A.prototype`. Reassigning `A.prototype` to something else doesn't retroactively change already-created instances — they keep their original link.

---

## PART 2 — `Object.create`, MANUAL PROTOTYPE LINKING, AND CLASS SUGAR

### Way 1 — `Object.create()` — the most direct way to express prototypal inheritance

```js
const animal = {
  eat() { console.log(`${this.name} is eating`); }
};

const dog = Object.create(animal); // dog.__proto__ = animal, directly, no constructor involved
dog.name = "Rex";
dog.bark = () => console.log("woof");

dog.eat();  // "Rex is eating" — found via prototype chain
dog.bark(); // "woof" — own property
```

`Object.create(proto)` does exactly one thing: creates a new empty object whose `[[Prototype]]` is set to `proto`. No constructor function, no `new`, no four-step dance — just the link, directly. This is the **purest expression** of what prototypal inheritance actually is, stripped of all the constructor-function ceremony.

```js
console.log(Object.getPrototypeOf(dog) === animal); // true
```

### `Object.create(null)` — a real, useful edge case

```js
const pureDict = Object.create(null);
pureDict.toString = "I overrode this";
console.log(pureDict.toString); // "I overrode this" — no inherited toString to clash with

const normalObj = {};
console.log(normalObj.toString); // function — inherited from Object.prototype
```

`Object.create(null)` produces an object with **no prototype at all** — not even `Object.prototype`. Useful for building genuine dictionaries/maps where you don't want accidental collisions with inherited methods like `toString`, `hasOwnProperty`, `constructor`, etc.

```js
console.log(pureDict.hasOwnProperty); // undefined — doesn't exist, no Object.prototype to inherit from
```

---

### Way 2 — Constructor functions + manual `.prototype` chaining (the "old school" way, pre-ES6)

This is what people did before `class` existed, and understanding it is what makes `class` stop feeling like magic.

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name); // manually call parent constructor, binding `this`
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype); // link Dog's prototype to Animal's
Dog.prototype.constructor = Dog; // MUST fix this manually — see below

Dog.prototype.bark = function() {
  console.log(`${this.name} says woof`);
};

const d = new Dog("Rex", "Labrador");
d.eat();  // "Rex is eating" — inherited from Animal.prototype
d.bark(); // "Rex says woof" — own to Dog.prototype
```

### Why `Dog.prototype.constructor = Dog` is necessary

```js
function Dog2(name) { this.name = name; }
Dog2.prototype = Object.create(Animal.prototype); // overwrote Dog2.prototype entirely

const d2 = new Dog2("Max");
console.log(d2.constructor); // Animal — WRONG, lying about what created d2
```

When you do `Dog.prototype = Object.create(Animal.prototype)`, you're **replacing the entire prototype object**, including its `constructor` property — which now points to whatever `Animal.prototype.constructor` was. If you don't manually fix it, `d2.constructor` falsely claims `d2` was made by `Animal`. This is exactly the kind of subtle bug that proves whether someone understands prototypes or just copy-pastes the pattern.

```js
Dog.prototype.constructor = Dog; // fixes it
```

---

### Why `Animal.call(this, name)` instead of `new Animal(name)` inside `Dog`

```js
function Dog(name, breed) {
  Animal.call(this, name); // correct
  // NOT: this.name = new Animal(name); — that would create a whole separate object
  this.breed = breed;
}
```

`Animal.call(this, name)` runs `Animal`'s logic **using `Dog`'s own `this`**, so `Dog`'s instance gets the properties `Animal` sets up (`this.name = name`), without creating a second, separate `Animal` instance. This is "constructor stealing" / "parent constructor invocation" and it's the manual equivalent of what `super()` does in classes.

---

### Way 3 — ES6 `class` / `extends` — same mechanism, different syntax

```js
class Animal3 {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog3 extends Animal3 {
  constructor(name, breed) {
    super(name); // exactly equivalent to Animal.call(this, name) above
    this.breed = breed;
  }
  bark() {
    console.log(`${this.name} says woof`);
  }
}

const d3 = new Dog3("Rex", "Labrador");
d3.eat();
d3.bark();
```

### Proving it's the same underlying mechanism

```js
console.log(Object.getPrototypeOf(Dog3.prototype) === Animal3.prototype); // true
console.log(d3.__proto__ === Dog3.prototype); // true
console.log(d3 instanceof Animal3); // true — chain walk finds Animal3.prototype
```

**`class` and `extends` are syntax sugar over exactly the same `[[Prototype]]`-chain mechanism you just built manually in Way 2.** `super()` does what `Animal.call(this, name)` did. `extends` does what `Dog.prototype = Object.create(Animal.prototype)` did, plus it correctly wires up `constructor` for you (fixing the bug above, automatically).

### What `class` gives you that the manual version doesn't

- `constructor` property fixed automatically — no manual patching needed
- Calling without `new` throws immediately, rather than silently misbehaving
- Class methods are non-enumerable by default (`for...in` won't pick them up); manually-added prototype methods *are* enumerable unless you use `Object.defineProperty` to mark them otherwise
- Cleaner, more constrained syntax — but **zero new capability at the engine level**. It's the same chain, dressed differently.

```js
console.log(Object.getOwnPropertyDescriptor(Dog3.prototype, 'bark').enumerable); // false

function OldDog() {}
OldDog.prototype.bark = function() {};
console.log(Object.getOwnPropertyDescriptor(OldDog.prototype, 'bark').enumerable); // true
```

This enumerability difference is a real, testable distinction — not just style.

---

## PART 3 — SHADOWING, OWN VS INHERITED, AND CHAIN LOOKUP MECHANICS

### The lookup algorithm, precisely

When you access `obj.prop`:

1. Check if `obj` has an **own** property called `prop`. If yes, use it. Stop.
2. If not, check `obj.__proto__` (its `[[Prototype]]`) for an own property called `prop`. If yes, use it. Stop.
3. Repeat up the chain until found, or until you hit an object whose `[[Prototype]]` is `null`.
4. If never found, return `undefined` (for property reads — function calls on a missing property throw `TypeError`).

```js
function Animal() {}
Animal.prototype.legs = 4;

const cat = new Animal();
console.log(cat.legs); // 4 — step 1 fails (no own `legs`), step 2 succeeds (found on prototype)
```

---

### Shadowing — own property always wins, and it doesn't "merge"

```js
cat.legs = 100; // creates a NEW own property on cat — does NOT modify Animal.prototype
console.log(cat.legs); // 100 — own property found at step 1, search stops immediately

console.log(Animal.prototype.legs); // 4 — completely untouched
console.log(cat.hasOwnProperty('legs')); // true — now it genuinely owns this property
```

**Critical detail: assignment (`cat.legs = 100`) never writes to the prototype, even if a property of that name already exists there.** It always creates (or overwrites) an **own** property on the object you're assigning to. The prototype is only ever consulted on *read*, never on plain assignment.

```js
delete cat.legs; // removes the OWN property
console.log(cat.legs); // 4 again — own property gone, lookup falls through to prototype
```

---

### The one exception — setters on the prototype chain

```js
const proto = {
  set value(v) {
    console.log("setter on prototype ran");
    this._value = v;
  }
};

const obj = Object.create(proto);
obj.value = 10; // does this create an own "value" property, or trigger the prototype's setter?
```

Answer: **the prototype's setter runs**, and it does NOT create an own `value` property on `obj` (unless the setter itself assigns one, which here it does, but to `_value`, a different key). Assignment checks the prototype chain for a setter **before** falling back to creating a plain own property. This is a genuinely advanced gotcha, but it's exactly the kind of thing that separates "read a blog post once" from "actually understands the mechanism."

---

### `hasOwnProperty` vs `in` — know the difference cold

```js
function Animal() {}
Animal.prototype.legs = 4;
const cat = new Animal();
cat.name = "Whiskers";

console.log(cat.hasOwnProperty('name')); // true — own
console.log(cat.hasOwnProperty('legs')); // false — inherited, not own

console.log('name' in cat); // true
console.log('legs' in cat); // true — `in` checks the ENTIRE chain, not just own properties
```

`in` doesn't distinguish own vs. inherited. `hasOwnProperty` only checks the object itself. Confusing these two is a very common, very real mistake.

---

### `for...in` walks the chain too (and why this trips people up)

```js
for (const key in cat) {
  console.log(key); // "name" AND "legs" — for...in walks enumerable properties up the WHOLE chain
}
```

```js
for (const key in cat) {
  if (cat.hasOwnProperty(key)) {
    console.log(key); // "name" only — the standard defensive pattern
  }
}
```

This is exactly why you constantly see that `hasOwnProperty` guard inside `for...in` loops in real code — without it, you silently iterate over inherited properties too, which is rarely what you want.

```js
console.log(Object.keys(cat)); // ["name"] — Object.keys only returns OWN enumerable properties, no guard needed
```

`Object.keys()` (and `Object.entries()`, `Object.values()`) already restrict to own properties — that's part of why modern code prefers them over raw `for...in`.

---

## PART 4 — INTERVIEW QUESTIONS, RAPID FIRE

**Q1. What's the output?**
```js
function Foo() {}
Foo.prototype.greet = function() { return "hi"; };

const a = new Foo();
const b = new Foo();

Foo.prototype.greet = function() { return "hello"; };

console.log(a.greet());
console.log(b.greet());
```
Answer: `"hello"` and `"hello"`. Both instances share a live reference to the same prototype object. Reassigning the method on the prototype after creation affects all existing and future instances.

---

**Q2. What's the output?**
```js
function Foo() {}
const a = new Foo();

Foo.prototype = { greet() { return "new"; } }; // full reassignment, not modification

console.log(a.greet());
```
Answer: **TypeError: a.greet is not a function.** This is different from Q1. There, the *same* prototype object was mutated. Here, `Foo.prototype` is pointed at a **brand new object** entirely — `a` still holds a reference to the *original* prototype object, which never had `greet`. Reassigning `.prototype` only affects instances created **after** the reassignment.

---

**Q3. What's the output?**
```js
function Person(name) {
  this.name = name;
  return { custom: true };
}

const p = new Person("Arun");
console.log(p.name);
console.log(p.custom);
```
Answer: `undefined` and `true`. The constructor explicitly returns an object, so `new` discards the freshly-created `this` entirely and uses the returned object instead.

---

**Q4. What's the output?**
```js
const obj = Object.create(null);
console.log(obj.toString);
console.log(obj);
```
Answer: `undefined`, and logging `obj` typically shows something like `[Object: null prototype] {}` rather than the usual `{}`. No prototype chain at all means no inherited methods whatsoever, not even the basics every other object gets for free.

---

**Q5. True or false: class syntax creates a fundamentally different inheritance mechanism than prototype chains.**
Answer: **False.** `class`/`extends` is syntax sugar over the exact same `[[Prototype]]` chain mechanism. `extends` wires up the prototype link; `super()` calls the parent constructor with the child's `this`. No new engine-level capability exists.

---

**Q6. What's the output?**
```js
function A() {}
A.prototype.value = 1;

function B() {}
B.prototype = A.prototype; // NOT Object.create(A.prototype) — direct reference, no copy
B.prototype.value = 2;

console.log(A.prototype.value); // ?
```
Answer: `2`. `B.prototype = A.prototype` doesn't create a new linked object — it makes `B.prototype` and `A.prototype` **literally the same object**. Mutating one mutates the other. This is exactly why the correct pattern is `Object.create(A.prototype)`, which creates a **new** object whose `[[Prototype]]` points to `A.prototype`, rather than aliasing it directly.

---

**Q7. What's the output?**
```js
const cat = { legs: 4 };
const dog = Object.create(cat);

console.log(dog.hasOwnProperty('legs'));
console.log('legs' in dog);
console.log(Object.keys(dog));
```
Answer: `false`, `true`, `[]`. `legs` is inherited, not owned — fails `hasOwnProperty`, passes `in` (which checks the whole chain), and is excluded from `Object.keys()` (own enumerable only).

---

**Q8. What's the output?**
```js
class Animal {
  eat() { console.log("eating"); }
}

const a = new Animal();
for (const key in a) {
  console.log(key);
}
```
Answer: **Nothing is logged.** Class methods are defined as non-enumerable on the prototype by default, so `for...in` (which only visits enumerable properties) skips them entirely. This is different from manually doing `Animal.prototype.eat = function(){}`, which WOULD show up in `for...in`, since manually-assigned prototype properties are enumerable by default.

---

**Q9. What's the output?**
```js
function Foo() {}
const f = new Foo();
console.log(f.constructor === Foo);
console.log(f.constructor === Foo.prototype.constructor);
```
Answer: `true` and `true`. `f` has no own `constructor` property — it's found via the chain, on `Foo.prototype.constructor`, which by default points back to `Foo` itself.

---

**Q10. Why does `instanceof` sometimes lie after manual prototype manipulation?**
Answer: Because `instanceof` walks the **actual, current** prototype chain of the specific object instance — it checks whether `Constructor.prototype` appears in that chain right now. If you reassign `Constructor.prototype` to a different object *after* instances were already created, those older instances still hold their original `[[Prototype]]` link and won't reflect the new `.prototype` value, while newly created instances will.

---

## PART 5 — THINGS PEOPLE GET WRONG (CONSOLIDATED)

1. **`__proto__` is the legacy accessor exposing the internal `[[Prototype]]` slot** — not the slot itself. Use `Object.getPrototypeOf`/`setPrototypeOf` in real code.
2. **Primitives don't have prototypes directly** — autoboxing temporarily wraps them when you call a method.
3. **`new` discards `this` if the constructor explicitly returns an object** — return value matters, conditionally.
4. **`p.__proto__ === Person.prototype` is a live reference, not a copy** — methods added later are visible to already-created instances.
5. **Reassigning `Foo.prototype` entirely (not mutating it) only affects instances created afterward** — existing instances keep their original link.
6. **`B.prototype = A.prototype` aliases the same object** — mutating one prototype mutates both. Use `Object.create(A.prototype)` to get a properly linked but distinct object.
7. **Plain assignment (`obj.x = y`) always creates/overwrites an own property** — it never silently writes to the prototype, except when a setter exists somewhere on the chain.
8. **`hasOwnProperty` checks only the object itself. `in` and `for...in` walk the entire chain.** `Object.keys/values/entries` are own-only, automatically.
9. **`class` is sugar, not a new mechanism** — same `[[Prototype]]` chain, but with automatic `constructor` fixing, mandatory `new`, and non-enumerable methods by default.
10. **`Dog.prototype.constructor = Dog` must be set manually** when manually chaining constructor functions — `class`/`extends` does this for you silently.
11. **Long prototype chains cost lookup performance** — every miss means walking one more link before failing or succeeding.

---

## Mental Model — Carry This One Thing

Every object has exactly one hidden link: `[[Prototype]]`, exposed via `__proto__`, pointing to exactly one other object (or `null`). Property lookup is **just walking that linked list of objects until something matches, or until you hit `null`.**

`.prototype` on a function is nothing mystical — it's just **a plain object sitting there, waiting to be handed out as the `[[Prototype]]` of whatever `new` creates next.** `new` is the handoff mechanism. `class` is a cleaner ceremony around the exact same handoff. `Object.create` is the handoff with zero ceremony at all.

Once you can mentally trace "where does this property lookup actually go, link by link, and does assignment ever touch the prototype" — you've fully internalized the topic. Everything else is variations on that one walk.