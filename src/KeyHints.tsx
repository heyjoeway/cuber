import React from "react";

import "./KeyHints.scss";
import KeyHandler from "./KeyHandler";

interface KeyHintsState {
    mode: "none" | "vert" | "horiz";
}

class KeyHints extends React.Component {
    state: KeyHintsState;    
    _keyHandler: React.RefObject<KeyHandler>;

    constructor(props: {}) {
        super(props);
        this.state = { mode: "none" };
        this._keyHandler = React.createRef<KeyHandler>();
    }

    set mode(mode: KeyHintsState["mode"]) {
        this.setState({ mode });
    }

    renderVertKeyHints(): React.ReactNode { return (
        <div className="game-keyhints-vert" style={{ opacity: this.state.mode == "vert" ? 1 : 0 }}>
            <div className="game-keyhint top-left"> 7 </div>
            <div className="game-keyhint top-mid"> 8 </div>
            <div className="game-keyhint top-right"> 9 </div>

            <div className="game-keyhint bottom-left"> 1 </div>
            <div className="game-keyhint bottom-mid"> 2 </div>
            <div className="game-keyhint bottom-right"> 3 </div>
        </div>
    ); }

    renderHorizKeyHints(): React.ReactNode { return (
        <div className="game-keyhints-horiz" style={{ opacity: this.state.mode == "horiz" ? 1 : 0 }}>
            <div className="game-keyhint top-left"> 7 </div>
            <div className="game-keyhint mid-left"> 4 </div>
            <div className="game-keyhint bottom-left"> 1 </div>

            <div className="game-keyhint top-right"> 9 </div>
            <div className="game-keyhint mid-right"> 6 </div>
            <div className="game-keyhint bottom-right"> 3 </div>
        </div>
    ); }

    renderModeShiftHints(): React.ReactNode { return (
        <div className="game-keyhints-modeshift">
            z&nbsp;↔&nbsp;&nbsp;&nbsp;x&nbsp;↕
        </div>
    ); }

    updateMode() {
        if (this._keyHandler.current === null)
            throw new Error("KeyHints.updateMode: _keyHandler.current is null (somehow????)");

        if (this._keyHandler.current.isKeyDown("z"))
            this.mode = "horiz";
        else if (this._keyHandler.current.isKeyDown("x"))
            this.mode = "vert";
        else
            this.mode = "none";
    }

    render(): React.ReactNode { return (
        <div className="game-keyhints">
            <KeyHandler
                ref={ this._keyHandler }
                onKeyDown={ _ => this.updateMode() }
                onKeyUp={ _ => this.updateMode() }
            />
            {this.renderVertKeyHints()}
            {this.renderHorizKeyHints()}
            {this.renderModeShiftHints()}
        </div>
    )}
}

export default KeyHints;