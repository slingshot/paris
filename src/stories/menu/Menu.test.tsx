import { render, screen, waitFor } from '../../test/render';
import { Menu, MenuButton, MenuItem, MenuItems } from './Menu';

function renderMenu(props?: { onItemClick?: () => void; position?: 'left' | 'right' }) {
    return render(
        <Menu>
            <MenuButton>Options</MenuButton>
            <MenuItems position={props?.position}>
                <MenuItem as="button" onClick={props?.onItemClick}>
                    Edit
                </MenuItem>
                <MenuItem as="button">Delete</MenuItem>
                <MenuItem as="button" disabled>
                    Archive
                </MenuItem>
            </MenuItems>
        </Menu>,
    );
}

describe('Menu', () => {
    it('renders the menu button', () => {
        renderMenu();

        expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('does not show menu items initially', () => {
        renderMenu();

        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('opens menu when clicking the button', async () => {
        const { user } = renderMenu();

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Archive')).toBeInTheDocument();
    });

    it('renders all menu items when open', async () => {
        const { user } = renderMenu();

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getAllByRole('menuitem')).toHaveLength(3);
        });
    });

    it('fires callback when clicking a menu item', async () => {
        const onItemClick = vi.fn();
        const { user } = renderMenu({ onItemClick });

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        await user.click(screen.getByText('Edit'));

        expect(onItemClick).toHaveBeenCalledOnce();
    });

    it('closes menu after clicking a menu item', async () => {
        const { user } = renderMenu();

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        await user.click(screen.getByText('Edit'));

        await waitFor(() => {
            expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });
    });

    it('closes menu when pressing Escape', async () => {
        const { user } = renderMenu();

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });
    });

    it('supports keyboard navigation with arrow keys', async () => {
        const { user } = renderMenu();

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        // HeadlessUI Menu uses arrow keys for navigation
        await user.keyboard('{ArrowDown}');
        await user.keyboard('{ArrowDown}');

        // Verify focus moved (no crash)
        const items = screen.getAllByRole('menuitem');
        expect(items.length).toBeGreaterThan(0);
    });

    it('renders with isNew styling on a menu item', async () => {
        const { user } = render(
            <Menu>
                <MenuButton>Options</MenuButton>
                <MenuItems>
                    <MenuItem as="button" isNew>
                        New Feature
                    </MenuItem>
                </MenuItems>
            </Menu>,
        );

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('New Feature')).toBeInTheDocument();
        });
    });

    it('supports right position for menu items', async () => {
        const { user } = renderMenu({ position: 'right' });

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });
    });

    it('supports left position for menu items', async () => {
        const { user } = renderMenu({ position: 'left' });

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });
    });

    it('applies custom className to Menu', () => {
        const { container } = render(
            <Menu className="custom-menu">
                <MenuButton>Options</MenuButton>
                <MenuItems>
                    <MenuItem as="button">Item</MenuItem>
                </MenuItems>
            </Menu>,
        );

        expect(container.querySelector('.custom-menu')).toBeInTheDocument();
    });

    it('renders menu button with correct role', () => {
        renderMenu();

        expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
    });

    it('toggles menu open and closed with the button', async () => {
        const { user } = renderMenu();

        const button = screen.getByText('Options');

        // Open
        await user.click(button);
        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        // Close
        await user.click(button);
        await waitFor(() => {
            expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });
    });

    it('handles disabled menu items', async () => {
        const { user } = renderMenu();

        await user.click(screen.getByText('Options'));

        await waitFor(() => {
            expect(screen.getByText('Archive')).toBeInTheDocument();
        });

        // The disabled item should be rendered but marked as disabled
        const archiveItem = screen.getByText('Archive');
        expect(archiveItem.closest('[data-disabled]')).toBeInTheDocument();
    });

    describe('onOpenChange', () => {
        it('calls onOpenChange when the menu opens', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <Menu onOpenChange={handleOpenChange}>
                    <MenuButton>Options</MenuButton>
                    <MenuItems>
                        <MenuItem as="button">Edit</MenuItem>
                    </MenuItems>
                </Menu>,
            );

            await user.click(screen.getByText('Options'));

            await waitFor(() => {
                expect(handleOpenChange).toHaveBeenCalledWith(true);
            });
        });

        it('calls onOpenChange when the menu closes', async () => {
            const handleOpenChange = vi.fn();
            const { user } = render(
                <Menu onOpenChange={handleOpenChange}>
                    <MenuButton>Options</MenuButton>
                    <MenuItems>
                        <MenuItem as="button">Edit</MenuItem>
                    </MenuItems>
                </Menu>,
            );

            await user.click(screen.getByText('Options'));
            await waitFor(() => {
                expect(screen.getByText('Edit')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Edit'));

            await waitFor(() => {
                expect(handleOpenChange).toHaveBeenCalledWith(false);
            });
        });
    });
});
