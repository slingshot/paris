import { createRef } from 'react';
import { render, screen } from '../../test/render';
import { Input } from './Input';

describe('Input', () => {
    it('renders with a label', () => {
        render(<Input label="Username" />);
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders an input element with type text by default', () => {
        render(<Input label="Name" />);
        const input = screen.getByLabelText('Name');
        expect(input.tagName).toBe('INPUT');
        expect(input).toHaveAttribute('type', 'text');
    });

    it('allows typing into the input', async () => {
        const { user } = render(<Input label="Email" />);
        const input = screen.getByLabelText('Email');
        await user.type(input, 'test@example.com');
        expect(input).toHaveValue('test@example.com');
    });

    it('displays placeholder text', () => {
        render(<Input label="Search" placeholder="Type to search..." />);
        expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
    });

    it('sets data-status to default when no status is provided', () => {
        render(<Input label="Default" />);
        const input = screen.getByLabelText('Default');
        expect(input).toHaveAttribute('data-status', 'default');
    });

    it('sets data-status to error', () => {
        render(<Input label="Error field" status="error" />);
        const input = screen.getByLabelText('Error field');
        expect(input).toHaveAttribute('data-status', 'error');
    });

    it('sets data-status to success', () => {
        render(<Input label="Success field" status="success" />);
        const input = screen.getByLabelText('Success field');
        expect(input).toHaveAttribute('data-status', 'success');
    });

    it('sets data-status to disabled when disabled', () => {
        render(<Input label="Disabled" disabled />);
        const input = screen.getByLabelText('Disabled');
        expect(input).toHaveAttribute('data-status', 'disabled');
        expect(input).toHaveAttribute('aria-disabled', 'true');
        expect(input).toHaveAttribute('readonly');
    });

    it('overrides status with disabled when both are provided', () => {
        render(<Input label="Both" status="error" disabled />);
        const input = screen.getByLabelText('Both');
        expect(input).toHaveAttribute('data-status', 'disabled');
    });

    it('forwards ref to the input element', () => {
        const ref = createRef<HTMLInputElement>();
        render(<Input label="Ref test" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current).toBe(screen.getByLabelText('Ref test'));
    });

    it('renders with different input types', () => {
        render(<Input label="Password" type="password" />);
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('renders type email', () => {
        render(<Input label="Email" type="email" />);
        expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    it('renders type number', () => {
        render(<Input label="Age" type="number" />);
        expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
    });

    it('renders a start enhancer', () => {
        render(<Input label="With start" startEnhancer={<span data-testid="start-icon">$</span>} />);
        expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders an end enhancer', () => {
        render(<Input label="With end" endEnhancer={<span data-testid="end-icon">%</span>} />);
        expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('renders both start and end enhancers', () => {
        render(
            <Input
                label="Both enhancers"
                startEnhancer={<span data-testid="start">S</span>}
                endEnhancer={<span data-testid="end">E</span>}
            />,
        );
        expect(screen.getByTestId('start')).toBeInTheDocument();
        expect(screen.getByTestId('end')).toBeInTheDocument();
    });

    it('renders a function enhancer', () => {
        render(
            <Input label="Fn enhancer" startEnhancer={({ size }) => <span data-testid="fn-enhancer">{size}</span>} />,
        );
        expect(screen.getByTestId('fn-enhancer')).toBeInTheDocument();
    });

    it('forwards className to the input element', () => {
        render(<Input label="Classy" className="my-custom-class" />);
        const input = screen.getByLabelText('Classy');
        expect(input).toHaveClass('my-custom-class');
    });

    it('sets aria-describedby linking to the description', () => {
        render(<Input label="Described" description="Some helper text" />);
        const input = screen.getByLabelText('Described');
        const describedBy = input.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        const descriptionEl = document.getElementById(describedBy!);
        expect(descriptionEl).toBeInTheDocument();
        expect(descriptionEl).toHaveTextContent('Some helper text');
    });

    it('renders description text', () => {
        render(<Input label="With desc" description="Helpful description" />);
        expect(screen.getByText('Helpful description')).toBeInTheDocument();
    });

    it('hides label when hideLabel is true', () => {
        render(<Input label="Hidden" hideLabel />);
        const label = screen.getByText('Hidden');
        expect(label).toHaveClass('hidden');
    });

    it('calls onChange handler', async () => {
        const handleChange = vi.fn();
        const { user } = render(<Input label="Change test" onChange={handleChange} />);
        await user.type(screen.getByLabelText('Change test'), 'a');
        expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus and onBlur handlers', async () => {
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();
        const { user } = render(<Input label="Focus test" onFocus={handleFocus} onBlur={handleBlur} />);
        const input = screen.getByLabelText('Focus test');
        await user.click(input);
        expect(handleFocus).toHaveBeenCalled();
        await user.tab();
        expect(handleBlur).toHaveBeenCalled();
    });

    it('uses aria-label prop when label is not a string', () => {
        render(<Input label={<span>Complex label</span>} aria-label="accessible label" />);
        expect(screen.getByRole('textbox', { name: 'accessible label' })).toBeInTheDocument();
    });

    it('applies container override className', () => {
        render(<Input label="Override test" overrides={{ container: { 'data-testid': 'wrapper' } }} />);
        expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    });

    it('spreads additional HTML input props', () => {
        render(<Input label="Extra" maxLength={10} autoComplete="off" />);
        const input = screen.getByLabelText('Extra');
        expect(input).toHaveAttribute('maxlength', '10');
        expect(input).toHaveAttribute('autocomplete', 'off');
    });
});
