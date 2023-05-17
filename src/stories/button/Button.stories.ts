import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Forms/Button',
    component: Button,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Hello world! This is a new Button component.',
    },
};

export const Secondary: Story = {
    args: {
        content: 'Hello world! This is a secondary component.',
    },
};
