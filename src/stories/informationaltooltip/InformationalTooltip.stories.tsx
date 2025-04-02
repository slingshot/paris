import type { Meta, StoryObj } from '@storybook/react';
import { createElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { InformationalTooltip } from './InformationalTooltip';

const meta: Meta<typeof InformationalTooltip> = {
    title: 'Surfaces/InformationalTooltip',
    component: InformationalTooltip,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InformationalTooltip>;

const render: Story['render'] = (args) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    createElement('div', {
        style: { minHeight: '200px' },
    }, createElement(InformationalTooltip, {
        ...args,
    }));

export const Default: Story = {
    args: {
        children: 'If you are being payed on 1099s (through transfer outs) you need to pay taxes quarterly. The amount you pay each quarter is a portion of your estimated tax burden for the year, based on your anticipated income amount. If you over/underpay, you will be refunded/owe the difference at the end of the year. ',
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
        trigger: (
            <div>
                This is a custom trigger
            </div>
        ),
    },
    render,
};

export const Open: Story = {
    args: {
        children: 'Open boolean set to true',
        size: 'medium',
        open: true,
    },
    render,
};

export const CustomAlign: Story = {
    args: {
        children: 'With some text below',
        heading: 'Another info tooltip',
        size: 'medium',
        align: 'end',
        trigger: (
            <div>
                This tooltip below is set to align = `end`
            </div>
        ),
    },
    render,
};

export const HeadingIcon: Story = {
    args: {
        children: 'This is a medium tooltip with a heading',
        size: 'medium',
        headingIcon: (createElement(FontAwesomeIcon, {
            icon: faPlus,
            width: '14px',
        })),
        heading: 'Custom icon',
    },
    render,
};

export const NullIcon: Story = {
    args: {
        children: 'But the headingIcon is null',
        size: 'medium',
        headingIcon: null,
        heading: 'This has a heading',
    },
    render,
};
