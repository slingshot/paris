import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
    title: 'Content/Avatar',
    component: Avatar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    args: {
        width: '128px',
        children: createElement('img', {
            src: 'https://swift.slingshot.fm/sling/static/Billie-Eilish.jpg',
            alt: 'Avatar',
        }),
    },
};
