import { useCallback, useRef, useState } from 'react';

type UseControllableStateProps<T> = {
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
};

export function useControllableState<T>({
    value: controlledValue,
    defaultValue,
    onChange,
}: UseControllableStateProps<T>): [T, (next: T | ((prev: T) => T)) => void] {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);

    const hasWarned = useRef(false);
    if (process.env.NODE_ENV !== 'production' && !hasWarned.current) {
        if (controlledValue !== undefined && defaultValue !== undefined) {
            console.warn(
                '[Paris] A component received both `value` and `defaultValue`. ' +
                'A component can be either controlled or uncontrolled, not both. ' +
                'Decide between using `value` (controlled) or `defaultValue` (uncontrolled) ' +
                'and remove the other. Defaulting to controlled mode.',
            );
            hasWarned.current = true;
        }
    }

    const resolvedValue = isControlled ? controlledValue : internalValue;

    const setValue = useCallback(
        (next: T | ((prev: T) => T)) => {
            const nextValue = typeof next === 'function'
                ? (next as (prev: T) => T)(isControlled ? controlledValue : internalValue)
                : next;

            if (!isControlled) {
                setInternalValue(nextValue);
            }

            onChange?.(nextValue);
        },
        [isControlled, controlledValue, internalValue, onChange],
    );

    return [resolvedValue, setValue];
}
