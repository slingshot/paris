import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
    title: 'Content/Tag',
    component: Tag,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
    args: {
        children: 'Explicit',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        kind: 'secondary',
    },
};

export const Compact: Story = {
    args: {
        children: 'Compact',
        size: 'compact',
        kind: 'negative',
    },
};
