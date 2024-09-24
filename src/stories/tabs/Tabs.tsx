'use client';

import type { CSSProperties, FC, ReactNode } from 'react';
import { useId, useState } from 'react';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import type { CSSLength } from '@ssh/csstypes';
import { motion } from 'framer-motion';
import styles from './Tabs.module.scss';
import typography from '../text/Typography.module.css';
import { easeInOutExpo } from '../utility';

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
     * Stylistic alternates for the tabs.
     * `fixed` will rely on the `tabWidth` prop and default to 150px;
     * `compact` will use an alternate intrinsically-sized style that ignores the `tabWidth` prop;
     * `auto` will use fixed style on larger screens and switch to compact style on smaller screens (below 640px, the default Paris theme's medium breakpoint).
     * `full` will use a full-width style that ignores the `tabWidth` prop, with a taller height as well
     * @default auto
     */
    kind?: 'fixed' | 'compact' | 'auto' | 'full';
    /**
     * The thickness of the bottom bar. Defaults to `thick`.
     */
    barStyle?: 'thick' | 'thin';
    /**
     * The background style, with `default` being transparent and `glass` being a glassmorphism effect. Defaults to `default`.
     */
    backgroundStyle?: 'default' | 'glass';
    /**
     * The default index of the tab to render. Defaults to `0`.
     */
    defaultIndex?: number;
    /**
     * Pass in a controlled index to control the selected tab.
     */
    index?: number;
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
    barStyle = 'thick',
    backgroundStyle = 'default',
    defaultIndex = 0,
    index,
    onTabChange,
}) => {
    const id = useId();
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

    return (
        <Tab.Group
            as="div"
            selectedIndex={index ?? selectedIndex}
            onChange={(i) => {
                setSelectedIndex(i);
                if (onTabChange) {
                    onTabChange?.(i);
                }
            }}
            className={clsx(styles.tabGroup, styles[backgroundStyle])}
        >
            <div className={clsx(styles.tabBackground, styles[backgroundStyle])}>
                {backgroundStyle === 'glass' && (
                    <div className={styles.glassContainer}>
                        <div className={styles.glassOpacity} />
                        <div className={styles.glassBlend} />
                    </div>
                )}
                <Tab.List
                    style={{
                        '--tab-width': tabWidth,
                        '--tab-index': `${index ?? selectedIndex}`,
                    } as CSSProperties}
                    className={clsx(
                        styles.tabList,
                        styles[barStyle],
                        styles[backgroundStyle],
                    )}
                >
                    {tabs.map(({ title }, i) => (
                        <Tab
                            key={`${id}-tab-${title}`}
                            className={clsx(
                                typography.paragraphXSmall,
                                styles.tab,
                                styles[kind],
                            )}
                        >
                            {title}
                            {i === (index ?? selectedIndex) && (
                                <motion.div
                                    key={`${id}-tab-active-border`}
                                    className={clsx(styles.activeTabUnderline, styles[barStyle])}
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
                <div className={clsx(styles.tabListBorder, styles[barStyle])} />
            </div>

            <Tab.Panels
                className={clsx(styles.tabPanels, styles[backgroundStyle])}
            >
                {tabs.map(({ title, content }) => (
                    <Tab.Panel
                        key={`${id}-tab-${title}-content`}
                        className={clsx(
                            styles.panel,
                            styles[backgroundStyle],
                            styles[barStyle],
                            styles[kind],
                        )}
                    >
                        {content}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
};
