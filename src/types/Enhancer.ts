import type { ReactNode } from 'react';

export type Enhancer = ReactNode | (({ size }: { size: number }) => ReactNode);
