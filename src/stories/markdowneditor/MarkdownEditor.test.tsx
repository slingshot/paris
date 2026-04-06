import { render, screen } from '../../test/render';
import { MarkdownEditor } from './MarkdownEditor';

// ProseMirror needs real DOM measurement APIs that jsdom does not provide.
const mockEditor = {
    isDestroyed: false,
    isEditable: true,
    getMarkdown: () => 'mock',
    commands: { setContent: vi.fn() },
    setEditable: vi.fn(),
};

vi.mock('@tiptap/react', () => ({
    useEditor: () => mockEditor,
    EditorContent: ({ editor }: any) => (
        <div data-testid="editor-content">{editor ? 'Editor loaded' : 'No editor'}</div>
    ),
}));

describe('MarkdownEditor', () => {
    it('renders without crashing', () => {
        render(<MarkdownEditor value="" />);
        expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    });

    it('renders the editor content area', () => {
        render(<MarkdownEditor value="" />);
        expect(screen.getByText('Editor loaded')).toBeInTheDocument();
    });

    it('renders children (toolbar slot) inside the editor container', () => {
        render(
            <MarkdownEditor value="">
                <div data-testid="custom-toolbar">Toolbar</div>
            </MarkdownEditor>,
        );
        expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
    });

    it('applies custom className to root element', () => {
        const { container } = render(<MarkdownEditor value="" className="my-editor" />);
        const root = container.firstElementChild;
        expect(root).toHaveClass('my-editor');
    });

    it('sets data-status attribute based on status prop', () => {
        const { container } = render(<MarkdownEditor value="" status="error" />);
        const editorContainer = container.querySelector('[data-status]');
        expect(editorContainer).toHaveAttribute('data-status', 'error');
    });

    it('sets data-status to success', () => {
        const { container } = render(<MarkdownEditor value="" status="success" />);
        const editorContainer = container.querySelector('[data-status]');
        expect(editorContainer).toHaveAttribute('data-status', 'success');
    });

    it('sets data-status to default by default', () => {
        const { container } = render(<MarkdownEditor value="" />);
        const editorContainer = container.querySelector('[data-status]');
        expect(editorContainer).toHaveAttribute('data-status', 'default');
    });

    it('sets data-disabled attribute when editable is false', () => {
        const { container } = render(<MarkdownEditor value="" editable={false} />);
        const editorContainer = container.querySelector('[data-disabled]');
        expect(editorContainer).toHaveAttribute('data-disabled', 'true');
    });

    it('sets data-disabled to false when editable is true (default)', () => {
        const { container } = render(<MarkdownEditor value="" />);
        const editorContainer = container.querySelector('[data-disabled]');
        expect(editorContainer).toHaveAttribute('data-disabled', 'false');
    });

    it('applies override props to root element', () => {
        const { container } = render(
            <MarkdownEditor
                value=""
                overrides={{
                    root: { 'data-testid': 'root-override' },
                }}
            />,
        );
        expect(screen.getByTestId('root-override')).toBeInTheDocument();
    });

    it('applies override props to editor container element', () => {
        render(
            <MarkdownEditor
                value=""
                overrides={{
                    editorContainer: { 'data-testid': 'container-override' },
                }}
            />,
        );
        expect(screen.getByTestId('container-override')).toBeInTheDocument();
    });

    it('sets the markdown base font size CSS variable', () => {
        const { container } = render(<MarkdownEditor value="" size="paragraphMedium" />);
        const editorContent = container.querySelector('[class*="editorContent"]');
        expect(editorContent).toHaveStyle({
            '--markdown-base-font-size': 'var(--pte-new-typography-styles-paragraphMedium-fontSize)',
        });
    });

    it('uses paragraphSmall as the default size', () => {
        const { container } = render(<MarkdownEditor value="" />);
        const editorContent = container.querySelector('[class*="editorContent"]');
        expect(editorContent).toHaveStyle({
            '--markdown-base-font-size': 'var(--pte-new-typography-styles-paragraphSmall-fontSize)',
        });
    });
});
