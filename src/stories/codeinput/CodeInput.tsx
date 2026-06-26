'use client';

import { clsx } from 'clsx';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import styles from './CodeInput.module.scss';

export type CodeInputProps = {
    /** The current code value. Controlled — pass the digits entered so far. */
    value: string;
    /** Called with the new value whenever a segment changes. */
    onChange: (value: string) => void;
    /** Called once the final segment is filled (i.e. `value.length === length`). */
    onComplete?: (value: string) => void;
    /**
     * Number of digit segments.
     * @default 6
     */
    length?: number;
    /**
     * Visual status of the segments.
     * @default 'default'
     */
    status?: 'default' | 'error';
    /** Disables all segments. */
    disabled?: boolean;
    /**
     * Locks the input and plays a validating animation (a right-to-left fill, then a glare that
     * sweeps across the segments). Use while a submitted code is being verified.
     */
    loading?: boolean;
    /** Focus the first segment on mount. */
    autoFocus?: boolean;
    /**
     * Accessible label for the group of segments.
     * @default 'Verification code'
     */
    'aria-label'?: string;
};

/**
 * A segmented numeric code input — `length` single-digit cells with auto-advance, paste-to-fill,
 * backspace-retreat, and arrow-key navigation. Intended for one-time PIN / SMS verification codes.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { CodeInput } from 'paris/codeinput';
 * ```
 * @constructor
 */
export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
    (
        {
            value,
            onChange,
            onComplete,
            length = 6,
            status = 'default',
            disabled = false,
            loading = false,
            autoFocus = false,
            'aria-label': ariaLabel = 'Verification code',
        },
        ref,
    ) => {
        const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
        const digits = value.split('').slice(0, length);

        const focusAt = useCallback(
            (index: number) => {
                const clamped = Math.max(0, Math.min(index, length - 1));
                const input = inputsRef.current[clamped];
                input?.focus();
                input?.select();
            },
            [length],
        );

        useEffect(() => {
            if (autoFocus) focusAt(0);
        }, [autoFocus, focusAt]);

        const emit = useCallback(
            (next: string) => {
                const sliced = next.slice(0, length);
                onChange(sliced);
                if (sliced.length === length) onComplete?.(sliced);
            },
            [length, onChange, onComplete],
        );

        const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
            const typed = event.target.value.replace(/\D/g, '');
            if (!typed) return;
            const chars = value.split('');
            let cursor = index;
            for (const char of typed) {
                if (cursor >= length) break;
                chars[cursor] = char;
                cursor += 1;
            }
            emit(chars.join(''));
            focusAt(cursor);
        };

        const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
            const chars = value.split('');
            if (event.key === 'Backspace') {
                event.preventDefault();
                if (chars[index]) {
                    chars[index] = '';
                    emit(chars.join(''));
                } else if (index > 0) {
                    chars[index - 1] = '';
                    emit(chars.join(''));
                    focusAt(index - 1);
                }
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                focusAt(index - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                focusAt(index + 1);
            }
        };

        const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
            event.preventDefault();
            const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (!pasted) return;
            emit(pasted);
            focusAt(pasted.length);
        };

        return (
            <div className={clsx(styles.container, loading && styles.loading)} role="group" aria-label={ariaLabel}>
                {Array.from({ length }).map((_, index) => (
                    <input
                        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length positional code segments are stable
                        key={index}
                        ref={(element) => {
                            inputsRef.current[index] = element;
                            // Forward the first cell so form libraries can focus the code input by ref.
                            if (index === 0) {
                                if (typeof ref === 'function') ref(element);
                                else if (ref) ref.current = element;
                            }
                        }}
                        className={clsx(styles.segment, status === 'error' && styles.error)}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        maxLength={1}
                        disabled={disabled}
                        readOnly={loading}
                        value={digits[index] ?? ''}
                        aria-label={`Digit ${index + 1}`}
                        onChange={handleChange(index)}
                        onKeyDown={handleKeyDown(index)}
                        onPaste={handlePaste}
                        onFocus={(event) => event.target.select()}
                    />
                ))}
            </div>
        );
    },
);

CodeInput.displayName = 'CodeInput';
