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

/**
 * Queries the close button rendered by the Paris Button component with shape="circle".
 * Circle-shaped buttons render children as `aria-details` instead of visible text.
 */
export function getCloseButton() {
    return document.querySelector('[aria-details="Close dialog"]');
}
