'use client';

import type { Editor } from '@tiptap/react';
import { createContext, useContext } from 'react';
import type { MarkdownEditorFeature } from './features';

export type MarkdownEditorContextValue = {
    editor: Editor | null;
    features: Set<MarkdownEditorFeature>;
};

export const MarkdownEditorContext = createContext<MarkdownEditorContextValue>({
    editor: null,
    features: new Set(),
});

export const useMarkdownEditorContext = () => useContext(MarkdownEditorContext);
