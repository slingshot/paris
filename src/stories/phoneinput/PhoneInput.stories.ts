import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
    title: 'Uncategorized/PhoneInput',
    component: PhoneInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
    args: {
        children: 'Hello world! This is a new PhoneInput component.',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Hello world! This is a secondary component.',
    },
};
