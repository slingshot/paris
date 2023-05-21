// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
    title: 'Content/Text',
    component: Text,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Text>;

/**
 * By default, the Text component renders a `<span>` element with Paragraph Medium styling.
 */
export const Default: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'paragraphMedium',
        as: 'span',
    },
};

// The following stories are auto-generated with `pnpm generate:text`.
// Do not edit them manually; instead, edit the `generateTextStories` function in `scripts/text.ts` and run `pnpm generate:text -s`.

// @auto-generated-start

export const DisplayLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'displayLarge',
    },
};

export const DisplayMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'displayMedium',
    },
};

export const DisplaySmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'displaySmall',
    },
};

export const HeadingLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'headingLarge',
    },
};

export const HeadingMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'headingMedium',
    },
};

export const HeadingSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'headingSmall',
    },
};

export const HeadingXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'headingXSmall',
    },
};

export const HeadingXXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'headingXXSmall',
    },
};

export const LabelXLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'labelXLarge',
    },
};

export const LabelLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'labelLarge',
    },
};

export const LabelMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'labelMedium',
    },
};

export const LabelSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'labelSmall',
    },
};

export const LabelXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'labelXSmall',
    },
};

export const ParagraphLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'paragraphLarge',
    },
};

export const ParagraphMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'paragraphMedium',
    },
};

export const ParagraphSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'paragraphSmall',
    },
};

export const ParagraphXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'paragraphXSmall',
    },
};

export const ParagraphXXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        format: 'paragraphXXSmall',
    },
};

// @auto-generated-end
