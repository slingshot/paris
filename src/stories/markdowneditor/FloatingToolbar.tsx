'use client';

import { BubbleMenu } from '@tiptap/react/menus';
import { clsx } from 'clsx';
import { Bold, Code, Italic, Link, Strikethrough } from 'lucide-react';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { Fragment, useState } from 'react';
import styles from './FloatingToolbar.module.scss';
import { LinkPopover } from './LinkPopover';
import { useMarkdownEditorContext } from './MarkdownEditorContext';
import { ToolbarButton } from './ToolbarButton';

export type FloatingToolbarProps = {
    /** An optional CSS class name. */
    className?: string;
    /** Prop overrides for sub-elements. */
    overrides?: {
        root?: ComponentPropsWithoutRef<'div'>;
    };
};

const ICON_SIZE = 14;

/**
 * A floating toolbar that appears when text is selected.
 * Shows inline formatting options: bold, italic, strikethrough, code, link.
 * Wraps Tiptap's BubbleMenu component.
 */
export const FloatingToolbar: FC<FloatingToolbarProps> = ({ className, overrides }) => {
    const { editor, features } = useMarkdownEditorContext();
    const [showLinkPopover, setShowLinkPopover] = useState(false);

    if (!editor) return null;

    const items = [
        {
            feature: 'bold' as const,
            label: <Bold size={ICON_SIZE} />,
            tooltip: 'Bold (⌘B)',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            feature: 'italic' as const,
            label: <Italic size={ICON_SIZE} />,
            tooltip: 'Italic (⌘I)',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            feature: 'strikethrough' as const,
            label: <Strikethrough size={ICON_SIZE} />,
            tooltip: 'Strikethrough (⌘⇧X)',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            feature: 'code' as const,
            label: <Code size={ICON_SIZE} />,
            tooltip: 'Inline code (⌘E)',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        {
            feature: 'link' as const,
            label: <Link size={ICON_SIZE} />,
            tooltip: 'Link',
            action: () => setShowLinkPopover((prev) => !prev),
            isActive: () => editor.isActive('link'),
        },
    ];

    const visibleItems = items.filter((item) => features.has(item.feature));

    if (visibleItems.length === 0) return null;

    return (
        <BubbleMenu editor={editor} options={{ placement: 'top', offset: 8 }}>
            <div {...overrides?.root} className={clsx(styles.toolbar, className, overrides?.root?.className)}>
                {visibleItems.map((item, index) => (
                    <Fragment key={item.feature}>
                        {index > 0 && item.feature === 'link' && (
                            <div className={styles.separator} aria-hidden="true" />
                        )}
                        <ToolbarButton isActive={item.isActive()} onAction={item.action} tooltip={item.tooltip}>
                            {item.label}
                        </ToolbarButton>
                    </Fragment>
                ))}
                {showLinkPopover && features.has('link') && <LinkPopover onClose={() => setShowLinkPopover(false)} />}
            </div>
        </BubbleMenu>
    );
};
