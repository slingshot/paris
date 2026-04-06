import { render, screen } from '../../test/render';
import { Field } from './Field';

describe('Field', () => {
    it('renders children', () => {
        render(
            <Field label="Name">
                <input data-testid="child" />
            </Field>,
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders a string label as a <label> element', () => {
        render(
            <Field label="Email" htmlFor="email-input">
                <input id="email-input" />
            </Field>,
        );
        const label = screen.getByText('Email');
        expect(label.tagName).toBe('LABEL');
        expect(label).toHaveAttribute('for', 'email-input');
    });

    it('renders a ReactNode label wrapped in a plain <label>', () => {
        render(
            <Field label={<span data-testid="custom-label">Custom</span>} htmlFor="input-id">
                <input id="input-id" />
            </Field>,
        );
        const customLabel = screen.getByTestId('custom-label');
        expect(customLabel).toBeInTheDocument();
        // The wrapping <label> should have the htmlFor
        expect(customLabel.closest('label')).toHaveAttribute('for', 'input-id');
    });

    it('hides the label visually when hideLabel is true', () => {
        render(
            <Field label="Hidden Label" hideLabel>
                <input />
            </Field>,
        );
        const label = screen.getByText('Hidden Label');
        expect(label).toHaveClass('hidden');
    });

    it('renders a string description', () => {
        render(
            <Field label="Name" description="Enter your full name" htmlFor="name">
                <input id="name" />
            </Field>,
        );
        expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    });

    it('hides the description when hideDescription is true', () => {
        render(
            <Field label="Name" description="Helper text" hideDescription htmlFor="name">
                <input id="name" />
            </Field>,
        );
        const desc = screen.getByText('Helper text');
        expect(desc).toHaveClass('hidden');
    });

    it('hides the description element when no description is provided', () => {
        render(
            <Field label="Name" htmlFor="test-id">
                <input id="test-id" />
            </Field>,
        );
        const descEl = document.getElementById('test-id-description');
        expect(descEl).toBeInTheDocument();
        expect(descEl).toHaveClass('hidden');
    });

    it('renders description at the bottom by default', () => {
        const { container } = render(
            <Field label="Name" description="Below input" htmlFor="name">
                <input id="name" />
            </Field>,
        );
        const rootDiv = container.firstElementChild!;
        const children = Array.from(rootDiv.children);
        // Order: label, children (input), description
        const labelIdx = children.findIndex((el) => el.textContent === 'Name');
        const descIdx = children.findIndex((el) => el.textContent === 'Below input');
        expect(descIdx).toBeGreaterThan(labelIdx);
    });

    it('renders description above children when descriptionPosition is top', () => {
        const { container } = render(
            <Field label="Name" description="Above input" descriptionPosition="top" htmlFor="name">
                <input id="name" data-testid="input" />
            </Field>,
        );
        const rootDiv = container.firstElementChild!;
        const children = Array.from(rootDiv.children);
        // When top: label and description are in a labelContainer div, then children
        const labelContainer = children[0];
        expect(labelContainer).toHaveClass('labelContainer');
        expect(labelContainer.textContent).toContain('Name');
        expect(labelContainer.textContent).toContain('Above input');
    });

    it('focuses the input when the container is clicked', async () => {
        const { user } = render(
            <Field label="Click me" htmlFor="focusable">
                <input id="focusable" data-testid="focusable" />
            </Field>,
        );
        const label = screen.getByText('Click me');
        await user.click(label);
        expect(screen.getByTestId('focusable')).toHaveFocus();
    });

    it('does not focus the input when disabled', async () => {
        const { user, container } = render(
            <Field label="Disabled" htmlFor="disabled-input" disabled>
                <input id="disabled-input" data-testid="disabled-input" />
            </Field>,
        );
        await user.click(container.firstElementChild!);
        expect(screen.getByTestId('disabled-input')).not.toHaveFocus();
    });

    it('applies overrides.container props', () => {
        render(
            <Field label="Test" overrides={{ container: { 'data-testid': 'custom-container' } }}>
                <input />
            </Field>,
        );
        expect(screen.getByTestId('custom-container')).toBeInTheDocument();
    });

    it('renders ReactNode description in a div', () => {
        render(
            <Field label="Name" description={<em data-testid="em-desc">Emphasized</em>} htmlFor="name">
                <input id="name" />
            </Field>,
        );
        const emDesc = screen.getByTestId('em-desc');
        expect(emDesc).toBeInTheDocument();
        expect(emDesc.closest('div')).toHaveAttribute('id', 'name-description');
    });
});
