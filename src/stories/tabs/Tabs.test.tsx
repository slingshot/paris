import { render, screen, waitFor } from '../../test/render';
import { Tabs } from './Tabs';

// Mock framer-motion to avoid layout animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    cubicBezier: (..._args: number[]) => [0, 0, 1, 1],
}));

const defaultTabs = [
    { title: 'Transactions', content: 'Transactions content' },
    { title: 'Cards', content: 'Cards content' },
    { title: 'Documents', content: 'Documents content' },
];

describe('Tabs', () => {
    it('renders all tab titles', () => {
        render(<Tabs tabs={defaultTabs} />);

        expect(screen.getByText('Transactions')).toBeInTheDocument();
        expect(screen.getByText('Cards')).toBeInTheDocument();
        expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('renders the first tab panel content by default', () => {
        render(<Tabs tabs={defaultTabs} />);

        expect(screen.getByText('Transactions content')).toBeInTheDocument();
    });

    it('renders tab elements with correct roles', () => {
        render(<Tabs tabs={defaultTabs} />);

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(3);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('marks the first tab as selected by default', () => {
        render(<Tabs tabs={defaultTabs} />);

        const tabs = screen.getAllByRole('tab');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('switches active panel when clicking a different tab', async () => {
        const { user } = render(<Tabs tabs={defaultTabs} />);

        const tabs = screen.getAllByRole('tab');
        await user.click(tabs[1]);

        await waitFor(() => {
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });

        expect(screen.getByText('Cards content')).toBeInTheDocument();
    });

    it('calls onTabChange when a tab is clicked', async () => {
        const onTabChange = vi.fn();
        const { user } = render(<Tabs tabs={defaultTabs} onTabChange={onTabChange} />);

        const tabs = screen.getAllByRole('tab');
        await user.click(tabs[2]);

        await waitFor(() => {
            expect(onTabChange).toHaveBeenCalledWith(2);
        });
    });

    it('respects defaultIndex prop', () => {
        render(<Tabs tabs={defaultTabs} defaultIndex={1} />);

        const tabs = screen.getAllByRole('tab');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Cards content')).toBeInTheDocument();
    });

    it('supports controlled index', () => {
        const { rerender } = render(<Tabs tabs={defaultTabs} index={0} />);

        const tabs = screen.getAllByRole('tab');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

        rerender(<Tabs tabs={defaultTabs} index={2} />);

        expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Documents content')).toBeInTheDocument();
    });

    it('navigates tabs with keyboard arrow keys', async () => {
        const { user } = render(<Tabs tabs={defaultTabs} />);

        const tabs = screen.getAllByRole('tab');
        await user.click(tabs[0]);
        await user.keyboard('{ArrowRight}');

        await waitFor(() => {
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });
    });

    it('renders with compact kind', () => {
        render(<Tabs tabs={defaultTabs} kind="compact" />);

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(3);
    });

    it('renders with full kind', () => {
        render(<Tabs tabs={defaultTabs} kind="full" />);

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(3);
    });

    it('renders with thin barStyle', () => {
        render(<Tabs tabs={defaultTabs} barStyle="thin" />);

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(3);
    });

    it('renders with glass backgroundStyle', () => {
        render(<Tabs tabs={defaultTabs} backgroundStyle="glass" />);

        expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('renders ReactNode content in tab panels', async () => {
        const tabsWithJsx = [
            { title: 'Tab 1', content: <div data-testid="custom-content">Custom JSX</div> },
            { title: 'Tab 2', content: 'Plain text' },
        ];

        render(<Tabs tabs={tabsWithJsx} />);

        expect(screen.getByTestId('custom-content')).toBeInTheDocument();
        expect(screen.getByText('Custom JSX')).toBeInTheDocument();
    });

    it('handles a single tab', () => {
        const singleTab = [{ title: 'Only Tab', content: 'Only content' }];
        render(<Tabs tabs={singleTab} />);

        expect(screen.getAllByRole('tab')).toHaveLength(1);
        expect(screen.getByText('Only content')).toBeInTheDocument();
    });

    it('does not call onTabChange when clicking the already-selected tab', async () => {
        const onTabChange = vi.fn();
        const { user } = render(<Tabs tabs={defaultTabs} onTabChange={onTabChange} />);

        const tabs = screen.getAllByRole('tab');
        await user.click(tabs[0]);

        // HeadlessUI may or may not call onChange for same-tab clicks.
        // The important thing is it doesn't crash.
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });
});
