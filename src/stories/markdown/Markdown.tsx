'use client';

import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';
import { Children, isValidElement, memo, useMemo } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Accordion } from '../accordion';
import { Callout } from '../callout';
import { StyledLink } from '../styledlink';
import type { TextProps } from '../text';
import { Text } from '../text';
import { pvar } from '../theme';
import styles from './Markdown.module.scss';

export type MarkdownSize = Extract<
    TextProps['kind'],
    'paragraphLarge' | 'paragraphMedium' | 'paragraphSmall' | 'paragraphXSmall' | 'paragraphXXSmall'
>;

const smallerSize: Record<MarkdownSize, MarkdownSize> = {
    paragraphLarge: 'paragraphMedium',
    paragraphMedium: 'paragraphSmall',
    paragraphSmall: 'paragraphXSmall',
    paragraphXSmall: 'paragraphXXSmall',
    paragraphXXSmall: 'paragraphXXSmall',
};

/**
 * Extracts plain text from React children recursively.
 * Useful for generating IDs from heading content.
 */
function extractText(children: ReactNode): string {
    return Children.toArray(children)
        .map((child) => {
            if (typeof child === 'string') return child;
            if (typeof child === 'number') return String(child);
            if (isValidElement<{ children?: ReactNode }>(child) && child.props?.children) {
                return extractText(child.props.children);
            }
            return '';
        })
        .join('');
}

/**
 * Maps heading level to Paris Text `kind` and HTML element.
 */
const headingConfig = {
    1: { kind: 'headingLarge', as: 'h1' },
    2: { kind: 'headingMedium', as: 'h2' },
    3: { kind: 'headingSmall', as: 'h3' },
    4: { kind: 'headingXSmall', as: 'h4' },
    5: { kind: 'headingXXSmall', as: 'h5' },
    6: { kind: 'labelMedium', as: 'h6' },
} as const;

/**
 * Creates a heading component for a given level (1–6).
 */
function createHeading(level: keyof typeof headingConfig) {
    const { kind, as } = headingConfig[level];
    const HeadingComponent: Components[`h${typeof level}`] = ({ children }) => {
        const id = extractText(children)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
        return (
            <Text as={as} kind={kind} className={styles.heading} id={id}>
                {children}
            </Text>
        );
    };
    return HeadingComponent;
}

/**
 * Builds the react-markdown component overrides for a given base text size.
 */
function createMarkdownComponents(size: MarkdownSize): Components {
    const ddSize = smallerSize[size];

    return {
        // ── Headings ──────────────────────────────────────────────
        h1: createHeading(1),
        h2: createHeading(2),
        h3: createHeading(3),
        h4: createHeading(4),
        h5: createHeading(5),
        h6: createHeading(6),

        // ── Paragraphs & inline text ─────────────────────────────
        p: ({ children }) => (
            <Text as="p" kind={size} className={styles.paragraph}>
                {children}
            </Text>
        ),
        strong: ({ children }) => (
            <Text as="span" kind={size} weight="semibold">
                {children}
            </Text>
        ),
        em: ({ children }) => (
            <Text as="span" kind={size} fontStyle="italic">
                {children}
            </Text>
        ),
        del: ({ children }) => <span className={styles.strikethrough}>{children}</span>,

        // ── Links & images ───────────────────────────────────────
        a: ({ href, children }) => (
            <StyledLink href={href} target="_blank" rel="noopener noreferrer">
                {children}
            </StyledLink>
        ),
        img: ({ src, alt }) => (
            <span className={styles.imageWrapper}>
                <img src={src} alt={alt || ''} className={styles.image} loading="lazy" />
            </span>
        ),

        // ── Blockquotes ──────────────────────────────────────────
        blockquote: ({ children }) => (
            <Callout variant="default" icon={null} className={styles.blockquote}>
                {children}
            </Callout>
        ),

        // ── Horizontal rules ─────────────────────────────────────
        hr: () => <hr className={styles.hr} />,

        // ── Lists ────────────────────────────────────────────────
        ul: ({ children, className }) => {
            const isTaskList = className === 'contains-task-list';
            return (
                <ul className={clsx(styles.list, styles.unorderedList, isTaskList && styles.taskList)}>{children}</ul>
            );
        },
        ol: ({ children, start }) => (
            <ol className={clsx(styles.list, styles.orderedList)} start={start}>
                {children}
            </ol>
        ),
        li: ({ children, className }) => {
            const isTask = className === 'task-list-item';
            return <li className={clsx(styles.listItem, isTask && styles.taskListItem)}>{children}</li>;
        },

        // ── Code ─────────────────────────────────────────────────
        code: ({ children, className }) => {
            const languageMatch = className?.match(/language-(\w+)/);
            const isBlock = !!languageMatch;

            if (isBlock) {
                return (
                    <div className={styles.codeBlockWrapper}>
                        {languageMatch?.[1] && (
                            <div className={styles.codeLanguage}>
                                <Text as="span" kind="labelXSmall" weight="medium">
                                    {languageMatch[1]}
                                </Text>
                            </div>
                        )}
                        <code className={clsx(styles.codeBlock, className)}>{children}</code>
                    </div>
                );
            }

            return <code className={styles.inlineCode}>{children}</code>;
        },
        pre: ({ children }) => <pre className={styles.pre}>{children}</pre>,

        // ── Tables ───────────────────────────────────────────────
        table: ({ children }) => (
            <div className={styles.tableWrapper}>
                <table className={styles.table}>{children}</table>
            </div>
        ),
        thead: ({ children }) => <thead className={styles.thead}>{children}</thead>,
        tbody: ({ children }) => <tbody className={styles.tbody}>{children}</tbody>,
        tr: ({ children }) => <tr className={styles.tr}>{children}</tr>,
        th: ({ children, style }) => (
            <th className={styles.th} style={style}>
                <Text as="span" kind="labelXSmall" weight="semibold">
                    {children}
                </Text>
            </th>
        ),
        td: ({ children, style }) => (
            <td className={styles.td} style={style}>
                {children}
            </td>
        ),

        // ── HTML passthrough elements ────────────────────────────
        details: ({ children }) => {
            const childArray = Children.toArray(children);
            let summaryContent: ReactNode = 'Details';
            const bodyContent: ReactNode[] = [];

            for (const child of childArray) {
                if (isValidElement<{ children?: ReactNode }>(child) && child.type === 'summary') {
                    summaryContent = child.props.children;
                } else {
                    bodyContent.push(child);
                }
            }

            return (
                <Accordion title={summaryContent} kind="card" size="small">
                    <div className={styles.accordionBody}>{bodyContent}</div>
                </Accordion>
            );
        },
        summary: () => null,

        kbd: ({ children }) => <kbd className={styles.kbd}>{children}</kbd>,
        sup: ({ children }) => <sup className={styles.sup}>{children}</sup>,
        sub: ({ children }) => <sub className={styles.sub}>{children}</sub>,
        mark: ({ children }) => <mark className={styles.mark}>{children}</mark>,

        // ── Definition lists (HTML passthrough) ──────────────────
        dl: ({ children }) => <dl className={styles.dl}>{children}</dl>,
        dt: ({ children }) => (
            <dt className={styles.dt}>
                <Text as="span" kind={size} weight="semibold">
                    {children}
                </Text>
            </dt>
        ),
        dd: ({ children }) => (
            <dd className={styles.dd}>
                <Text as="span" kind={ddSize} color={pvar('new.colors.contentSecondary')}>
                    {children}
                </Text>
            </dd>
        ),
    };
}

export type MarkdownProps = {
    /** The markdown string to render. */
    children: string;
    /** An optional CSS class name for the wrapper element. */
    className?: string;
    /**
     * The base text size for body content (paragraphs, list items, inline text).
     * Maps to Paris paragraph typography variants. Headings and labels are unaffected.
     * @default 'paragraphSmall'
     */
    size?: MarkdownSize;
};

/**
 * A `Markdown` component renders a markdown string using Paris design system components.
 *
 * It supports GitHub-flavored markdown (tables, task lists, strikethrough, footnotes)
 * and HTML passthrough for elements like `<kbd>`, `<mark>`, `<details>`, and `<dl>`.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```tsx
 * import { Markdown } from 'paris/markdown';
 *
 * export const Example: FC = () => (
 *     <Markdown>{`# Hello World\n\nThis is **bold** and *italic* text.`}</Markdown>
 * );
 * ```
 *
 * @constructor
 */
export const Markdown: FC<MarkdownProps> = memo(({ children, className, size = 'paragraphSmall' }) => {
    const components = useMemo(() => createMarkdownComponents(size), [size]);

    return (
        <div
            className={clsx(styles.markdown, className)}
            style={
                {
                    '--markdown-base-font-size': `var(--pte-new-typography-styles-${size}-fontSize)`,
                } as React.CSSProperties
            }
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
                {children}
            </ReactMarkdown>
        </div>
    );
});
