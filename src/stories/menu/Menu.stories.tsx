import type { Meta, StoryObj } from '@storybook/react';
import {
    Menu, MenuButton, MenuItems, MenuItem,
} from './Menu';
import { Button } from '../button';
import { ChevronRight, Ellipsis } from '../icon';

const meta: Meta<typeof Menu> = {
    title: 'Surfaces/Menu',
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
        <div style={{ height: '150px' }}>
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
        </div>
    ),
};
