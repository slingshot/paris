import { useState } from 'react';
import { render, screen } from '../../test/render';
import { CodeInput } from './CodeInput';

function Controlled({ length = 6, onComplete }: { length?: number; onComplete?: (value: string) => void }) {
    const [value, setValue] = useState('');
    return <CodeInput value={value} onChange={setValue} onComplete={onComplete} length={length} aria-label="code" />;
}

describe('CodeInput', () => {
    describe('rendering', () => {
        it('renders `length` segments (default 6)', () => {
            render(<Controlled />);
            expect(screen.getAllByRole('textbox')).toHaveLength(6);
        });

        it('respects a custom length', () => {
            render(<Controlled length={4} />);
            expect(screen.getAllByRole('textbox')).toHaveLength(4);
        });
    });

    describe('entry', () => {
        it('types digits across segments and ignores non-numerics', async () => {
            const { user } = render(<Controlled />);
            const segments = screen.getAllByRole('textbox');
            await user.click(segments[0]);
            await user.keyboard('12a3');
            expect(segments[0]).toHaveValue('1');
            expect(segments[1]).toHaveValue('2');
            expect(segments[2]).toHaveValue('3');
        });

        it('pastes to fill all segments and fires onComplete once', async () => {
            const onComplete = vi.fn();
            const { user } = render(<Controlled onComplete={onComplete} />);
            const segments = screen.getAllByRole('textbox');
            await user.click(segments[0]);
            await user.paste('123456');
            expect(segments[0]).toHaveValue('1');
            expect(segments[5]).toHaveValue('6');
            expect(onComplete).toHaveBeenCalledTimes(1);
            expect(onComplete).toHaveBeenCalledWith('123456');
        });

        it('backspace on an empty segment clears and retreats to the previous', async () => {
            const { user } = render(<Controlled />);
            const segments = screen.getAllByRole('textbox');
            await user.click(segments[0]);
            await user.keyboard('12');
            await user.keyboard('{Backspace}');
            expect(segments[1]).toHaveValue('');
            expect(segments[0]).toHaveValue('1');
        });
    });
});
