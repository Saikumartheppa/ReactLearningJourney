# JavaScript Modules (ES Modules) — Complete Deep Dive

---

## What Is It, And Why You Were Told It's Important

Every `import`/`export` statement you've written in React is this topic. `import React from "react"`, `import { useState } from "react"`, `export default function App()` — none of that is React-specific syntax. It's the ES Modules (ESM) system, and React just happens to be the context where you use it most densely.

If your mental model of imports/exports is "magic words that make React work," you will eventually hit a wall — circular import bugs, "why is this undefined," bundler config confusion, CommonJS interop issues. This topic is foundational, not decorative.

---

## PART 1 — WHY MODULES EXIST AT ALL

Before modules, JS files shared one global scope. Every `<script>` tag dumped its variables into the same bucket.

```html
<script src="a.js"></script>
<script src="b.js"></script>
```

```js
// a.js
var count = 0;

// b.js
var count = 5; // silently clobbers a.js's variable — same global scope
```

No isolation. No explicit dependency declaration. Order of `<script>` tags determined what existed when — fragile, and unscalable beyond small projects. People worked around this with IIFEs, namespacing objects, and tools like CommonJS (Node) or AMD (browser) — all *before* JS had a real module system built in.

ES Modules (ES2015 spec, but not stably supported everywhere until years later) finally gave JS:
- **Per-file scope** — variables don't leak between files automatically
- **Explicit exports** — a file declares exactly what it shares
- **Explicit imports** — a file declares exactly what it needs, from where

```js
// math.js
export const PI = 3.14159;
function privateHelper() { /* not exported, invisible outside this file */ }
export function double(x) { return x * 2; }
```

```js
// app.js
import { PI, double } from "./math.js";
console.log(PI, double(5)); // 3.14159, 10
// privateHelper is NOT accessible here — it was never exported
```

---

## PART 2 — NAMED EXPORTS

You can export multiple things from one file, each by name.

```js
// utils.js
export const TAX_RATE = 0.18;

export function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

export class Logger {
  log(msg) { console.log(msg); }
}
```

### Importing named exports — names must match exactly

```js
import { TAX_RATE, formatCurrency, Logger } from "./utils.js";
```

You can also export things separately from their declaration, grouped at the bottom of the file:

```js
const TAX_RATE = 0.18;
function formatCurrency(amount) { /* ... */ }

export { TAX_RATE, formatCurrency };
```

Both styles are equally valid. The second is common when you want all exports visible in one place at the bottom, rather than scattered with `export` keywords throughout the file.

---

### Renaming on export

```js
// utils.js
const internalName = "secret";
export { internalName as publicName };
```

```js
import { publicName } from "./utils.js";
console.log(publicName); // "secret"
// internalName doesn't exist on the importing side at all
```

### Renaming on import

```js
import { formatCurrency as formatMoney } from "./utils.js";
formatMoney(100);
```

Useful when two modules export something with the same name and you need both in one file.

```js
import { formatCurrency as formatINR } from "./indiaUtils.js";
import { formatCurrency as formatUSD } from "./usUtils.js";
```

---

## PART 3 — DEFAULT EXPORTS

Each file can have **at most one** default export. This is the form you see constantly in React component files.

```js
// Button.js
export default function Button({ label }) {
  return <button>{label}</button>;
}
```

```js
import Button from "./Button.js";
```

### The defining trait: default imports can be named anything

```js
import Button from "./Button.js";
import MyRandomNameForButton from "./Button.js"; // also valid, also works
```

There's no name-matching requirement for default imports, unlike named imports. This is a real source of bugs in large codebases — two files importing the same default export under different names makes searching/refactoring harder. It's a tradeoff, not a free win.

---

### Default + named exports together — totally legal

```js
// api.js
export default function fetchData() { /* ... */ }
export const BASE_URL = "https://api.example.com";
```

```js
import fetchData, { BASE_URL } from "./api.js";
```

Default import has no braces. Named imports use braces. Mixing both in one `import` statement is fine — order matters: default comes first.

---

### Default export forms — there are several

```js
export default function fetchData() {}     // named function as default
export default () => {};                    // anonymous arrow function
export default class User {}                // class as default
export default { a: 1, b: 2 };               // object literal as default
export default 42;                          // even a primitive value

const myVar = "hi";
export default myVar;                       // exporting a variable as default
```

All valid. Whatever the expression evaluates to becomes "the" default export of that module.

---

## PART 4 — IMPORT FORMS, COMPLETE LIST

```js
import Default from "./module.js";                    // default only
import { a, b } from "./module.js";                    // named only
import Default, { a, b } from "./module.js";            // default + named
import * as Utils from "./module.js";                   // namespace import — everything as one object
import "./module.js";                                    // side-effect only, no bindings
```

### Namespace import in detail

```js
// utils.js
export const a = 1;
export const b = 2;
export default function main() {}
```

```js
import * as Utils from "./utils.js";

console.log(Utils.a);       // 1
console.log(Utils.b);       // 2
console.log(Utils.default); // the default export, accessed via .default
Utils.default();
```

Everything — named exports AND the default — gets bundled into one object, with the default specifically available under the key `default`.

---

### Side-effect-only import

```js
import "./setupAnalytics.js";
```

No bindings pulled in at all. You're importing the file purely to run whatever top-level code it contains (registering something globally, injecting CSS, polyfills). Common with CSS imports in bundler-based React setups:

```js
import "./styles.css"; // no JS binding — bundler handles this specially
```

---

## PART 5 — RE-EXPORTING (BARREL FILES)

A very common React project pattern — collecting multiple component exports into one "index" file so consumers import from a single path.

```js
// components/Button.js
export default function Button() {}

// components/Input.js
export default function Input() {}

// components/index.js  — the "barrel" file
export { default as Button } from "./Button.js";
export { default as Input } from "./Input.js";
```

```js
// somewhere else
import { Button, Input } from "./components/index.js";
// or, since bundlers resolve directories to index.js automatically:
import { Button, Input } from "./components";
```

This collapses each component's *default* export into a *named* export on the barrel file — `Button` and `Input` become named exports of `index.js`, even though they started as default exports of their own files.

### Re-exporting everything

```js
export * from "./Button.js"; // re-exports all named exports (not default)
export * as ButtonModule from "./Button.js"; // namespaces it instead
```

**Caveat worth knowing**: barrel files can hurt performance with some bundlers/tree-shaking setups because importing one thing from the barrel can pull in the whole chain of re-exports unless the bundler is smart about dead-code elimination. Not a reason to avoid them outright, but a real tradeoff in large codebases — don't treat barrel files as purely beneficial with zero cost.

---

## PART 6 — LIVE BINDINGS (The Part Almost Nobody Knows)

This is the single most underrated fact about ES Modules, and a strong interview differentiator.

**Imports are not copies of values. They are live, read-only references to the exporting module's bindings.**

```js
// counter.js
export let count = 0;
export function increment() {
  count++;
}
```

```js
// main.js
import { count, increment } from "./counter.js";

console.log(count); // 0
increment();
console.log(count); // 1 — updated! Even though you never reassigned `count` yourself
```

This is fundamentally different from CommonJS (`require`), where you'd get a **snapshot copy** of the value at the time of import, and later changes in the source module wouldn't be reflected.

```js
// CommonJS equivalent behavior (Node's older system)
let count = 0;
function increment() { count++; }
module.exports = { count, increment };
```

```js
const { count, increment } = require("./counter");
console.log(count); // 0
increment();
console.log(count); // still 0 — count was copied by value at require time
```

ESM's live-binding behavior is a real architectural difference, not a minor footnote — and it's exactly why `let`-exported mutable state behaves the way it does in module-based state management patterns.

---

### You cannot reassign an imported binding yourself

```js
import { count } from "./counter.js";
count = 5; // SyntaxError: Assignment to constant variable (effectively read-only)
```

The exporting module can change it. The importing module can only read the current value — never assign to the imported name directly.

---

## PART 7 — HOISTING AND EXECUTION ORDER

### Imports are hoisted

```js
sayHi(); // works, even though import is written below

import { sayHi } from "./greet.js";
```

Import declarations are hoisted to the top of the module, conceptually, before any code runs — similar in spirit to function declaration hoisting, though the actual mechanism (module resolution) is different under the hood.

### Modules execute once, and are cached

```js
// expensive.js
console.log("module executing");
export const value = 42;
```

```js
// a.js
import { value } from "./expensive.js"; // logs "module executing"

// b.js
import { value } from "./expensive.js"; // does NOT log again — cached
```

No matter how many files import the same module, its top-level code runs **exactly once**. Every importer shares the same single instance of its exports. This is why a singleton pattern (e.g., a shared config object, a single Redux store reference in some setups) works simply by exporting it from a module — every import gets the same object reference.

---

## PART 8 — CIRCULAR IMPORTS (Real Gotcha In Larger React Apps)

```js
// a.js
import { b } from "./b.js";
export const a = "a-value";
console.log("b is:", b);
```

```js
// b.js
import { a } from "./a.js";
export const b = "b-value";
console.log("a is:", a);
```

Depending on which file loads first, one of these logs will show `undefined` for the not-yet-initialized value — because of the live-binding model, the binding exists but hasn't been assigned yet at the moment it's read.

This is a real production bug class in large component trees with tangled cross-imports (component A imports a util that imports component A, etc.). The general advice: **avoid circular imports structurally** rather than relying on knowing the exact resolution order, because that order can be genuinely hard to reason about as the dependency graph grows.

---

## PART 9 — ESM VS COMMONJS (Interview Staple)

| | ES Modules (`import`/`export`) | CommonJS (`require`/`module.exports`) |
|---|---|---|
| Used in | Browsers natively, modern Node (`.mjs` or `"type": "module"`) | Node.js historically/default |
| Loading | Static, resolved at parse time | Dynamic, resolved at runtime |
| Bindings | Live references | Copied values |
| Top-level `await` | Supported | Not supported |
| Tree-shaking | Possible (static structure) | Difficult (dynamic structure) |
| Syntax | `import x from "y"` | `const x = require("y")` |

### Why "static" vs "dynamic" matters

```js
// CommonJS — totally legal, require() is just a function call
if (condition) {
  const mod = require("./moduleA");
} else {
  const mod = require("./moduleB");
}
```

```js
// ESM — import declarations must be at the top level, not conditional
if (condition) {
  import x from "./moduleA"; // SyntaxError — not allowed
}
```

ESM's static structure (imports/exports must be at the top level, not inside `if`/functions) is exactly what enables **tree-shaking** — bundlers can analyze the dependency graph at build time without running any code, and strip out exports that are never used. CommonJS's dynamic nature makes this kind of static analysis far harder, since `require()` calls could theoretically happen anywhere, conditionally, with computed paths.

### Dynamic import in ESM — the escape hatch

```js
async function loadFeature() {
  const module = await import("./featureModule.js");
  module.default();
}
```

`import()` as a function call (not the static `import` statement) returns a Promise and can be used conditionally — this is how React's `lazy()` and code-splitting work under the hood.

```js
const LazyComponent = React.lazy(() => import("./HeavyComponent.js"));
```

That's not React magic either — it's a standard JS feature (dynamic `import()`), and React just consumes the Promise it returns.

---

## PART 10 — STRICT MODE BY DEFAULT

ES Modules are automatically in strict mode — no `"use strict"` needed, ever.

```js
// module.js — automatically strict, no directive required
x = 5; // ReferenceError — can't create undeclared globals, strict mode enforced
```

Consequence: `this` at the top level of a module is `undefined`, not the global object.

```js
console.log(this); // undefined, inside an ES module
```

---

## PART 11 — REACT-SPECIFIC PATTERNS THIS UNLOCKS

### Component files — default export convention

```js
// UserCard.js
export default function UserCard({ name }) {
  return <div>{name}</div>;
}
```

```js
import UserCard from "./UserCard";
```

One component, one default export, per file — the dominant React convention. Not enforced by the language, just a strong community convention for discoverability.

### Named exports for hooks/utilities

```js
// useAuth.js
export function useAuth() { /* ... */ }
export function useUser() { /* ... */ }
```

```js
import { useAuth, useUser } from "./useAuth";
```

Multiple related hooks in one file, imported by exact name — named exports fit better here since there's no single "main" export.

### Barrel exports for component libraries

```js
// components/index.js
export { default as Button } from "./Button";
export { default as Modal } from "./Modal";
export { default as Card } from "./Card";
```

```js
import { Button, Modal, Card } from "../components";
```

### Code-splitting with dynamic import

```js
const Dashboard = React.lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

This is the single biggest "modules knowledge directly impacts React performance" moment — understanding that `import()` returns a Promise, and that this is how route-based code splitting works, is what separates people who copy-paste `React.lazy` examples from people who understand why it works.

---

## PART 12 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
// a.js
export let value = 1;
export function update() { value = 2; }
```
```js
// b.js
import { value, update } from "./a.js";
console.log(value); // ?
update();
console.log(value); // ?
```
Answer: `1` then `2`. Live binding — the imported `value` reflects changes made inside the exporting module, even though `b.js` never reassigned it directly.

---

**Q2. Can you have two default exports in one file?**
Answer: No — `SyntaxError: Duplicate export of 'default'`. Exactly one default export per module, maximum.

---

**Q3. What's the output?**
```js
import { count } from "./counter.js";
count = 10;
```
Answer: `TypeError` (or SyntaxError depending on engine/tooling) — imported bindings are read-only from the importing side. You cannot assign to them directly, only the exporting module can change the underlying value.

---

**Q4. Why does this fail?**
```js
function loadModule(name) {
  import { something } from `./${name}.js`; // attempt at "dynamic" static import
}
```
Answer: Static `import` statements must have a **literal string** as the source and must be at the top level — no template literals, no conditional placement, no runtime-computed paths. For genuinely dynamic loading, use the `import()` function form instead, which does accept expressions and returns a Promise.

---

**Q5. What's the output?**
```js
// logger.js
console.log("logger loaded");
export default function log(msg) { console.log(msg); }
```
```js
// a.js
import log from "./logger.js";
// b.js
import log2 from "./logger.js";
```
If both `a.js` and `b.js` are imported by a third file, how many times does `"logger loaded"` print?
Answer: **Once.** Modules are cached after first execution — every subsequent import of the same module reuses the already-executed instance, regardless of how many files import it or under what local name.

---

**Q6. What does `React.lazy(() => import("./X"))` rely on at the language level?**
Answer: The dynamic `import()` function, which returns a Promise resolving to the module's exports object. `React.lazy` is just consuming that Promise and using Suspense to handle the pending state — there's no special React-only import mechanism involved.

---

**Q7. What's the practical difference between these two imports of the same default export?**
```js
import Btn from "./Button.js";
import Button from "./Button.js";
```
Answer: Both work identically — default imports can be named anything locally, since there's no name to match against (unlike named exports). This flexibility is also a maintenance risk: the same component can end up under inconsistent names across a codebase, making refactors and searches harder.

---

**Q8. What happens here?**
```js
// a.js
import { b } from "./b.js";
console.log(b);
export const a = "hello";
```
```js
// b.js
import { a } from "./a.js";
export const b = a + " world";
```
If `a.js` is the entry point, what prints?
Answer: `undefined` is logged for `b` initially in some resolution orders — circular dependency, where `b.js` tries to use `a` before `a.js` has finished assigning it. The exact outcome depends on module resolution order, which is precisely why circular imports are flagged as a real hazard rather than something to "just reason through" reliably.

---

## PART 13 — THINGS PEOPLE GET WRONG

1. **Imports are live bindings, not copies.** Changing an exported `let` in the source module is visible to every importer, automatically.
2. **You cannot reassign an imported binding** from the importing file — only the exporting module can change its own variables.
3. **Only one default export per file**, but unlimited named exports.
4. **Default imports can be renamed freely with no penalty/error** — but this is a real maintainability cost in large teams, not a pure convenience.
5. **Static `import` must be top-level, with a literal string path** — no conditionals, no template literals, no computed paths. Use `import()` (the function) for genuinely dynamic loading.
6. **Modules execute exactly once and are cached** — regardless of how many files import them.
7. **Circular imports can produce `undefined` for not-yet-initialized exports** — a structural problem to avoid, not something to patch around with import ordering tricks.
8. **ESM is strict mode by default**, with no `"use strict"` directive needed — top-level `this` is `undefined`, not the global object.
9. **Barrel files have a real tree-shaking/performance cost in some setups** — convenient, but not free.

---

## Mental Model

A module is a **file with its own private scope and an explicit, declared interface.**

`export` is the file saying: "here is exactly what I'm willing to share, nothing else exists outside these walls." `import` is another file saying: "give me a live, read-only window into those specific named things."

The "live window" framing is the part that actually matters and that most tutorials skip — you're not receiving a value, you're receiving an ongoing connection to wherever that value lives. That single fact explains live bindings, why reassignment from the importing side is blocked, why module caching makes sense, and why circular imports can produce genuinely undefined behavior depending on timing. Everything else in this topic is naming conventions and syntax variety layered on top of that one core idea.