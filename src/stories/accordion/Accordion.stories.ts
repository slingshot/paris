import type { Meta, StoryObj } from '@storybook/nextjs';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
    title: 'Content/Accordion',
    component: Accordion,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
    args: {
        title: 'Where were we?',
        children: 'In an alleyway, drinking champagne.',
    },
};

export const Card: Story = {
    args: {
        title: 'Where were we?',
        children: 'In an alleyway, drinking champagne.',
        kind: 'card',
    },
};

export const CardLarge: Story = {
    args: {
        title: 'Where were we?',
        children: 'In an alleyway, drinking champagne.',
        kind: 'card',
        size: 'large',
    },
};
