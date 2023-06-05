import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
    title: 'Surfaces/Card',
    component: Card,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * By default, the card has a shadow and parallax tilt effect. You may want to adjust the max tilt angles through the `overrides.tilt.tiltMaxAngle(X|Y)` props to provide a good experience depending on the size of the content. See the [Tilt component](/docs/surfaces-tilt--docs) for all available props.
 */
export const Default: Story = {
    args: {
        children: 'Revenue: $3000',
    },
};

/**
 * Setting the `kind` prop to `flat` will remove the shadow from the card.
 *
 * This example also disables the `tilt` effect by setting the `tilt` prop to `false`, but by default the `tilt` prop will remain set to `true`.
 */
export const Flat: Story = {
    args: {
        kind: 'flat',
        tilt: false,
        children: 'Revenue: $3000',
    },
};
