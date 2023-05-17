import type { FC, PropsWithChildren, ReactNode } from 'react';
import styles from './Button.module.scss';

export enum ButtonKind {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    TERTIARY = 'tertiary',
}

export type ButtonProps = PropsWithChildren<{
    /**
     * The visual style of the button.
     */
    kind: ButtonKind;
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
    <button type="button" className={styles.content}>
        {children}
    </button>
);
