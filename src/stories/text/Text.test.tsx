import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test/render';
import { Text } from './Text';

describe('Text', () => {
    it('renders children as text', () => {
        render(<Text>Hello World</Text>);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders as a span by default', () => {
        render(<Text>Default span</Text>);
        const el = screen.getByText('Default span');
        expect(el.tagName).toBe('SPAN');
    });

    it('renders as different elements via the as prop', () => {
        const { unmount } = render(<Text as="h1">Heading</Text>);
        expect(screen.getByText('Heading').tagName).toBe('H1');
        unmount();

        const { unmount: unmount2 } = render(<Text as="p">Paragraph</Text>);
        expect(screen.getByText('Paragraph').tagName).toBe('P');
        unmount2();

        render(<Text as="label">Label</Text>);
        expect(screen.getByText('Label').tagName).toBe('LABEL');
    });

    it('applies the paragraphMedium kind class by default', () => {
        render(<Text>Styled text</Text>);
        const el = screen.getByText('Styled text');
        expect(el.className).toContain('paragraphMedium');
    });

    it('applies a custom kind class', () => {
        render(<Text kind="headingLarge">Big heading</Text>);
        const el = screen.getByText('Big heading');
        expect(el.className).toContain('headingLarge');
    });

    it('applies weight class when weight is provided', () => {
        render(<Text weight="bold">Bold text</Text>);
        const el = screen.getByText('Bold text');
        expect(el.className).toContain('weight-bold');
    });

    it('applies fontStyle class when fontStyle is provided', () => {
        render(<Text fontStyle="italic">Italic text</Text>);
        const el = screen.getByText('Italic text');
        expect(el.className).toContain('fontStyle-italic');
    });

    it('sets --text-color CSS variable when color is provided', () => {
        render(<Text color="red">Red text</Text>);
        const el = screen.getByText('Red text');
        expect(el.style.getPropertyValue('--text-color')).toBe('red');
    });

    it('does not set style when no color is provided', () => {
        render(<Text>No color</Text>);
        const el = screen.getByText('No color');
        expect(el.style.getPropertyValue('--text-color')).toBe('');
    });

    it('forwards className prop', () => {
        render(<Text className="custom-class">Custom</Text>);
        const el = screen.getByText('Custom');
        expect(el.className).toContain('custom-class');
    });

    it('forwards additional HTML props', () => {
        render(
            <Text data-testid="text-element" id="my-text">
                Props test
            </Text>,
        );
        const el = screen.getByTestId('text-element');
        expect(el.id).toBe('my-text');
    });
});
