import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test/render';
import { Tag } from './Tag';

describe('Tag', () => {
    it('renders children text', () => {
        render(<Tag>Active</Tag>);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
        render(<Tag>Tag div</Tag>);
        const el = screen.getByText('Tag div').closest('div');
        expect(el).toBeInTheDocument();
    });

    it('applies the default kind class', () => {
        const { container } = render(<Tag>Default</Tag>);
        const root = container.firstElementChild;
        expect(root?.className).toContain('default');
    });

    it('applies a custom kind class', () => {
        const { container } = render(<Tag kind="positive">Success</Tag>);
        const root = container.firstElementChild;
        expect(root?.className).toContain('positive');
    });

    it('applies kind variants', () => {
        const kinds = ['secondary', 'warning', 'negative', 'new', 'void', 'draft'] as const;
        for (const kind of kinds) {
            const { container, unmount } = render(<Tag kind={kind}>{kind}</Tag>);
            const root = container.firstElementChild;
            expect(root?.className).toContain(kind);
            unmount();
        }
    });

    it('applies the normal size by default', () => {
        const { container } = render(<Tag>Normal</Tag>);
        const root = container.firstElementChild;
        expect(root?.className).toContain('normal');
    });

    it('applies the compact size', () => {
        const { container } = render(<Tag size="compact">Compact</Tag>);
        const root = container.firstElementChild;
        expect(root?.className).toContain('compact');
    });

    it('applies rectangle shape by default (children visible)', () => {
        render(<Tag>Rectangle</Tag>);
        const textEl = screen.getByText('Rectangle');
        expect(textEl).toBeVisible();
    });

    it('applies square shape and hides children visually', () => {
        const { container } = render(<Tag shape="square">Hidden</Tag>);
        const root = container.firstElementChild;
        expect(root?.className).toContain('square');
    });

    it('applies corner preset classes', () => {
        const { container } = render(<Tag corners="roundedXL">Rounded</Tag>);
        const root = container.firstElementChild;
        expect(root?.className).toContain('roundedXL');
    });

    it('applies custom border radius for non-preset corners', () => {
        const { container } = render(<Tag corners="8px">Custom radius</Tag>);
        const root = container.firstElementChild as HTMLElement;
        expect(root?.style.borderRadius).toBe('8px');
    });

    it('sets data-status attribute for colorLevel', () => {
        const { container } = render(
            <Tag kind="positive" colorLevel="strong">
                Strong
            </Tag>,
        );
        const root = container.firstElementChild;
        expect(root?.getAttribute('data-status')).toBe('strong');
    });

    it('forwards className prop', () => {
        const { container } = render(<Tag className="my-tag">Custom</Tag>);
        const root = container.firstElementChild;
        expect(root?.className).toContain('my-tag');
    });
});
