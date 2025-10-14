import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { Popover } from './Popover';
import { Button } from '../button';

const meta: Meta<typeof Popover> = {
    title: 'Surfaces/Popover',
    component: Popover,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
    args: {
        trigger: createElement(Button, {}, 'Click me'),
        children: 'Hello world!',
    },
};
