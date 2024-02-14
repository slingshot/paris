import type { FC, ReactNode } from 'react';
import type {
    MenuProps, MenuItemsProps, MenuItemProps, MenuButtonProps,
} from '@headlessui/react';
import { Menu as HeadlessMenu } from '@headlessui/react';
import clsx from 'clsx';

import styles from './Menu.module.scss';

export { Menu as HeadlessMenu } from '@headlessui/react';

/**
 * Wraps the `HeadlessMenu` component from `@headlessui/react` to provide a styled dropdown menu.
 *
 * This component serves as the root of the menu and should wrap `Menu.Button`, `Menu.Items`, and `Menu.Item` components.
 *
 * Usage:
 *
 * ```tsx
 * <Menu>
 *   <Menu.Button>Options</Menu.Button>
 *   <Menu.Items>
 *     <Menu.Item>Item 1</Menu.Item>
 *     <Menu.Item>Item 2</Menu.Item>
 *   </Menu.Items>
 * </Menu>
 * ```
 */
export const Menu: FC<MenuProps<React.ElementType>> & {
    Button: FC<MenuButtonProps<React.ElementType>>;
    Items: FC<MenuItemsProps<React.ElementType> & {
        position?: 'left' | 'right';
    }>;
    Item: FC<MenuItemProps<React.ElementType>>;
} = ({ className, children, ...props }) => (
    <HeadlessMenu as="div" className={clsx(className, styles.menu)} {...props}>
        {children}
    </HeadlessMenu>
);

/**
 * Renders a button that toggles the display of `MenuItems` in a `Menu`.
 *
 * Should be used inside a `Menu` component to serve as the toggle for `MenuItems`.
 */
Menu.Button = ({ className, children, ...props }) => (
    <HeadlessMenu.Button className={clsx(className, styles.menuButton)} {...props}>
        {children}
    </HeadlessMenu.Button>
);

/**
 * Container for menu item options, rendering the list of `MenuItem` components.
 *
 * Positions the menu items relative to the `MenuButton` based on the `position` prop.
 *
 * @param position - Controls the positioning of the menu items ('left' or 'right').
 */
Menu.Items = ({
    className, children, position = 'left', ...props
}) => (
    <HeadlessMenu.Items className={clsx(className, styles.menuItems, position === 'left' && styles.leftPosition, position === 'right' && styles.rightPosition)} {...props}>
        {children}
    </HeadlessMenu.Items>
);

/**
 * Represents an individual item within a `MenuItems` container.
 *
 * Should be used inside `MenuItems` to represent selectable options in the menu.
 *
 */
Menu.Item = ({ className, children, ...props }) => (
    <HeadlessMenu.Item className={clsx(className, styles.menuItem)} {...props}>
        {children}
    </HeadlessMenu.Item>
);
