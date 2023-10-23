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
        children: 'Hello world! This is a new StyledLink component.',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Hello world! This is a secondary component.',
    },
};
