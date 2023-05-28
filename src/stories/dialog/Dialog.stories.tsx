/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../button';
import { Text } from '../text';

const meta: Meta<typeof Dialog> = {
    title: 'Surfaces/Dialog',
    component: Dialog,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
    args: {
        children: (
            <Text>
                Are you sure? That's a lot of money.
            </Text>
        ),
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <div
                    style={{
                        minHeight: '400px',
                    }}
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                    >
                        Pay now
                    </Button>
                </div>
                <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    {args.children}
                </Dialog>
            </>
        );
    },
};
