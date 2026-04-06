import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test/render';
import { Close } from './Close';
import { Icon } from './Icon';

describe('Icon', () => {
    it('renders with the icon prop', () => {
        render(<Icon icon={Close} size={20} data-testid="icon" />);
        const el = screen.getByTestId('icon');
        expect(el).toBeInTheDocument();
    });

    it('renders as a span by default', () => {
        render(<Icon icon={Close} size={20} data-testid="icon-span" />);
        const el = screen.getByTestId('icon-span');
        expect(el.tagName).toBe('SPAN');
    });

    it('renders as a different element via the as prop', () => {
        render(<Icon icon={Close} size={20} as="div" data-testid="icon-div" />);
        const el = screen.getByTestId('icon-div');
        expect(el.tagName).toBe('DIV');
    });

    it('renders the SVG icon inside', () => {
        render(<Icon icon={Close} size={20} data-testid="icon-svg" />);
        const el = screen.getByTestId('icon-svg');
        const svg = el.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('passes size to the icon definition', () => {
        render(<Icon icon={Close} size={24} data-testid="icon-sized" />);
        const el = screen.getByTestId('icon-sized');
        const svg = el.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('24');
        expect(svg?.getAttribute('height')).toBe('24');
    });

    it('forwards className prop', () => {
        render(<Icon icon={Close} size={20} className="custom-icon" data-testid="icon-class" />);
        const el = screen.getByTestId('icon-class');
        expect(el.className).toContain('custom-icon');
    });

    it('forwards additional HTML props', () => {
        render(<Icon icon={Close} size={20} id="my-icon" data-testid="icon-props" />);
        const el = screen.getByTestId('icon-props');
        expect(el.id).toBe('my-icon');
    });

    it('renders correctly with overrides prop', () => {
        render(<Icon icon={Close} size={16} overrides={{ icon: {} }} data-testid="icon-overrides" />);
        const el = screen.getByTestId('icon-overrides');
        const svg = el.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.getAttribute('width')).toBe('16');
    });
});
