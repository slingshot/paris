'use client';

import { useEditor } from '@tiptap/react';
import { useEffect, useMemo, useRef } from 'react';
import type { MarkdownEditorFeature } from './features';
import { ALL_FEATURES, buildExtensions } from './features';

export type UseMarkdownEditorOptions = {
    /** The markdown string value (controlled). */
    value: string;
    /** Fires with the updated markdown string on every edit. */
    onChange?: (value: string) => void;
    /** Whitelist of formatting features. Defaults to ALL_FEATURES. */
    features?: MarkdownEditorFeature[];
    /** Placeholder text when the editor is empty. */
    placeholder?: string;
    /** Whether the editor is editable. @default true */
    editable?: boolean;
    /** Whether to autofocus the editor on mount. @default false */
    autofocus?: boolean;
};

export function useMarkdownEditor({
    value,
    onChange,
    features = ALL_FEATURES,
    placeholder,
    editable = true,
    autofocus = false,
}: UseMarkdownEditorOptions) {
    const featureSet = useMemo(() => new Set(features), [features]);
    const extensions = useMemo(() => buildExtensions(featureSet, placeholder), [featureSet, placeholder]);

    // Track the last value we sent via onChange to prevent circular updates
    const lastOnChangeValue = useRef(value);

    const editor = useEditor({
        extensions,
        // Empty strings produce no DOM nodes with contentType: 'markdown',
        // which breaks the placeholder. Only use markdown parsing for non-empty content.
        content: value || undefined,
        contentType: value ? 'markdown' : undefined,
        editable,
        autofocus,
        immediatelyRender: false,
        onUpdate: ({ editor: ed }) => {
            const markdown = ed.getMarkdown();
            lastOnChangeValue.current = markdown;
            onChange?.(markdown);
        },
    });

    // Sync external value changes into the editor (controlled mode)
    useEffect(() => {
        if (!editor || editor.isDestroyed) return;

        // Skip if this value came from our own onChange
        if (value === lastOnChangeValue.current) return;

        const currentMarkdown = editor.getMarkdown();
        if (value !== currentMarkdown) {
            editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false });
            lastOnChangeValue.current = value;
        }
    }, [editor, value]);

    // Sync editable state
    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    return { editor, featureSet };
}
