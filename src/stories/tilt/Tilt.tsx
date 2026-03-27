'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import type {
    CSSProperties,
    FC,
    MouseEvent as ReactMouseEvent,
    ReactNode,
    TouchEvent as ReactTouchEvent,
} from 'react';
import { clsx } from 'clsx';
import styles from './Tilt.module.scss';

type GlarePosition = 'top' | 'right' | 'bottom' | 'left' | 'all';

export type OnMoveParams = {
    tiltAngleX: number;
    tiltAngleY: number;
    tiltAngleXPercentage: number;
    tiltAngleYPercentage: number;
    glareAngle: number;
    glareOpacity: number;
};

export type TiltProps = {
    /** Disables the tilt effect. @default false */
    disableTilt?: boolean;
    children?: ReactNode | ReactNode[];
    className?: string;
    style?: CSSProperties;
    /** Scale on hover (1.05 = 105%). @default 1.05 */
    scale?: number;
    /** Max tilt on X axis in degrees. @default 12.5 */
    tiltMaxAngleX?: number;
    /** Max tilt on Y axis in degrees. @default 12.5 */
    tiltMaxAngleY?: number;
    /** Manual tilt on X axis in degrees. Overrides mouse input when non-null. */
    tiltAngleXManual?: number | null;
    /** Manual tilt on Y axis in degrees. Overrides mouse input when non-null. */
    tiltAngleYManual?: number | null;
    /** CSS perspective distance in px. @default 1000 */
    perspective?: number;
    /** Transition speed in ms for enter/leave. @default 400 */
    transitionSpeed?: number;
    /** Transition easing function. @default 'cubic-bezier(.03,.98,.52,.99)' */
    transitionEasing?: string;
    /** Reset tilt on mouse leave. @default true */
    reset?: boolean;
    /** Enable glare overlay. @default true */
    glareEnable?: boolean;
    /** Max glare opacity (0-1). @default 0.5 */
    glareMaxOpacity?: number;
    /** Glare gradient color. @default '#ffffff' */
    glareColor?: string;
    /** Glare gradient origin position. @default 'bottom' */
    glarePosition?: GlarePosition;
    /** Reverse glare direction. @default false */
    glareReverse?: boolean;
    /** CSS border-radius for glare wrapper. Derived from style.borderRadius by default. */
    glareBorderRadius?: string;
    onEnter?: (params: { event: ReactMouseEvent | ReactTouchEvent }) => void;
    onLeave?: (params: { event: ReactMouseEvent | ReactTouchEvent }) => void;
    onMove?: (params: OnMoveParams) => void;
};

type TiltState = {
    tiltAngleX: number;
    tiltAngleY: number;
    currentScale: number;
    glareAngle: number;
    glareOpacity: number;
    transitioning: boolean;
};

const INITIAL_STATE: TiltState = {
    tiltAngleX: 0,
    tiltAngleY: 0,
    currentScale: 1,
    glareAngle: 0,
    glareOpacity: 0,
    transitioning: false,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function computeGlareOpacity(
    xPct: number,
    yPct: number,
    position: GlarePosition,
    reverse: boolean,
    maxOpacity: number,
): number {
    const g = reverse ? -1 : 1;
    let raw = 0;
    switch (position) {
        case 'top': raw = -xPct * g; break;
        case 'right': raw = yPct * g; break;
        case 'left': raw = -yPct * g; break;
        case 'all': raw = Math.hypot(xPct, yPct); break;
        case 'bottom':
        default: raw = xPct * g; break;
    }
    return clamp(raw, 0, 100) * maxOpacity / 100;
}

/**
 * Tilt components allow you to add a parallax tilt effect to any component.
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
    tiltAngleXManual = null,
    tiltAngleYManual = null,
    perspective = 1000,
    transitionSpeed = 400,
    transitionEasing = 'cubic-bezier(.03,.98,.52,.99)',
    reset = true,
    glareEnable = true,
    glareMaxOpacity = 0.5,
    glareColor = '#ffffff',
    glarePosition = 'bottom',
    glareReverse = false,
    glareBorderRadius,
    style = {},
    className,
    children,
    onEnter,
    onLeave,
    onMove,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafID = useRef<number | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const pendingRef = useRef<TiltState | null>(null);

    const [tilt, setTilt] = useState<TiltState>(INITIAL_STATE);

    const effectiveScale = disableTilt ? 1 : scale;
    const effectiveMaxX = disableTilt ? 0 : tiltMaxAngleX;
    const effectiveMaxY = disableTilt ? 0 : tiltMaxAngleY;
    const effectiveGlare = !disableTilt && glareEnable;
    const effectiveGlareMax = disableTilt ? 0 : glareMaxOpacity;
    const effectiveManualX = disableTilt ? 0 : tiltAngleXManual;
    const effectiveManualY = disableTilt ? 0 : tiltAngleYManual;

    const computedGlareBorderRadius = glareBorderRadius ?? `calc(${style?.borderRadius || '1px'} - 1px)`;
    const isManual = effectiveManualX !== null || effectiveManualY !== null;

    // Cancel any pending rAF on unmount
    useEffect(() => () => {
        if (rafID.current !== null) cancelAnimationFrame(rafID.current);
    }, []);

    const flushToState = useCallback(() => {
        if (!pendingRef.current) return;
        const next = pendingRef.current;
        pendingRef.current = null;
        setTilt(next);
    }, []);

    const scheduleUpdate = useCallback((next: TiltState) => {
        pendingRef.current = next;
        if (rafID.current !== null) cancelAnimationFrame(rafID.current);
        rafID.current = requestAnimationFrame(flushToState);
    }, [flushToState]);

    const computeTilt = useCallback((pageX: number, pageY: number): TiltState => {
        const rect = rectRef.current;
        if (!rect) return { ...INITIAL_STATE, currentScale: effectiveScale };

        const xPct = clamp(((pageX - rect.left) / rect.width) * 200 - 100, -100, 100);
        const yPct = clamp(((pageY - rect.top) / rect.height) * 200 - 100, -100, 100);

        const angleX = (effectiveManualX !== null) ? effectiveManualX : (yPct * effectiveMaxX / 100);
        const angleY = (effectiveManualY !== null) ? effectiveManualY : (xPct * effectiveMaxY / 100 * -1);

        const glareAngle = xPct ? Math.atan2(yPct, -xPct) * (180 / Math.PI) : 0;
        const glareOpacity = effectiveGlare
            ? computeGlareOpacity(xPct, yPct, glarePosition, glareReverse, effectiveGlareMax)
            : 0;

        return {
            tiltAngleX: clamp(angleX, -90, 90),
            tiltAngleY: clamp(angleY, -90, 90),
            currentScale: effectiveScale,
            glareAngle,
            glareOpacity,
            transitioning: false,
        };
    }, [effectiveScale, effectiveMaxX, effectiveMaxY, effectiveManualX, effectiveManualY, effectiveGlare, effectiveGlareMax, glarePosition, glareReverse]);

    const handleMouseEnter = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        rectRef.current = containerRef.current.getBoundingClientRect();

        const next = computeTilt(e.pageX, e.pageY);
        setTilt({ ...next, transitioning: true });
        onEnter?.({ event: e });
    }, [computeTilt, onEnter]);

    const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !rectRef.current) return;
        if (effectiveManualX !== null || effectiveManualY !== null) return;

        const next = computeTilt(e.pageX, e.pageY);
        scheduleUpdate(next);

        if (onMove) {
            onMove({
                tiltAngleX: next.tiltAngleX,
                tiltAngleY: next.tiltAngleY,
                tiltAngleXPercentage: effectiveMaxX ? (next.tiltAngleX / effectiveMaxX) * 100 : 0,
                tiltAngleYPercentage: effectiveMaxY ? (next.tiltAngleY / effectiveMaxY) * 100 : 0,
                glareAngle: next.glareAngle,
                glareOpacity: next.glareOpacity,
            });
        }
    }, [computeTilt, scheduleUpdate, onMove, effectiveManualX, effectiveManualY, effectiveMaxX, effectiveMaxY]);

    const handleMouseLeave = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        rectRef.current = null;

        if (reset) {
            setTilt({ ...INITIAL_STATE, transitioning: true });
        }
        onLeave?.({ event: e });
    }, [reset, onLeave]);

    const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
        if (!containerRef.current || !e.touches[0]) return;
        rectRef.current = containerRef.current.getBoundingClientRect();

        const touch = e.touches[0];
        const next = computeTilt(touch.pageX, touch.pageY);
        setTilt({ ...next, transitioning: true });
        onEnter?.({ event: e });
    }, [computeTilt, onEnter]);

    const handleTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
        if (!containerRef.current || !rectRef.current || !e.touches[0]) return;
        if (effectiveManualX !== null || effectiveManualY !== null) return;

        const touch = e.touches[0];
        const next = computeTilt(touch.pageX, touch.pageY);
        scheduleUpdate(next);
    }, [computeTilt, scheduleUpdate, effectiveManualX, effectiveManualY]);

    const handleTouchEnd = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        rectRef.current = null;

        if (reset) {
            setTilt({ ...INITIAL_STATE, transitioning: true });
        }
        onLeave?.({ event: e });
    }, [reset, onLeave]);

    // Compute glare element size (diagonal of container)
    const [glareSize, setGlareSize] = useState(0);
    useEffect(() => {
        if (!effectiveGlare || !containerRef.current) {
            return undefined;
        }
        const el = containerRef.current;
        const observer = new ResizeObserver(([entry]) => {
            if (!entry) return;
            const { width, height } = entry.contentRect;
            setGlareSize(Math.sqrt(width ** 2 + height ** 2));
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [effectiveGlare]);

    // Apply manual angle overrides at render time
    const finalAngleX = isManual ? (effectiveManualX ?? 0) : tilt.tiltAngleX;
    const finalAngleY = isManual ? (effectiveManualY ?? 0) : tilt.tiltAngleY;
    const finalScale = tilt.currentScale;

    const transform = `perspective(${perspective}px) rotateX(${finalAngleX}deg) rotateY(${finalAngleY}deg) scale3d(${finalScale},${finalScale},${finalScale})`;

    const transition = tilt.transitioning || isManual
        ? `transform ${transitionSpeed}ms ${transitionEasing}`
        : undefined;

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={clsx(styles.container, className)}
            style={{
                ...style,
                transform,
                transition,
                willChange: tilt.transitioning || finalScale !== 1 || finalAngleX !== 0 || finalAngleY !== 0 ? 'transform' : undefined,
            }}
        >
            {children}
            {effectiveGlare && (
                <div
                    className={styles.glareWrapper}
                    style={{ borderRadius: computedGlareBorderRadius }}
                >
                    <div
                        className={styles.glare}
                        style={{
                            width: glareSize,
                            height: glareSize,
                            transform: `rotate(${tilt.glareAngle}deg) translate(-50%, -50%)`,
                            opacity: tilt.glareOpacity,
                            background: `linear-gradient(0deg, rgba(255,255,255,0) 0%, ${glareColor} 100%)`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};
