import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Markdown } from './Markdown';

const meta: Meta<typeof Markdown> = {
    title: 'Content/Markdown',
    component: Markdown,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['paragraphLarge', 'paragraphMedium', 'paragraphSmall', 'paragraphXSmall', 'paragraphXXSmall'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Default: Story = {
    args: {
        children: `# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough~~.

Here is a [link to Paris](https://paris.slingshot.fm) and some \`inline code\`.

---

> This is a blockquote. It can contain **bold** and *italic* text.

- Unordered list item 1
- Unordered list item 2
  - Nested item A
  - Nested item B
    - Deeply nested item
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item
   2. Another nested item
3. Ordered list item 3`,
    },
};

export const CodeBlocks: Story = {
    args: {
        children: `## Code Examples

Inline code: \`const x = 42;\`

\`\`\`typescript
interface User {
    id: string;
    name: string;
    email: string;
}

function getUser(id: string): Promise<User> {
    return fetch(\`/api/users/\${id}\`).then(res => res.json());
}
\`\`\`

\`\`\`css
.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
}
\`\`\`

\`\`\`bash
bun install paris
bun run storybook
\`\`\``,
    },
};

export const Tables: Story = {
    args: {
        children: `## Table Example

| Component | Description | Status |
|-----------|-------------|--------|
| Text | Typography rendering | Stable |
| Button | Interactive button | Stable |
| Markdown | Markdown renderer | New |
| Dialog | Modal dialog | Stable |

## Alignment

| Left | Center | Right |
|:-----|:------:|------:|
| A | B | C |
| D | E | F |`,
    },
};

export const RichContent: Story = {
    args: {
        children: `## Task Lists

- [x] Design Markdown component
- [x] Implement parser with react-markdown
- [ ] Add syntax highlighting
- [ ] Write documentation

## Blockquotes

> **Note:** This is an important callout rendered using the Paris Callout component.

> Nested blockquotes work too.
>
> > This is a nested blockquote.

## Horizontal Rule

Content above the rule.

---

Content below the rule.

## Images

![Placeholder](https://placehold.co/600x200/1a1a2e/e0e0e0?text=Paris+Design+System)`,
    },
};

export const HTMLPassthrough: Story = {
    args: {
        children: `## Keyboard Shortcuts

Press <kbd>Cmd</kbd> + <kbd>K</kbd> to open the command palette.

## Highlighted Text

This is <mark>highlighted text</mark> within a paragraph.

## Superscript and Subscript

E = mc<sup>2</sup> and H<sub>2</sub>O

## Details / Summary

<details>
<summary>Click to expand</summary>

This content is hidden by default and rendered inside a Paris Accordion component.

- Item one
- Item two
- Item three

</details>

## Definition Lists

<dl>
<dt>Paris</dt>
<dd>Slingshot's React design system</dd>
<dt>PTE</dt>
<dd>Property Token Engine — generates CSS variables from TypeScript theme definitions</dd>
</dl>`,
    },
};

const sampleMarkdown = `## The Markdown Component

This is a paragraph demonstrating the **size** prop. It controls the base font size for all body text — paragraphs, list items, bold, italic, and definition list terms.

- List items follow the base size
- So do **bold** and *italic* inline text
- Headings and labels are unaffected

> Blockquote content also inherits the base size.

Here is some \`inline code\` within a paragraph.`;

export const Large: Story = {
    args: {
        size: 'paragraphLarge',
        children: sampleMarkdown,
    },
};

export const Small: Story = {
    args: {
        size: 'paragraphSmall',
        children: sampleMarkdown,
    },
};
