import { writable, get } from 'svelte/store';

enum Tilt {
    None = "none",
    Left = "left",
    Right = "right",
    Up = "up",
    Down = "down",
    Behind = "behind",
    Test2 = "test2"
}

enum Animation {
    None = "none",
    RotateCW = "rotate-cw",
    RotateCCW = "rotate-ccw",
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right"
}

class FaceState {
    faceChangedPrev = writable([
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ]);

    _animation = writable(Animation.None);
    keyIncrement = writable(0);
    
    _tiles = writable([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]);

    constructor(value: number) {
        this._tiles.set([
            [value, value, value],
            [value, value, value],
            [value, value, value]
        ]);
    }

    set animation(newAnimation: Animation) {
        this.keyIncrement.set(get(this.keyIncrement) + 1);
        this._animation.set(newAnimation);
    }
    
    clearFaceChangedPrev() {
        this.faceChangedPrev.set([
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ]);
    }

    setAllFaceChangedPrev() {
        this.faceChangedPrev.set([
            [true, true, true],
            [true, true, true],
            [true, true, true]
        ]);
    }

    getRow(rowIndex: number) {
        return structuredClone(get(this._tiles)[rowIndex]);
    }

    setRow(rowIndex: number, rowData: number[], animationNew: Animation = Animation.None) {
        let faceChanged = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ];

        let tiles = get(this._tiles);

        for (let i = 0; i < rowData.length; i++) {
            tiles[rowIndex][i] = rowData[i];
            faceChanged[rowIndex][i] = true;
        }

        this.faceChangedPrev.set(faceChanged);
        this._tiles.set(tiles);
        this.animation = animationNew;
    }

    getCol(colIndex: number): number[] {
        let colData = [];

        let tiles = get(this._tiles);

        for (let i = 0; i < tiles.length; i++)
            colData.push(tiles[i][colIndex]);
            
        return colData;
    }

    setCol(colIndex: number, colData: number[], animationNew: Animation = Animation.None) {
        let faceChanged = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ];

        let tiles = get(this._tiles);

        for (let i = 0; i < colData.length; i++) {
            tiles[i][colIndex] = colData[i];
            faceChanged[i][colIndex] = true;
        }

        this.faceChangedPrev.set(faceChanged);
        this._tiles.set(tiles);
        this.animation = animationNew;
    }

    rotateClockwise() {
        let tiles = get(this._tiles);
        this._tiles.set([
            [tiles[2][0], tiles[1][0], tiles[0][0]],
            [tiles[2][1], tiles[1][1], tiles[0][1]],
            [tiles[2][2], tiles[1][2], tiles[0][2]]
        ]);
        this.setAllFaceChangedPrev();
        this.animation = Animation.RotateCW;
    }

    rotateCounterClockwise() {
        let tiles = get(this._tiles);
        this._tiles.set([
            [tiles[0][2], tiles[1][2], tiles[2][2]],
            [tiles[0][1], tiles[1][1], tiles[2][1]],
            [tiles[0][0], tiles[1][0], tiles[2][0]]
        ]);
        this.setAllFaceChangedPrev();
        this.animation = Animation.RotateCCW;
    }
}

export { FaceState, Tilt, Animation };