import { render, screen } from '../../test/render';
import { Avatar } from './Avatar';

describe('Avatar', () => {
    it('renders children', () => {
        render(
            <Avatar>
                <img src="/photo.jpg" alt="User" />
            </Avatar>,
        );
        expect(screen.getByAltText('User')).toBeInTheDocument();
    });

    it('renders text children (initials)', () => {
        render(<Avatar>AB</Avatar>);
        expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('applies content class', () => {
        const { container } = render(<Avatar>AB</Avatar>);
        expect(container.firstElementChild).toHaveClass('content');
    });

    it('forwards className', () => {
        const { container } = render(<Avatar className="extra">AB</Avatar>);
        expect(container.firstElementChild).toHaveClass('content', 'extra');
    });

    it('sets fit-content width by default', () => {
        const { container } = render(<Avatar>AB</Avatar>);
        expect(container.firstElementChild).toHaveStyle({ width: 'fit-content' });
    });

    it('sets numeric width in pixels', () => {
        const { container } = render(<Avatar width={48}>AB</Avatar>);
        expect(container.firstElementChild).toHaveStyle({ width: '48px' });
    });

    it('sets string width as-is', () => {
        const { container } = render(<Avatar width="3rem">AB</Avatar>);
        expect(container.firstElementChild).toHaveStyle({ width: '3rem' });
    });

    it('applies frame color as CSS variable', () => {
        const { container } = render(<Avatar frameColor="red">AB</Avatar>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.style.getPropertyValue('--frame-color')).toBe('red');
    });

    it('applies default frame color CSS variable', () => {
        const { container } = render(<Avatar>AB</Avatar>);
        const el = container.firstElementChild as HTMLElement;
        // Default is pvar('new.colors.borderMedium') which produces a var() string
        expect(el.style.getPropertyValue('--frame-color')).toBeTruthy();
    });

    it('forwards HTML div attributes', () => {
        render(
            <Avatar data-testid="avatar" id="avatar-1">
                AB
            </Avatar>,
        );
        const avatar = screen.getByTestId('avatar');
        expect(avatar).toHaveAttribute('id', 'avatar-1');
    });

    it('merges custom style with computed styles', () => {
        const { container } = render(
            <Avatar style={{ border: '2px solid blue' }} width={64}>
                AB
            </Avatar>,
        );
        const el = container.firstElementChild as HTMLElement;
        expect(el.style.border).toBe('2px solid blue');
        expect(el.style.width).toBe('64px');
    });
});
