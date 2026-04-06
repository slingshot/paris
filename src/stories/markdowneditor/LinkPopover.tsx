'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './LinkPopover.module.scss';
import { useMarkdownEditorContext } from './MarkdownEditorContext';

export type LinkPopoverProps = {
    /** Callback when the popover should close. */
    onClose: () => void;
};

/**
 * An inline popover for inserting/editing links.
 * Reads the current link state from the editor and allows
 * setting href and target attributes.
 */
export const LinkPopover: FC<LinkPopoverProps> = ({ onClose }) => {
    const { editor } = useMarkdownEditorContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Read existing link attributes if cursor is on a link
    const existingHref = editor?.getAttributes('link')?.href ?? '';
    const existingTarget = editor?.getAttributes('link')?.target ?? '_blank';

    const [url, setUrl] = useState(existingHref);
    const [openInNewTab, setOpenInNewTab] = useState(existingTarget === '_blank');

    // Focus the input on mount
    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        // Use requestAnimationFrame to skip the current event that triggered the popover
        const raf = requestAnimationFrame(() => {
            document.addEventListener('mousedown', handleClickOutside);
        });
        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                editor?.chain().focus().run();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose, editor]);

    const handleApply = useCallback(() => {
        if (!editor) return;

        if (!url) {
            editor.chain().focus().unsetLink().run();
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({
                    href: url,
                    target: openInNewTab ? '_blank' : null,
                })
                .run();
        }
        onClose();
    }, [editor, url, openInNewTab, onClose]);

    const handleRemove = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().unsetLink().run();
        onClose();
    }, [editor, onClose]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleApply();
            }
        },
        [handleApply],
    );

    return (
        <div ref={popoverRef} className={styles.popover}>
            <div className={styles.label}>Link URL</div>
            <div className={styles.inputRow}>
                <input
                    ref={inputRef}
                    type="url"
                    className={styles.input}
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    type="button"
                    className={styles.applyButton}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleApply}
                >
                    Apply
                </button>
            </div>
            <div className={styles.footer}>
                <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={openInNewTab} onChange={(e) => setOpenInNewTab(e.target.checked)} />
                    Open in new tab
                </label>
                {existingHref && (
                    <button type="button" className={styles.removeButton} onClick={handleRemove}>
                        Remove link
                    </button>
                )}
            </div>
        </div>
    );
};
