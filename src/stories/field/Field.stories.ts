import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
    title: 'Uncategorized/Field',
    component: Field,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
    args: {
        children: 'Hello world! This is a new Field component.',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Hello world! This is a secondary component.',
    },
};
