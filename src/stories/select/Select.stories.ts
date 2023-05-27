import type { Meta, StoryObj } from '@storybook/react';
import { createElement, useState } from 'react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
    title: 'Inputs/Select',
    component: Select,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    args: {
        options: [
            { id: '1', node: 'Option 1' },
            { id: '2', node: 'Option 2' },
            { id: '3', node: 'Option 3' },
            { id: '4', node: 'Option 4' },
        ],
    },
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selected, setSelected] = useState<string | null>(null);
        return createElement(Select, {
            ...args,
            value: selected,
            onChange: (e) => setSelected(e),
        });
    },
};
