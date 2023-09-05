import type { FC, HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.scss';
import { Tilt } from '../tilt';

export type CardProps = {
    /**
     * The visual variant of the Card.
     *
     * @default "hover"
     */
    kind?: 'hover' | 'flat';
    // /**
    //  * Whether the Card should tilt on hover.
    //  *
    //  * @default true
    //  */
    // tilt?: boolean;
    /** The contents of the Card. */
    children?: ReactNode | ReactNode[];
    // /**
    //  * Overrides for nested components.
    //  */
    // overrides?: {
    //     tilt?: TiltProps;
    // }
} & HTMLAttributes<HTMLDivElement>;

/**
 * A Card component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Card } from 'paris/card';
 * ```
 * @constructor
 */
export const Card: FC<CardProps> = ({
    kind = 'hover',
    children,
    ...props
}) => (
    <div
        {...props}
        className={clsx(
            styles.container,
            styles[kind],
            props?.className,
        )}
    >
        {children}
    </div>
);
