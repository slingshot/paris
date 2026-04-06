import { act, render, screen, waitFor } from '../../test/render';
import { Toast, toast } from './Toast';

describe('Toast', () => {
    it('renders the Toaster container without crashing', () => {
        const { container } = render(<Toast />);
        expect(container).toBeInTheDocument();
    });

    it('displays a toast message when toast() is called', async () => {
        render(<Toast />);

        act(() => {
            toast('Hello from Paris');
        });

        await waitFor(() => {
            expect(screen.getByText('Hello from Paris')).toBeInTheDocument();
        });
    });

    it('displays a success toast', async () => {
        render(<Toast />);

        act(() => {
            toast.success('Operation succeeded');
        });

        await waitFor(() => {
            expect(screen.getByText('Operation succeeded')).toBeInTheDocument();
        });
    });

    it('displays an error toast', async () => {
        render(<Toast />);

        act(() => {
            toast.error('Something went wrong');
        });

        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });
    });

    it('displays a loading toast', async () => {
        render(<Toast />);

        act(() => {
            toast.loading('Please wait...');
        });

        await waitFor(() => {
            expect(screen.getByText('Please wait...')).toBeInTheDocument();
        });
    });

    it('displays a custom JSX toast', async () => {
        render(<Toast />);

        act(() => {
            toast(<span data-testid="custom-toast">Custom content</span>);
        });

        await waitFor(() => {
            expect(screen.getByTestId('custom-toast')).toBeInTheDocument();
        });
    });

    it('applies toast styling className', async () => {
        render(<Toast />);

        act(() => {
            toast('Styled toast');
        });

        await waitFor(() => {
            const toastEl = screen.getByText('Styled toast').closest('[class*="toast"]');
            expect(toastEl).toBeInTheDocument();
        });
    });

    it('passes additional Toaster props through', () => {
        render(<Toast position="bottom-left" />);
    });
});
