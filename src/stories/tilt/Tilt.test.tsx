import { fireEvent } from '@testing-library/react';
import { render, screen } from '../../test/render';
import { Tilt } from './Tilt';

describe('Tilt', () => {
    it('renders children', () => {
        render(
            <Tilt>
                <div data-testid="child">Content</div>
            </Tilt>,
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
        render(
            <Tilt>
                <div data-testid="child-1">First</div>
                <div data-testid="child-2">Second</div>
            </Tilt>,
        );
        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    describe('className forwarding', () => {
        it('forwards custom className', () => {
            const { container } = render(<Tilt className="custom-class">Content</Tilt>);
            expect(container.firstElementChild).toHaveClass('custom-class');
        });

        it('preserves container class when custom className is added', () => {
            const { container } = render(<Tilt className="custom-class">Content</Tilt>);
            expect(container.firstElementChild).toHaveClass('container');
            expect(container.firstElementChild).toHaveClass('custom-class');
        });
    });

    describe('style forwarding', () => {
        it('applies custom styles', () => {
            const { container } = render(<Tilt style={{ backgroundColor: 'red' }}>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            expect(el.style.backgroundColor).toBe('red');
        });
    });

    describe('transform', () => {
        it('applies initial transform with default perspective and scale', () => {
            const { container } = render(<Tilt>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            expect(el.style.transform).toContain('perspective(1000px)');
            expect(el.style.transform).toContain('rotateX(0deg)');
            expect(el.style.transform).toContain('rotateY(0deg)');
            expect(el.style.transform).toContain('scale3d(1,1,1)');
        });

        it('applies custom perspective', () => {
            const { container } = render(<Tilt perspective={500}>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            expect(el.style.transform).toContain('perspective(500px)');
        });
    });

    describe('glare', () => {
        it('renders glare overlay by default', () => {
            const { container } = render(<Tilt>Content</Tilt>);
            const glareWrapper = container.querySelector('.glareWrapper');
            expect(glareWrapper).toBeInTheDocument();
        });

        it('does not render glare when glareEnable is false', () => {
            const { container } = render(<Tilt glareEnable={false}>Content</Tilt>);
            const glareWrapper = container.querySelector('.glareWrapper');
            expect(glareWrapper).not.toBeInTheDocument();
        });

        it('does not render glare when tilt is disabled', () => {
            const { container } = render(<Tilt disableTilt>Content</Tilt>);
            const glareWrapper = container.querySelector('.glareWrapper');
            expect(glareWrapper).not.toBeInTheDocument();
        });
    });

    describe('disableTilt', () => {
        it('uses scale of 1 when tilt is disabled', () => {
            const { container } = render(<Tilt disableTilt>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            expect(el.style.transform).toContain('scale3d(1,1,1)');
        });
    });

    describe('mouse events', () => {
        it('calls onEnter on mouse enter', () => {
            const onEnter = vi.fn();
            const { container } = render(<Tilt onEnter={onEnter}>Content</Tilt>);
            fireEvent.mouseEnter(container.firstElementChild!);
            expect(onEnter).toHaveBeenCalledTimes(1);
            expect(onEnter).toHaveBeenCalledWith(expect.objectContaining({ event: expect.anything() }));
        });

        it('calls onLeave on mouse leave', () => {
            const onLeave = vi.fn();
            const { container } = render(<Tilt onLeave={onLeave}>Content</Tilt>);
            const el = container.firstElementChild!;
            fireEvent.mouseEnter(el);
            fireEvent.mouseLeave(el);
            expect(onLeave).toHaveBeenCalledTimes(1);
        });

        it('calls onMove on mouse move', () => {
            const onMove = vi.fn();
            const { container } = render(<Tilt onMove={onMove}>Content</Tilt>);
            const el = container.firstElementChild!;
            fireEvent.mouseEnter(el);
            fireEvent.mouseMove(el, { pageX: 50, pageY: 50 });
            expect(onMove).toHaveBeenCalled();
        });

        it('resets transform on mouse leave when reset is true', () => {
            const { container } = render(<Tilt reset>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            fireEvent.mouseEnter(el);
            fireEvent.mouseLeave(el);
            expect(el.style.transform).toContain('rotateX(0deg)');
            expect(el.style.transform).toContain('rotateY(0deg)');
        });
    });

    describe('touch events', () => {
        it('calls onEnter on touch start', () => {
            const onEnter = vi.fn();
            const { container } = render(<Tilt onEnter={onEnter}>Content</Tilt>);
            fireEvent.touchStart(container.firstElementChild!, {
                touches: [{ pageX: 50, pageY: 50 }],
            });
            expect(onEnter).toHaveBeenCalledTimes(1);
        });

        it('calls onLeave on touch end', () => {
            const onLeave = vi.fn();
            const { container } = render(<Tilt onLeave={onLeave}>Content</Tilt>);
            const el = container.firstElementChild!;
            fireEvent.touchStart(el, { touches: [{ pageX: 50, pageY: 50 }] });
            fireEvent.touchEnd(el);
            expect(onLeave).toHaveBeenCalledTimes(1);
        });
    });

    describe('manual tilt angles', () => {
        it('applies manual tilt angle X', () => {
            const { container } = render(<Tilt tiltAngleXManual={10}>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            expect(el.style.transform).toContain('rotateX(10deg)');
        });

        it('applies manual tilt angle Y', () => {
            const { container } = render(<Tilt tiltAngleYManual={15}>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            expect(el.style.transform).toContain('rotateY(15deg)');
        });

        it('applies transition when manual angles are set', () => {
            const { container } = render(
                <Tilt tiltAngleXManual={10} transitionSpeed={300}>
                    Content
                </Tilt>,
            );
            const el = container.firstElementChild as HTMLElement;
            expect(el.style.transition).toContain('300ms');
        });
    });

    describe('transition', () => {
        it('applies transition on mouse enter', () => {
            const { container } = render(<Tilt transitionSpeed={500}>Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            fireEvent.mouseEnter(el);
            expect(el.style.transition).toContain('500ms');
        });

        it('applies custom easing function', () => {
            const { container } = render(<Tilt transitionEasing="ease-in-out">Content</Tilt>);
            const el = container.firstElementChild as HTMLElement;
            fireEvent.mouseEnter(el);
            expect(el.style.transition).toContain('ease-in-out');
        });
    });

    describe('glare border radius', () => {
        it('uses custom glareBorderRadius when provided', () => {
            const { container } = render(<Tilt glareBorderRadius="10px">Content</Tilt>);
            const glareWrapper = container.querySelector('.glareWrapper') as HTMLElement;
            expect(glareWrapper.style.borderRadius).toBe('10px');
        });

        it('derives glare border radius from style.borderRadius', () => {
            const { container } = render(<Tilt style={{ borderRadius: '20px' }}>Content</Tilt>);
            const glareWrapper = container.querySelector('.glareWrapper') as HTMLElement;
            // jsdom may simplify calc(20px - 1px) to calc(19px)
            expect(glareWrapper.style.borderRadius).toMatch(/calc\((?:20px - 1px|19px)\)/);
        });
    });
});
