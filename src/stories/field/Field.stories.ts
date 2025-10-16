import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
    title: 'Inputs/Field',
    component: Field,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
    args: {
        label: 'Label',
        description: 'Description.',
        children: createElement(
            'div',
            {
                style: {
                    backgroundColor: 'var(--pte-new-colors-inputFill)',
                    height: '36px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingLeft: '12px',
                    border: '1px solid pink',
                },
            },
            'Children are inserted here.',
        ),
    },
};
