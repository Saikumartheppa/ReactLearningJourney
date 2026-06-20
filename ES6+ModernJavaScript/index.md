# JavaScript Modern Syntax — Revision Index

A topic-wise deep dive series covering modern JS syntax with an interview-prep lens. Each file is self-contained but cross-references related topics where the concepts connect.

| # | File | Topic |
|---|------|-------|
| 01 | `01-destructuring.md` | Object + Array Destructuring |
| 02 | `02-rest-operator.md` | Rest Operator (`...`) |
| 03 | `03-spread-operator.md` | Spread Operator (`...`) |
| 04 | `04-default-parameters.md` | Default Parameters |
| 05 | `05-template-literals.md` | Template Literals & Tagged Templates |
| 06 | `06-optional-chaining.md` | Optional Chaining (`?.`) |
| 07 | `07-nullish-coalescing.md` | Nullish Coalescing (`??`) |
| 08 | `08-logical-assignment-operators.md` | Logical Assignment Operators (`||=`, `&&=`, `??=`) |
| 09 | `09-object-shorthand.md` | Object Shorthand (property + method) |
| 10 | `10-dynamic-keys.md` | Dynamic / Computed Property Keys |
| 11 | `11-modules.md` | ES Modules (import/export) — React foundation |

## Suggested Revision Order

The topics build on each other in this sequence:

1. **Destructuring** → foundation for everything else
2. **Rest** → the collecting half of `...`
3. **Spread** → the expanding half of `...` (contrast directly with Rest)
4. **Default Parameters** → same "only undefined triggers it" rule as destructuring defaults
5. **Template Literals** → independent topic, but tagged templates connect to real libraries (styled-components)
6. **Optional Chaining** → safe reads
7. **Nullish Coalescing** → pairs directly with Optional Chaining
8. **Logical Assignment Operators** → builds directly on `??` from topic 7
9. **Object Shorthand** → independent, but sets up topic 10
10. **Dynamic Keys** → deep dive on the computed-key mention from topic 9
11. **Modules** → the big one for React; independent of 1-10 but everything you write in React uses this

## How To Use This For Revision

- Each file has: core concept → progressively deeper edge cases → interview Q&A → a "things people get wrong" checklist → one mental model paragraph at the end.
- Before an interview, the fastest pass is: read only the **"Things People Get Wrong"** sections and the **Mental Model** paragraphs across all 11 files first. That's the compressed version.
- Then go back through the **Interview Questions** sections and try answering before reading the answer.
- The full explanations are for when a checklist item doesn't make sense and you need the reasoning back.V