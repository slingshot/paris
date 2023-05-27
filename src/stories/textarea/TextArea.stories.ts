import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
    title: 'Inputs/TextArea',
    component: TextArea,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
    args: {
        placeholder: 'Billie Eilish',
        label: 'Name',
        description: 'Type your full name here.',
    },
};
