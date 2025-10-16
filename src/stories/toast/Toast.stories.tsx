import type { Meta, StoryObj } from '@storybook/react';
import { toast, Toast } from './Toast';
import { Button } from '../button';
import { ChevronRight, Icon } from '../icon';

const meta: Meta<typeof Toast> = {
    title: 'Surfaces/Toast',
    component: Toast,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
    args: {},
    render: (args) => (
        <>
            <Button
                onClick={() => {
                    toast('Like we were in Paris', {
                        icon: <Icon size={12} icon={ChevronRight} />,
                    });
                }}
            >
                Show toast
            </Button>
            <Toast {...args} />
        </>
    ),
};
