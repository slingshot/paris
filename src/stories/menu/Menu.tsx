import type { MenuButtonProps, MenuItemProps, MenuItemsProps, MenuProps } from '@headlessui/react';
import {
    Menu as HeadlessMenu,
    MenuButton as HMenuButton,
    MenuItem as HMenuItem,
    MenuItems as HMenuItems,
} from '@headlessui/react';
import { clsx } from 'clsx';
import type { FC } from 'react';

import styles from './Menu.module.scss';

/**
 * Wraps the `HeadlessMenu` component from `@headlessui/react` to provide a styled dropdown menu.
 *
 * This component serves as the root of the menu and should wrap `MenuButton`, `MenuItems`, and `MenuItem` components.
 *
 * Usage:
 *
 * ```tsx
 * <Menu>
 *   <MenuButton>Options</MenuButton>
 *   <MenuItems>
 *     <MenuItem>Item 1</MenuItem>
 *     <MenuItem>Item 2</MenuItem>
 *   </MenuItems>
 * </Menu>
 * ```
 */
export const Menu: FC<MenuProps<React.ElementType>> = ({ className, children, ...props }) => (
    <HeadlessMenu as="div" className={clsx(styles.menu, className)} {...props}>
        {children}
    </HeadlessMenu>
);

/**
 * Renders a button that toggles the display of `MenuItems` in a `Menu`.
 *
 * Should be used inside a `Menu` component to serve as the toggle for `MenuItems`.
 */
export const MenuButton: FC<MenuButtonProps<React.ElementType>> = ({ className, children, ...props }) => (
    <HMenuButton className={clsx(styles.menuButton, className)} {...props}>
        {children}
    </HMenuButton>
);

/**
 * Container for menu item options, rendering the list of `MenuItem` components.
 *
 * Positions the menu items relative to the `MenuButton` based on the `position` prop.
 *
 * @param position - Controls the positioning of the menu items ('left' or 'right').
 */
export const MenuItems: FC<
    MenuItemsProps<React.ElementType> & {
        position?: 'left' | 'right';
    }
> = ({ className, children, position = 'left', ...props }) => (
    <HMenuItems
        transition
        className={clsx(
            styles.menuItems,
            position === 'left' && styles.leftPosition,
            position === 'right' && styles.rightPosition,
            className,
        )}
        {...props}
    >
        {children}
    </HMenuItems>
);

/**
 * Represents an individual item within a `MenuItems` container.
 *
 * Should be used inside `MenuItems` to represent selectable options in the menu.
 *
 * @param isNew - Whether the menu items should be styled as new items.
 */
export const MenuItem: FC<
    MenuItemProps<React.ElementType> & {
        isNew?: boolean;
    }
> = ({ className, children, isNew = false, ...props }) => (
    <HMenuItem className={clsx(styles.menuItem, isNew && styles.newItem, className)} {...props}>
        {children}
    </HMenuItem>
);
