import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createElement } from 'react';
import { Button, CornerPresets } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Inputs/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        // `corners` is a `CornerPreset | CSSLength` union that Storybook can't infer a control for,
        // so define it manually as a select over the presets (it also accepts any CSSLength string).
        corners: {
            control: 'select',
            options: [...CornerPresets],
            description:
                'Corner rounding for the `rectangle` and `square` shapes. A preset (`sharp`, `rounded`, `roundedXL`) or any valid CSSLength string.',
            table: { defaultValue: { summary: 'rounded' } },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * By default, the Button component renders a primary large pill.
 *
 * **Primary** buttons are intended to represent primary or leading actions, such as "Submit" or "Save".
 */
export const Primary: Story = {
    args: {
        children: 'Button',
    },
};

/**
 * **Secondary** buttons are intended to represent secondary or trailing actions, such as "Cancel" or "Delete".
 */
export const Secondary: Story = {
    args: {
        children: 'Button',
        kind: 'secondary',
    },
};

/**
 * **Tertiary** buttons offer a visual alternative for non-primary actions.
 */
export const Tertiary: Story = {
    args: {
        children: 'Button',
        kind: 'tertiary',
    },
};

/**
 * Enhancers can be used to add icons at the start (left) or end (right) of a button.
 */
export const WithEnhancer: Story = {
    args: {
        children: 'Button',
        kind: 'primary',
        startEnhancer: ({ size }) =>
            createElement(FontAwesomeIcon, {
                icon: faPlus,
                width: `${size}px`,
            }),
    },
};

export const Circle: Story = {
    args: {
        children: 'Button',
        shape: 'circle',
        kind: 'tertiary',
        startEnhancer: ({ size }) =>
            createElement(FontAwesomeIcon, {
                icon: faPlus,
                width: `${size}px`,
            }),
    },
};

export const Rounded: Story = {
    args: {
        children: 'Button',
        shape: 'rectangle',
        corners: 'rounded',
        startEnhancer: ({ size }) =>
            createElement(FontAwesomeIcon, {
                icon: faPlus,
                width: `${size}px`,
            }),
    },
};

export const Notification: Story = {
    args: {
        children: 'Button',
        displayNotificationDot: true,
    },
};
