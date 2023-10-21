import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
    title: 'Surfaces/Tabs',
    component: Tabs,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    args: {
        tabs: [
            { title: 'Transactions', content: 'Tab 1 content' },
            { title: 'Cards', content: 'Tab 2 content' },
            { title: 'Documents', content: 'Tab 3 content' },
            // { title: 'Tab 4', content: 'Tab 4 content' },
            // { title: 'Tab 5', content: 'Tab 5 content' },
            // { title: 'Tab 6', content: 'Tab 6 content' },
            // { title: 'Tab 7', content: 'Tab 7 content' },
            // { title: 'Tab 8', content: 'Tab 8 content' },
            // { title: 'Tab 9', content: 'Tab 9 content' },
            // { title: 'Tab 10', content: 'Tab 10 content' },
        ],
    },
};

export const Compact: Story = {
    args: {
        kind: 'compact',
        tabs: [
            { title: 'Albums', content: 'Tab 1 content' },
            { title: 'EPs', content: 'Tab 2 content' },
            { title: 'Singles', content: 'Tab 3 content' },
        ],
    },
};
