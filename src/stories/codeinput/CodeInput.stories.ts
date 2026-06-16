import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createElement, useState } from 'react';
import { CodeInput } from './CodeInput';

const meta: Meta<typeof CodeInput> = {
    title: 'Inputs/CodeInput',
    component: CodeInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CodeInput>;

export const Default: Story = {
    render: function Render(args) {
        const [value, setValue] = useState('');
        return createElement(CodeInput, { ...args, value, onChange: setValue });
    },
};

export const Error: Story = {
    args: { status: 'error' },
    render: function Render(args) {
        const [value, setValue] = useState('123');
        return createElement(CodeInput, { ...args, value, onChange: setValue });
    },
};

export const Disabled: Story = {
    args: { disabled: true },
    render: function Render(args) {
        const [value, setValue] = useState('12');
        return createElement(CodeInput, { ...args, value, onChange: setValue });
    },
};

export const Loading: Story = {
    args: { loading: true },
    render: function Render(args) {
        const [value, setValue] = useState('123456');
        return createElement(CodeInput, { ...args, value, onChange: setValue });
    },
};

export const FourDigits: Story = {
    args: { length: 4 },
    render: function Render(args) {
        const [value, setValue] = useState('');
        return createElement(CodeInput, { ...args, value, onChange: setValue });
    },
};
