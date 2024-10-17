import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Inputs/Button',
    component: Button,
    tags: ['autodocs'],
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
        startEnhancer: ({ size }) => createElement(FontAwesomeIcon, {
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
        startEnhancer: ({ size }) => createElement(FontAwesomeIcon, {
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
        startEnhancer: ({ size }) => createElement(FontAwesomeIcon, {
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
