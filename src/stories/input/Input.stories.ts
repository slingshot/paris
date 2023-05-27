import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Inputs/Input',
    component: Input,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Billie Eilish',
        label: 'Name',
        description: 'Type your full name here.',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Password',
        label: 'Password',
        hideLabel: true,
    },
};

export const WithEnhancer: Story = {
    args: {
        placeholder: 'Billie Eilish',
        label: 'Name',
        description: 'Type your full name here.',
        startEnhancer: ({ size }) => createElement(FontAwesomeIcon, {
            icon: faSearch,
            width: `${size}px`,
        }),
    },
};

export const WithEndEnhancer: Story = {
    args: {
        placeholder: 'Billie Eilish',
        label: 'Name',
        description: 'Type your full name here.',
        endEnhancer: ({ size }) => createElement(FontAwesomeIcon, {
            icon: faSearch,
            width: `${size}px`,
        }),
    },
};
