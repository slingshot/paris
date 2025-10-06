/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Drawer } from './Drawer';
import { DrawerBottomPanelPortal } from './DrawerBottomPanelPortal';
import { useDrawer } from '.';
import { Button } from '../button';
import { Callout } from '../callout';
import {
    Menu, MenuButton, MenuItems, MenuItem,
} from '../menu';
import { usePagination, usePaginationContext } from '../pagination';
import { ChevronRight, Ellipsis } from '../icon';
import { Input } from '../input';

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
        size: 'default',
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

export const BottomPanel: Story = {
    args: {
        title: 'Transfer Out',
        children: (
            <div style={{
                width: '100%', display: 'flex', flexDirection: 'column', gap: '12px',
            }}
            >
                <h1>
                    Transfer Policies:
                </h1>
                <Button kind="secondary">
                    Read more...
                </Button>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim bibendum gravida. Donec
                    pharetra, erat et semper luctus, dolor enim elementum est, eget cursus nisi libero sit amet purus.
                    Fusce blandit leo in lectus blandit, sed elementum enim accumsan. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque pretium erat at lacus ultricies
                    tincidunt. Praesent non luctus magna, ac efficitur ligula. Sed a justo fermentum, feugiat mauris
                    vel, ultrices turpis. Ut interdum malesuada lacus, ac posuere sapien feugiat et. Nulla dignissim
                    bibendum gravida. Donec pharetra, erat et semper luctus, dolor enim elementum est, eget cursus nisi
                    libero sit amet purus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim bibendum gravida. Donec
                    pharetra, erat et semper luctus, dolor enim elementum est, eget cursus nisi libero sit amet purus.
                    Fusce blandit leo in lectus blandit, sed elementum enim accumsan. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque pretium erat at lacus ultricies
                    tincidunt. Praesent non luctus magna, ac efficitur ligula. Sed a justo fermentum, feugiat mauris
                    vel, ultrices turpis. Ut interdum malesuada lacus, ac posuere sapien feugiat et. Nulla dignissim
                    bibendum gravida. Donec pharetra, erat et semper luctus, dolor enim elementum est, eget cursus nisi
                    libero sit amet purus.
                </p>
            </div>
        ),
        bottomPanel: (
            <div style={{
                width: '100%', display: 'flex', flexDirection: 'column', gap: '12px',
            }}
            >
                <Callout>
                    Transfer should arrive in your account within 2-3 business days.
                </Callout>
                <Button>
                    Initiate
                </Button>
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
                <Button
                    onClick={() => setIsOpen(true)}
                >
                    Transfer Out
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

export const Full: Story = {
    args: {
        title: 'Transaction details',
        children: 'This was a transaction for $22.89 at Il Tramezzino in Beverly Hills, CA.',
        size: 'full',
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
                >
                    {args.children}
                </Drawer>
            </>
        );
    },
};

/**
 * Example using pageConfig for declarative per-page configuration.
 * Eliminates conditional logic in the parent component.
 */
export const WithPageConfig: Story = {
    args: {},
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        const pages = ['details', 'edit', 'confirm'] as const;
        const pagination = usePagination<typeof pages>('details');

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>
                    Open Multi-Step Form
                </Button>
                <Drawer
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Multi-Step Process"
                    pagination={pagination}
                    pageConfig={{
                        details: {
                            title: 'View Details',
                            bottomPanel: (
                                <Button onClick={() => pagination.open('edit')}>
                                    Edit
                                </Button>
                            ),
                        },
                        edit: {
                            title: 'Edit Information',
                            bottomPanel: (
                                <Button onClick={() => pagination.open('confirm')}>
                                    Continue to Confirm
                                </Button>
                            ),
                        },
                        confirm: {
                            title: 'Confirm Changes',
                            bottomPanel: (
                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                    <Button onClick={() => setIsOpen(false)}>
                                        Confirm
                                    </Button>
                                    <Button kind="secondary" onClick={() => pagination.back()}>
                                        Go Back
                                    </Button>
                                </div>
                            ),
                        },
                    }}
                >
                    <div key="details">
                        <h3>Account Details</h3>
                        <p>Name: John Doe</p>
                        <p>Email: john@example.com</p>
                    </div>
                    <div key="edit">
                        <h3>Edit Account</h3>
                        <Input label="Name" defaultValue="John Doe" />
                        <Input label="Email" defaultValue="john@example.com" />
                    </div>
                    <div key="confirm">
                        <h3>Confirm Your Changes</h3>
                        <Callout>
                            Please review your changes before confirming.
                        </Callout>
                        <p>Updated Name: John Doe</p>
                        <p>Updated Email: john@example.com</p>
                    </div>
                </Drawer>
            </>
        );
    },
};

/**
 * Example using DrawerBottomPanelPortal to inject bottom panel content from a child component.
 * Child component can control its own actions without prop drilling.
 */
export const WithBottomPanelPortal: Story = {
    args: {},
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        // Child component that uses the portal
        const FormWithActions = () => {
            const [value, setValue] = useState('');
            const [isSubmitting, setIsSubmitting] = useState(false);
            const { close } = useDrawer();

            const handleSubmit = async () => {
                setIsSubmitting(true);
                // Simulate API call
                await new Promise((resolve) => { setTimeout(resolve, 1000); });
                setIsSubmitting(false);
                close();
            };

            return (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Input
                            label="Enter your message"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Type something..."
                        />
                        <p>
                            Your message:
                            {' '}
                            {value || '(empty)'}
                        </p>
                    </div>

                    <DrawerBottomPanelPortal mode="replace">
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <Button
                                onClick={handleSubmit}
                                loading={isSubmitting}
                                disabled={!value}
                            >
                                Submit
                            </Button>
                            <Button kind="secondary" onClick={close}>
                                Cancel
                            </Button>
                        </div>
                    </DrawerBottomPanelPortal>
                </>
            );
        };

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>
                    Open Form with Portal
                </Button>
                <Drawer
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Form Example"
                >
                    <FormWithActions />
                </Drawer>
            </>
        );
    },
};

/**
 * Example using usePaginationContext to access pagination from nested components.
 * Eliminates prop drilling for navigation callbacks.
 */
export const WithPaginationContext: Story = {
    args: {},
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        const pages = ['step1', 'step2', 'step3'] as const;
        const pagination = usePagination<typeof pages>('step1');

        // Nested component that accesses pagination directly
        const Step1Content = () => {
            const paginationCtx = usePaginationContext<typeof pages>();

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>Step 1: Personal Information</h3>
                    <Input label="Name" placeholder="Enter your name" />

                    <DrawerBottomPanelPortal>
                        <Button onClick={() => paginationCtx?.open('step2')}>
                            Next: Contact Info
                        </Button>
                    </DrawerBottomPanelPortal>
                </div>
            );
        };

        const Step2Content = () => {
            const paginationCtx = usePaginationContext<typeof pages>();

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>Step 2: Contact Information</h3>
                    <Input label="Email" placeholder="Enter your email" />

                    <DrawerBottomPanelPortal>
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <Button onClick={() => paginationCtx?.open('step3')}>
                                Next: Review
                            </Button>
                            <Button kind="secondary" onClick={() => paginationCtx?.back()}>
                                Back
                            </Button>
                        </div>
                    </DrawerBottomPanelPortal>
                </div>
            );
        };

        const Step3Content = () => {
            const { close } = useDrawer();

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>Step 3: Review & Submit</h3>
                    <Callout>
                        Please review your information before submitting.
                    </Callout>

                    <DrawerBottomPanelPortal>
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <Button onClick={() => {
                                pagination.reset();
                                close();
                            }}>
                                Submit
                            </Button>
                            <Button kind="secondary" onClick={() => pagination.back()}>
                                Back
                            </Button>
                        </div>
                    </DrawerBottomPanelPortal>
                </div>
            );
        };

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>
                    Start Wizard
                </Button>
                <Drawer
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Registration Wizard"
                    pagination={pagination}
                    pageConfig={{
                        step1: { title: 'Step 1 of 3' },
                        step2: { title: 'Step 2 of 3' },
                        step3: { title: 'Step 3 of 3' },
                    }}
                >
                    <div key="step1"><Step1Content /></div>
                    <div key="step2"><Step2Content /></div>
                    <div key="step3"><Step3Content /></div>
                </Drawer>
            </>
        );
    },
};
