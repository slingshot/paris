import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import type { Control, DefaultValues, FieldValues, UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { act, render, screen, waitFor, within } from '../test/render';
import type { AccordionSelectOption } from './accordionselect/AccordionSelect';
import { AccordionSelect } from './accordionselect/AccordionSelect';
import { Checkbox } from './checkbox/Checkbox';
import type { Option as ComboboxOption } from './combobox/Combobox';
import { Combobox } from './combobox/Combobox';
import { Input } from './input/Input';
import { PhoneInput } from './phoneinput/PhoneInput';
import type { Option as SelectOption } from './select/Select';
import { Select } from './select/Select';

/**
 * Mounts `renderFields` inside a real `useForm()` and hands back an accessor for the live form
 * instance, so every assertion reads the value react-hook-form actually stored.
 */
function renderInForm<T extends FieldValues>(
    defaultValues: DefaultValues<T>,
    renderFields: (form: UseFormReturn<T>) => ReactNode,
) {
    const captured: { form: UseFormReturn<T> | null } = { form: null };

    function Harness() {
        const form = useForm<T>({ defaultValues });
        captured.form = form;
        return <form>{renderFields(form)}</form>;
    }

    const result = render(<Harness />);

    return {
        ...result,
        form: () => {
            if (!captured.form) throw new Error('form harness did not mount');
            return captured.form;
        },
    };
}

const releaseOptions: SelectOption[] = [
    { id: '1', node: 'Single' },
    { id: '2', node: 'EP' },
    { id: '3', node: 'Album (LP)' },
];

const locationOptions: AccordionSelectOption[] = [
    { id: 'champagne', node: 'In an alleyway, drinking champagne' },
    { id: 'rooftop', node: 'On a rooftop, watching the sunset' },
];

const artistOptions: ComboboxOption[] = [
    { id: '1', node: 'Mia Dolan' },
    { id: '2', node: 'Sebastian Wilder' },
];

type ArtistForm = { artist: string | null };

/**
 * `Combobox` filtering is the consumer's job, so a form-side wrapper owns the query state while the
 * field still spreads bare onto the component.
 */
function ArtistCombobox({
    control,
    allowCustomValue,
    status,
}: {
    control: Control<ArtistForm>;
    allowCustomValue?: boolean;
    status?: 'default' | 'error';
}) {
    const [query, setQuery] = useState('');
    const filtered = artistOptions.filter((option) =>
        typeof option.node === 'string' ? option.node.toLowerCase().includes(query.toLowerCase()) : true,
    );

    return (
        <Controller
            control={control}
            name="artist"
            render={({ field }) => (
                <Combobox
                    label="Artist"
                    placeholder="Search..."
                    options={filtered}
                    allowCustomValue={allowCustomValue}
                    customValueString='Add "%v"'
                    status={status}
                    onInputChange={setQuery}
                    {...field}
                />
            )}
        />
    );
}

function expectErrorStatus(container: HTMLElement) {
    expect(container.querySelector('[data-status="error"]')).not.toBeNull();
}

describe('react-hook-form contract', () => {
    describe('Input', () => {
        it('stores typed text through a register spread', async () => {
            const { user, form } = renderInForm<{ email: string }>({ email: '' }, (f) => (
                <Input label="Email" {...f.register('email')} />
            ));

            await user.type(screen.getByLabelText('Email'), 'nobody@example.com');
            expect(form().getValues('email')).toBe('nobody@example.com');
        });

        it('hands the register ref the input element', () => {
            const received: { node: HTMLInputElement | null } = { node: null };

            renderInForm<{ email: string }>({ email: '' }, (f) => {
                const { ref, ...rest } = f.register('email');
                return (
                    <Input
                        label="Email"
                        {...rest}
                        ref={(node) => {
                            received.node = node;
                            ref(node);
                        }}
                    />
                );
            });

            expect(received.node).toBe(screen.getByLabelText('Email'));
        });

        // react-hook-form defers setFocus through a timeout, so every focus assertion has to settle.
        it('focuses a registered input via setFocus', async () => {
            const { form } = renderInForm<{ email: string }>({ email: '' }, (f) => (
                <Input label="Email" {...f.register('email')} />
            ));

            form().setFocus('email');
            await waitFor(() => expect(screen.getByLabelText('Email')).toHaveFocus());
        });

        it('stores typed text through a bare Controller field spread', async () => {
            const { user, form } = renderInForm<{ email: string }>({ email: '' }, (f) => (
                <Controller
                    control={f.control}
                    name="email"
                    render={({ field }) => <Input label="Email" {...field} />}
                />
            ));

            await user.type(screen.getByLabelText('Email'), 'nobody@example.com');
            expect(form().getValues('email')).toBe('nobody@example.com');
        });

        it('focuses a Controller-bound input via setFocus', async () => {
            const { form } = renderInForm<{ email: string }>({ email: '' }, (f) => (
                <Controller
                    control={f.control}
                    name="email"
                    render={({ field }) => <Input label="Email" {...field} />}
                />
            ));

            form().setFocus('email');
            await waitFor(() => expect(screen.getByLabelText('Email')).toHaveFocus());
        });

        it('accepts a register return spread onto its props', () => {
            // Compilation is the whole assertion; nothing beyond it is checked at runtime.
            const asInputProps = (register: UseFormRegisterReturn) =>
                ({ label: 'Email', ...register }) satisfies ComponentProps<typeof Input>;

            expect(asInputProps).toBeTypeOf('function');
        });

        it('renders error status driven by formState.errors', () => {
            const { container, form } = renderInForm<{ email: string }>({ email: '' }, (f) => (
                <Input label="Email" status={f.formState.errors.email ? 'error' : 'default'} {...f.register('email')} />
            ));

            expect(container.querySelector('[data-status="error"]')).toBeNull();
            act(() => form().setError('email', { type: 'manual' }));
            expectErrorStatus(container);
        });
    });

    describe('PhoneInput', () => {
        const renderPhoneForm = (status?: (form: UseFormReturn<{ phone: string | null }>) => 'default' | 'error') =>
            renderInForm<{ phone: string | null }>({ phone: null }, (f) => (
                <Controller
                    control={f.control}
                    name="phone"
                    render={({ field }) => <PhoneInput label="Phone" status={status?.(f)} {...field} />}
                />
            ));

        it('stores E.164 from a bare Controller field spread', async () => {
            const { user, form } = renderPhoneForm();

            await user.type(screen.getByLabelText('Phone'), '4155552671');
            expect(form().getValues('phone')).toBe('+14155552671');
        });

        it('clears the display when the form resets', async () => {
            const { user, form } = renderPhoneForm();

            await user.type(screen.getByLabelText('Phone'), '4155552671');
            act(() => form().reset());

            expect(screen.getByLabelText('Phone')).toHaveValue('');
        });

        it('focuses the tel input via setFocus', async () => {
            const { form } = renderPhoneForm();

            form().setFocus('phone');
            await waitFor(() => expect(screen.getByLabelText('Phone')).toHaveFocus());
        });

        it('renders error status driven by formState.errors', () => {
            const { container, form } = renderPhoneForm((f) => (f.formState.errors.phone ? 'error' : 'default'));

            expect(container.querySelector('[data-status="error"]')).toBeNull();
            act(() => form().setError('phone', { type: 'manual' }));
            expectErrorStatus(container);
        });
    });

    describe('Select', () => {
        type ReleaseForm = { releaseType: string | null };

        const renderSelectForm = (
            props?: Partial<ComponentProps<typeof Select>>,
            status?: (form: UseFormReturn<ReleaseForm>) => 'default' | 'error',
        ) =>
            renderInForm<ReleaseForm>({ releaseType: null }, (f) => (
                <Controller
                    control={f.control}
                    name="releaseType"
                    render={({ field }) => (
                        <Select options={releaseOptions} status={status?.(f)} {...props} {...field} />
                    )}
                />
            ));

        it('stores the selected option id and shows it back', async () => {
            const { user, form } = renderSelectForm();

            await user.click(screen.getByText('Select an option'));
            await waitFor(() => {
                expect(screen.getByText('EP')).toBeInTheDocument();
            });
            await user.click(screen.getByText('EP'));

            expect(form().getValues('releaseType')).toBe('2');
            await waitFor(() => {
                expect(screen.getByRole('button', { expanded: false })).toHaveTextContent('EP');
            });
        });

        it('puts the field name in the DOM', () => {
            renderSelectForm();
            expect(document.querySelectorAll('[name="releaseType"]')).toHaveLength(1);
        });

        it('focuses the listbox trigger via setFocus', async () => {
            const { form } = renderSelectForm();

            form().setFocus('releaseType');
            await waitFor(() => expect(screen.getByRole('button')).toHaveFocus());
        });

        it('focuses the radio roving tab stop via setFocus', async () => {
            const { form } = renderSelectForm({ kind: 'radio' });

            form().setFocus('releaseType');
            await waitFor(() => expect(screen.getByRole('radio', { name: 'Single' })).toHaveFocus());
        });

        it('stores the selected id for the radio kind', async () => {
            const { user, form } = renderSelectForm({ kind: 'radio' });

            await user.click(screen.getByText('EP'));

            expect(form().getValues('releaseType')).toBe('2');
            await waitFor(() => {
                expect(screen.getByRole('radio', { name: 'EP' })).toHaveAttribute('aria-checked', 'true');
            });
        });

        it('renders error status driven by formState.errors', () => {
            const { container, form } = renderSelectForm({}, (f) =>
                f.formState.errors.releaseType ? 'error' : 'default',
            );

            expect(container.querySelector('[data-status="error"]')).toBeNull();
            act(() => form().setError('releaseType', { type: 'manual' }));
            expectErrorStatus(container);
        });
    });

    describe('Checkbox', () => {
        type AcceptForm = { accept: boolean };

        const renderCheckboxForm = (
            props?: Partial<ComponentProps<typeof Checkbox>>,
            status?: (form: UseFormReturn<AcceptForm>) => 'default' | 'error',
        ) =>
            renderInForm<AcceptForm>({ accept: false }, (f) => (
                <Controller
                    control={f.control}
                    name="accept"
                    render={({ field }) => (
                        <Checkbox status={status?.(f)} {...props} {...field}>
                            Accept terms
                        </Checkbox>
                    )}
                />
            ));

        it.each([
            ['default', 'checkbox'],
            ['switch', 'switch'],
        ] as const)('stores the toggled boolean for the %s kind', async (kind, role) => {
            const { user, form } = renderCheckboxForm({ kind });

            const control = screen.getByRole(role);
            expect(control).not.toBeChecked();

            await user.click(control);
            expect(form().getValues('accept')).toBe(true);
            expect(control).toBeChecked();

            await user.click(control);
            expect(form().getValues('accept')).toBe(false);
            expect(control).not.toBeChecked();
        });

        it.each([
            ['default', 'checkbox'],
            ['switch', 'switch'],
        ] as const)('focuses the %s control via setFocus', async (kind, role) => {
            const { form } = renderCheckboxForm({ kind });

            form().setFocus('accept');
            await waitFor(() => expect(screen.getByRole(role)).toHaveFocus());
        });

        it('renders error status driven by formState.errors', () => {
            const { container, form } = renderCheckboxForm({}, (f) =>
                f.formState.errors.accept ? 'error' : 'default',
            );

            expect(container.querySelector('[data-status="error"]')).toBeNull();
            act(() => form().setError('accept', { type: 'manual' }));
            expectErrorStatus(container);
        });
    });

    describe('AccordionSelect', () => {
        type LocationForm = { location: string | null };

        const renderAccordionForm = (status?: (form: UseFormReturn<LocationForm>) => 'default' | 'error') =>
            renderInForm<LocationForm>({ location: null }, (f) => (
                <Controller
                    control={f.control}
                    name="location"
                    render={({ field }) => (
                        <AccordionSelect options={locationOptions} status={status?.(f)} {...field} />
                    )}
                />
            ));

        const getHeader = (container: HTMLElement) => {
            const header = container.querySelector('[role="button"][tabindex="0"]');
            if (!(header instanceof HTMLElement)) throw new Error('accordion header not found');
            return header;
        };

        it('stores the selected option id and shows it back', async () => {
            const { user, form, container } = renderAccordionForm();

            await user.click(getHeader(container));
            await user.click(screen.getByText('On a rooftop, watching the sunset'));

            expect(form().getValues('location')).toBe('rooftop');
            await waitFor(() => {
                expect(within(getHeader(container)).getByText('On a rooftop, watching the sunset')).toBeInTheDocument();
            });
        });

        it('puts the field name on the header', () => {
            const { container } = renderAccordionForm();
            expect(getHeader(container)).toHaveAttribute('name', 'location');
        });

        it('focuses the header via setFocus', async () => {
            const { form, container } = renderAccordionForm();

            form().setFocus('location');
            await waitFor(() => expect(getHeader(container)).toHaveFocus());
        });

        it('renders error status driven by formState.errors', () => {
            const { container, form } = renderAccordionForm((f) => (f.formState.errors.location ? 'error' : 'default'));

            expect(container.querySelector('[data-status="error"]')).toBeNull();
            act(() => form().setError('location', { type: 'manual' }));
            expectErrorStatus(container);
        });
    });

    describe('Combobox', () => {
        it('stores the selected option id and shows it back', async () => {
            const { user, form } = renderInForm<ArtistForm>({ artist: null }, (f) => (
                <ArtistCombobox control={f.control} />
            ));

            await user.click(screen.getByPlaceholderText('Search...'));
            await waitFor(() => {
                expect(screen.getByText('Sebastian Wilder')).toBeInTheDocument();
            });
            await user.click(screen.getByText('Sebastian Wilder'));

            expect(form().getValues('artist')).toBe('2');
            await waitFor(() => {
                expect(screen.getByDisplayValue('Sebastian Wilder')).toBeInTheDocument();
            });
        });

        it('stores typed text as the value when custom values are allowed', async () => {
            const { user, form } = renderInForm<ArtistForm>({ artist: null }, (f) => (
                <ArtistCombobox control={f.control} allowCustomValue />
            ));

            await user.type(screen.getByPlaceholderText('Search...'), 'New Artist');

            expect(form().getValues('artist')).toBe('New Artist');
            expect(screen.getByDisplayValue('New Artist')).toBeInTheDocument();
        });

        it('empties the value when the custom text is cleared', async () => {
            const { user, form } = renderInForm<ArtistForm>({ artist: null }, (f) => (
                <ArtistCombobox control={f.control} allowCustomValue />
            ));

            const input = screen.getByPlaceholderText('Search...');
            await user.type(input, 'New');
            await user.clear(input);

            expect(form().getValues('artist')).toBeNull();
            expect(input).toHaveValue('');
        });

        it('puts the field name on the inner input', () => {
            renderInForm<ArtistForm>({ artist: null }, (f) => <ArtistCombobox control={f.control} />);
            expect(screen.getByPlaceholderText('Search...')).toHaveAttribute('name', 'artist');
        });

        it('renders error status driven by formState.errors', () => {
            const { container, form } = renderInForm<ArtistForm>({ artist: null }, (f) => (
                <ArtistCombobox control={f.control} status={f.formState.errors.artist ? 'error' : 'default'} />
            ));

            expect(container.querySelector('[data-status="error"]')).toBeNull();
            act(() => form().setError('artist', { type: 'manual' }));
            expectErrorStatus(container);
        });
    });
});
