import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FixedToolbar } from './FixedToolbar';
import { FloatingToolbar } from './FloatingToolbar';
import { MarkdownEditor } from './MarkdownEditor';

const meta: Meta<typeof MarkdownEditor> = {
    title: 'Content/MarkdownEditor',
    component: MarkdownEditor,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['paragraphLarge', 'paragraphMedium', 'paragraphSmall', 'paragraphXSmall', 'paragraphXXSmall'],
        },
        status: {
            control: 'select',
            options: ['default', 'error', 'success'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

const sampleMarkdown = `# Getting Started

This is a **WYSIWYG** markdown editor built on *Tiptap*.

## Features

- Bold, italic, and ~~strikethrough~~
- [Links](https://paris.slingshot.fm) and \`inline code\`
- Headings, blockquotes, and horizontal rules

> Blockquotes render with Paris styling.

### Task Lists

- [x] Set up Tiptap
- [x] Add markdown serialization
- [ ] Style with Paris tokens

\`\`\`typescript
const [md, setMd] = useState('');
\`\`\`

---

That's it! The editor outputs **markdown** on every change.`;

/**
 * Default editor with both FixedToolbar and FloatingToolbar.
 * All features enabled.
 */
export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState(sampleMarkdown);
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={value} onChange={setValue}>
                    <FixedToolbar />
                    <FloatingToolbar />
                </MarkdownEditor>
                <details style={{ marginTop: 16 }}>
                    <summary
                        style={{ cursor: 'pointer', fontSize: 12, color: 'var(--pte-new-colors-contentTertiary)' }}
                    >
                        Markdown output
                    </summary>
                    <pre
                        style={{
                            marginTop: 8,
                            padding: 12,
                            fontSize: 12,
                            background: 'var(--pte-new-colors-backgroundSecondary)',
                            borderRadius: 8,
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {value}
                    </pre>
                </details>
            </div>
        );
    },
    args: {
        placeholder: 'Start writing...',
    },
};

/**
 * Editor with only the FloatingToolbar (appears on text selection).
 * Clean editing surface without a fixed toolbar.
 */
export const FloatingOnly: Story = {
    render: (args) => {
        const [value, setValue] = useState('Select some text to see the floating toolbar.');
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={value} onChange={setValue}>
                    <FloatingToolbar />
                </MarkdownEditor>
            </div>
        );
    },
    args: {
        placeholder: 'Start writing...',
    },
};

/**
 * Editor with only the FixedToolbar.
 */
export const FixedOnly: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={value} onChange={setValue}>
                    <FixedToolbar />
                </MarkdownEditor>
            </div>
        );
    },
    args: {
        placeholder: 'Start writing...',
    },
};

/**
 * Editor with a limited feature set — only bold, italic, heading, and link.
 * Toolbar only shows buttons for enabled features.
 */
export const LimitedFeatures: Story = {
    render: (args) => {
        const [value, setValue] = useState('Only **bold**, *italic*, headings, and links are available.');
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={value} onChange={setValue}>
                    <FixedToolbar />
                    <FloatingToolbar />
                </MarkdownEditor>
            </div>
        );
    },
    args: {
        features: ['bold', 'italic', 'heading', 'link'],
        placeholder: 'Limited formatting...',
    },
};

/**
 * Read-only editor with pre-filled content.
 * The editor is not editable — useful for preview modes.
 */
export const ReadOnly: Story = {
    render: (args) => {
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={sampleMarkdown} editable={false} />
            </div>
        );
    },
};

/**
 * Editor with error status — shows error border styling.
 */
export const ErrorStatus: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={value} onChange={setValue} status="error">
                    <FixedToolbar />
                </MarkdownEditor>
            </div>
        );
    },
    args: {
        placeholder: 'This field has an error...',
    },
};

/**
 * Editor with no toolbar — users rely on keyboard shortcuts and
 * markdown input rules (e.g., type `## ` for heading 2).
 */
export const NoToolbar: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={value} onChange={setValue} />
            </div>
        );
    },
    args: {
        placeholder: 'Type markdown shortcuts: # heading, **bold**, - list item...',
    },
};

/**
 * Editor with custom placeholder text.
 */
export const WithPlaceholder: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        return (
            <div style={{ maxWidth: 700 }}>
                <MarkdownEditor {...args} value={value} onChange={setValue}>
                    <FixedToolbar />
                </MarkdownEditor>
            </div>
        );
    },
    args: {
        placeholder: 'Write your thoughts here...',
        size: 'paragraphMedium',
    },
};
