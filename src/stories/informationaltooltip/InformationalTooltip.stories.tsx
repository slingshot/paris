import type { Meta, StoryObj } from '@storybook/nextjs';
import { createElement } from 'react';
import { InformationalTooltip } from './InformationalTooltip';

const meta: Meta<typeof InformationalTooltip> = {
    title: 'Surfaces/InformationalTooltip',
    component: InformationalTooltip,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InformationalTooltip>;

const render: Story['render'] = (args) => createElement(
    'div',
    {
        style: { minHeight: '200px' },
    },
    createElement(InformationalTooltip, {
        ...args,
    }),
);

export const Default: Story = {
    args: {
        children:
      'If you are being paid on 1099s (through transfer outs) you need to pay taxes quarterly. The amount you pay each quarter is a portion of your estimated tax burden for the year, based on your anticipated income amount. If you over/underpay, you will be refunded/owe the difference at the end of the year. ',
        heading: 'Quarterly taxes',
    },
    render,
};

export const Medium: Story = {
    args: {
        children: 'This is a medium tooltip with no heading',
        size: 'medium',
    },
    render,
};

export const CustomTrigger: Story = {
    args: {
        children: 'With some text below',
        heading: 'Another info tooltip',
        size: 'medium',
        trigger: <div>This is a custom trigger</div>,
    },
    render,
};

export const CustomAlign: Story = {
    args: {
        children: 'With some text below',
        heading: 'Another info tooltip',
        size: 'medium',
        align: 'end',
        trigger: <div>This tooltip below is set to align = `end`</div>,
    },
    render,
};
