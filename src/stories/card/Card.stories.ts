import type { Meta, StoryObj } from '@storybook/nextjs';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
    title: 'Surfaces/Card',
    component: Card,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Raised: Story = {
    args: {
        children: 'Hello world!',
    },
};

export const Surface: Story = {
    args: {
        kind: 'surface',
        children: 'Hello world!',
    },
};

export const Flat: Story = {
    args: {
        kind: 'flat',
        children: 'Hello world!',
    },
};

export const Pending: Story = {
    args: {
        children: 'Hello world!',
        status: 'pending',
    },
};
