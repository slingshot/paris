import type { Meta, StoryObj } from '@storybook/react';
import { SelectableCard } from './SelectableCard';

const meta: Meta<typeof SelectableCard> = {
    title: 'Inputs/SelectableCard',
    component: SelectableCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectableCard>;

export const Default: Story = {
    args: {
        title: 'Standard Transfer',
        description: 'Free transfer, 3-5 business days',
        onSelect: () => {},
    },
};

export const Selected: Story = {
    args: {
        title: 'Standard Transfer',
        description: 'Free transfer, 3-5 business days',
        isSelected: true,
        onSelect: () => {},
    },
};

export const Disabled: Story = {
    args: {
        title: 'Wire Transfer',
        description: 'Not available for this account',
        disabled: true,
        onSelect: () => {},
    },
};
