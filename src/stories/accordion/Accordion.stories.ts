import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createElement } from 'react';
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

export const CustomIcon: Story = {
    args: {
        title: 'Where were we?',
        children: 'In an alleyway, drinking champagne.',
        kind: 'card',
        icon: ({ size }) =>
            createElement(FontAwesomeIcon, { icon: faChevronDown, style: { width: size, height: size } }),
    },
};
