import "./Board.scss";

import React from "react";
import Face from "./Face";
import FaceRef from "./FaceRef";
import KeyHandler from "./KeyHandler";
import KeyHints from "./KeyHints";

interface BoardProps { }

class Board extends React.Component {
    _board: (React.RefObject<Face> | null)[][];
    _keyHandler: React.RefObject<KeyHandler>;

    constructor(props: BoardProps) {
        super(props);

        let faceRefs = [
            React.createRef<Face>(),
            React.createRef<Face>(),
            React.createRef<Face>(),
            React.createRef<Face>(),
            React.createRef<Face>(),
            React.createRef<Face>(),
            React.createRef<Face>()
        ];

        this._board = [
            [faceRefs[0], faceRefs[1], faceRefs[2], faceRefs[3]],
            [faceRefs[4], null, null, null],
            [faceRefs[5], null, null, null],
            [faceRefs[6], null, null, null]
        ];
        
        this._keyHandler = React.createRef<KeyHandler>();
    }

    getFaceRef(y: number, x: number): React.RefObject<Face> {
        let faceRef = this._board[y][x];
        if (faceRef === null)
            throw new Error("Board.getFaceRef: faceRef is null (somehow????)");

        return faceRef;
    }

    getFace(y: number, x: number): Face {
        let faceRef = this.getFaceRef(y, x);

        if (faceRef === null)
            throw new Error("Board.getFace: faceRef is null (somehow????)");

        if (faceRef.current === null)
            throw new Error("Board.getFace: faceRef.current is null (somehow????)");

        return faceRef.current;
    }

    rotateRowRight(rowIndex: number): void {
        let lastFaceRowData = this.getFace(0, 3).getRow(rowIndex);

        for (let i = 1; i <= 3; i++)
            this.getFace(0, i).setRow(
                rowIndex,
                this.getFace(0, i - 1).getRow(rowIndex),
                "right"
            );

        this.getFace(0, 0).setRow(
            rowIndex,
            lastFaceRowData,
            "right"
        )

        if (rowIndex === 0) {
            this.getFace(3, 0).rotateCounterClockwise();
        } else if (rowIndex === 2) {
            this.getFace(1, 0).rotateClockwise();
        }
    }

    rotateRowLeft(rowIndex: number): void {
        let firstFaceRowData = this.getFace(0, 0).getRow(rowIndex);

        for (let i = 3; i >= 1; i--)
            this.getFace(0, i - 1).setRow(
                rowIndex,
                this.getFace(0, i).getRow(rowIndex),
                "left"
            );

        this.getFace(0, 3).setRow(
            rowIndex,
            firstFaceRowData,
            "left"
        );

        if (rowIndex === 0) {
            this.getFace(3, 0).rotateClockwise();
        } else if (rowIndex === 2) {
            this.getFace(1, 0).rotateCounterClockwise();
        }
    }

    rotateColUp(colIndex: number): void {
        let firstFaceColData = this.getFace(0, 0).getCol(colIndex);

        for (let i = 3; i >= 1; i--)
            this.getFace(i - 1, 0).setCol(
                colIndex,
                this.getFace(i, 0).getCol(colIndex),
                "up"
            );

        this.getFace(3, 0).setCol(
            colIndex,
            firstFaceColData,
            "up"
        );

        if (colIndex === 0) {
            this.getFace(0, 3).rotateCounterClockwise();
        } else if (colIndex === 2) {
            this.getFace(0, 1).rotateClockwise();
        }
    }

    rotateColDown(colIndex: number): void {
        let lastFaceColData = this.getFace(3, 0).getCol(colIndex);

        for (let i = 1; i <= 3; i++)
            this.getFace(i, 0).setCol(
                colIndex,
                this.getFace(i - 1, 0).getCol(colIndex),
                "down"
            );

        this.getFace(0, 0).setCol(
            colIndex,
            lastFaceColData,
            "down"
        );

        if (colIndex === 0) {
            this.getFace(0, 3).rotateClockwise();
        } else if (colIndex === 2) {
            this.getFace(0, 1).rotateCounterClockwise();
        }
    }

    clickCenterFace(rowIndex: number, colIndex: number) {
        console.log("clickCenterFace", rowIndex, colIndex);
    }
    clickTopFace(rowIndex: number, colIndex: number) {
        this.rotateColUp(colIndex);
    }
    clickBottomFace(rowIndex: number, colIndex: number) {
        this.rotateColDown(colIndex);
    }
    clickLeftFace(rowIndex: number, colIndex: number) {
        this.rotateRowLeft(rowIndex);
    }
    clickRightFace(rowIndex: number, colIndex: number) {
        this.rotateRowRight(rowIndex);
    }
    onKeyDown(key: string) {
        if (this._keyHandler.current?.isKeyDown("z")) {
            if (key == "7") this.rotateRowLeft(0);
            if (key == "4") this.rotateRowLeft(1);
            if (key == "1") this.rotateRowLeft(2);

            if (key == "9") this.rotateRowRight(0);
            if (key == "6") this.rotateRowRight(1);
            if (key == "3") this.rotateRowRight(2);
        } else if (this._keyHandler.current?.isKeyDown("x")) {
            if (key == "7") this.rotateColUp(0);
            if (key == "8") this.rotateColUp(1);
            if (key == "9") this.rotateColUp(2);

            if (key == "1") this.rotateColDown(0);
            if (key == "2") this.rotateColDown(1);
            if (key == "3") this.rotateColDown(2);
        }

        console.log("onKeyDown", key);
    }
    onKeyUp(key: string) {
        console.log("onKeyUp", key);
    }
    
    render(): JSX.Element {
        return (
            <div className="game-container">
                <Face
                    value={0}
                    ref={this.getFaceRef(0, 0)}
                    onTileClick={this.clickCenterFace.bind(this)}
                />
                <Face
                    value={1}
                    ref={this.getFaceRef(0, 1)}
                    tilt="right"
                    onTileClick={this.clickRightFace.bind(this)}
                />
                <FaceRef
                    ref={(this.getFaceRef(0, 2) as React.RefObject<FaceRef>)}
                    faceRef={this.getFaceRef(2, 0)}
                    visible={false}
                />
                <Face
                    value={2}
                    ref={this.getFaceRef(0, 3)}
                    tilt="left"
                    onTileClick={this.clickLeftFace.bind(this)}
                />
                <Face
                    value={3}
                    ref={this.getFaceRef(1, 0)}
                    tilt="down"
                    onTileClick={this.clickBottomFace.bind(this)}
                />
                <Face
                    value={4}
                    ref={this.getFaceRef(2, 0)}
                    tilt="test2"
                />
                <Face
                    value={5}
                    ref={this.getFaceRef(3, 0)}
                    tilt="up"
                    onTileClick={this.clickTopFace.bind(this)}
                />
                <KeyHandler
                    ref={ this._keyHandler }
                    onKeyDown={ this.onKeyDown.bind(this) }
                    onKeyUp={ this.onKeyUp.bind(this) }
                />
                <KeyHints />
            </div>
        );
    }
}

export default Board;
export type { BoardProps };