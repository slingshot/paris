import { memo } from 'react';
import type { IconDefinition } from './Icon';

export const ChevronRight: IconDefinition = memo(({ size }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14.5312 9.46875C14.8125 9.78125 14.8125 10.25 14.5312 10.5312L8.53125 16.5312C8.21875 16.8438 7.75 16.8438 7.46875 16.5312C7.15625 16.25 7.15625 15.7812 7.46875 15.5L12.9375 10.0312L7.46875 4.53125C7.15625 4.25 7.15625 3.78125 7.46875 3.5C7.75 3.1875 8.21875 3.1875 8.5 3.5L14.5312 9.46875Z"
            fill="currentColor"
        />
    </svg>
));
