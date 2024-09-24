import type { Meta, StoryObj } from '@storybook/react';
import { createElement, useState } from 'react';
import { Select } from './Select';
import { Text } from '../text';

const meta: Meta<typeof Select> = {
    title: 'Inputs/Select',
    component: Select,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

const render: Story['render'] = (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<string | null>(null);
    return createElement('div', {
        style: { minHeight: '400px' },
    }, createElement(Select, {
        ...args,
        value: selected,
        onChange: (e) => setSelected(e),
    }));
};

export const Default: Story = {
    args: {
        label: 'Release type',
        description: 'Select the type of release you want to create.',
        options: [
            { id: '1', node: 'Single' },
            { id: '2', node: 'EP' },
            { id: '3', node: 'Album (LP)' },
            { id: '4', node: 'Compilation' },
            { id: '5', node: 'Mixtape' },
            { id: '6', node: 'Live album' },
            { id: '7', node: 'Remix album' },
            { id: '8', node: 'Soundtrack' },
            { id: '9', node: 'Demo' },
            { id: '10', node: 'Reissue' },
            { id: '11', node: 'Promo' },
            { id: '12', node: 'Other' },
        ],
    },
    render,
};

export const WithCustomNodes: Story = {
    args: {
        options: [
            {
                id: '1',
                // eslint-disable-next-line react/no-children-prop
                node: createElement(Text, {
                    as: 'span',
                    kind: 'displaySmall',
                    children: 'Option 1',
                }),
            },
            {
                id: '2',
                // eslint-disable-next-line react/no-children-prop
                node: createElement(Text, {
                    as: 'span',
                    kind: 'paragraphXXSmall',
                    children: 'Option 2',
                }),
            },
            {
                id: '3',
                // eslint-disable-next-line react/no-children-prop
                node: createElement(Text, {
                    as: 'span',
                    kind: 'labelXLarge',
                    children: 'Option 3',
                }),
            },
        ],
    },
    render,
};

export const Radio: Story = {
    args: {
        label: 'Release type',
        description: 'Select the type of release you want to create.',
        kind: 'radio',
        options: [
            { id: '1', node: 'Single' },
            { id: '2', node: 'EP' },
            { id: '3', node: 'Album (LP)' },
            { id: '4', node: 'Compilation' },
        ],
    },
    render,
};
