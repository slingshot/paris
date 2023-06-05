import type { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { createElement, Fragment } from 'react';
import styles from './Card.module.scss';
import type { TiltProps } from '../tilt';
import { Tilt } from '../tilt';

export type CardProps = {
    /**
     * The visual variant of the Card.
     *
     * @default "hover"
     */
    kind?: 'hover' | 'flat';
    /**
     * Whether the Card should tilt on hover.
     *
     * @default true
     */
    tilt?: boolean;
    /** The contents of the Card. */
    children?: ReactNode | ReactNode[];
    /**
     * Overrides for nested components.
     */
    overrides?: {
        tilt?: TiltProps;
    }
};

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
    tilt = true,
    children,
    overrides,
}) => (
    <Tilt
        disableTilt={!tilt}
        {...overrides?.tilt}
        className={clsx(
            styles.container,
            styles[kind],
            overrides?.tilt?.className,
        )}
    >
        {children}
    </Tilt>
);
