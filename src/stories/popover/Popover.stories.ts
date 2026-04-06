import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createElement } from 'react';
import { Button } from '../button';
import { Popover } from './Popover';

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
