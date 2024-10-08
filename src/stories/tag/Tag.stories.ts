import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
        children: 'Label',
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

export const New: Story = {
    args: {
        children: 'New',
        size: 'compact',
        kind: 'new',
    },
};

export const Square: Story = {
    args: {
        children: 'New',
        size: 'compact',
        shape: 'square',
        kind: 'positive',
    },
};

export const RoundedXL: Story = {
    args: {
        children: 'Label',
        size: 'normal',
        corners: 'roundedXL',
        kind: 'default',
    },
};
