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
            { title: 'Tab 1', content: 'Tab 1 content' },
            { title: 'Tab 2', content: 'Tab 2 content' },
            { title: 'Tab 3', content: 'Tab 3 content' },
        ],
    },
};
