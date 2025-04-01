import type { Meta, StoryObj } from '@storybook/react';
import { createElement, useState } from 'react';
import { MultiSelect } from './MultiSelect';

const meta: Meta<typeof MultiSelect> = {
    title: 'Inputs/MultiSelect',
    component: MultiSelect,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const render: Story['render'] = (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<string[] | null | undefined>();
    return createElement('div', {
        style: { minHeight: '400px' },
    }, createElement(MultiSelect, {
        ...args,
        value: selected,
        onChange: (e) => setSelected(e),
    }));
};

// const render: Story['render'] = (args) => {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const [selected, setSelected] = useState<string | null>(null);
//     return createElement('div', {
//         style: { minHeight: '400px' },
//     }, createElement(MultiSelect, {
//         ...args,
//         value: selected,
//         onChange: (e) => setSelected(e),
//     }));
// };
//
// export const Default: Story = {
//     args: {
//         label: 'Release type',
//         description: 'Select the type of release you want to create.',
//         options: [
//             { id: '1', node: 'Single' },
//             { id: '2', node: 'EP' },
//             { id: '3', node: 'Album (LP)' },
//             { id: '4', node: 'Compilation' },
//             { id: '5', node: 'Mixtape' },
//             { id: '6', node: 'Live album' },
//             { id: '7', node: 'Remix album' },
//             { id: '8', node: 'Soundtrack' },
//             { id: '9', node: 'Demo' },
//             { id: '10', node: 'Reissue' },
//             { id: '11', node: 'Promo' },
//             { id: '12', node: 'Other' },
//         ],
//     },
//     render,
// };

export const Default: Story = {
    args: {
        label: 'Release type',
        description: 'Select the type of release you want to create.',
        options: [
            { id: '1', node: 'Single' },
            { id: '2', node: 'EP' },
            { id: '3', node: 'Album (LP)' },
        ],
    },
    render,
};
