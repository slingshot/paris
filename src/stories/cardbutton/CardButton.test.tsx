import { fireEvent } from '@testing-library/react';
import { render, screen } from '../../test/render';
import { CardButton } from './CardButton';

describe('CardButton', () => {
    it('renders children', () => {
        render(<CardButton>Card Content</CardButton>);
        expect(screen.getByRole('button')).toHaveTextContent('Card Content');
    });

    it('renders non-string children', () => {
        render(
            <CardButton>
                <div data-testid="child">Complex child</div>
            </CardButton>,
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    describe('kind variants', () => {
        it.each(['raised', 'surface', 'flat'] as const)('renders %s kind', (kind) => {
            render(<CardButton kind={kind}>Label</CardButton>);
            expect(screen.getByRole('button')).toHaveClass(kind);
        });

        it('defaults to raised kind', () => {
            render(<CardButton>Label</CardButton>);
            expect(screen.getByRole('button')).toHaveClass('raised');
        });
    });

    describe('status variants', () => {
        it.each(['default', 'pending'] as const)('renders %s status', (status) => {
            render(<CardButton status={status}>Label</CardButton>);
            expect(screen.getByRole('button')).toHaveClass(status);
        });

        it('defaults to default status', () => {
            render(<CardButton>Label</CardButton>);
            expect(screen.getByRole('button')).toHaveClass('default');
        });
    });

    describe('onClick', () => {
        it('fires onClick when clicked', async () => {
            const onClick = vi.fn();
            const { user } = render(<CardButton onClick={onClick}>Label</CardButton>);
            await user.click(screen.getByRole('button'));
            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('disabled state', () => {
        it('sets aria-disabled when disabled', () => {
            render(<CardButton disabled>Label</CardButton>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
        });

        it('does not fire onClick when disabled', () => {
            const onClick = vi.fn();
            render(
                <CardButton disabled onClick={onClick}>
                    Label
                </CardButton>,
            );
            fireEvent.click(screen.getByRole('button'));
            expect(onClick).not.toHaveBeenCalled();
        });

        it('sets aria-disabled to false when not disabled', () => {
            render(<CardButton>Label</CardButton>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');
        });
    });

    describe('className forwarding', () => {
        it('forwards custom className', () => {
            render(<CardButton className="custom-class">Label</CardButton>);
            expect(screen.getByRole('button')).toHaveClass('custom-class');
        });

        it('preserves internal classes when custom className is added', () => {
            render(<CardButton className="custom-class">Label</CardButton>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('card');
            expect(button).toHaveClass('raised');
            expect(button).toHaveClass('custom-class');
        });
    });

    describe('href rendering', () => {
        it('renders as an anchor when href is provided', () => {
            render(<CardButton href="https://example.com">Link</CardButton>);
            const anchor = screen.getByRole('link', { name: /link/i });
            expect(anchor).toBeInTheDocument();
            expect(anchor).toHaveAttribute('href', 'https://example.com');
        });

        it('defaults target to _self', () => {
            render(<CardButton href="https://example.com">Link</CardButton>);
            expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
        });

        it('applies hreftarget when provided', () => {
            render(
                <CardButton href="https://example.com" hreftarget="_blank">
                    Link
                </CardButton>,
            );
            const anchor = screen.getByRole('link');
            expect(anchor).toHaveAttribute('target', '_blank');
            expect(anchor).toHaveAttribute('rel', 'noreferrer');
        });

        it('does not fire onClick when href is set', async () => {
            const onClick = vi.fn();
            const { user } = render(
                <CardButton href="https://example.com" onClick={onClick}>
                    Link
                </CardButton>,
            );
            await user.click(screen.getByRole('link'));
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('text class for string children', () => {
        it('applies text class when children is a string', () => {
            render(<CardButton>Text content</CardButton>);
            expect(screen.getByRole('button')).toHaveClass('text');
        });

        it('does not apply text class when children is not a string', () => {
            render(
                <CardButton>
                    <span>JSX content</span>
                </CardButton>,
            );
            expect(screen.getByRole('button')).not.toHaveClass('text');
        });
    });

    describe('aria-details', () => {
        it('sets aria-details when children is a string', () => {
            render(<CardButton>Description</CardButton>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-details', 'Description');
        });

        it('does not set aria-details when children is not a string', () => {
            render(
                <CardButton>
                    <span>JSX</span>
                </CardButton>,
            );
            expect(screen.getByRole('button')).not.toHaveAttribute('aria-details');
        });
    });

    describe('container', () => {
        it('wraps button in a container div', () => {
            const { container } = render(<CardButton>Label</CardButton>);
            const wrapper = container.firstElementChild;
            expect(wrapper).toHaveClass('container');
            expect(wrapper?.querySelector('button')).toBeInTheDocument();
        });
    });

    describe('type attribute', () => {
        it('defaults to button type', () => {
            render(<CardButton>Label</CardButton>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        });
    });
});
