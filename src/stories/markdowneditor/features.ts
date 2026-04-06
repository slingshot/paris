import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Markdown } from '@tiptap/markdown';
import type { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const FEATURES = [
    'bold',
    'italic',
    'strikethrough',
    'heading',
    'blockquote',
    'horizontalRule',
    'bulletList',
    'orderedList',
    'taskList',
    'codeBlock',
    'code',
    'link',
    'image',
    'table',
] as const;

export type MarkdownEditorFeature = (typeof FEATURES)[number];

export const ALL_FEATURES: MarkdownEditorFeature[] = [...FEATURES];

/**
 * Builds the Tiptap extensions array based on enabled features.
 * Always includes: Document, Paragraph, Text, History, Markdown, Placeholder.
 * Conditionally includes StarterKit sub-extensions and standalone extensions.
 */
export function buildExtensions(features: Set<MarkdownEditorFeature>, placeholder?: string): Extensions {
    const extensions: Extensions = [
        StarterKit.configure({
            bold: features.has('bold') ? {} : false,
            italic: features.has('italic') ? {} : false,
            strike: features.has('strikethrough') ? {} : false,
            heading: features.has('heading') ? { levels: [1, 2, 3, 4, 5, 6] } : false,
            blockquote: features.has('blockquote') ? {} : false,
            horizontalRule: features.has('horizontalRule') ? {} : false,
            bulletList: features.has('bulletList') ? {} : false,
            orderedList: features.has('orderedList') ? {} : false,
            listItem: features.has('bulletList') || features.has('orderedList') ? {} : false,
            codeBlock: features.has('codeBlock') ? {} : false,
            code: features.has('code') ? {} : false,
        }),
        Markdown,
        Placeholder.configure({
            placeholder: placeholder ?? '',
            showOnlyCurrent: false,
        }),
    ];

    if (features.has('taskList')) {
        extensions.push(TaskList);
        extensions.push(TaskItem.configure({ nested: true }));
    }

    if (features.has('table')) {
        extensions.push(Table.configure({ resizable: false }));
        extensions.push(TableRow);
        extensions.push(TableCell);
        extensions.push(TableHeader);
    }

    if (features.has('link')) {
        extensions.push(
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
        );
    }

    if (features.has('image')) {
        extensions.push(
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
        );
    }

    return extensions;
}
