import React from "react";

interface TouchHandlerProps {
    onTap?: (event: TouchEvent, handler: TouchHandler) => void;
    onDrag?: (event: TouchEvent, handler: TouchHandler) => void;
    onDragX?: (event: TouchEvent, handler: TouchHandler) => void;
    onDragY?: (event: TouchEvent, handler: TouchHandler) => void;
    onDragRelease?: (event: TouchEvent, handler: TouchHandler) => void;
    minDragDistance: number;
    passive: boolean;
}

interface TouchHandlerState {
    touchStartX?: number;
    touchStartY?: number;
    touchX?: number;
    touchY?: number;
    dragMode?: "x" | "y";
}

class TouchHandler extends React.Component {
    state: TouchHandlerState;
    props!: TouchHandlerProps;

    static defaultProps: TouchHandlerProps = {
        minDragDistance: 10,
        passive: false
    };

    constructor(props: TouchHandlerProps) {
        super(props);

        this.state = {
            touchStartX: undefined,
            touchStartY: undefined,
            touchX: undefined,
            touchY: undefined,
            dragMode: undefined
        };
    }

    get isActive(): boolean {
        // Don't bother checking for touchStartY, since it should only be defined if touchStartX is defined
        return this.state.touchStartX !== undefined;
    }

    componentDidMount(): void {
        document.addEventListener(
            "touchstart",
            this.touchStart.bind(this),
            { passive: this.props.passive }
        );
        document.addEventListener(
            "touchmove",
            this.touchMove.bind(this),
            { passive: this.props.passive }
        );
        document.addEventListener(
            "touchend",
            this.touchEnd.bind(this),
            { passive: this.props.passive }
        );
    }

    componentWillUnmount(): void {
        document.removeEventListener("touchstart", this.touchStart.bind(this));
        document.removeEventListener("touchmove", this.touchMove.bind(this));
        document.removeEventListener("touchend", this.touchEnd.bind(this));
    }

    touchStart(event: TouchEvent): void {
        event.preventDefault();
        
        let touch = event.touches[0];
        let touchX = touch.clientX;
        let touchY = touch.clientY;
        this.setState({
            touchStartX: touchX,
            touchStartY: touchY,
            touchX: touchX,
            touchY: touchY
        });
        console.log("TouchHandler.touchStart");
    }

    touchMove(event: TouchEvent): void {
        if (!this.isActive) return;

        event.preventDefault();
        let touch = event.touches[0];
        let touchX = touch.clientX;
        let touchY = touch.clientY;
        this.setState({
            touchX: touchX,
            touchY: touchY
        });

        let deltaX = touchX - this.state.touchStartX!;
        let deltaY = touchY - this.state.touchStartY!;
        let deltaAbsMax = Math.max(Math.abs(deltaX), Math.abs(deltaY));

        if ((this.state.dragMode === undefined) && (deltaAbsMax > this.props.minDragDistance)) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.setState({ dragMode: "x" });
            } else {
                this.setState({ dragMode: "y" });
            }
        }

        if (this.state.dragMode === "x") {
            this.props.onDragX?.(event, this);
        } else if (this.state.dragMode === "y") {
            this.props.onDragY?.(event, this);
        }
    }

    touchEnd(event: TouchEvent): void {
        event.preventDefault();

        if (!this.isActive) return;

        if (this.state.dragMode === undefined)
           this.props.onTap?.(event, this);

        this.setState({
            touchStartX: undefined,
            touchStartY: undefined,
            touchX: undefined,
            touchY: undefined,
            dragMode: "none"
        });
    }

    render(): null {
        return null;
    }
}

export default TouchHandler;
export type { TouchHandlerProps, TouchHandlerState };