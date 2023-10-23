import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCancel, faWarning } from '@fortawesome/free-solid-svg-icons';
import { Callout } from './Callout';

const meta: Meta<typeof Callout> = {
    title: 'Surfaces/Callout',
    component: Callout,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Default: Story = {
    args: {
        children: 'Receipts required for transactions over $25',
    },
};

export const Negative: Story = {
    args: {
        variant: 'negative',
        children: 'Please upload a receipt',
        icon: createElement(
            FontAwesomeIcon,
            { icon: faCancel },
        ),
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        children: 'Receipt does not match transaction',
        icon: createElement(
            FontAwesomeIcon,
            { icon: faWarning },
        ),
    },
};

export const Positive: Story = {
    args: {
        variant: 'positive',
        children: 'Receipt saved',
        icon: createElement(
            FontAwesomeIcon,
            { icon: faCheck },
        ),
    },
};
