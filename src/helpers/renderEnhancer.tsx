import type { ReactNode } from 'react';
import { isValidElement, memo } from 'react';
import type { Enhancer } from '../types/Enhancer';

export const renderEnhancer = (enhancer: Enhancer, size: number): ReactNode => {
    if (isValidElement(enhancer)) {
        return enhancer;
    }

    if (typeof enhancer === 'function') {
        return enhancer({ size });
    }

    return enhancer;
};

export const MemoizedEnhancer = memo<{ enhancer: Enhancer, size: number }>(({ enhancer, size }) => (
    <>
        { renderEnhancer(enhancer, size)}
    </>
), (prev, next) => prev.enhancer === next.enhancer && prev.size === next.size);
