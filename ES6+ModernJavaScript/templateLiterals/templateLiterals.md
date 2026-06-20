# Template Literals — Complete Deep Dive

---

## What Is It?

Template literals use backticks (`` ` ``) instead of quotes, and let you embed expressions directly inside strings using `${}`.

```js
const name = "Arun";
const age = 25;

// Old way
const msg1 = "Hello, " + name + ". You are " + age + " years old.";

// Template literal
const msg2 = `Hello, ${name}. You are ${age} years old.`;
```

Same output. But the second version doesn't force you to break your sentence apart with `+` concatenation.

That's the surface-level pitch everyone gives. The actual depth is in multi-line strings, expression evaluation, nesting, and tagged templates — which is where interviews actually probe.

---

## PART 1 — INTERPOLATION

### Basic

```js
const x = 10, y = 20;
console.log(`Sum is ${x + y}`); // "Sum is 30"
```

`${}` doesn't just take variables. It takes **any valid JavaScript expression**. Function calls, ternaries, arithmetic, object property access — all valid.

```js
const user = { name: "Arun", isAdmin: true };

console.log(`Welcome ${user.name.toUpperCase()}`); // "Welcome ARUN"
console.log(`Role: ${user.isAdmin ? "Admin" : "User"}`); // "Role: Admin"
console.log(`Random: ${Math.random()}`);
```

---

### Nested template literals

```js
const isLoggedIn = true;
const name = "Arun";

const greeting = `Status: ${isLoggedIn ? `Welcome, ${name}` : "Please log in"}`;
console.log(greeting); // "Status: Welcome, Arun"
```

A template literal inside `${}` is completely legal. You can nest as deep as needed, though readability suffers fast — most teams cap this at one level in real code.

---

### Function calls inside

```js
function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

console.log(`Total: ${formatCurrency(499.5)}`); // "Total: ₹499.50"
```

---

## PART 2 — MULTI-LINE STRINGS

Before template literals, multi-line strings required `\n` or string concatenation.

```js
// Old way
const msg1 = "Line one\n" +
             "Line two\n" +
             "Line three";

// Template literal — just hit enter
const msg2 = `Line one
Line two
Line three`;
```

Whatever whitespace and line breaks you type **inside the backticks is preserved exactly**, including leading spaces from indentation.

```js
function getHTML() {
  return `
    <div>
      <p>Hello</p>
    </div>
  `;
}
```

Watch out — this also preserves the leading indentation from your code formatting, which can produce unwanted whitespace in output you didn't intend (common gotcha in generated HTML/email templates).

---

## PART 3 — TAGGED TEMPLATES (The Part Most People Skip)

This is the feature that separates "I've used template literals" from "I understand template literals." Almost nobody outside framework-internals work uses this directly, but it shows up constantly under the hood — and it's a strong interview differentiator.

### What is it?

A tag is a function placed right before a template literal, with no parentheses or space:

```js
function tag(strings, ...values) {
  console.log(strings); // array of literal string parts
  console.log(values);  // array of interpolated values
}

const name = "Arun";
const age = 25;

tag`Hello ${name}, you are ${age}`;
```

Output:
```
["Hello ", ", you are ", ""]
["Arun", 25]
```

The string is split at every `${}` boundary. `strings` is the literal text segments. `values` is the array of evaluated expressions, in order.

---

### Why this matters — building your own formatter

```js
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? `**${values[i]}**` : "";
    return result + str + value;
  }, "");
}

const name = "Arun";
const role = "Admin";

console.log(highlight`User ${name} has role ${role}.`);
// "User **Arun** has role **Admin**."
```

You intercept the construction of the string and decide how interpolated values get formatted. This is exactly how libraries like `styled-components` work:

```js
const Button = styled.button`
  color: ${props => props.primary ? "blue" : "gray"};
  padding: 10px;
`;
```

`styled.button` is a tag function. It receives the CSS text and the interpolated function, and returns a React component. Understanding tagged templates means understanding how that library works internally instead of treating it as magic.

---

### `String.raw` — built-in tag function

```js
console.log(`Line1\nLine2`);       // Line1 and Line2 on separate lines — \n is interpreted
console.log(String.raw`Line1\nLine2`); // "Line1\nLine2" — literally printed, \n NOT interpreted
```

`String.raw` gives you the **raw, unescaped string** — exactly as typed, before any escape sequences are processed. Useful for things like file paths or regex patterns where you don't want `\n`, `\t` etc. interpreted.

```js
console.log(`C:\Users\name`);      // C:Usersname — \U and \n are treated as escapes (broken)
console.log(String.raw`C:\Users\name`); // C:\Users\name — exactly as written
```

---

### `strings.raw` inside a custom tag

Every tag function's `strings` array has a `.raw` property containing the unescaped versions.

```js
function tag(strings) {
  console.log(strings[0]);     // processed
  console.log(strings.raw[0]); // raw, unescaped
}

tag`Tab\tHere`;
// "Tab	Here"  (real tab character)
// "Tab\tHere" (literal backslash-t)
```

---

## PART 4 — ESCAPING IN TEMPLATE LITERALS

### Backticks inside template literals

```js
const code = `Use \`backticks\` for templates`;
console.log(code); // Use `backticks` for templates
```

You must escape backticks with `\` since the backtick is the delimiter.

### Dollar sign without interpolation

```js
const price = `Price: \${100}`;
console.log(price); // "Price: ${100}" — literal, not interpolated
```

Escape `$` if you want a literal `${...}` to appear without triggering interpolation.

---

## PART 5 — PRACTICAL PATTERNS

### Conditional class names (common in frontend)

```js
const isActive = true;
const className = `btn ${isActive ? "btn-active" : ""}`.trim();
```

### Building dynamic queries / URLs

```js
const baseUrl = "https://api.example.com";
const endpoint = "users";
const id = 42;

const url = `${baseUrl}/${endpoint}/${id}`;
console.log(url); // "https://api.example.com/users/42"
```

### Multi-line SQL or GraphQL-like strings

```js
const query = `
  SELECT name, age
  FROM users
  WHERE id = ${userId}
`;
```

**Stop here — this is also a textbook SQL injection vector if `userId` comes from user input.** Interviewers love asking: "what's wrong with this code?" Template literals make string-building easy, which makes it easy to accidentally build unsafe queries. Always use parameterized queries for actual database calls — never interpolate raw user input into SQL strings.

---

## PART 6 — INTERVIEW QUESTIONS

**Q1. What's the output?**
```js
const a = 5;
console.log(`${a > 3 ? "big" : "small"}`);
```
Answer: `"big"` — any expression works inside `${}`, including ternaries.

---

**Q2. What's the output?**
```js
function tag(strings, ...values) {
  return strings.length;
}

console.log(tag`a${1}b${2}c`);
```
Answer: `3` — there are always `n+1` string segments for `n` interpolated values: `["a", "b", "c"]`.

---

**Q3. What's the difference?**
```js
console.log(`5 + 3 = ${5 + 3}`);
console.log("5 + 3 = ${5 + 3}");
```
Answer: First prints `"5 + 3 = 8"` — backticks trigger interpolation. Second prints the literal text `"5 + 3 = ${5 + 3}"` — regular strings don't process `${}` at all, it's just text.

---

**Q4. What does `String.raw` solve?**
Answer: It gives you the string exactly as typed, without processing escape sequences like `\n`, `\t`. Useful for regex patterns, file paths, or any case where backslashes shouldn't be interpreted.

---

**Q5. What's the output?**
```js
const name = undefined;
console.log(`Hello ${name}`);
```
Answer: `"Hello undefined"` — interpolation calls `String()` conversion on the value. `undefined` and `null` become the literal strings `"undefined"` and `"null"`, not empty strings. This is a common bug source in UI templates.

---

**Q6. What's the output?**
```js
const obj = { toString() { return "custom"; } };
console.log(`Value: ${obj}`);
```
Answer: `"Value: custom"` — interpolation coerces the value to a string. If the object defines `toString()`, that's used.

---

**Q7. Write a tag function that escapes HTML in interpolated values only (not the literal text).**
```js
function safeHTML(strings, ...values) {
  const escape = (str) =>
    String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined ? escape(values[i]) : "";
    return result + str + value;
  }, "");
}

const userInput = "<script>alert('xss')</script>";
console.log(safeHTML`<p>${userInput}</p>`);
// "<p>&lt;script&gt;alert('xss')&lt;/script&gt;</p>"
```
This is a real-world security pattern — tagged templates can sanitize interpolated values automatically while leaving your literal markup untouched. This is essentially what some templating libraries do internally.

---

**Q8. Is this valid?**
```js
const html = `<div class="${isActive && "active"}"></div>`;
```
What happens if `isActive` is `false`?
Answer: `<div class="false"></div>` — `&&` with `false` returns `false`, and `false` gets stringified to `"false"` literally inside the template. This is a real bug pattern. Correct version: `${isActive ? "active" : ""}`.

---

## PART 7 — THINGS PEOPLE GET WRONG

1. **Interpolation always stringifies via `String()` coercion** — `undefined`, `null`, objects, booleans all get converted, sometimes producing literal text like `"undefined"` or `"false"` you didn't want.
2. **Tagged templates are functions, not magic syntax.** `tag\`text\`` is just calling `tag(strings, ...values)`.
3. **`strings` array always has `values.length + 1` entries.** Off-by-one errors happen if you assume they're equal.
4. **`String.raw` and `strings.raw` give you unescaped text** — different from the default processed string. Confusing these is a common mistake when building anything regex or path related.
5. **Multi-line template literals preserve exact whitespace**, including indentation from your code formatting — this leaks into output unexpectedly in generated markup or emails.
6. **Template literals don't sanitize anything by default.** They make string building easy, which makes injection vulnerabilities (SQL, HTML/XSS) easier to write accidentally.
7. **`${}` only works inside backticks.** Regular quotes silently treat it as plain text — no error, just wrong output. Easy mistake when refactoring quickly.

---

## Mental Model

A template literal is **not** "a string with variables in it." It's syntax sugar for calling a function (the default behavior, or your custom tag function) with two things: the literal text chunks, and the evaluated expressions, in order.

```js
`Hello ${name}, age ${age}`

// is conceptually:
defaultTag(["Hello ", ", age ", ""], name, age)
```

Once you see it that way, multi-line preservation, escaping rules, and tagged templates stop being separate features and become consequences of one underlying mechanism: **split-and-substitute, with an optional interception point.**