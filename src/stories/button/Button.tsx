'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';
import styles from './Button.module.scss';
import { updateTheme } from '../theme';

export type ButtonProps = PropsWithChildren<{
    /**
     * The visual style of the button.
     */
    kind?: 'primary' | 'secondary' | 'tertiary';
    /**
     * The contents of the button, usually just text.
     */
    children: ReactNode;
}>;

/**
 * Button component!
 */
export const Button: FC<ButtonProps> = ({
    kind = 'primary',
    children = 'Submit',
}) => (
    <button type="button" className={styles.content} onClick={() => updateTheme({ colors: { primary: `#${100000 + Math.floor(899999 * Math.random())}`, backgroundPrimary: `#${100000 + Math.floor(899999 * Math.random())}` } })}>
        {children}
    </button>
);
