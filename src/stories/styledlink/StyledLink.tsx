import type {
    ComponentPropsWithoutRef, ElementType, FC, ReactNode,
} from 'react';
import { createElement } from 'react';
import clsx from 'clsx';
import styles from './StyledLink.module.scss';

export type StyledLinkProps<T extends ElementType = 'a'> = {
    /** The element to render the StyledLink as. */
    as?: T;
    /** The contents of the StyledLink. */
    children?: ReactNode;
} & ComponentPropsWithoutRef<T>;

/**
 * A StyledLink component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { StyledLink } from 'paris/styledlink';
 * ```
 * @constructor
 */
export const StyledLink: FC<StyledLinkProps<ElementType>> = ({
    as = 'a',
    children,
    className,
    ...props
}) => createElement(
    as,
    {
        ...props,
        className: clsx(className, styles.link),
    },
    children,
);
