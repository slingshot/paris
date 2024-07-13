import { memo } from 'react';
import type { IconDefinition } from './Icon';

export const NotificationDot: IconDefinition = memo(({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 8 8" fill="none">
        <circle cx="4" cy="4" r="3.5" fill="#1DEECD" stroke="#8EF7E6" />
    </svg>
));
