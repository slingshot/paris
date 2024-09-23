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
        title: 'Confirmation',
        appearance: 'simple',
        width: 'default',
        height: 'content',
        draggable: false,
        isOpen: false,
        children: (
            <Text>
                Are you sure? That's a lot of money.
            </Text>
        ),
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);
        // const [primary, bg] = [
        //     pvar('colors.contentSecondary'),
        //     pvar('colors.backgroundPrimary'),
        // ];
        return (
            <>
                <div
                    style={{}}
                    // Background texture that can be enabled to emphasize glassmorphism
                    // Make sure to also uncomment the pvar array above
                    // style={{
                    //     width: '80vw',
                    //     height: '80dvh',
                    //     backgroundColor: bg,
                    //     opacity: '0.8',
                    //     // eslint-disable-next-line css/no-shorthand-property-overrides
                    //     background: `repeating-linear-gradient( -45deg, ${primary}, ${primary} 4px, transparent 4px, transparent 25px )`,
                    // }}
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                    >
                        Pay now
                    </Button>
                </div>
                <Dialog
                    {...args}
                    isOpen={isOpen}
                    onClose={() => {
                        setIsOpen(false);
                    }}
                >
                    {args.children}
                </Dialog>
            </>
        );
    },
};

export const Grey: Story = {
    args: {
        title: 'Confirmation',
        appearance: 'simple',
        width: 'default',
        height: 'content',
        overlayStyle: 'grey',
        draggable: false,
        isOpen: false,
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
                <div>
                    <Button
                        onClick={() => setIsOpen(true)}
                    >
                        Pay now
                    </Button>
                </div>
                <Dialog
                    {...args}
                    isOpen={isOpen}
                    onClose={() => {
                        setIsOpen(false);
                    }}
                >
                    {args.children}
                </Dialog>
            </>
        );
    },
};
