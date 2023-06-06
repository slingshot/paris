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
    },
};

// The following stories are auto-generated with `pnpm generate:text`.
// Do not edit them manually; instead, edit the `generateTextStories` function in `scripts/text.ts` and run `pnpm generate:text -s`.

// @auto-generated-start

export const DisplayLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'displayLarge',
    },
};

export const DisplayMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'displayMedium',
    },
};

export const DisplaySmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'displaySmall',
    },
};

export const HeadingLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'headingLarge',
    },
};

export const HeadingMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'headingMedium',
    },
};

export const HeadingSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'headingSmall',
    },
};

export const HeadingXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'headingXSmall',
    },
};

export const HeadingXXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'headingXXSmall',
    },
};

export const LabelXLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'labelXLarge',
    },
};

export const LabelLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'labelLarge',
    },
};

export const LabelMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'labelMedium',
    },
};

export const LabelSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'labelSmall',
    },
};

export const LabelXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'labelXSmall',
    },
};

export const ParagraphLarge: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphLarge',
    },
};

export const ParagraphMedium: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphMedium',
    },
};

export const ParagraphSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphSmall',
    },
};

export const ParagraphXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphXSmall',
    },
};

export const ParagraphXXSmall: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphXXSmall',
    },
};

export const ParagraphLargeBold: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphLarge',
        weight: 'bold',
    },
};

export const ParagraphMediumBold: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphMedium',
        weight: 'bold',
    },
};

export const ParagraphSmallBold: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphSmall',
        weight: 'bold',
    },
};

export const ParagraphXSmallBold: Story = {
    args: {
        children: 'In an alleyway, drinking champagne',
        kind: 'paragraphXSmall',
        weight: 'bold',
    },
};

// @auto-generated-end
