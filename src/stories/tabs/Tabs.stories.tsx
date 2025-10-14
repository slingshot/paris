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
    render: (args) => (
        <div style={{ background: 'var(--pte-new-colors-backgroundPrimary)' }}>
            <Tabs {...args} />
        </div>
    ),
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
    render: (args) => (
        <div style={{ background: 'var(--pte-new-colors-backgroundPrimary)' }}>
            <Tabs {...args} />
        </div>
    ),
};

export const Full: Story = {
    args: {
        kind: 'full',
        barStyle: 'thin',
        tabs: [
            { title: 'Albums', content: 'Tab 1 content' },
            { title: 'EPs', content: 'Tab 2 content' },
            { title: 'Singles', content: 'Tab 3 content' },
        ],
    },
    render: (args) => (
        <div style={{ background: 'var(--pte-new-colors-backgroundPrimary)' }}>
            <Tabs {...args} />
        </div>
    ),
};

export const Glass: Story = {
    args: {
        kind: 'full',
        barStyle: 'thin',
        backgroundStyle: 'glass',
        tabs: [
            { title: 'Albums', content: 'Tab 1 content' },
            {
                title: 'EPs',
                content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim bibendum gravida. Donec pharetra, erat et semper luctus, dolor enim elementum est, eget cursus nisi libero sit amet purus. Fusce blandit leo in lectus blandit, sed elementum enim accumsan. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque pretium erat at lacus ultricies tincidunt. Praesent non luctus magna, ac efficitur ligula. Sed a justo fermentum, feugiat mauris vel, ultrices turpis. Ut interdum malesuada lacus, ac posuere sapien feugiat et. Nulla dignissim bibendum gravida. Donec pharetra, erat et semper luctus, dolor enim elementum est, eget cursus nisi libero sit amet purus.',
            },
            {
                title: 'Singles',
                content: (
                    <div
                        style={{
                            width: '100%',
                            height: '300px',
                            background: 'red',
                        }}
                    >
                        <p>Hello world!</p>
                    </div>
                ),
            },
            { title: 'Invoices', content: 'Tab 4 content' },
            { title: 'Payments', content: 'Tab 5 content' },
            { title: 'Payroll', content: 'Tab 6 content' },
            { title: 'Insights', content: 'Tab 7 content' },
            { title: 'Settings', content: 'Tab 8 content' },
            { title: 'Account', content: 'Tab 9 content' },
        ],
    },
    render: (args) => (
        <div style={{ background: 'var(--pte-new-colors-backgroundPrimary)' }}>
            <div style={{ height: '120px' }}>
                <Tabs {...args} />
            </div>
        </div>
    ),
};

export const Scroll: Story = {
    args: {
        tabs: [
            { title: 'Transactions', content: 'Tab 1 content' },
            { title: 'Cards', content: 'Tab 2 content' },
            { title: 'Documents', content: 'Tab 3 content' },
            { title: 'Invoices', content: 'Tab 4 content' },
            { title: 'Payments', content: 'Tab 5 content' },
            { title: 'Payroll', content: 'Tab 6 content' },
            { title: 'Insights', content: 'Tab 7 content' },
            { title: 'Settings', content: 'Tab 8 content' },
            { title: 'Account', content: 'Tab 9 content' },
        ],
    },
    render: (args) => (
        <div style={{ background: 'var(--pte-new-colors-backgroundPrimary)' }}>
            <Tabs {...args} />
        </div>
    ),
};
