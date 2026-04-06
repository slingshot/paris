import { createRef } from 'react';
import { render, screen } from '../../test/render';
import { TextArea } from './TextArea';

describe('TextArea', () => {
    it('renders with a label', () => {
        render(<TextArea label="Message" />);
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('renders a textarea element', () => {
        render(<TextArea label="Bio" />);
        const textarea = screen.getByLabelText('Bio');
        expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('allows typing into the textarea', async () => {
        const { user } = render(<TextArea label="Notes" />);
        const textarea = screen.getByLabelText('Notes');
        await user.type(textarea, 'Hello world');
        expect(textarea).toHaveValue('Hello world');
    });

    it('displays placeholder text', () => {
        render(<TextArea label="Comment" placeholder="Write a comment..." />);
        expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    });

    it('defaults to 3 rows', () => {
        render(<TextArea label="Default rows" />);
        expect(screen.getByLabelText('Default rows')).toHaveAttribute('rows', '3');
    });

    it('accepts a custom rows value', () => {
        render(<TextArea label="Custom rows" rows={6} />);
        expect(screen.getByLabelText('Custom rows')).toHaveAttribute('rows', '6');
    });

    it('sets data-status to default when no status is provided', () => {
        render(<TextArea label="Default status" />);
        expect(screen.getByLabelText('Default status')).toHaveAttribute('data-status', 'default');
    });

    it('sets data-status to error', () => {
        render(<TextArea label="Error" status="error" />);
        expect(screen.getByLabelText('Error')).toHaveAttribute('data-status', 'error');
    });

    it('sets data-status to success', () => {
        render(<TextArea label="Success" status="success" />);
        expect(screen.getByLabelText('Success')).toHaveAttribute('data-status', 'success');
    });

    it('sets data-status to disabled when disabled', () => {
        render(<TextArea label="Disabled" disabled />);
        const textarea = screen.getByLabelText('Disabled');
        expect(textarea).toHaveAttribute('data-status', 'disabled');
        expect(textarea).toHaveAttribute('aria-disabled', 'true');
        expect(textarea).toHaveAttribute('readonly');
    });

    it('overrides status with disabled when both are provided', () => {
        render(<TextArea label="Both" status="error" disabled />);
        expect(screen.getByLabelText('Both')).toHaveAttribute('data-status', 'disabled');
    });

    it('forwards ref to the textarea element', () => {
        const ref = createRef<HTMLTextAreaElement>();
        render(<TextArea label="Ref test" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
        expect(ref.current).toBe(screen.getByLabelText('Ref test'));
    });

    it('renders a start enhancer', () => {
        render(<TextArea label="With start" startEnhancer={<span data-testid="start-icon">S</span>} />);
        expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders an end enhancer', () => {
        render(<TextArea label="With end" endEnhancer={<span data-testid="end-icon">E</span>} />);
        expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('forwards className to the textarea element', () => {
        render(<TextArea label="Classy" className="my-custom-class" />);
        expect(screen.getByLabelText('Classy')).toHaveClass('my-custom-class');
    });

    it('sets aria-describedby linking to the description', () => {
        render(<TextArea label="Described" description="Helper text" />);
        const textarea = screen.getByLabelText('Described');
        const describedBy = textarea.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        const descriptionEl = document.getElementById(describedBy!);
        expect(descriptionEl).toBeInTheDocument();
        expect(descriptionEl).toHaveTextContent('Helper text');
    });

    it('renders description text', () => {
        render(<TextArea label="With desc" description="A helpful note" />);
        expect(screen.getByText('A helpful note')).toBeInTheDocument();
    });

    it('hides label when hideLabel is true', () => {
        render(<TextArea label="Hidden" hideLabel />);
        expect(screen.getByText('Hidden')).toHaveClass('hidden');
    });

    it('calls onChange handler', async () => {
        const handleChange = vi.fn();
        const { user } = render(<TextArea label="Change" onChange={handleChange} />);
        await user.type(screen.getByLabelText('Change'), 'x');
        expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus and onBlur handlers', async () => {
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();
        const { user } = render(<TextArea label="Focus" onFocus={handleFocus} onBlur={handleBlur} />);
        await user.click(screen.getByLabelText('Focus'));
        expect(handleFocus).toHaveBeenCalled();
        await user.tab();
        expect(handleBlur).toHaveBeenCalled();
    });

    it('uses aria-label prop when label is not a string', () => {
        render(<TextArea label={<span>Complex</span>} aria-label="accessible label" />);
        expect(screen.getByRole('textbox', { name: 'accessible label' })).toBeInTheDocument();
    });

    it('applies container override props', () => {
        render(<TextArea label="Override" overrides={{ container: { 'data-testid': 'wrapper' } }} />);
        expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    });

    it('spreads additional HTML textarea props', () => {
        render(<TextArea label="Extra" maxLength={500} />);
        expect(screen.getByLabelText('Extra')).toHaveAttribute('maxlength', '500');
    });

    it('renders a function enhancer', () => {
        render(
            <TextArea label="Fn enhancer" endEnhancer={({ size }) => <span data-testid="fn-enhancer">{size}</span>} />,
        );
        expect(screen.getByTestId('fn-enhancer')).toBeInTheDocument();
    });
});
