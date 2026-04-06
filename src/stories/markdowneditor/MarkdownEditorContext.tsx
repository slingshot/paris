'use client';

import type { Editor } from '@tiptap/react';
import { createContext, useContext } from 'react';
import type { MarkdownEditorFeature } from './features';

export type ImageUploadHandler = (file: File) => Promise<string>;

export type MarkdownEditorContextValue = {
    editor: Editor | null;
    features: Set<MarkdownEditorFeature>;
    handleImageUpload?: ImageUploadHandler;
};

export const MarkdownEditorContext = createContext<MarkdownEditorContextValue>({
    editor: null,
    features: new Set(),
});

export const useMarkdownEditorContext = () => useContext(MarkdownEditorContext);
