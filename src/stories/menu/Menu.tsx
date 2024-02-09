import type { FC, ReactNode } from 'react';
import type {
    MenuProps, MenuItemsProps, MenuItemProps, MenuButtonProps,
} from '@headlessui/react';
import { Menu as HeadlessMenu } from '@headlessui/react';
import clsx from 'clsx';

import styles from './Menu.module.scss';

export { Menu as HeadlessMenu } from '@headlessui/react';

export const Menu: FC<MenuProps<React.ElementType>> = ({ className, children, ...props }) => (
    <HeadlessMenu as="div" className={clsx(className, styles.menu)} {...props}>
        {children}
    </HeadlessMenu>
);

export const MenuButton: FC<MenuButtonProps<React.ElementType>> = ({ className, children, ...props }) => (
    <HeadlessMenu.Button className={clsx(className, styles.menuButton)} {...props}>
        {children}
    </HeadlessMenu.Button>
);

export const MenuItems: FC<MenuItemsProps<React.ElementType> & {
    position?: 'left' | 'right';
}> = ({
    className, children, position = 'left', ...props
}) => (
    <HeadlessMenu.Items className={clsx(className, styles.menuItems, position === 'left' && styles.leftPosition, position === 'right' && styles.rightPosition)} {...props}>
        {children}
    </HeadlessMenu.Items>
);

export const MenuItem: FC<MenuItemProps<React.ElementType>> = ({ className, children, ...props }) => (
    <HeadlessMenu.Item className={clsx(className, styles.menuItem)} {...props}>
        {children}
    </HeadlessMenu.Item>
);
