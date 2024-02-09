import type {
    ComponentPropsWithoutRef, ElementType, FC, ReactNode,
} from 'react';
import { createElement } from 'react';
import clsx from 'clsx';
import styles from './ActionMenu.module.scss';

export type ActionMenuProps<T extends ElementType = 'div'> = {
    /** The element to render the ActionMenu as. */
    as?: T;
    /** The contents of the ActionMenu. */
    children?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export const ActionMenuItem: FC<ActionMenuProps<'button'>> = ({
    as = 'button',
    children,
    className,
    ...props
}) => createElement(
    as,
    {
        ...props,
        className: clsx(className, styles.actionMenuItem),
    },
    children,
);

/**
 * A ActionMenu component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { ActionMenu } from 'paris/ActionMenu';
 * ```
 * @constructor
 */
export const ActionMenu: FC<ActionMenuProps> & { Item: typeof ActionMenuItem } = ({
    as = 'div',
    children,
    className,
    ...props
}) => createElement(
    as,
    {
        ...props,
        className: clsx(className, styles.actionMenu),
    },
    children,
);

ActionMenu.Item = ActionMenuItem;
