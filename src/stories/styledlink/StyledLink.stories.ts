import type { Meta, StoryObj } from '@storybook/react';
import { StyledLink } from './StyledLink';

const meta: Meta<typeof StyledLink> = {
    title: 'Content/StyledLink',
    component: StyledLink,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StyledLink>;

export const Default: Story = {
    args: {
        href: 'https://slingshot.fm',
        target: '_blank',
        children: 'Hello world! This is a styled link.',
    },
};

export const AsButton: Story = {
    args: {
        as: 'button',

        onClick: () => alert('Hello world!'),
        children: 'Hello world! This is a StyledLink rendered as a button.',
    },
};
