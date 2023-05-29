import type { ComponentPropsWithoutRef, NamedExoticComponent } from 'react';
import { createElement, memo } from 'react';

export type IconDefinitionProps = {
    /**
     * The size of the Icon, in pixels.
     */
    size: number;
};
export type IconDefinition = NamedExoticComponent<IconDefinitionProps>;

export type IconProps<T extends keyof JSX.IntrinsicElements = 'span'> = IconDefinitionProps & {
    icon: IconDefinition;
    as?: T;
    overrides?: {
        icon?: ComponentPropsWithoutRef<'svg'>
    }
} & ComponentPropsWithoutRef<T>;

/**
* Paris comes with a set of simple UI icons that can be used in your application. Icons are MIT-licensed and can be used in any project.
*
* <hr />
*
* To use this component, import the parent `Icon` component and the icon you want to use:
*
* ```tsx
* import { Icon, Close } from 'paris/icon';
 *
 * <Icon icon={Close} size={20} />
* ```
* @constructor
*/
export const Icon = memo<IconProps>(({
    as = 'span',
    icon,
    size,
    overrides = { icon: {} },
    ...props
}) => (
    createElement(
        as,
        props,
        createElement(icon, { size, ...overrides.icon }),
    )
));
