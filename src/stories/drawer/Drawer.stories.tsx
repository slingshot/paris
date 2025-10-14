/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Drawer } from './Drawer';
import { Button } from '../button';
import { Callout } from '../callout';
import {
    Menu, MenuButton, MenuItems, MenuItem,
} from '../menu';
import { usePagination } from '../pagination';
import { ChevronRight, Ellipsis } from '../icon';

const meta: Meta<typeof Drawer> = {
    title: 'Surfaces/Drawer',
    component: Drawer,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
    args: {
        title: 'Transaction details',
        children:
      'This was a transaction for $22.89 at Il Tramezzino in Beverly Hills, CA.',
        size: 'default',
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>View details</Button>
                <Drawer
                    {...args}
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    additionalActions={(
                        <Menu as="div">
                            <MenuButton>
                                <Button
                                    kind="tertiary"
                                    shape="circle"
                                    startEnhancer={<Ellipsis size={20} />}
                                >
                                    Action menu
                                </Button>
                            </MenuButton>
                            <MenuItems position="right">
                                <MenuItem as="button">Dispute</MenuItem>
                                <MenuItem as="button">
                                    Transfer
                                    <ChevronRight size={20} />
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    )}
                >
                    {args.children}
                </Drawer>
            </>
        );
    },
};

export const Paginated: Story = {
    args: {
        children: [],
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        const pages = ['step1', 'step2', 'step3'] as const;
        const pagination = usePagination<typeof pages>('step1');

        const currentPageTitle = {
            step1: 'Step 1',
            step2: 'Step 2',
            step3: 'Step 3',
        }[pagination.currentPage];

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Start process</Button>
                <Drawer
                    {...args}
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    pagination={pagination}
                    title={currentPageTitle}
                    additionalActions={(
                        <Menu as="div">
                            <MenuButton>
                                <Button
                                    kind="tertiary"
                                    shape="circle"
                                    startEnhancer={<Ellipsis size={20} />}
                                >
                                    Action menu
                                </Button>
                            </MenuButton>
                            <MenuItems position="right">
                                <MenuItem as="button">Dispute</MenuItem>
                                <MenuItem as="button">
                                    Transfer
                                    <ChevronRight size={20} />
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    )}
                >
                    <div
                        key="step1"
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                        Step 1: Enter your name
                        <Button onClick={() => pagination.open('step2')}>
                            Go to step 2
                        </Button>
                        <Button onClick={() => pagination.open('step3')}>
                            Go to step 3
                        </Button>
                    </div>
                    <div
                        key="step2"
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                        Step 2: Enter your address
                        <Button onClick={() => pagination.open('step3')}>
                            Go to step 3
                        </Button>
                    </div>
                    <div
                        key="step3"
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                        Step 3: Enter your credit card information
                    </div>
                </Drawer>
            </>
        );
    },
};

export const BottomPanel: Story = {
    args: {
        title: 'Transfer Out',
        children: (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <h1>Transfer Policies:</h1>
                <Button kind="secondary">Read more...</Button>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                    dignissim bibendum gravida. Donec pharetra, erat et semper luctus,
                    dolor enim elementum est, eget cursus nisi libero sit amet purus.
                    Fusce blandit leo in lectus blandit, sed elementum enim accumsan.
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                    posuere cubilia curae; Pellentesque pretium erat at lacus ultricies
                    tincidunt. Praesent non luctus magna, ac efficitur ligula. Sed a justo
                    fermentum, feugiat mauris vel, ultrices turpis. Ut interdum malesuada
                    lacus, ac posuere sapien feugiat et. Nulla dignissim bibendum gravida.
                    Donec pharetra, erat et semper luctus, dolor enim elementum est, eget
                    cursus nisi libero sit amet purus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                    dignissim bibendum gravida. Donec pharetra, erat et semper luctus,
                    dolor enim elementum est, eget cursus nisi libero sit amet purus.
                    Fusce blandit leo in lectus blandit, sed elementum enim accumsan.
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                    posuere cubilia curae; Pellentesque pretium erat at lacus ultricies
                    tincidunt. Praesent non luctus magna, ac efficitur ligula. Sed a justo
                    fermentum, feugiat mauris vel, ultrices turpis. Ut interdum malesuada
                    lacus, ac posuere sapien feugiat et. Nulla dignissim bibendum gravida.
                    Donec pharetra, erat et semper luctus, dolor enim elementum est, eget
                    cursus nisi libero sit amet purus.
                </p>
            </div>
        ),
        bottomPanel: (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <Callout>
                    Transfer should arrive in your account within 2-3 business days.
                </Callout>
                <Button>Initiate</Button>
                <Button kind="secondary" theme="negative">
                    Cancel
                </Button>
            </div>
        ),
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Transfer Out</Button>
                <Drawer
                    {...args}
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    additionalActions={(
                        <Menu as="div">
                            <MenuButton>
                                <Button
                                    kind="tertiary"
                                    shape="circle"
                                    startEnhancer={<Ellipsis size={20} />}
                                >
                                    Action menu
                                </Button>
                            </MenuButton>
                            <MenuItems position="right">
                                <MenuItem as="button">Dispute</MenuItem>
                                <MenuItem as="button">
                                    Transfer
                                    <ChevronRight size={20} />
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    )}
                >
                    {args.children}
                </Drawer>
            </>
        );
    },
};

export const Full: Story = {
    args: {
        title: 'Transaction details',
        children:
      'This was a transaction for $22.89 at Il Tramezzino in Beverly Hills, CA.',
        size: 'full',
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>View details</Button>
                <Drawer {...args} isOpen={isOpen} onClose={setIsOpen}>
                    {args.children}
                </Drawer>
            </>
        );
    },
};
