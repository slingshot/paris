import { memo } from 'react';
import type { IconDefinition } from './Icon';

export const ChevronLeft: IconDefinition = memo(({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.46875 9.46875L11.4688 3.5C11.75 3.1875 12.2188 3.1875 12.5312 3.5C12.8125 3.78125 12.8125 4.25 12.5312 4.53125L7.03125 10L12.5 15.5C12.8125 15.7812 12.8125 16.25 12.5 16.5312C12.2188 16.8438 11.75 16.8438 11.4688 16.5312L5.46875 10.5312C5.15625 10.25 5.15625 9.78125 5.46875 9.46875Z"
            fill="currentColor"
        />
    </svg>
));
