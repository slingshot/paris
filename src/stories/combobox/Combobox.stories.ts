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

const ComboboxArgs2: ComboboxProps<{ name: string }> = {
    label: 'Share',
    description: 'Search for a friend to share this document with.',
    placeholder: 'Search...',
    options: [
        {
            id: '1',
            node: 'Mia Dolan',
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
            node: 'Amy Brandt',
            metadata: {
                name: 'Amy Brandt',
            },
        },
        {
            id: '4',
            node: 'Laura Wilder',
            metadata: {
                name: 'Laura Wilder',
            },
        },
    ],
};

const ComboboxArgs3: ComboboxProps<{ name: string }> = {
    label: 'Team type',
    description: 'Select the label that best matches your team.',
    placeholder: 'Select...',
    options: [
        {
            id: 'artist',
            node: 'Artist',
            category: 'music',
            metadata: {
                name: 'Artist',
            },
        },
        {
            id: 'engineer/mixer',
            node: 'Engineer/Mixer',
            category: 'music',
            metadata: {
                name: 'Engineer/Mixer',
            },
        },
        {
            id: 'producer/songwriter',
            node: 'Producer/Songwriter',
            category: 'music',
            metadata: {
                name: 'Producer/Songwriter',
            },
        },
        {
            id: 'director',
            node: 'Director',
            category: 'film',
            metadata: {
                name: 'Director',
            },
        },
        {
            id: 'editor',
            node: 'Editor',
            category: 'film',
            metadata: {
                name: 'Editor',
            },
        },
        {
            id: 'misc',
            node: 'Misc',
            metadata: {
                name: 'Misc',
            },
        },
    ],
    categories: [
        {
            id: 'music',
            node: 'Music',
            metadata: {
                name: 'Music',
            },
        },
        {
            id: 'film',
            node: 'Film',
            metadata: {
                name: 'Film',
            },
        },
    ],
};

const ComboboxArgs4: ComboboxProps<{ name: string }> = {
    label: 'Payment category',
    description: 'Recommended category, with uncategorized options at the bottom.',
    placeholder: 'Select...',
    options: [
        {
            id: 'advertisingandpromotion',
            node: 'Advertising and Promotion',
            metadata: {
                name: 'Advertising and Promotion',
            },
        },
        {
            id: 'contractlabor',
            node: 'Contract Labor',
            suggested: true,
            metadata: {
                name: 'Contract Labor',
            },
        },
        {
            id: 'entertainment',
            node: 'Entertainment',
            category: 'personal',
            metadata: {
                name: 'Entertainment',
            },
        },
        {
            id: 'rentexpense',
            node: 'Rent Expense',
            metadata: {
                name: 'Rent Expense',
            },
        },
        {
            id: 'softwareandsaas',
            node: 'Software and Saas',
            metadata: {
                name: 'Software and Saas',
            },
        },
        {
            id: 'travel',
            node: 'Travel',
            category: 'personal',
            suggested: true,
            metadata: {
                name: 'Travel',
            },
        },
    ],
    // categories: [
    //     {
    //         id: 'personal',
    //         node: 'Personal',
    //         metadata: {
    //             name: 'Personal',
    //         },
    //     },
    // ],
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
            allowCustomValue: true,
        }));
    },
};

export const HideOptionsInitially: Story = {
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
            hideOptionsInitially: true,
        }));
    },
};

export const HideClearButton: Story = {
    args: ComboboxArgs2,
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
            hideClearButton: true,
        }));
    },
};

export const Categories: Story = {
    args: ComboboxArgs3,
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
            options: (args.options as Option<{ name: string }>[]).filter((o) => (o.metadata?.name as string || '').toLowerCase().includes(inputValue.toLowerCase()) || (o?.category as string || '').toLowerCase().includes(inputValue.toLowerCase())),
            onChange: (e) => setSelected(e),
            onInputChange: (e) => setInputValue(e),
            hideClearButton: true,
            hasOptionBorder: true,
            categories: args.categories,
        }));
    },
};

export const Suggested: Story = {
    args: ComboboxArgs4,
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
            hasOptionBorder: true,
            categories: args.categories,
            allowCustomValue: true,
            hideSuggested: inputValue.length > 0,
        }));
    },
};
