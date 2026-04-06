import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test/render';
import { StyledLink } from './StyledLink';

describe('StyledLink', () => {
    it('renders children text', () => {
        render(<StyledLink>Click me</StyledLink>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders as an anchor element by default', () => {
        render(<StyledLink>Link</StyledLink>);
        const el = screen.getByText('Link');
        expect(el.tagName).toBe('A');
    });

    it('renders with href attribute', () => {
        render(<StyledLink href="https://example.com">Example</StyledLink>);
        const el = screen.getByText('Example');
        expect(el.getAttribute('href')).toBe('https://example.com');
    });

    it('renders as a different element via the as prop', () => {
        render(<StyledLink as="button">Button link</StyledLink>);
        const el = screen.getByText('Button link');
        expect(el.tagName).toBe('BUTTON');
    });

    it('applies the link style class', () => {
        render(<StyledLink>Styled</StyledLink>);
        const el = screen.getByText('Styled');
        expect(el.className).toContain('link');
    });

    it('forwards className prop and merges with default class', () => {
        render(<StyledLink className="custom-link">Custom</StyledLink>);
        const el = screen.getByText('Custom');
        expect(el.className).toContain('custom-link');
        expect(el.className).toContain('link');
    });

    it('forwards additional HTML props', () => {
        render(
            <StyledLink target="_blank" rel="noopener noreferrer" data-testid="styled-link">
                External
            </StyledLink>,
        );
        const el = screen.getByTestId('styled-link');
        expect(el.getAttribute('target')).toBe('_blank');
        expect(el.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('renders without children', () => {
        const { container } = render(<StyledLink href="/empty" />);
        const anchor = container.querySelector('a');
        expect(anchor).toBeInTheDocument();
        expect(anchor?.getAttribute('href')).toBe('/empty');
    });
});
