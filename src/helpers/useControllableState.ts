import { useCallback, useRef, useState } from 'react';

type UseControllableStateProps<T> = {
    value?: T;
    defaultValue?: T;
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
        hasWarned.current = true;
        if (controlledValue !== undefined && defaultValue !== undefined) {
            console.warn(
                '[Paris] A component received both `value` and `defaultValue`. ' +
                    'A component can be either controlled or uncontrolled, not both. ' +
                    'Decide between using `value` (controlled) or `defaultValue` (uncontrolled) ' +
                    'and remove the other. Defaulting to controlled mode.',
            );
        }
    }

    const resolvedValue = isControlled ? controlledValue : internalValue;

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const setValue = useCallback(
        (next: T | ((prev: T) => T)) => {
            if (typeof next === 'function') {
                const updater = next as (prev: T) => T;
                if (!isControlled) {
                    setInternalValue((prev) => {
                        const nextValue = updater(prev as T);
                        onChangeRef.current?.(nextValue);
                        return nextValue;
                    });
                } else {
                    onChangeRef.current?.(updater(controlledValue));
                }
            } else {
                if (!isControlled) {
                    setInternalValue(next);
                }
                onChangeRef.current?.(next);
            }
        },
        [isControlled, controlledValue],
    );

    return [resolvedValue as T, setValue];
}
