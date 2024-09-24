import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
    title: 'Surfaces/Card',
    component: Card,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: 'Revenue: $3000',
    },
};

/**
 * Setting the `kind` prop to `flat` will remove the shadow from the card.
 */
export const Flat: Story = {
    args: {
        kind: 'flat',
        children: 'Revenue: $3000',
    },
};
