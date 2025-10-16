import type { FC } from 'react';
import type { ToasterProps } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { clsx } from 'clsx';
import styles from './Toast.module.scss';
import typography from '../text/Typography.module.css';

export type ToastProps = ToasterProps;

/**
 * A Toast component and associated function, based on the amazing [`react-hot-toast`](https://react-hot-toast.com/). For full customization, use that library directly instead.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```tsx
 * import { Toast } from 'paris/toast';
 *
 * // e.g. in your root layout.tsx
 * export default function RootLayout({ children }) {
 *    return (
 *        <>
 *            {children}
 *            <Toast />
 *        </>
 *    );
 * }
 *
 * // Then, call the `toast` function from any client component:
 * import { toast } from 'paris/toast';
 *
 * toast('Hello World!');
 * ```
 * @constructor
 */
export const Toast: FC<ToastProps> = ({
    toastOptions,
    ...props
}) => (
    <Toaster
        {...props}
        toastOptions={{
            className: clsx(styles.toast, typography.paragraphXSmall),
        }}
    />
);

export * from 'react-hot-toast';
