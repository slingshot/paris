/* eslint-disable react/no-children-prop */

import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { ActionMenu } from './ActionMenu';
import { Text } from '../text';
import { ChevronRight } from '../icon';

const meta: Meta<typeof ActionMenu> = {
    title: 'Content/ActionMenu',
    component: ActionMenu,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {
    args: {
        children:
        createElement(
            ActionMenu,
            null,
            createElement(
                ActionMenu.Item,
                null,
                createElement(Text, { kind: 'paragraphSmall', children: 'Transfer out' }),
                createElement(ChevronRight, { size: 13 }),
            ),
            createElement(
                ActionMenu.Item,
                null,
                createElement(Text, { kind: 'paragraphSmall', children: 'Deposit check' }),
                createElement(ChevronRight, { size: 13 }),
            ),
        ),
    },
};

export const Secondary: Story = {
    args: {
        children: 'Hello world! This is a secondary component.',
    },
};
