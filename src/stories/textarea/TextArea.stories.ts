import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
    title: 'Inputs/TextArea',
    component: TextArea,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
    args: {
        placeholder: 'Mia Dolan',
        label: 'Name',
        description: 'Type your full name here.',
    },
};

export const WithCustomLabel: Story = {
    args: {
        placeholder: 'Mia Dolan',
        label: createElement('span', {}, [
            createElement('b', null, 'Name'),
            createElement('i', null, ' (optional)'),
        ]),
        'aria-label': 'Name (optional)',
        description: createElement('span', null, [
            createElement(
                'b',
                {
                    style: {
                        color: 'red',
                    },
                },
                'My custom description',
            ),
        ]),
    },
};
