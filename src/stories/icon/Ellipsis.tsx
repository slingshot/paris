import { memo } from 'react';
import type { IconDefinition } from './Icon';

export const Ellipsis: IconDefinition = memo(({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 10C13.5 9.1875 14.1562 8.5 15 8.5C15.8125 8.5 16.5 9.1875 16.5 10C16.5 10.8438 15.8125 11.5 15 11.5C14.1562 11.5 13.5 10.8438 13.5 10ZM8.5 10C8.5 9.1875 9.15625 8.5 10 8.5C10.8125 8.5 11.5 9.1875 11.5 10C11.5 10.8438 10.8125 11.5 10 11.5C9.15625 11.5 8.5 10.8438 8.5 10ZM6.5 10C6.5 10.8438 5.8125 11.5 5 11.5C4.15625 11.5 3.5 10.8438 3.5 10C3.5 9.1875 4.15625 8.5 5 8.5C5.8125 8.5 6.5 9.1875 6.5 10Z" fill="currentColor" />
    </svg>
));
