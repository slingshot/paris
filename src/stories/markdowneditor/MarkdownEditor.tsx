'use client';

import { EditorContent } from '@tiptap/react';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { useMemo } from 'react';
import type { MarkdownSize } from '../markdown';
import type { MarkdownEditorFeature } from './features';
import { ALL_FEATURES } from './features';
import styles from './MarkdownEditor.module.scss';
import type { ImageUploadHandler } from './MarkdownEditorContext';
import { MarkdownEditorContext } from './MarkdownEditorContext';
import { useMarkdownEditor } from './useMarkdownEditor';

export type MarkdownEditorProps = {
    /** The markdown string value (controlled). */
    value: string;
    /** Fires with the updated markdown string on every edit. */
    onChange?: (value: string) => void;
    /** Whitelist of formatting features to enable. Defaults to all features. */
    features?: MarkdownEditorFeature[];
    /** Placeholder text shown when the editor is empty. */
    placeholder?: string;
    /**
     * Base text size for body content, matching the Markdown component's size prop.
     * @default 'paragraphSmall'
     */
    size?: MarkdownSize;
    /** Whether the editor is editable. @default true */
    editable?: boolean;
    /** Whether to autofocus the editor on mount. @default false */
    autofocus?: boolean;
    /** An optional CSS class name for the root wrapper. */
    className?: string;
    /**
     * Handler for image uploads. Receives a File, should return a Promise
     * resolving to the image URL. If not provided, the image button is hidden.
     */
    handleImageUpload?: ImageUploadHandler;
    /** Visual status for the editor container (follows Input pattern). */
    status?: 'default' | 'error' | 'success';
    /** Prop overrides for sub-elements. */
    overrides?: {
        root?: ComponentPropsWithoutRef<'div'>;
        editorContainer?: ComponentPropsWithoutRef<'div'>;
    };
    /**
     * Children are placed inside the context provider, before the editor content.
     * This is where toolbar components should be placed.
     */
    children?: ReactNode;
};

/**
 * A WYSIWYG markdown editor built on Tiptap, styled with Paris design tokens.
 * It pairs with the read-only `<Markdown>` component as its write counterpart.
 *
 * The editor uses a compound component pattern — toolbar components are passed
 * as children and communicate with the editor via React context.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```tsx
 * import { MarkdownEditor, FixedToolbar, FloatingToolbar } from 'paris/markdowneditor';
 *
 * export const Example: FC = () => {
 *     const [md, setMd] = useState('');
 *     return (
 *         <MarkdownEditor value={md} onChange={setMd} placeholder="Start writing...">
 *             <FixedToolbar />
 *             <FloatingToolbar />
 *         </MarkdownEditor>
 *     );
 * };
 * ```
 *
 * @constructor
 */
export const MarkdownEditor: FC<MarkdownEditorProps> = ({
    value,
    onChange,
    features = ALL_FEATURES,
    placeholder,
    size = 'paragraphSmall',
    editable = true,
    autofocus = false,
    handleImageUpload,
    className,
    status = 'default',
    overrides,
    children,
}) => {
    const { editor, featureSet } = useMarkdownEditor({
        value,
        onChange,
        features,
        placeholder,
        editable,
        autofocus,
    });

    const contextValue = useMemo(
        () => ({ editor, features: featureSet, handleImageUpload }),
        [editor, featureSet, handleImageUpload],
    );

    return (
        <MarkdownEditorContext.Provider value={contextValue}>
            <div {...overrides?.root} className={clsx(styles.root, className, overrides?.root?.className)}>
                <div
                    {...overrides?.editorContainer}
                    className={clsx(styles.editorContainer, overrides?.editorContainer?.className)}
                    data-status={status}
                    data-disabled={!editable}
                >
                    {children}
                    <div
                        className={styles.editorContent}
                        style={
                            {
                                '--markdown-base-font-size': `var(--pte-new-typography-styles-${size}-fontSize)`,
                            } as React.CSSProperties
                        }
                    >
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>
        </MarkdownEditorContext.Provider>
    );
};
