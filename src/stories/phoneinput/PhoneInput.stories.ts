import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { createElement, useState } from 'react';
import type { PhoneInputChangeMeta, PhoneInputProps } from './PhoneInput';
import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
    title: 'Inputs/PhoneInput',
    component: PhoneInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
    args: {
        label: 'Phone number',
        description: 'Include your area code.',
        placeholder: '(555) 555-5555',
    },
};

// This file is .ts (no JSX), so the controlled demo composes with createElement.
function ControlledDemo(args: PhoneInputProps): ReactNode {
    const [value, setValue] = useState<string | null>(null);
    const [meta, setMeta] = useState<PhoneInputChangeMeta | null>(null);
    return createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        createElement(PhoneInput, {
            ...args,
            value,
            onChange: (next: string | null, changeMeta: PhoneInputChangeMeta) => {
                setValue(next);
                setMeta(changeMeta);
            },
        }),
        createElement('code', {}, `value: ${JSON.stringify(value)} · isValid: ${String(meta?.isValid ?? false)}`),
    );
}

export const Controlled: Story = {
    args: {
        label: 'Phone number',
        description: 'The E.164 value and validity are shown live below.',
    },
    render: (args) => createElement(ControlledDemo, args),
};

export const WithDefaultValue: Story = {
    args: {
        label: 'Phone number',
        defaultValue: '+14155552671',
    },
};

export const UnitedKingdomDefault: Story = {
    args: {
        label: 'Phone number',
        defaultCountry: 'GB',
    },
};

export const PriorityCountries: Story = {
    args: {
        label: 'Phone number',
        priorityCountries: ['US', 'GB', 'IN'],
        description: 'US, UK, and India are pinned to the top of the dropdown.',
    },
};

export const RestrictedCountries: Story = {
    args: {
        label: 'Phone number',
        countries: ['US', 'CA', 'MX'],
        description: 'Only North American numbers are accepted.',
    },
};

export const ErrorStatus: Story = {
    args: {
        label: 'Phone number',
        status: 'error',
        defaultValue: '+1415555',
        description: 'Enter a complete phone number.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Phone number',
        disabled: true,
        defaultValue: '+14155552671',
    },
};
