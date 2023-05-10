import React from "react";

interface KeyHandlerProps {
    onKeyDown: (key: string) => void;
    onKeyUp: (key: string) => void;
}


class KeyHandler extends React.Component {
    props!: KeyHandlerProps;
    _keysHeld: Set<string>;

    constructor(props: KeyHandlerProps) {
        super(props);
        this._keysHeld = new Set();
    }

    isKeyDown(key: string): boolean {
        return this._keysHeld.has(key);
    }

    areAllKeysDown(keys: string[]): boolean {
        for (let key of keys)
            if (!this.isKeyDown(key))
                return false;
        return true;
    }

    isAnyKeyDown(keys: string[]): boolean {
        for (let key of keys)
            if (this.isKeyDown(key))
                return true;
        return false;
    }

    componentDidMount(): void {
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
        document.addEventListener("keyup", this._handleKeyUp.bind(this));
    }

    componentWillUnmount(): void {
        document.removeEventListener("keydown", this._handleKeyDown.bind(this));
        document.removeEventListener("keyup", this._handleKeyUp.bind(this));
    }

    _handleKeyDown(event: KeyboardEvent): void {
        // Prevent repeat keys
        if (this._keysHeld.has(event.key))
            return;

        this._keysHeld.add(event.key);
        this.props.onKeyDown(event.key);
    }
    
    _handleKeyUp(event: KeyboardEvent): void {
        this._keysHeld.delete(event.key);
        this.props.onKeyUp(event.key);
    }

    render(): React.ReactNode {
        return null;
    }
}

export default KeyHandler;