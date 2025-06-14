import type { Meta, StoryObj } from '@storybook/react';
import { createElement, useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Inputs/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        children: 'I agree to the terms of service',
    },
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: (e) => setChecked(!!e),
        });
    },
};

export const Surface: Story = {
    args: {
        children: 'ACH Bank Transfer',
        kind: 'surface',
    },
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: (e) => setChecked(!!e),
        });
    },
};

export const Switch: Story = {
    args: {
        children: 'ACH Bank Transfer',
        kind: 'switch',
    },
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: (e) => setChecked(!!e),
        });
    },
};

export const HideLabel: Story = {
    args: {
        children: 'ACH Bank Transfer',
        kind: 'switch',
        hideLabel: true,
    },
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: (e) => setChecked(!!e),
        });
    },
};
