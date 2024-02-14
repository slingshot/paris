import type { Meta, StoryObj } from '@storybook/react';
import {
    Menu, MenuItem, MenuItems, MenuButton,
} from './Menu';
import { Button } from '../button';
import { ChevronRight, Ellipsis } from '../icon';

const meta: Meta<typeof Menu> = {
    title: 'Uncategorized/Menu',
    component: Menu,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
    args: {
        children: 'Hello world! This is a new Menu component.',
    },
    render: (args) => (
        <Menu as="div">
            <MenuButton>
                <Button
                    kind="tertiary"
                    shape="circle"
                    startEnhancer={(
                        <Ellipsis size={20} />
                    )}
                >
                    Action menu
                </Button>
            </MenuButton>
            <MenuItems>
                <MenuItem as="button">
                    Dispute
                </MenuItem>
                <MenuItem as="button">
                    Transfer
                    <ChevronRight size={20} />
                </MenuItem>
            </MenuItems>
        </Menu>
    ),
};

export const Secondary: Story = {
    args: {
        children: 'Hello world! This is a secondary component.',
    },
};
