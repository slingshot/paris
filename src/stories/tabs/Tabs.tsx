'use client';

import type { CSSProperties, FC, ReactNode } from 'react';
import { Tab } from '@headlessui/react';
import { useId, useState } from 'react';
import clsx from 'clsx';
import type { CSSLength } from '@ssh/csstypes';
import styles from './Tabs.module.scss';
import typography from '../text/Typography.module.css';

export type TabsProps = {
    tabs: {
        title: string;
        content: ReactNode;
    }[];
    tabWidth?: CSSLength;
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
}) => {
    const id = useId();
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Tab.Group
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
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
                {tabs.map(({ title }) => (
                    <Tab
                        key={`${id}-tab-${title}`}
                        className={clsx(
                            typography.paragraphXSmall,
                            styles.tab,
                        )}
                    >
                        {title}
                    </Tab>
                ))}

                <div key={`${id}-tab-active-border`} className={styles.activeTabBorder} />
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
