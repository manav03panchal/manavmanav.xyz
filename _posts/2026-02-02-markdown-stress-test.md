---
layout: post
title: "Markdown Stress Test"
date: 2026-02-02 00:00:00 -0700
tags: [test, markdown]
---

A comprehensive test of all markdown features.

## Headings

### Level 3 Heading
#### Level 4 Heading
##### Level 5 Heading

## Text Formatting

Regular text. **Bold text**. *Italic text*. ***Bold and italic***. ~~Strikethrough~~. `inline code`.

## Links

[External link](https://example.com)

[Link with title](https://example.com "Example Site")

## Lists

Unordered:
- Item one
- Item two
  - Nested item
  - Another nested
    - Deep nesting
- Item three

Ordered:
1. First
2. Second
   1. Nested numbered
   2. Another
3. Third

## Task List

- [x] Completed task
- [ ] Incomplete task
- [ ] Another todo

## Blockquotes

> Single line quote.

> Multi-line blockquote.
>
> With multiple paragraphs.
>
> > And nested quotes.

## Code

Inline: `const x = 42;`

Block with syntax highlighting:

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
```

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

```rust
fn main() {
    let mut vec = vec![1, 2, 3];
    vec.push(4);
    println!("{:?}", vec);
}
```

## Tables

| Name | Type | Description |
|------|------|-------------|
| `id` | int | Primary key |
| `name` | string | User's name |
| `active` | bool | Account status |

Right-aligned:

| Item | Price |
|------|------:|
| Coffee | $4.00 |
| Tea | $3.00 |
| Milk | $2.50 |

## Horizontal Rule

---

## Images

![Placeholder](https://via.placeholder.com/600x200/111/eee?text=Sample+Image)

## Definition List

Term 1
: Definition for term 1.

Term 2
: Definition for term 2.
: Can have multiple definitions.

## Keyboard Shortcuts

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

Use <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> for command palette.

## Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium

## Footnotes

Here's a sentence with a footnote[^1].

Another statement requiring citation[^2].

[^1]: This is the first footnote.
[^2]: This is the second footnote with more detail.

## Collapsible Section

<details markdown="1">
<summary>Click to expand</summary>

Hidden content here.

- Can contain lists
- And other markdown

</details>

## Mermaid Diagram

<pre class="mermaid">
graph LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
</pre>

## Long Code Block (Scroll Test)

```javascript
// A longer code block to test horizontal scrolling
const veryLongVariableName = "This is a very long string that should cause horizontal scrolling in the code block";

function anotherFunctionWithAVeryLongNameThatMightCauseScrolling(parameterOne, parameterTwo, parameterThree) {
    return parameterOne + parameterTwo + parameterThree;
}
```

## Inline HTML

<mark>Highlighted text</mark>

<abbr title="Application Programming Interface">API</abbr>

## End

That covers most markdown features.
