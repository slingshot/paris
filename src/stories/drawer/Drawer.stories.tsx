import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../button';
import { Callout } from '../callout';
import { ChevronRight, Ellipsis } from '../icon';
import { Menu, MenuButton, MenuItem, MenuItems } from '../menu';
import { usePagination } from '../pagination';
import { Select } from '../select';
import { Text } from '../text';
import { Drawer } from './Drawer';
import { DrawerActions } from './DrawerActions';
import { DrawerBottomPanel } from './DrawerBottomPanel';
import { useDrawer } from './DrawerContext';
import { DrawerPage } from './DrawerPage';
import { useDrawerPagination } from './DrawerPaginationContext';
import { DrawerTitle } from './DrawerTitle';

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
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>View details</Button>
                <Drawer
                    {...args}
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    additionalActions={
                        <Menu as="div">
                            <MenuButton>
                                <Button kind="tertiary" shape="circle" startEnhancer={<Ellipsis size={20} />}>
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
                    }
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
    render: function Render(args) {
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
                    additionalActions={
                        <Menu as="div">
                            <MenuButton>
                                <Button kind="tertiary" shape="circle" startEnhancer={<Ellipsis size={20} />}>
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
                    }
                >
                    <div key="step1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        Step 1: Enter your name
                        <Button onClick={() => pagination.open('step2')}>Go to step 2</Button>
                        <Button onClick={() => pagination.open('step3')}>Go to step 3</Button>
                    </div>
                    <div key="step2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        Step 2: Enter your address
                        <Button onClick={() => pagination.open('step3')}>Go to step 3</Button>
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
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Transfer Out</Button>
                <Drawer
                    {...args}
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    additionalActions={
                        <Menu as="div">
                            <MenuButton>
                                <Button kind="tertiary" shape="circle" startEnhancer={<Ellipsis size={20} />}>
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
                    }
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h1>Transfer Policies:</h1>
                        <Button kind="secondary">Read more...</Button>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dignissim bibendum gravida.
                            Donec pharetra, erat et semper luctus, dolor enim elementum est, eget cursus nisi libero sit
                            amet purus. Fusce blandit leo in lectus blandit, sed elementum enim accumsan.
                        </p>
                    </div>
                    <DrawerBottomPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Callout>Transfer should arrive in your account within 2-3 business days.</Callout>
                        <Button>Initiate</Button>
                        <Button kind="secondary" theme="negative">
                            Cancel
                        </Button>
                    </DrawerBottomPanel>
                </Drawer>
            </>
        );
    },
};

export const WithSelectDropdown: Story = {
    args: {
        title: 'Settings',
        size: 'default',
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const [selected, setSelected] = useState<string | null>(null);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open drawer</Button>
                <Drawer {...args} isOpen={isOpen} onClose={setIsOpen}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <p>Try opening the Select dropdown below — it should appear above the Drawer.</p>
                        <Select
                            label="Country"
                            placeholder="Select a country"
                            value={selected}
                            onChange={setSelected}
                            options={[
                                { id: 'us', node: 'United States' },
                                { id: 'uk', node: 'United Kingdom' },
                                { id: 'ca', node: 'Canada' },
                                { id: 'au', node: 'Australia' },
                                { id: 'de', node: 'Germany' },
                                { id: 'fr', node: 'France' },
                                { id: 'jp', node: 'Japan' },
                            ]}
                        />
                    </div>
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
    render: function Render(args) {
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

export const CompoundAPI: Story = {
    args: {},
    render: function Render() {
        const [isOpen, setIsOpen] = useState(false);
        const pages = ['details', 'edit'] as const;
        const pagination = usePagination<typeof pages>('details');

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open compound drawer</Button>
                <Drawer
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    title="Fallback Title"
                    pagination={pagination}
                    onAfterClose={() => pagination.reset()}
                >
                    <DrawerPage id="details">
                        <DrawerTitle>Transaction Details</DrawerTitle>
                        <DrawerActions>
                            <Menu as="div">
                                <MenuButton>
                                    <Button kind="tertiary" shape="circle" startEnhancer={<Ellipsis size={20} />}>
                                        Action menu
                                    </Button>
                                </MenuButton>
                                <MenuItems position="right">
                                    <MenuItem as="button">Dispute</MenuItem>
                                </MenuItems>
                            </Menu>
                        </DrawerActions>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p>This is the details page with its own title and actions.</p>
                            <Button onClick={() => pagination.open('edit')}>Go to Edit</Button>
                        </div>
                        <DrawerBottomPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Button onClick={() => pagination.open('edit')}>Edit Transaction</Button>
                        </DrawerBottomPanel>
                    </DrawerPage>

                    <DrawerPage id="edit">
                        <DrawerTitle>Edit Transaction</DrawerTitle>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p>This is the edit page. The title bar changed!</p>
                            <NestedFormExample />
                        </div>
                    </DrawerPage>
                </Drawer>
            </>
        );
    },
};

const NestedFormExample = () => {
    const { close } = useDrawer();
    const pagination = useDrawerPagination();
    const [saving, setSaving] = useState(false);

    return (
        <>
            <p>This form component uses useDrawer() and renders its own bottom panel.</p>
            <DrawerBottomPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                    loading={saving}
                    onClick={() => {
                        setSaving(true);
                        setTimeout(() => {
                            setSaving(false);
                            close();
                        }, 1000);
                    }}
                >
                    Save Changes
                </Button>
                <Button kind="secondary" onClick={() => pagination?.back()}>
                    Back
                </Button>
            </DrawerBottomPanel>
        </>
    );
};

// ─── Page Transition Stories ────────────────────────────────────────────────

const TransitionDemoPage = ({
    step,
    color,
    onNext,
    onPrev,
}: {
    step: number;
    color: string;
    onNext?: () => void;
    onPrev?: () => void;
}) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '20px',
            background: color,
            borderRadius: '8px',
            minHeight: '200px',
        }}
    >
        <h3 style={{ margin: 0 }}>Step {step}</h3>
        <p style={{ margin: 0 }}>This is step {step}. Navigate between pages to see the transition effect.</p>
        <div style={{ display: 'flex', gap: '8px' }}>
            {onPrev && (
                <Button kind="secondary" onClick={onPrev}>
                    Back
                </Button>
            )}
            {onNext && <Button onClick={onNext}>Next</Button>}
        </div>
    </div>
);

export const ProgressBar: Story = {
    render: function Render() {
        const [isOpen, setIsOpen] = useState(false);
        const pages = ['account', 'details', 'confirm'] as const;
        const pagination = usePagination<typeof pages>('account');

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open wizard with progress</Button>
                <Drawer
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    title="Wizard"
                    pagination={pagination}
                    pageTransition="slide"
                    progressBar
                    onAfterClose={() => pagination.reset()}
                >
                    <DrawerPage id="account">
                        <DrawerTitle>Create Account</DrawerTitle>
                        <TransitionDemoPage
                            step={1}
                            color="var(--pte-new-colors-overlaySubtle)"
                            onNext={() => pagination.open('details')}
                        />
                        <DrawerBottomPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Button style={{ width: '100%' }} onClick={() => pagination.open('details')}>
                                Continue
                            </Button>
                        </DrawerBottomPanel>
                    </DrawerPage>

                    <DrawerPage id="details">
                        <DrawerTitle>Add Details</DrawerTitle>
                        <TransitionDemoPage
                            step={2}
                            color="var(--pte-new-colors-overlaySubtle)"
                            onPrev={() => pagination.back()}
                            onNext={() => pagination.open('confirm')}
                        />
                        <DrawerBottomPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Button style={{ width: '100%' }} onClick={() => pagination.open('confirm')}>
                                Continue
                            </Button>
                            <Button style={{ width: '100%' }} kind="secondary" onClick={() => pagination.back()}>
                                Back
                            </Button>
                        </DrawerBottomPanel>
                    </DrawerPage>

                    <DrawerPage id="confirm">
                        <DrawerTitle>Confirm</DrawerTitle>
                        <TransitionDemoPage
                            step={3}
                            color="var(--pte-new-colors-overlaySubtle)"
                            onPrev={() => pagination.back()}
                        />
                        <DrawerBottomPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Button style={{ width: '100%' }} theme="positive">
                                Submit
                            </Button>
                            <Button style={{ width: '100%' }} kind="secondary" onClick={() => pagination.back()}>
                                Back
                            </Button>
                        </DrawerBottomPanel>
                    </DrawerPage>
                </Drawer>
            </>
        );
    },
};

export const AppendModeBottomPanel: Story = {
    args: {},
    render: function Render() {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open append mode drawer</Button>
                <Drawer isOpen={isOpen} onClose={setIsOpen} title="Append Mode Demo">
                    <p>
                        The bottom panel uses multiple DrawerBottomPanel components with priority ordering and automatic
                        separator borders.
                    </p>
                    <DrawerBottomPanel
                        mode="append"
                        priority={10}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '14px 20px',
                        }}
                    >
                        <Text kind="paragraphXSmall" weight="medium">
                            Total
                        </Text>
                        <Text kind="paragraphSmall" weight="medium">
                            $249.00
                        </Text>
                    </DrawerBottomPanel>
                    <DrawerBottomPanel
                        mode="append"
                        priority={20}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                        <Callout>Free shipping on orders over $200</Callout>
                        <Button style={{ width: '100%' }}>Confirm Order</Button>
                    </DrawerBottomPanel>
                </Drawer>
            </>
        );
    },
};
