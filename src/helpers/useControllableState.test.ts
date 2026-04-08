import { act, renderHook } from '@testing-library/react';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
    describe('uncontrolled mode', () => {
        it('initializes to defaultValue when value is undefined', () => {
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 'hello' }),
            );
            expect(result.current[0]).toBe('hello');
        });

        it('updates internal state via setter', () => {
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 'a' }),
            );
            act(() => result.current[1]('b'));
            expect(result.current[0]).toBe('b');
        });

        it('supports functional updates', () => {
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 1 }),
            );
            act(() => result.current[1]((prev) => prev + 1));
            expect(result.current[0]).toBe(2);
        });

        it('calls onChange when setter is invoked', () => {
            const onChange = vi.fn();
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 'a', onChange }),
            );
            act(() => result.current[1]('b'));
            expect(onChange).toHaveBeenCalledWith('b');
        });
    });

    describe('controlled mode', () => {
        it('uses the provided value', () => {
            const { result } = renderHook(() =>
                useControllableState({ value: 'controlled', defaultValue: 'default' }),
            );
            expect(result.current[0]).toBe('controlled');
        });

        it('reflects value changes from props', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useControllableState({ value, defaultValue: 'default' }),
                { initialProps: { value: 'a' as string | undefined } },
            );
            expect(result.current[0]).toBe('a');

            rerender({ value: 'b' });
            expect(result.current[0]).toBe('b');
        });

        it('treats null as controlled (not uncontrolled)', () => {
            const { result } = renderHook(() =>
                useControllableState<string | null>({ value: null, defaultValue: 'default' }),
            );
            expect(result.current[0]).toBe(null);
        });

        it('calls onChange but does not update internal state', () => {
            const onChange = vi.fn();
            const { result } = renderHook(() =>
                useControllableState({ value: 'locked', defaultValue: 'default', onChange }),
            );
            act(() => result.current[1]('new'));
            expect(onChange).toHaveBeenCalledWith('new');
            expect(result.current[0]).toBe('locked');
        });
    });

    describe('dev warning', () => {
        it('warns when both value and defaultValue are provided', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            renderHook(() =>
                useControllableState({ value: 'a', defaultValue: 'b' }),
            );
            expect(spy).toHaveBeenCalledWith(
                expect.stringContaining('received both `value` and `defaultValue`'),
            );
            spy.mockRestore();
        });

        it('does not warn when only value is provided', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            renderHook(() =>
                useControllableState({ value: 'a', defaultValue: undefined as unknown as string }),
            );
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });

        it('does not warn when only defaultValue is provided', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            renderHook(() =>
                useControllableState({ defaultValue: 'a' }),
            );
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});
