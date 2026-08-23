import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
    render: function Render(args) {
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: setChecked,
        });
    },
};

export const Surface: Story = {
    args: {
        children: 'ACH Bank Transfer',
        kind: 'surface',
    },
    render: function Render(args) {
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: setChecked,
        });
    },
};

export const Panel: Story = {
    args: {
        children: 'Credit/debit card',
        kind: 'panel',
    },
    render: function Render(args) {
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: setChecked,
        });
    },
};

export const Switch: Story = {
    args: {
        children: 'ACH Bank Transfer',
        kind: 'switch',
    },
    render: function Render(args) {
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: setChecked,
        });
    },
};

export const HideLabel: Story = {
    args: {
        children: 'ACH Bank Transfer',
        kind: 'switch',
        hideLabel: true,
    },
    render: function Render(args) {
        const [checked, setChecked] = useState(false);
        return createElement(Checkbox, {
            ...args,
            checked,
            onChange: setChecked,
        });
    },
};

/** A `react-hook-form` field object spread straight onto the Checkbox, with no `checked` adapter. */
export const FormField: Story = {
    args: {
        children: 'I agree to the terms of service',
    },
    render: function Render(args) {
        const [value, setValue] = useState(false);
        const field = { name: 'terms', value, onChange: setValue, onBlur: () => {} };
        return createElement(Checkbox, { ...args, ...field });
    },
};
