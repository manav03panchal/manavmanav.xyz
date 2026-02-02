---
title: "Markdown Stress Test"
date: 2026-02-02
description: "A comprehensive test of all markdown features"
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

## Keyboard Shortcuts

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

Use <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> for command palette.

## Collapsible Section

<details>
<summary>Click to expand</summary>

Hidden content here.

- Can contain lists
- And other markdown

</details>

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

## End

That covers most markdown features.
