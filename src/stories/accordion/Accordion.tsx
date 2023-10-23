import type { FC, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import clsx from 'clsx';
import styles from './Accordion.module.scss';
import { TextWhenString } from '../utility';

export type AccordionProps = {
    /** The title of the Accordion. */
    title?: ReactNode;
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
    children,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={styles.container}
        >
            <div
                className={clsx(styles.title, open && styles.open)}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen((o) => !o);
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
                <div className={styles.plusIcon}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        className={clsx(open && styles.open)}
                    />
                </div>
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
                        <div className={styles.dropdownContent}>
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
