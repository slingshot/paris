import { memo } from 'react';
import type { IconDefinition } from './Icon';

export const Check: IconDefinition = memo(({ size }) => (
    <svg width={size} height={size} viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M441 103c9.4 9.4 9.4 24.6 0 33.9L177 401c-9.4 9.4-24.6 9.4-33.9 0L7 265c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l119 119L407 103c9.4-9.4 24.6-9.4 33.9 0z"
            fill="currentColor"
        />
    </svg>
));
