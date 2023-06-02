<script lang="ts">
    import Face from "./Face.svelte";
    import {
        FaceState,
        Tilt as FaceTilt,
        Animation as FaceAnimation
    } from "./FaceState";
    import KeyHints from "./KeyHints.svelte";
    import KeyHandler from "./KeyHandler.svelte";

    let splay = 60;
    let faceStates: FaceState[] = [
        new FaceState(0),
        new FaceState(1),
        new FaceState(2),
        new FaceState(3),
        new FaceState(4),
        new FaceState(5)
    ];

    function getFace(y: number, x: number): FaceState {
        if (y === 0) {
            switch (x) {
                case 0: return faceStates[0];
                case 1: return faceStates[1];
                case 2: return faceStates[2];
                case 3: return faceStates[3];
            }
        } else if (x === 0) {
            switch (y) {
                case 1: return faceStates[4];
                case 2: return faceStates[2];
                case 3: return faceStates[5];
            }
        }
        throw new Error(`Invalid face coordinates: (${x}, ${y})`);
    }

    function rotateRowRight(rowIndex: number) {
        let lastFaceRowData = getFace(0, 3).getRow(rowIndex);

        for (let i = 3; i >= 1; i--) {
            getFace(0, i).setRow(
                rowIndex,
                getFace(0, i - 1).getRow(rowIndex),
                FaceAnimation.Right
            );
        }

        getFace(0, 0).setRow(
            rowIndex,
            lastFaceRowData,
            FaceAnimation.Right
        );

        if (rowIndex === 0) {
            getFace(3, 0).rotateCounterClockwise();
        } else if (rowIndex === 2) {
            getFace(1, 0).rotateClockwise();
        }
    }

    function rotateRowLeft(rowIndex: number) {
        let firstFaceRowData = getFace(0, 0).getRow(rowIndex);

        for (let i = 1; i <= 3; i++) {
            getFace(0, i - 1).setRow(
                rowIndex,
                getFace(0, i).getRow(rowIndex),
                FaceAnimation.Left
            );
        }

        getFace(0, 3).setRow(
            rowIndex,
            firstFaceRowData,
            FaceAnimation.Left
        );

        if (rowIndex === 0) {
            getFace(3, 0).rotateClockwise();
        } else if (rowIndex === 2) {
            getFace(1, 0).rotateCounterClockwise();
        }
    }

    function rotateColUp(colIndex: number) {
        let firstFaceColData = getFace(0, 0).getCol(colIndex);

        for (let i = 1; i <= 3; i++) {
            getFace(i - 1, 0).setCol(
                colIndex,
                getFace(i, 0).getCol(colIndex),
                FaceAnimation.Up
            );
        }

        getFace(3, 0).setCol(
            colIndex,
            firstFaceColData,
            FaceAnimation.Up
        );

        if (colIndex === 0) {
            getFace(0, 3).rotateCounterClockwise();
        } else if (colIndex === 2) {
            getFace(0, 1).rotateClockwise();
        }
    }

    function rotateColDown(colIndex: number) {
        let lastFaceColData = getFace(3, 0).getCol(colIndex);

        for (let i = 3; i >= 1; i--) {
            getFace(i, 0).setCol(
                colIndex,
                getFace(i - 1, 0).getCol(colIndex),
                FaceAnimation.Down
            );
        }

        getFace(0, 0).setCol(
            colIndex,
            lastFaceColData,
            FaceAnimation.Down
        );

        if (colIndex === 0) {
            getFace(0, 3).rotateClockwise();
        } else if (colIndex === 2) {
            getFace(0, 1).rotateCounterClockwise();
        }
    }

    function clickCenterFace(rowIndex: number, colIndex: number) {
        console.log("clickCenterFace", rowIndex, colIndex);
    }
    function clickTopFace(rowIndex: number, colIndex: number) {
        rotateColUp(colIndex);
    }
    function clickBottomFace(rowIndex: number, colIndex: number) {
        rotateColDown(colIndex);
    }
    function clickLeftFace(rowIndex: number, colIndex: number) {
        rotateRowLeft(rowIndex);
    }
    function clickRightFace(rowIndex: number, colIndex: number) {
        rotateRowRight(rowIndex);
    }

    let handler: KeyHandler;

    function onKeyDown(key: string) {
        if (handler.isKeyDown("z")) {
            if (key === "7") rotateRowLeft(0);
            if (key === "4") rotateRowLeft(1);
            if (key === "1") rotateRowLeft(2);

            if (key === "9") rotateRowRight(0);
            if (key === "6") rotateRowRight(1);
            if (key === "3") rotateRowRight(2);
        } else if (handler.isKeyDown("x")) {
            if (key === "7") rotateColUp(0);
            if (key === "8") rotateColUp(1);
            if (key === "9") rotateColUp(2);

            if (key === "1") rotateColDown(0);
            if (key === "2") rotateColDown(1);
            if (key === "3") rotateColDown(2);
        }

        console.log("onKeyDown", key);
    }

    function onKeyUp(key: string) {
        console.log("onKeyUp", key);
    }

    $: cssVarStyles = `
        --game-tilt-deg: ${splay}deg;
        --game-tilt-origin-z: ${-22876 * Math.pow(splay, -1.132)}px;
    `;
</script>

<KeyHandler
    bind:this={handler}
    onKeyDown={onKeyDown}
    onKeyUp={onKeyUp}
/>

<div class="game-container" style={cssVarStyles}>
    <Face
        state={faceStates[0]}
        onFaceClick={clickCenterFace}
        />
    <Face
        state={faceStates[1]}
        tilt={FaceTilt.Right}
        onFaceClick={clickRightFace}
    />
    <Face
        state={faceStates[2]}
        tilt={FaceTilt.Behind}
    />
    <Face
        state={faceStates[3]}
        tilt={FaceTilt.Left}
        onFaceClick={clickLeftFace}
    />
    <Face
        state={faceStates[2]}
        tilt={FaceTilt.Test2}
    />
    <Face
        state={faceStates[4]}
        tilt={FaceTilt.Down}
        onFaceClick={clickBottomFace}
    />
    <Face
        state={faceStates[5]}
        tilt={FaceTilt.Up}
        onFaceClick={clickTopFace}
    />
    <KeyHints />
</div>

<style lang="scss">
    .game-container {
        perspective: 1000px;
        position: relative;
    }
</style>