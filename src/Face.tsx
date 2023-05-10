import "./Face.scss";

import React from "react";

interface TileProps {
    colorID: number;
    onClick?: () => void;
    visible?: boolean;
}

function Tile(props: TileProps): JSX.Element {
    let colors = ["red", "green", "blue", "orange", "yellow", "purple"];
    let color = colors[props.colorID];
    return (
        <div
            onClick={props.onClick}
            style={{
                background: color,
                opacity: props.visible ? 1 : 0
            }}
            className="game-tile"
        >
        </div>
    );
}

function Row({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div className="game-row">
            {children}
        </div>
    );
}

interface FaceState {
    face: number[][];
    faceChangedPrev: boolean[][]; // used for animation
    animation: "none" | "rotate-cw" | "rotate-ccw" | "up" | "down" | "left" | "right";
    keyIncrement: number;
}

interface FaceProps {
    value?: number;
    visible?: boolean;
    tilt?: "none" | "left" | "right" | "up" | "down" | "test1" | "test2";
    onTileClick?: (rowIndex: number, colIndex: number) => void;
}

class Face extends React.Component {
    state: FaceState;
    props!: FaceProps;

    constructor(props: FaceProps) {
        super(props);
        let value = props.value || 0;
        this.state = {
            face: [
                [value, value, value],
                [value, value, value],
                [value, value, value]
            ],
            faceChangedPrev: [
                [false, false, false],
                [false, false, false],
                [false, false, false]
            ],
            animation: "none",
            keyIncrement: 0
        };
    }

    addKeyIncrement(): void {
        this.setState({ keyIncrement: this.state.keyIncrement + 1 });
    }

    get face(): number[][] { return structuredClone(this.state.face); }
    set face(face) { this.setState({ face: face }); }

    set animation(animation: FaceState["animation"]) {
        this.setState({ animation: animation });
        this.addKeyIncrement(); // force re-render
    }

    _clearFaceChangedPrev(): void {
        this.setState({
            faceChangedPrev: [
                [false, false, false],
                [false, false, false],
                [false, false, false]
            ]
        });
    }

    _setAllFaceChangedPrev(): void {
        this.setState({
            faceChangedPrev: [
                [true, true, true],
                [true, true, true],
                [true, true, true]
            ]
        });
    }

    _handleTileClick(rowIndex: number, colIndex: number): void {
        if (this.props.onTileClick)
            this.props.onTileClick(rowIndex, colIndex);
    }

    getRow(rowIndex: number): number[] {
        return this.face[rowIndex];
    }

    setRow(rowIndex: number, rowData: number[], animation: FaceState["animation"] = "none"): void {
        let face = this.face;
        let faceChanged = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ];

        for (let i = 0; i < rowData.length; i++) {
            face[rowIndex][i] = rowData[i];
            faceChanged[rowIndex][i] = true;
        }

        this.face = face;
        this.setState({ faceChangedPrev: faceChanged });
        this.animation = animation;
    }

    getCol(colIndex: number): number[] {
        let face = this.face;
        let colData = [];

        for (let i = 0; i < face.length; i++)
            colData.push(face[i][colIndex]);

        return colData;
    }

    setCol(colIndex: number, colData: number[], animation: FaceState["animation"] = "none"): void {
        let face = this.face;
        let faceChanged = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ];

        for (let i = 0; i < colData.length; i++) {
            face[i][colIndex] = colData[i];
            faceChanged[i][colIndex] = true;
        }

        this.face = face;
        this.setState({ faceChangedPrev: faceChanged });
        this.animation = animation;
    }

    rotateClockwise(): void {
        let face = this.face;
        let faceRotated = [
            [face[2][0], face[1][0], face[0][0]],
            [face[2][1], face[1][1], face[0][1]],
            [face[2][2], face[1][2], face[0][2]]
        ];
        this.face = faceRotated;
        this._setAllFaceChangedPrev();
        this.animation = "rotate-cw";
    }

    rotateCounterClockwise(): void {
        let face = this.face;
        let faceRotated = [
            [face[0][2], face[1][2], face[2][2]],
            [face[0][1], face[1][1], face[2][1]],
            [face[0][0], face[1][0], face[2][0]]
        ];
        this.face = faceRotated;
        this._setAllFaceChangedPrev();
        this.animation = "rotate-ccw";
    }

    renderFace(): JSX.Element | null {
        if (this.props.visible === false) // yes we need this because visible might not be defined
            return null;

        let tiltClass = "tilt-" + (this.props.tilt || "none");
        let divContents = [];
        for (let y = 0; y < 3; y++) {
            let rowContents = [];
            for (let x = 0; x < 3; x++) {
                rowContents.push(
                    <Tile
                        key={`${y}-${x}`}
                        onClick={() => this._handleTileClick(y, x)}
                        colorID={this.state.face[y][x]}
                        visible={!this.state.faceChangedPrev[y][x]}
                    />
                );
            }
            divContents.push(
                <Row key={y}>
                    {rowContents}
                </Row>
            );
        }
        return (
            <div
                className={`game-face ${tiltClass}`}
                key={this.state.keyIncrement}
            >
                {divContents}
            </div>
        );
    }

    renderFaceAnimation(): JSX.Element | null {
        if (this.props.visible === false) // yes we need this because visible might not be defined
            return null;

        let tiltClass = "tilt-" + (this.props.tilt || "none");
        let divContents = [];
        for (let y = 0; y < 3; y++) {
            let rowContents = [];
            for (let x = 0; x < 3; x++) {
                rowContents.push(
                    <Tile
                        key={`${y}-${x}`}
                        colorID={this.state.face[y][x]}
                        visible={this.state.faceChangedPrev[y][x]}
                    />
                );
            }
            divContents.push(
                <Row key={y}>
                    {rowContents}
                </Row>
            );
        }
        return (
            <div
                className={`game-face game-face-anim ${tiltClass} anim-${this.state.animation}`}
                key={`${this.state.keyIncrement}-anim`}
                style={{ pointerEvents: "none" }}
            >
                {divContents}
            </div>
        );
    }

    render(): JSX.Element | null {
        return (
            <React.Fragment>
                {this.renderFaceAnimation()}
                {this.renderFace()}
            </React.Fragment>
        );
    }
}

export default Face;
export type {
    FaceState,
    FaceProps
}