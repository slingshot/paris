import { render, screen } from '../../test/render';
import { Callout } from './Callout';

describe('Callout', () => {
    it('renders children text', () => {
        render(<Callout>Important message</Callout>);
        expect(screen.getByText('Important message')).toBeInTheDocument();
    });

    it('renders non-string children', () => {
        render(
            <Callout>
                <strong>Bold message</strong>
            </Callout>,
        );
        expect(screen.getByText('Bold message')).toBeInTheDocument();
    });

    it('applies default variant class', () => {
        const { container } = render(<Callout>Message</Callout>);
        expect(container.firstElementChild).toHaveClass('content', 'default');
    });

    it('applies warning variant', () => {
        const { container } = render(<Callout variant="warning">Warning!</Callout>);
        expect(container.firstElementChild).toHaveClass('content', 'warning');
    });

    it('applies positive variant', () => {
        const { container } = render(<Callout variant="positive">Success!</Callout>);
        expect(container.firstElementChild).toHaveClass('content', 'positive');
    });

    it('applies negative variant', () => {
        const { container } = render(<Callout variant="negative">Error!</Callout>);
        expect(container.firstElementChild).toHaveClass('content', 'negative');
    });

    it('renders default icon when no icon prop is provided', () => {
        const { container } = render(<Callout>With icon</Callout>);
        const iconWrapper = container.querySelector('.icon');
        expect(iconWrapper).toBeInTheDocument();
    });

    it('renders a custom icon', () => {
        render(<Callout icon={<svg data-testid="custom-icon" />}>With custom icon</Callout>);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('hides the icon when icon is null', () => {
        const { container } = render(<Callout icon={null}>No icon</Callout>);
        const iconWrapper = container.querySelector('.icon');
        expect(iconWrapper).not.toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<Callout className="extra">Message</Callout>);
        expect(container.firstElementChild).toHaveClass('extra');
    });

    it('forwards HTML div attributes', () => {
        render(
            <Callout data-testid="my-callout" role="alert">
                Alert!
            </Callout>,
        );
        const callout = screen.getByTestId('my-callout');
        expect(callout).toHaveAttribute('role', 'alert');
    });

    it('combines variant and custom className', () => {
        const { container } = render(
            <Callout variant="negative" className="custom">
                Error
            </Callout>,
        );
        expect(container.firstElementChild).toHaveClass('content', 'negative', 'custom');
    });
});
