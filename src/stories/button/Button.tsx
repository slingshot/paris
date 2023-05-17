import type { FC, PropsWithChildren } from 'react';
import styles from './Button.module.scss';

export type ButtonProps = PropsWithChildren<{
    /** Add props here */
    content?: string;
}>;

export const Button: FC<ButtonProps> = ({ children }) => (
    <button type="button" className={styles.content}>
        {children}
    </button>
);
