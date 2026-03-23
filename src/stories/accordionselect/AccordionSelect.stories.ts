import type { Meta, StoryObj } from '@storybook/react';
import { AccordionSelect } from './AccordionSelect';

const meta: Meta<typeof AccordionSelect> = {
    title: 'Inputs/AccordionSelect',
    component: AccordionSelect,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AccordionSelect>;

const options = [
    { id: 'bank-1', node: 'Chase ••4521' },
    { id: 'bank-2', node: 'Wells Fargo ••8832' },
    { id: 'bank-3', node: 'Bank of America ••1100' },
];

export const Default: Story = {
    args: {
        options,
        value: 'bank-1',
    },
};

export const NoSelection: Story = {
    args: {
        options,
        placeholder: 'Select a bank account',
    },
};

export const WithDisabledOption: Story = {
    args: {
        options: [
            ...options,
            { id: 'bank-4', node: 'Expired Account ••0000', disabled: true },
        ],
        value: 'bank-1',
    },
};
