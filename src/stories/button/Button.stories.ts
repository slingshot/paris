import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Inputs/Button',
    component: Button,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * By default, the Button component renders a primary large pill.
 *
 * **Primary** buttons are intended to represent primary or leading actions, such as "Submit" or "Save".
 */
export const Primary: Story = {
    args: {
        children: 'Button',
    },
};

/**
 * **Secondary** buttons are intended to represent secondary or trailing actions, such as "Cancel" or "Delete".
 */
export const Secondary: Story = {
    args: {
        children: 'Button',
        kind: 'secondary',
    },
};

/**
 * **Tertiary** buttons offer a visual alternative for non-primary actions.
 */
export const Tertiary: Story = {
    args: {
        children: 'Button',
        kind: 'tertiary',
    },
};
