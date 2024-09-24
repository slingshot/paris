import type { Meta, StoryObj } from '@storybook/react';
import type { Property } from 'csstype';
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
        children: (
            <Text kind="headingMedium">Tilt Component</Text>
        ),
        onEnter: undefined,
        onLeave: undefined,
        onMove: undefined,
    },
    render: ({ children, style, ...args }) => (
        <Tilt
            {...args}
            style={{
                width: 'max-content',
                userSelect: pvar('utils.defaultUserSelect') as Property.UserSelect,
                backgroundColor: pvar('new.colors.surfacePrimary'),
                boxShadow: pvar('new.lighting.shallowBelow'),
                padding: '8px 16px',
                // border: `1px solid ${pvar('new.borders.dropdown.color')}`,
                borderRadius: pvar('borders.radius.rounded'),
                ...style,
            }}
        >
            {children}
        </Tilt>
    ),
};
