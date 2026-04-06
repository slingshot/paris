import { render, screen } from '../../test/render';
import { RemoveFromDOM } from './RemoveFromDOM';
import { TextWhenString } from './TextWhenString';
import { VisuallyHidden } from './VisuallyHidden';

describe('RemoveFromDOM', () => {
    it('renders children when `when` is false', () => {
        render(
            <RemoveFromDOM when={false}>
                <span>visible child</span>
            </RemoveFromDOM>,
        );
        expect(screen.getByText('visible child')).toBeInTheDocument();
    });

    it('removes children from the DOM when `when` is true', () => {
        render(
            <RemoveFromDOM when={true}>
                <span>hidden child</span>
            </RemoveFromDOM>,
        );
        expect(screen.queryByText('hidden child')).not.toBeInTheDocument();
    });

    it('toggles visibility when `when` prop changes', () => {
        const { rerender } = render(
            <RemoveFromDOM when={false}>
                <span>toggle me</span>
            </RemoveFromDOM>,
        );
        expect(screen.getByText('toggle me')).toBeInTheDocument();

        rerender(
            <RemoveFromDOM when={true}>
                <span>toggle me</span>
            </RemoveFromDOM>,
        );
        expect(screen.queryByText('toggle me')).not.toBeInTheDocument();
    });
});

describe('TextWhenString', () => {
    it('wraps string children in a Text component', () => {
        render(<TextWhenString as="span">hello world</TextWhenString>);
        const el = screen.getByText('hello world');
        expect(el).toBeInTheDocument();
        expect(el.tagName).toBe('SPAN');
    });

    it('wraps numeric children in a Text component', () => {
        render(<TextWhenString as="span">{42}</TextWhenString>);
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('passes ReactNode children through without wrapping', () => {
        render(
            <TextWhenString as="span">
                <div data-testid="passthrough">node child</div>
            </TextWhenString>,
        );
        const el = screen.getByTestId('passthrough');
        expect(el).toBeInTheDocument();
        expect(el.tagName).toBe('DIV');
    });
});

describe('VisuallyHidden', () => {
    it('visually hides children when `when` is true (default)', () => {
        render(
            <VisuallyHidden>
                <span>hidden text</span>
            </VisuallyHidden>,
        );
        expect(screen.getByText('hidden text')).toBeInTheDocument();
    });

    it('renders children normally when `when` is false', () => {
        render(
            <VisuallyHidden when={false}>
                <span data-testid="normal">visible text</span>
            </VisuallyHidden>,
        );
        const el = screen.getByTestId('normal');
        expect(el).toBeInTheDocument();
        expect(el.tagName).toBe('SPAN');
    });

    it('visually hides children when `when` is explicitly true', () => {
        render(
            <VisuallyHidden when={true}>
                <span>explicitly hidden</span>
            </VisuallyHidden>,
        );
        expect(screen.getByText('explicitly hidden')).toBeInTheDocument();
    });
});
