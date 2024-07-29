import type { Meta, StoryObj } from '@storybook/react';
import {
    Menu,
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
        <Menu as="div">
            <Menu.Button>
                <Button
                    kind="tertiary"
                    shape="circle"
                    startEnhancer={(
                        <Ellipsis size={20} />
                    )}
                >
                    Action menu
                </Button>
            </Menu.Button>
            <Menu.Items>
                <Menu.Item as="button">
                    Dispute
                </Menu.Item>
                <Menu.Item as="button">
                    Transfer
                    <ChevronRight size={20} />
                </Menu.Item>
            </Menu.Items>
        </Menu>
    ),
};

export const Secondary: Story = {
    args: {
        children: 'Hello world! This is a secondary component.',
    },
};
