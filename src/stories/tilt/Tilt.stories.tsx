import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { Tilt } from './Tilt';
import { Text } from '../text';
import { pvar } from '../theme';

const meta: Meta<typeof Tilt> = {
    title: 'Surfaces/Tilt',
    component: Tilt,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tilt>;

export const Default: Story = {
    args: {
        style: {},
        children: <Text kind="headingMedium">Tilt Component</Text>,
        onEnter: undefined,
        onLeave: undefined,
        onMove: undefined,
    },
    render: ({ children, style, ...args }) => {
        const tiltStyle = {
            width: 'max-content',
            userSelect: pvar('utils.defaultUserSelect'),
            backgroundColor: pvar('new.colors.surfacePrimary'),
            boxShadow: pvar('new.lighting.shallowBelow'),
            padding: '8px 16px',
            // border: `1px solid ${pvar('new.borders.dropdown.color')}`,
            borderRadius: pvar('borders.radius.rounded'),
            ...style,
        } as CSSProperties;

        return (
            <Tilt
                {...args}
                style={tiltStyle}
            >
                {children}
            </Tilt>
        );
    },
};
