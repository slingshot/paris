import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Dialog as HDialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import styles from './Dialog.module.scss';

export type DialogProps = {
    isOpen?: boolean;
    onClose?: (value: boolean) => void;
    title?: ReactNode;
};

/**
* A Dialog component.
*
* <hr />
*
* To use this component, import it as follows:
*
* ```js
* import { Dialog } from 'paris/dialog';
* ```
* @constructor
*/
export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
    isOpen = false,
    onClose = () => {},
    title,
    children,
}) => (
    <Transition
        appear
        show={isOpen}
        as={Fragment}
    >
        <HDialog
            as="div"
            onClose={onClose}
            className={styles.root}
        >
            <div className={styles.overlayContainer}>
                <Transition.Child
                    as={Fragment}
                    enter={styles.enter}
                    enterFrom={styles.enterFrom}
                    enterTo={styles.enterTo}
                    leave={styles.leave}
                    leaveFrom={styles.leaveFrom}
                    leaveTo={styles.leaveTo}
                >
                    <div className={styles.overlay} />
                </Transition.Child>
            </div>

            <div className={styles.panelContainer}>
                <Transition.Child
                    as={Fragment}
                    enter={styles.enter}
                    enterFrom={styles.enterFrom}
                    enterTo={styles.enterTo}
                    leave={styles.leave}
                    leaveFrom={styles.leaveFrom}
                    leaveTo={styles.leaveTo}
                >
                    <HDialog.Panel className={styles.panel}>
                        {title && (
                            <HDialog.Title as="h1" className={styles.title}>
                                {title}
                            </HDialog.Title>
                        )}
                        {children}
                    </HDialog.Panel>
                </Transition.Child>
            </div>
        </HDialog>
    </Transition>
);
