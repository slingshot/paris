import type { FC, ReactNode } from 'react';
import RPTilt from 'react-parallax-tilt';
import styles from './Tilt.module.scss';

export type TiltProps = {
    /**
     * Disables the tilt effect.
     * @default false
     */
    disableTilt?: boolean;
    /** The contents of the Tilt. */
    children?: ReactNode | ReactNode[];
    /** The class names to apply to this element. */
    className?: string;
} & RPTilt['props'];

/**
 * Tilt components allow you to add a parallax tilt effect to any component.
 *
 * Based on [react-parallax-tilt](https://github.com/mkosir/react-parallax-tilt), customized with our preferred defaults.
 *
 * > Card components include a Tilt component by default, by setting the `tilt` prop to `true`. You can override any of the underlying Tilt props by passing them to the Card component's `overrides.tilt` prop.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Tilt } from 'paris/tilt';
 * ```
 * @constructor
 */
export const Tilt: FC<TiltProps> = ({
    disableTilt = false,
    scale = 1.05,
    tiltMaxAngleX = 12.5,
    tiltMaxAngleY = 12.5,
    glareEnable = true,
    glareMaxOpacity = 0.5,
    style = {},
    tiltAngleXManual = null,
    tiltAngleYManual = null,
    perspective = 1000,
    children,
    ...props
}) => (
    <RPTilt
        scale={disableTilt ? 1 : scale}
        tiltMaxAngleX={disableTilt ? 0 : tiltMaxAngleX}
        tiltMaxAngleY={disableTilt ? 0 : tiltMaxAngleY}
        glareEnable={!disableTilt && glareEnable}
        glareMaxOpacity={disableTilt ? 0 : glareMaxOpacity}
        style={style}
        glareBorderRadius={`calc(${style?.borderRadius || '1px'} - 1px)`}
        tiltAngleXManual={disableTilt ? 0 : tiltAngleXManual}
        tiltAngleYManual={disableTilt ? 0 : tiltAngleYManual}
        perspective={perspective}
        {...props}
        className={`${styles.container} ${props.className}`}
    >
        {children}
    </RPTilt>
);
