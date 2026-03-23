import type { Meta, StoryObj } from '@storybook/react';
import { CardButton } from './CardButton';

const meta: Meta<typeof CardButton> = {
    title: 'Inputs/CardButton',
    component: CardButton,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CardButton>;

export const Default: Story = {
    args: {
        children: 'Hello world!',
    },
};

export const Raised: Story = {
    args: {
        children: 'Hello world!',
        kind: 'raised',
    },
};

export const Surface: Story = {
    args: {
        children: 'Hello world!',
        kind: 'surface',
    },
};

export const Flat: Story = {
    args: {
        children: 'Hello world!',
        kind: 'flat',
    },
};

export const Disabled: Story = {
    args: {
        children: 'Hello world!',
        disabled: true,
    },
};
