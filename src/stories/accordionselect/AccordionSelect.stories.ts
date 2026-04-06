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
    { id: 'champagne', node: 'In an alleyway, drinking champagne' },
    { id: 'rooftop', node: 'On a rooftop, watching the sunset' },
    { id: 'garden', node: 'In a garden, under the stars' },
];

export const Default: Story = {
    args: {
        options,
        value: 'champagne',
    },
};

export const NoSelection: Story = {
    args: {
        options,
        placeholder: 'Where were we?',
    },
};

export const WithDisabledOption: Story = {
    args: {
        options: [...options, { id: 'nowhere', node: 'Nowhere, it was all a dream', disabled: true }],
        value: 'champagne',
    },
};
