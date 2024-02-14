/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Drawer } from './Drawer';
import { Button } from '../button';
import {
    Menu, MenuButton, MenuItem, MenuItems,
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
        children: 'This was a transaction for $22.89 at Il Tramezzino in Beverly Hills, CA.',
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button
                    onClick={() => setIsOpen(true)}
                >
                    View details
                </Button>
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
                                    startEnhancer={(
                                        <Ellipsis size={20} />
                                    )}
                                >
                                    Action menu
                                </Button>
                            </MenuButton>
                            <MenuItems position="right">
                                <MenuItem as="button">
                                    Dispute
                                </MenuItem>
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
                <Button
                    onClick={() => setIsOpen(true)}
                >
                    Start process
                </Button>
                <Drawer
                    {...args}
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    pagination={pagination}
                    title={currentPageTitle}
                >
                    <div key="step1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        Step 1: Enter your name
                        <Button
                            onClick={() => pagination.open('step2')}
                        >
                            Go to step 2
                        </Button>
                        <Button
                            onClick={() => pagination.open('step3')}
                        >
                            Go to step 3
                        </Button>
                    </div>
                    <div key="step2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        Step 2: Enter your address
                        <Button
                            onClick={() => pagination.open('step3')}
                        >
                            Go to step 3
                        </Button>
                    </div>
                    <div key="step3" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        Step 3: Enter your credit card information
                    </div>
                </Drawer>
            </>
        );
    },
};
