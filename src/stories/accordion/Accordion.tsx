import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './Accordion.module.scss';
import { TextWhenString } from '../utility';
import { ChevronRight, Icon } from '../icon';

export type AccordionProps = {
    /** The title of the Accordion. */
    title?: ReactNode;
    /**
     * The style of the Accordion.
     * @default default
     */
    kind?: 'default' | 'card';
    /**
     * The size of the Accordion. Only affects kind="card".
     * @default small
     */
    size?: 'small' | 'large';
    /** Whether the Accordion is open. If provided, the Accordion will be a controlled component. */
    isOpen?: boolean;
    /** A handler for when the Accordion state changes. */
    onOpenChange?: (open: boolean) => void | Promise<void>;
    /** The collapsible contents of the Accordion. */
    children?: ReactNode;
};

/**
 * A Accordion component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Accordion } from 'paris/accordion';
 * ```
 * @constructor
 */
export const Accordion: FC<AccordionProps> = ({
    title,
    kind = 'default',
    size = 'small',
    isOpen,
    onOpenChange,
    children,
}) => {
    const [open, setOpen] = useState(isOpen ?? false);

    return (
        <div
            className={clsx(styles[kind], open && styles.open)}
        >
            <div
                className={clsx(styles.title, styles[size], open && styles.open)}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((o) => !o);
                        onOpenChange?.(!open);
                    }
                }}
                role="button"
                tabIndex={0}
            >
                <div>
                    <TextWhenString kind="paragraphSmall" weight="medium">
                        {title}
                    </TextWhenString>
                </div>
                {kind === 'default' && (
                    <div className={styles.plusIcon}>
                        <FontAwesomeIcon
                            icon={faPlus}
                            className={clsx(open && styles.open)}
                        />
                    </div>
                )}
                {kind === 'card' && (
                    <Icon
                        icon={ChevronRight}
                        size={16}
                        className={clsx(styles.chevron, open && styles.open)}
                    />
                )}
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className={styles.dropdown}
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto', y: 0 },
                            collapsed: { opacity: 0, height: 0, y: -10 },
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.87, 0, 0.13, 1],
                        }}
                    >
                        <div className={clsx(styles.dropdownContent, styles[size])}>
                            <TextWhenString kind="paragraphXSmall">
                                {children}
                            </TextWhenString>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
