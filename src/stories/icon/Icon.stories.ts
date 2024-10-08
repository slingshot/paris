import type { Meta, StoryObj } from '@storybook/react';
import type { IconDefinition } from './Icon';
import { Icon } from './Icon';
import * as Icons from './index';
import { pvar } from '../theme';

const meta: Meta<typeof Icon> = {
    title: 'Content/Icon',
    component: Icon,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Icon>;

const getArgs = (icon: IconDefinition): Story => ({
    args: {
        icon,
        size: 20,
        style: {
            color: pvar('new.colors.contentPrimary'),
        },
    },
});

export const Close: Story = getArgs(Icons.Close);
export const ChevronLeft: Story = getArgs(Icons.ChevronLeft);
export const ChevronRight: Story = getArgs(Icons.ChevronRight);
export const Ellipsis: Story = getArgs(Icons.Ellipsis);
export const NotificationDot: Story = getArgs(Icons.NotificationDot);
export const Spinner: Story = getArgs(Icons.Spinner);
export const Check: Story = getArgs(Icons.Check);
export const ArrowRight: Story = getArgs(Icons.ArrowRight);
