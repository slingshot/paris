import type { FC, ReactNode } from 'react';
import styles from './PhoneInput.module.scss';

export type PhoneInputProps = {
    /** The contents of the PhoneInput. */
    children?: ReactNode;
};

/**
 * A PhoneInput component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { PhoneInput } from 'paris/phoneinput';
 * ```
 * @constructor
 */
export const PhoneInput: FC<PhoneInputProps> = ({ children }) => (
    <div className={styles.content}>
        <p>{children || 'Replace this area with your component.'}</p>
    </div>
);
