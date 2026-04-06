import { render, screen, waitFor } from '../../test/render';
import { Markdown } from './Markdown';

describe('Markdown', () => {
    describe('headings', () => {
        it('renders h1', async () => {
            render(<Markdown>{'# Heading 1'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('Heading 1')).toBeInTheDocument();
            });
            expect(screen.getByText('Heading 1').closest('h1')).toBeInTheDocument();
        });

        it('renders h2', async () => {
            render(<Markdown>{'## Heading 2'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('Heading 2').closest('h2')).toBeInTheDocument();
            });
        });

        it('renders h3', async () => {
            render(<Markdown>{'### Heading 3'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('Heading 3').closest('h3')).toBeInTheDocument();
            });
        });

        it('generates slug IDs for headings', async () => {
            render(<Markdown>{'# Hello World'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('Hello World')).toHaveAttribute('id', 'hello-world');
            });
        });
    });

    describe('paragraphs and inline text', () => {
        it('renders paragraphs', async () => {
            render(<Markdown>{'This is a paragraph.'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
            });
        });

        it('renders bold text', async () => {
            render(<Markdown>{'This is **bold** text.'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('bold')).toBeInTheDocument();
            });
        });

        it('renders italic text', async () => {
            render(<Markdown>{'This is *italic* text.'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('italic')).toBeInTheDocument();
            });
        });
    });

    describe('links', () => {
        it('renders links with href', async () => {
            render(<Markdown>{'[Click me](https://example.com)'}</Markdown>);
            await waitFor(() => {
                const link = screen.getByText('Click me');
                expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
            });
        });

        it('renders links with target="_blank"', async () => {
            render(<Markdown>{'[Link](https://example.com)'}</Markdown>);
            await waitFor(() => {
                const link = screen.getByText('Link');
                expect(link.closest('a')).toHaveAttribute('target', '_blank');
            });
        });
    });

    describe('lists', () => {
        it('renders unordered lists', async () => {
            render(<Markdown>{'- Item 1\n- Item 2\n- Item 3'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('Item 1')).toBeInTheDocument();
                expect(screen.getByText('Item 2')).toBeInTheDocument();
                expect(screen.getByText('Item 3')).toBeInTheDocument();
            });
        });

        it('renders ordered lists', async () => {
            render(<Markdown>{'1. First\n2. Second\n3. Third'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('First')).toBeInTheDocument();
                expect(screen.getByText('Second')).toBeInTheDocument();
            });
        });
    });

    describe('code', () => {
        it('renders inline code', async () => {
            render(<Markdown>{'Use `console.log()` to debug.'}</Markdown>);
            await waitFor(() => {
                const code = screen.getByText('console.log()');
                expect(code.tagName).toBe('CODE');
            });
        });

        it('renders code blocks with language', async () => {
            render(<Markdown>{'```js\nconst x = 1;\n```'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('js')).toBeInTheDocument();
                expect(screen.getByText('const x = 1;')).toBeInTheDocument();
            });
        });
    });

    describe('GFM extensions', () => {
        it('renders strikethrough text', async () => {
            render(<Markdown>{'~~deleted~~'}</Markdown>);
            await waitFor(() => {
                const del = screen.getByText('deleted');
                expect(del.closest('span')).toHaveClass('strikethrough');
            });
        });

        it('renders tables', async () => {
            const md = '| Name | Age |\n| --- | --- |\n| Alice | 30 |';
            render(<Markdown>{md}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('Name')).toBeInTheDocument();
                expect(screen.getByText('Alice')).toBeInTheDocument();
                expect(screen.getByText('30')).toBeInTheDocument();
            });
        });

        it('renders task lists', async () => {
            const md = '- [x] Done\n- [ ] Todo';
            const { container } = render(<Markdown>{md}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('Done')).toBeInTheDocument();
                expect(screen.getByText('Todo')).toBeInTheDocument();
            });
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            expect(checkboxes.length).toBe(2);
        });
    });

    describe('raw HTML', () => {
        it('renders kbd elements', async () => {
            render(<Markdown>{'Press <kbd>Ctrl</kbd>+<kbd>C</kbd>'}</Markdown>);
            await waitFor(() => {
                const kbd = screen.getByText('Ctrl');
                expect(kbd.tagName).toBe('KBD');
            });
        });

        it('renders mark elements', async () => {
            render(<Markdown>{'This is <mark>highlighted</mark> text.'}</Markdown>);
            await waitFor(() => {
                const mark = screen.getByText('highlighted');
                expect(mark.tagName).toBe('MARK');
            });
        });

        it('renders sup elements', async () => {
            render(<Markdown>{'E=mc<sup>2</sup>'}</Markdown>);
            await waitFor(() => {
                const sup = screen.getByText('2');
                expect(sup.tagName).toBe('SUP');
            });
        });
    });

    describe('blockquotes', () => {
        it('renders blockquotes', async () => {
            render(<Markdown>{'> This is a quote'}</Markdown>);
            await waitFor(() => {
                expect(screen.getByText('This is a quote')).toBeInTheDocument();
            });
        });
    });

    describe('horizontal rules', () => {
        it('renders hr elements', async () => {
            const { container } = render(<Markdown>{'Above\n\n---\n\nBelow'}</Markdown>);
            await waitFor(() => {
                expect(container.querySelector('hr')).toBeInTheDocument();
            });
        });
    });

    describe('images', () => {
        it('renders images with src and alt', async () => {
            render(<Markdown>{'![Alt text](https://example.com/image.png)'}</Markdown>);
            await waitFor(() => {
                const img = screen.getByAltText('Alt text');
                expect(img).toHaveAttribute('src', 'https://example.com/image.png');
            });
        });
    });

    describe('className', () => {
        it('applies custom className', () => {
            const { container } = render(<Markdown className="custom-md">{'Hello'}</Markdown>);
            expect(container.firstElementChild).toHaveClass('custom-md');
        });

        it('always applies the markdown base class', () => {
            const { container } = render(<Markdown>{'Hello'}</Markdown>);
            expect(container.firstElementChild).toHaveClass('markdown');
        });
    });

    describe('size', () => {
        it('sets CSS variable for base font size', () => {
            const { container } = render(<Markdown size="paragraphLarge">{'Hello'}</Markdown>);
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper.style.getPropertyValue('--markdown-base-font-size')).toBe(
                'var(--pte-new-typography-styles-paragraphLarge-fontSize)',
            );
        });

        it('defaults to paragraphSmall', () => {
            const { container } = render(<Markdown>{'Hello'}</Markdown>);
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper.style.getPropertyValue('--markdown-base-font-size')).toBe(
                'var(--pte-new-typography-styles-paragraphSmall-fontSize)',
            );
        });
    });
});
