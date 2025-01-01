/* eslint-disable react-hooks/rules-of-hooks,react/no-children-prop */
import type { Meta, StoryObj } from '@storybook/react';
import { createElement, useState } from 'react';
import type { ComboboxProps, Option } from './Combobox';
import { Combobox } from './Combobox';
import { Text } from '../text';

const meta: Meta<typeof Combobox> = {
    title: 'Inputs/Combobox',
    component: Combobox,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox<{ name: string }>>;

const ComboboxArgs: ComboboxProps<{ name: string }> = {
    label: 'Share',
    description: 'Search for a friend to share this document with.',
    placeholder: 'Search...',
    options: [
        {
            id: '1',
            node: createElement(Text, {
                kind: 'paragraphSmall',
                children: 'Mia Dolan',
            }),
            metadata: {
                name: 'Mia Dolan',
            },
        },
        {
            id: '2',
            node: 'SEB',
            metadata: {
                name: 'Sebastian Wilder',
            },
        },
        {
            id: '3',
            node: createElement(Text, {
                kind: 'paragraphSmall',
                children: 'Amy Brandt',
            }),
            metadata: {
                name: 'Amy Brandt',
            },
        },
        {
            id: '4',
            node: createElement(Text, {
                kind: 'paragraphSmall',
                children: 'Laura Wilder',
            }),
            metadata: {
                name: 'Laura Wilder',
            },
        },
    ],
};

export const Default: Story = {
    args: ComboboxArgs,
    render: (args) => {
        const [selected, setSelected] = useState<Option<{ name: string }> | null>(null);
        const [inputValue, setInputValue] = useState<string>('');
        return createElement('div', {
            style: { minHeight: '200px' },
        }, createElement(Combobox<{ name: string }>, {
            ...args,
            value: (selected?.id === null) ? {
                id: null,
                node: inputValue,
                metadata: {
                    name: inputValue,
                },
            } : selected as Option<{ name: string }> | null,
            options: (args.options as Option<{ name: string }>[]).filter((o) => (o.metadata?.name as string || '').toLowerCase().includes(inputValue.toLowerCase())),
            onChange: (e) => setSelected(e),
            onInputChange: (e) => setInputValue(e),
        }));
    },
};

export const AllowCustomValue: Story = {
    args: { ...ComboboxArgs, allowCustomValue: true, customValueString: 'Add "%v"' },
    render: (args) => {
        const [selected, setSelected] = useState<Option | null>(null);
        const [inputValue, setInputValue] = useState<string>('');
        return createElement('div', {
            style: { minHeight: '200px' },
        }, createElement(Combobox<{ name: string }>, {
            ...args,
            value: (selected?.id === null) ? {
                id: null,
                node: inputValue,
                metadata: {
                    name: inputValue,
                },
            } : selected as Option<{ name: string }> | null,
            options: (args.options as Option<{ name: string }>[]).filter((o) => (o.metadata?.name as string || '').toLowerCase().includes(inputValue.toLowerCase())),
            onChange: (e) => setSelected(e),
            onInputChange: (e) => setInputValue(e),
        }));
    },
};
