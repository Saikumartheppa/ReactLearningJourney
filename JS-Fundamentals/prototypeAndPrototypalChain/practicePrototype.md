# JavaScript Prototype & Prototypal Inheritance -- Revision Guide

> **How to use this file**
>
> Try answering each question **before** expanding the solution.

---

## Q1. Property Lookup

```js
const user = { name: "Sai" };

console.log(user.name);
console.log(user.age);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**Output**

```txt
Sai
undefined
```

### Why?

JavaScript searches for `age` in this order:

```
user
 ↓
Object.prototype
 ↓
null
```

When the property is not found anywhere in the prototype chain,
JavaScript returns `undefined` instead of throwing an error.

</details>

---

## Q2. Inherited Property

```js
const animal = { eats: true };
const dog = Object.create(animal);

console.log(dog.eats);
console.log(dog.hasOwnProperty("eats"));
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**Output**

```txt
true
false
```

`dog` doesn't own the `eats` property.

Prototype chain:

```
dog
 ↓
animal
 ↓
Object.prototype
 ↓
null
```

`hasOwnProperty()` checks only the object's own properties.

</details>

---

## Q3. Shadowing

```js
const animal = { eats: true };
const dog = Object.create(animal);

dog.eats = false;

console.log(dog.eats);
console.log(animal.eats);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**Output**

```txt
false
true
```

This is called **shadowing**.

`dog.eats = false` creates a new property on `dog`; it does **not**
modify `animal.eats`.

</details>

---

## Q4. Object Prototype

```js
const obj = {};

console.log(obj.__proto__ === Object.prototype);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**Answer:** `true`

Every plain object created with `{}` inherits from `Object.prototype`.

</details>

---

## Q5. Array Prototype Chain

```js
const arr = [];

console.log(arr.__proto__ === Array.prototype);
console.log(arr.__proto__.__proto__ === Object.prototype);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

Both are **true**.

```
arr
 ↓
Array.prototype
 ↓
Object.prototype
 ↓
null
```

Arrays inherit array methods from `Array.prototype` and general object
methods from `Object.prototype`.

</details>

---

## Q6. Where does `toString` come from?

```js
const arr = [];
console.log(arr.toString);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

`toString` is found on `Array.prototype`.

JavaScript checks `arr` first, then `Array.prototype`.

</details>

---

## Q7. Constructor Function & Prototype

```js
function User(name) {
  this.name = name;
}

const u1 = new User("Sai");
```

<details>
<summary>📖 Show Answer & Explanation</summary>

`new` roughly performs:

```js
const obj = {};
obj.__proto__ = User.prototype;
User.call(obj, "Sai");
return obj;
```

Therefore,

```js
u1.__proto__ === User.prototype // true
```

Important:

- `User` → Function object
- `User.prototype` → Plain object used by instances
- `u1.__proto__` → Points to `User.prototype`

They are **different concepts**, although `u1.__proto__` and
`User.prototype` reference the same object.

</details>

---

## Q8

```js
u1.__proto__ === User.prototype
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**Answer:** `true`

Instances created with `new` automatically have their internal
`[[Prototype]]` set to `User.prototype`.

</details>

---

## Q9. Where is `sayHi` stored?

```js
User.prototype.sayHi = function () {
  console.log("Hi");
};

const u1 = new User("Sai");
u1.sayHi();
```

<details>
<summary>📖 Show Answer & Explanation</summary>

`sayHi` is stored **once** on `User.prototype`.

All instances share the same function instead of creating a copy per
object.

</details>

---

## Q10. `.prototype` vs `__proto__`

```js
function User() {}

console.log(User.prototype);
console.log(User.__proto__);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

They are **not the same**.

- `User.prototype` → Object inherited by instances.
- `User.__proto__` → `Function.prototype`.

```
User
 │
 ├── prototype ──► User.prototype
 │
 └── __proto__ ─► Function.prototype
```

</details>

---

## Q11

```js
User.prototype === User.__proto__
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**false**

One belongs to instances, the other belongs to the function object
itself.

</details>

---

## Q12

```js
User.__proto__ === Function.prototype
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**true**

Functions are objects created by `Function`.

</details>

---

## Q13

```js
const u1 = new User();
console.log(u1.constructor);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

Returns the `User` function.

Lookup:

```
u1
 ↓
User.prototype
 ↓
constructor → User
```

</details>

---

## Q14

```js
u1.constructor === User
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**true**

This is property lookup, **not** function invocation.

</details>

---

## Q15

```js
User.prototype = {};

const u1 = new User();

console.log(u1.constructor === User);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**false**

Replacing the entire prototype removes the default `constructor`
property.

Lookup falls through to `Object.prototype.constructor`.

</details>

---

## Q16

```js
const u1 = new User();

User.prototype.sayHi = function(){};

u1.sayHi();
```

<details>
<summary>📖 Show Answer & Explanation</summary>

Works!

Why?

You **mutated** the existing prototype object.

`u1` still points to that same object.

</details>

---

## Q17

```js
const u1 = new User();

User.prototype = {
  sayHi(){}
};

u1.sayHi();
```

<details>
<summary>📖 Show Answer & Explanation</summary>

Throws `TypeError`.

You replaced the prototype with a new object.

`u1` still references the old prototype.

</details>

---

## Q18

```js
const u1 = new User();
const u2 = new User();

User.prototype.city = "Chennai";

console.log(u1.city);
console.log(u2.city);
```

<details>
<summary>📖 Show Answer & Explanation</summary>

```
Chennai
Chennai
```

Again, you mutated the shared prototype.

</details>

---

## Q19

Prototype chain lookup:

```
child
 ↓
parent
 ↓
grandParent
 ↓
Object.prototype
 ↓
null
```

<details>
<summary>📖 Show Answer & Explanation</summary>

`child.money` resolves to `1000`.

</details>

---

## Q20

Creating `child.money = 500` shadows the inherited property.

<details>
<summary>📖 Show Answer & Explanation</summary>

Outputs:

```
500
1000
1000
```

</details>

---

## Q21

<details>
<summary>📖 Show Answer & Explanation</summary>

Outputs:

```
Sai
Ram
Sai
```

Deleting the own property exposes the inherited one again.

</details>

---

## Q22

<details>
<summary>📖 Show Answer & Explanation</summary>

```
"city" in u1           // true
u1.hasOwnProperty()    // false
```

`in` checks the whole chain.

`hasOwnProperty()` checks only own properties.

</details>

---

## Q23

```js
Object.prototype.__proto__
```

<details>
<summary>📖 Show Answer & Explanation</summary>

Result:

```
null
```

</details>

---

## Q24

```js
User.prototype.constructor === User
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**true**

Because JavaScript creates

```js
User.prototype = {
  constructor: User
}
```

by default.

</details>

---

## Q25

```js
u1.__proto__.constructor.prototype === u1.__proto__
```

<details>
<summary>📖 Show Answer & Explanation</summary>

**true**

The chain resolves back to the same `User.prototype` object.

</details>

---

## Q26

<details>
<summary>📖 Show Answer & Explanation</summary>

Use:

```js
Object.getPrototypeOf(obj)
```

instead of `__proto__`.

Reasons:

- Standard API
- Clear intent
- Avoids relying on legacy accessor semantics

</details>

---

## Final Prototype Chains

### Instance

```
u1
 ↓
User.prototype
 ↓
Object.prototype
 ↓
null
```

### Function

```
User
 ↓
Function.prototype
 ↓
Object.prototype
 ↓
null
```

## Key Takeaways

- `__proto__` → Prototype of an object.
- `.prototype` → Property on constructor functions used for future instances.
- Mutating a prototype affects all existing instances.
- Replacing a prototype affects only future instances.
- Property lookup walks the prototype chain until `null`.
- Shadowing creates an own property without modifying the prototype.