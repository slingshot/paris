import { type RenderOptions, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

export function render(ui: ReactElement, options?: RenderOptions) {
    return {
        user: userEvent.setup(),
        ...rtlRender(ui, options),
    };
}

export { act, screen, waitFor, within } from '@testing-library/react';
