import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from '../text';
import { pvar } from '../theme';
import { AccordionSelect } from './AccordionSelect';

const meta: Meta<typeof AccordionSelect> = {
    title: 'Inputs/AccordionSelect',
    component: AccordionSelect,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AccordionSelect>;

const options = [
    { id: 'champagne', node: 'In an alleyway, drinking champagne' },
    { id: 'rooftop', node: 'On a rooftop, watching the sunset' },
    { id: 'garden', node: 'In a garden, under the stars' },
];

export const Default: Story = {
    args: {
        options,
        value: 'champagne',
    },
};

export const NoSelection: Story = {
    args: {
        options,
        placeholder: 'Where were we?',
    },
};

export const WithDisabledOption: Story = {
    args: {
        options: [...options, { id: 'nowhere', node: 'Nowhere, it was all a dream', disabled: true }],
        value: 'champagne',
    },
};

export const DisabledOptionWithIcon: Story = {
    args: {
        options: [...options, { id: 'nowhere', node: 'Nowhere, it was all a dream', disabled: true }],
        value: 'champagne',
        renderOption: (option) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <Text kind="paragraphXSmall" weight="medium">
                    {option.node}
                </Text>
                {option.disabled && (
                    <FontAwesomeIcon
                        icon={faCircleExclamation}
                        style={{
                            width: '12.8px',
                            height: '13px',
                            padding: '1.5px 1.6px',
                            color: pvar('new.colors.contentNegative'),
                        }}
                    />
                )}
            </div>
        ),
    },
};
