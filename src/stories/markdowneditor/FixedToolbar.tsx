'use client';

import { clsx } from 'clsx';
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Image,
    Italic,
    Link,
    List,
    ListChecks,
    ListOrdered,
    Minus,
    Quote,
    SquareCode,
    Strikethrough,
    Table,
} from 'lucide-react';
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { Fragment, useCallback, useState } from 'react';
import styles from './FixedToolbar.module.scss';
import type { MarkdownEditorFeature } from './features';
import { LinkPopover } from './LinkPopover';
import { useMarkdownEditorContext } from './MarkdownEditorContext';
import { ToolbarButton } from './ToolbarButton';

export type FixedToolbarProps = {
    /** An optional CSS class name. */
    className?: string;
    /** Prop overrides for sub-elements. */
    overrides?: {
        root?: ComponentPropsWithoutRef<'div'>;
        group?: ComponentPropsWithoutRef<'div'>;
        separator?: ComponentPropsWithoutRef<'div'>;
    };
};

type ToolbarItem = {
    feature: MarkdownEditorFeature;
    label: ReactNode;
    tooltip: string;
    action: () => void;
    isActive: () => boolean;
};

const ICON_SIZE = 14;

/**
 * A fixed toolbar that renders above the editor content.
 * Reads the editor instance and enabled features from MarkdownEditorContext.
 *
 * Renders button groups: Inline marks | Blocks | Lists | Inserts.
 * Groups with no enabled features are hidden.
 */
export const FixedToolbar: FC<FixedToolbarProps> = ({ className, overrides }) => {
    const { editor, features } = useMarkdownEditorContext();
    const [showLinkPopover, setShowLinkPopover] = useState(false);

    const handleLinkClick = useCallback(() => {
        setShowLinkPopover((prev) => !prev);
    }, []);

    if (!editor) return null;

    const inlineMarks: ToolbarItem[] = [
        {
            feature: 'bold',
            label: <Bold size={ICON_SIZE} />,
            tooltip: 'Bold (⌘B)',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            feature: 'italic',
            label: <Italic size={ICON_SIZE} />,
            tooltip: 'Italic (⌘I)',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            feature: 'strikethrough',
            label: <Strikethrough size={ICON_SIZE} />,
            tooltip: 'Strikethrough (⌘⇧X)',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            feature: 'code',
            label: <Code size={ICON_SIZE} />,
            tooltip: 'Inline code (⌘E)',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
    ];

    const blocks: ToolbarItem[] = [
        {
            feature: 'heading',
            label: <Heading1 size={ICON_SIZE} />,
            tooltip: 'Heading 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            feature: 'heading',
            label: <Heading2 size={ICON_SIZE} />,
            tooltip: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            feature: 'heading',
            label: <Heading3 size={ICON_SIZE} />,
            tooltip: 'Heading 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            feature: 'blockquote',
            label: <Quote size={ICON_SIZE} />,
            tooltip: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            feature: 'horizontalRule',
            label: <Minus size={ICON_SIZE} />,
            tooltip: 'Horizontal rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
            isActive: () => false,
        },
    ];

    const lists: ToolbarItem[] = [
        {
            feature: 'bulletList',
            label: <List size={ICON_SIZE} />,
            tooltip: 'Bullet list (⌘⇧8)',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            feature: 'orderedList',
            label: <ListOrdered size={ICON_SIZE} />,
            tooltip: 'Ordered list (⌘⇧7)',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            feature: 'taskList',
            label: <ListChecks size={ICON_SIZE} />,
            tooltip: 'Task list',
            action: () => editor.chain().focus().toggleTaskList().run(),
            isActive: () => editor.isActive('taskList'),
        },
    ];

    const inserts: ToolbarItem[] = [
        {
            feature: 'link',
            label: <Link size={ICON_SIZE} />,
            tooltip: 'Link',
            action: handleLinkClick,
            isActive: () => editor.isActive('link'),
        },
        {
            feature: 'image',
            label: <Image size={ICON_SIZE} />,
            tooltip: 'Image',
            action: () => {
                const url = window.prompt('Image URL');
                if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            },
            isActive: () => false,
        },
        {
            feature: 'table',
            label: <Table size={ICON_SIZE} />,
            tooltip: 'Insert table',
            action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
            isActive: () => false,
        },
        {
            feature: 'codeBlock',
            label: <SquareCode size={ICON_SIZE} />,
            tooltip: 'Code block',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor.isActive('codeBlock'),
        },
    ];

    const groupEntries = [
        { name: 'inline', items: inlineMarks },
        { name: 'blocks', items: blocks },
        { name: 'lists', items: lists },
        { name: 'inserts', items: inserts },
    ];

    // Filter each group to only include items whose feature is enabled
    const filteredGroups = groupEntries
        .map((g) => ({ name: g.name, items: g.items.filter((item) => features.has(item.feature)) }))
        .filter((g) => g.items.length > 0);

    if (filteredGroups.length === 0) return null;

    return (
        <div
            role="toolbar"
            aria-label="Formatting options"
            {...overrides?.root}
            className={clsx(styles.toolbar, className, overrides?.root?.className)}
        >
            {filteredGroups.map((group, groupIndex) => (
                <Fragment key={group.name}>
                    {groupIndex > 0 && (
                        <div
                            {...overrides?.separator}
                            className={clsx(styles.separator, overrides?.separator?.className)}
                            aria-hidden="true"
                        />
                    )}
                    <div {...overrides?.group} className={clsx(styles.group, overrides?.group?.className)}>
                        {group.items.map((item) => (
                            <ToolbarButton
                                key={item.tooltip}
                                isActive={item.isActive()}
                                onAction={item.action}
                                tooltip={item.tooltip}
                            >
                                {item.label}
                            </ToolbarButton>
                        ))}
                    </div>
                </Fragment>
            ))}
            {showLinkPopover && features.has('link') && <LinkPopover onClose={() => setShowLinkPopover(false)} />}
        </div>
    );
};
