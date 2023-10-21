'use client';

import type { CSSProperties, FC, ReactNode } from 'react';
import { Tab } from '@headlessui/react';
import { useId, useState } from 'react';
import clsx from 'clsx';
import type { CSSLength } from '@ssh/csstypes';
import { motion } from 'framer-motion';
import styles from './Tabs.module.scss';
import typography from '../text/Typography.module.css';
import { easeInOutExpo } from '../utility';
import { theme } from '../theme';

export type TabsProps = {
    /**
     * The tabs to render.
     */
    tabs: {
        /** The title of the tab. */
        title: string;
        /** The content of the tab. */
        content: ReactNode;
    }[];
    /**
     * The width of each tab. Defaults to `150px`.
     */
    tabWidth?: CSSLength;
    /**
     * Stylistic alternates for the tabs. `fixed` will rely on the `tabWidth` prop and default to 150px; `compact` will use an alternate intrinsically-sized style that ignores the `tabWidth` prop; `auto` will use fixed style on larger screens and switch to compact style on smaller screens (below 640px, the default Paris theme's medium breakpoint).
     * @default auto
     */
    kind?: 'fixed' | 'compact' | 'auto';
    /**
     * The default index of the tab to render. Defaults to `0`.
     */
    defaultIndex?: number;
    /**
     * An optional handler for tab changes.
     * @param index - The index of the tab that was selected.
     */
    onTabChange?: (index: number) => void | Promise<void>;
};

/**
 * A Tabs component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Tabs } from 'paris/tabs';
 * ```
 * @constructor
 */
export const Tabs: FC<TabsProps> = ({
    tabs,
    tabWidth = '150px',
    kind = 'auto',
    defaultIndex = 0,
    onTabChange,
}) => {
    const id = useId();
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

    return (
        <Tab.Group
            as="div"
            selectedIndex={selectedIndex}
            onChange={(i) => {
                setSelectedIndex(i);
                if (onTabChange) {
                    onTabChange?.(i);
                }
            }}
        >
            <Tab.List
                style={{
                    '--tab-width': tabWidth,
                    '--tab-index': `${selectedIndex}`,
                } as CSSProperties}
                className={clsx(
                    styles.tabList,
                )}
            >
                {tabs.map(({ title }, index) => (
                    <Tab
                        key={`${id}-tab-${title}`}
                        className={clsx(
                            typography.paragraphXSmall,
                            styles.tab,
                            styles[kind],
                        )}
                    >
                        {title}
                        {index === selectedIndex && (
                            <motion.div
                                key={`${id}-tab-active-border`}
                                className={styles.activeTabUnderline}
                                layoutId={`${id}-tab-active-border`}
                                transition={{
                                    ease: easeInOutExpo,
                                }}
                            />
                        )}
                    </Tab>
                ))}

                {/* <div key={`${id}-tab-active-border`} className={styles.activeTabBorder} /> */}
            </Tab.List>
            <div className={styles.tabListBorder} />

            <Tab.Panels>
                {tabs.map(({ title, content }) => (
                    <Tab.Panel
                        key={`${id}-tab-${title}-content`}
                        className={styles.panel}
                    >
                        {content}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
};
