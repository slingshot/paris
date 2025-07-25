import type { Meta, StoryObj } from '@storybook/nextjs';
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

export const Disabled: Story = {
    args: {
        children: 'Hello world!',
        disabled: true,
    },
};
