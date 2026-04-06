import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
            {
                title: 'Albums',
                content: (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p>Scroll down to see the glass blur effect on the tab bar.</p>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 1
                        </div>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 2
                        </div>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 3
                        </div>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 4
                        </div>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 5
                        </div>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 6
                        </div>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 7
                        </div>
                        <div
                            style={{
                                padding: '12px',
                                background: 'var(--pte-new-colors-overlayMedium)',
                                borderRadius: '8px',
                            }}
                        >
                            Item 8
                        </div>
                    </div>
                ),
            },
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
            <div style={{ height: '300px' }}>
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
