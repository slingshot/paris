import { fireEvent } from '@testing-library/react';
import { render, screen } from '../../test/render';
import { Button } from './Button';

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders default text when no children provided', () => {
        render(<Button />);
        expect(screen.getByRole('button')).toHaveTextContent('Button');
    });

    describe('kind variants', () => {
        it.each(['primary', 'secondary', 'tertiary'] as const)('renders %s kind', (kind) => {
            render(<Button kind={kind}>Label</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass(kind);
        });

        it('defaults to primary kind', () => {
            render(<Button>Label</Button>);
            expect(screen.getByRole('button')).toHaveClass('primary');
        });
    });

    describe('size variants', () => {
        it.each(['large', 'medium', 'small', 'xs'] as const)('renders %s size', (size) => {
            render(<Button size={size}>Label</Button>);
            expect(screen.getByRole('button')).toHaveClass(size);
        });

        it('defaults to large size', () => {
            render(<Button>Label</Button>);
            expect(screen.getByRole('button')).toHaveClass('large');
        });
    });

    describe('shape variants', () => {
        it.each(['pill', 'circle', 'rectangle', 'square'] as const)('renders %s shape', (shape) => {
            render(<Button shape={shape}>Label</Button>);
            expect(screen.getByRole('button')).toHaveClass(shape);
        });

        it('defaults to pill shape', () => {
            render(<Button>Label</Button>);
            expect(screen.getByRole('button')).toHaveClass('pill');
        });

        it('hides text content for circle shape but keeps it for accessibility', () => {
            render(<Button shape="circle">Action</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-details', 'Action');
        });

        it('hides text content for square shape but keeps it for accessibility', () => {
            render(<Button shape="square">Action</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-details', 'Action');
        });
    });

    describe('disabled state', () => {
        it('sets aria-disabled when disabled', () => {
            render(<Button disabled>Label</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
        });

        it('does not fire onClick when disabled', () => {
            const onClick = vi.fn();
            render(
                <Button disabled onClick={onClick}>
                    Label
                </Button>,
            );
            fireEvent.click(screen.getByRole('button'));
            expect(onClick).not.toHaveBeenCalled();
        });

        it('sets aria-disabled to false when not disabled', () => {
            render(<Button>Label</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');
        });
    });

    describe('loading state', () => {
        it('does not fire onClick when loading', async () => {
            const onClick = vi.fn();
            const { user } = render(
                <Button loading onClick={onClick}>
                    Label
                </Button>,
            );
            await user.click(screen.getByRole('button'));
            expect(onClick).not.toHaveBeenCalled();
        });

        it('hides children text when loading', () => {
            render(<Button loading>Label</Button>);
            expect(screen.getByRole('button')).not.toHaveTextContent('Label');
        });

        it('hides enhancers when loading', () => {
            render(
                <Button loading startEnhancer={<span data-testid="start">S</span>}>
                    Label
                </Button>,
            );
            expect(screen.queryByTestId('start')).not.toBeInTheDocument();
        });
    });

    describe('onClick', () => {
        it('fires onClick when clicked', async () => {
            const onClick = vi.fn();
            const { user } = render(<Button onClick={onClick}>Label</Button>);
            await user.click(screen.getByRole('button'));
            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('href rendering', () => {
        it('renders as an anchor when href is provided', () => {
            render(<Button href="https://example.com">Link</Button>);
            const anchor = screen.getByRole('link', { name: /link/i });
            expect(anchor).toBeInTheDocument();
            expect(anchor).toHaveAttribute('href', 'https://example.com');
        });

        it('defaults target to _self', () => {
            render(<Button href="https://example.com">Link</Button>);
            expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
        });

        it('applies hreftarget when provided', () => {
            render(
                <Button href="https://example.com" hreftarget="_blank">
                    Link
                </Button>,
            );
            const anchor = screen.getByRole('link');
            expect(anchor).toHaveAttribute('target', '_blank');
            expect(anchor).toHaveAttribute('rel', 'noreferrer');
        });

        it('does not fire onClick when href is set', async () => {
            const onClick = vi.fn();
            const { user } = render(
                <Button href="https://example.com" onClick={onClick}>
                    Link
                </Button>,
            );
            await user.click(screen.getByRole('link'));
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('enhancers', () => {
        it('renders startEnhancer as ReactNode', () => {
            render(<Button startEnhancer={<span data-testid="start-icon">icon</span>}>Label</Button>);
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
        });

        it('renders endEnhancer as ReactNode', () => {
            render(<Button endEnhancer={<span data-testid="end-icon">icon</span>}>Label</Button>);
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
        });

        it('renders startEnhancer as function', () => {
            render(<Button startEnhancer={({ size }) => <span data-testid="fn-icon">{size}</span>}>Label</Button>);
            expect(screen.getByTestId('fn-icon')).toBeInTheDocument();
            expect(screen.getByTestId('fn-icon')).toHaveTextContent('13');
        });

        it('passes correct size to enhancer based on button size', () => {
            render(
                <Button size="xs" startEnhancer={({ size }) => <span data-testid="fn-icon">{size}</span>}>
                    Label
                </Button>,
            );
            expect(screen.getByTestId('fn-icon')).toHaveTextContent('9');
        });
    });

    describe('notification dot', () => {
        it('renders notification dot when displayNotificationDot is true', () => {
            const { container } = render(<Button displayNotificationDot>Label</Button>);
            const dotWrapper = container.querySelector('.absolute');
            expect(dotWrapper).toBeInTheDocument();
        });

        it('does not render notification dot by default', () => {
            const { container } = render(<Button>Label</Button>);
            const dotWrapper = container.querySelector('.absolute');
            expect(dotWrapper).not.toBeInTheDocument();
        });
    });

    describe('custom colors and theme', () => {
        it('applies custom colors as CSS variables', () => {
            render(<Button colors={{ primary: '#ff0000', secondary: '#00ff00' }}>Label</Button>);
            const button = screen.getByRole('button');
            expect(button.style.getPropertyValue('--pte-new-colors-buttonFill')).toBe('#ff0000');
            expect(button.style.getPropertyValue('--pte-new-colors-buttonFillHover')).toBe('#00ff00');
        });

        it('applies theme preset', () => {
            render(<Button theme="negative">Label</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('style');
        });
    });

    describe('className forwarding', () => {
        it('forwards custom className', () => {
            render(<Button className="custom-class">Label</Button>);
            expect(screen.getByRole('button')).toHaveClass('custom-class');
        });

        it('preserves internal classes when custom className is added', () => {
            render(<Button className="custom-class">Label</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('button');
            expect(button).toHaveClass('primary');
            expect(button).toHaveClass('pill');
            expect(button).toHaveClass('large');
            expect(button).toHaveClass('custom-class');
        });
    });

    describe('corners', () => {
        it('applies corner preset class', () => {
            render(
                <Button shape="rectangle" corners="sharp">
                    Label
                </Button>,
            );
            expect(screen.getByRole('button')).toHaveClass('sharp');
        });

        it('applies custom corner radius as inline style', () => {
            render(
                <Button shape="rectangle" corners="8px">
                    Label
                </Button>,
            );
            expect(screen.getByRole('button').style.borderRadius).toBe('8px');
        });
    });

    describe('type attribute', () => {
        it('defaults to button type', () => {
            render(<Button>Label</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        });

        it('allows submit type', () => {
            render(<Button type="submit">Label</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
        });
    });
});
