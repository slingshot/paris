import { render, screen } from '../../test/render';
import { Card } from './Card';

describe('Card', () => {
    it('renders children', () => {
        render(<Card>Hello world</Card>);
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders non-string children without Text wrapper', () => {
        render(
            <Card>
                <button type="button">Click me</button>
            </Card>,
        );
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Card className="custom-class">Content</Card>);
        expect(container.firstElementChild).toHaveClass('custom-class');
    });

    it('applies raised kind by default', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstElementChild).toHaveClass('container', 'raised');
    });

    it('applies surface kind', () => {
        const { container } = render(<Card kind="surface">Content</Card>);
        expect(container.firstElementChild).toHaveClass('container', 'surface');
    });

    it('applies flat kind', () => {
        const { container } = render(<Card kind="flat">Content</Card>);
        expect(container.firstElementChild).toHaveClass('container', 'flat');
    });

    it('applies default status by default', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstElementChild).toHaveClass('default');
    });

    it('applies pending status', () => {
        const { container } = render(<Card status="pending">Content</Card>);
        expect(container.firstElementChild).toHaveClass('pending');
    });

    it('applies text class when children is a string', () => {
        const { container } = render(<Card>Plain text</Card>);
        expect(container.firstElementChild).toHaveClass('text');
    });

    it('does not apply text class when children is not a string', () => {
        const { container } = render(
            <Card>
                <span>Not a string</span>
            </Card>,
        );
        expect(container.firstElementChild).not.toHaveClass('text');
    });

    it('forwards HTML div attributes', () => {
        render(
            <Card data-testid="my-card" id="card-1">
                Content
            </Card>,
        );
        const card = screen.getByTestId('my-card');
        expect(card).toHaveAttribute('id', 'card-1');
    });

    it('combines kind and status classes', () => {
        const { container } = render(
            <Card kind="flat" status="pending">
                Content
            </Card>,
        );
        expect(container.firstElementChild).toHaveClass('container', 'flat', 'pending');
    });
});
