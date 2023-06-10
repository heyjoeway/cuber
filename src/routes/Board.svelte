<script lang="ts">
    import Face from "./Face.svelte";
    import {
        FaceState,
        Tilt as FaceTilt,
        Animation as FaceAnimation
    } from "./FaceState";
    import KeyHints from "./KeyHints.svelte";
    import KeyHandler from "./KeyHandler.svelte";
    import { onMount } from "svelte";
    import {
        HistoryNumberVar,
        absCap,
        noNaN
    } from "./Utils";

    let animProgress = 1;
    let animProgressVisual = animProgress;
    let animSpeed = 0;

    onMount(() => {
        setInterval(() => {
            if ([DragMode.Inactive, DragMode.Free].includes(dragMode)) {
                let movingSlowly = Math.abs(animSpeed) < 0.006125;
                let closeToDone = Math.abs(1 - animProgress) < 0.01;
                if (movingSlowly && closeToDone) {
                    animSpeed = 0;
                    animProgress = 1;
                } else {
                    let fac = 0.25;
                    if (animProgress < 1) {
                        animSpeed += 0.02 * fac;
                    } else {
                        animSpeed -= 0.01 * fac;
                    }
                    animSpeed *= 0.9;
                    animProgress += animSpeed;
                }
            } else {
                animSpeed = absCap(
                    noNaN(dragAnimationProgress.getAverageDelta()),
                    dragDistanceMax * 0.0001
                );
                animProgress = dragAnimationProgress.value;
            }

            animProgress = animProgress;
        }, 1000 / 240);

        requestAnimationFrame(function update() {
            animProgressVisual = animProgress;
            requestAnimationFrame(update);
        });
    });

    let splay = 60;
    let faceStates: FaceState[] = [
        new FaceState(0),
        new FaceState(1),
        new FaceState(2),
        new FaceState(3),
        new FaceState(4),
        new FaceState(5)
    ];

    function prepareAnimation() {
        faceStates.forEach(face => face.clearFaceChangedPrev());
        animProgress = 0;
    }

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
        prepareAnimation();

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
        prepareAnimation();

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
        prepareAnimation();

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
        prepareAnimation();

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
        --game-anim-progress: ${animProgressVisual};
        --game-anim-progress-inv: ${1 - animProgressVisual};
    `;

    enum DragMode {
        Inactive,
        Free,
        RowRight,
        RowLeft,
        ColUp,
        ColDown
    }

    const dragDistanceMax = 200;

    let dragMode: DragMode = DragMode.Inactive;
    let dragStartX: number = 0;
    let dragStartY: number = 0;
    let dragRowIndex: number = 0;
    let dragColIndex: number = 0;
    let dragAnimationProgress: HistoryNumberVar = new HistoryNumberVar(10, 0);

    const dragThreshold = 10;

    function onFaceMouseDown(rowIndex: number, colIndex: number, clientX: number, clientY: number) {
        dragMode = DragMode.Free;
        dragStartX = clientX;
        dragStartY = clientY;
        dragRowIndex = rowIndex;
        dragColIndex = colIndex;
        dragAnimationProgress.set(0);
        dragAnimationProgress.clearHistory();
    }

    function onMouseMove(event: MouseEvent) {
        let deltaX = event.clientX - dragStartX;
        let deltaY = event.clientY - dragStartY;

        onDragMove(deltaX, deltaY);
    }

    function onTouchMove(event: TouchEvent) {
        let deltaX = event.touches[0].clientX - dragStartX;
        let deltaY = event.touches[0].clientY - dragStartY;

        onDragMove(deltaX, deltaY);
    }
    
    function onDragMove(deltaX: number, deltaY: number) {
        if (dragMode == DragMode.Inactive) return;
    
        // If we haven't decided on a drag mode yet, check if we've moved enough to decide
        if (dragMode == DragMode.Free) {
            if (Math.abs(deltaX) > dragThreshold) {
                if (deltaX > 0) {
                    dragMode = DragMode.RowRight;
                    rotateRowRight(dragRowIndex);
                } else {
                    dragMode = DragMode.RowLeft;
                    rotateRowLeft(dragRowIndex);
                }
            } else if (Math.abs(deltaY) > dragThreshold) {
                if (deltaY > 0) {
                    dragMode = DragMode.ColDown;
                    rotateColDown(dragColIndex);
                } else {
                    dragMode = DragMode.ColUp;
                    rotateColUp(dragColIndex);
                }
            }
        }

        if (dragMode == DragMode.RowLeft) {
            if (deltaX > 0) {
                rotateRowRight(dragRowIndex);
                rotateRowRight(dragRowIndex);
                dragMode = DragMode.RowRight;
            }
            dragAnimationProgress.set(Math.min(1, Math.abs(deltaX) / dragDistanceMax));
        } else if (dragMode == DragMode.RowRight) {
            if (deltaX < 0) {
                rotateRowLeft(dragRowIndex);
                rotateRowLeft(dragRowIndex);
                dragMode = DragMode.RowLeft;
            }
            dragAnimationProgress.set(Math.min(1, Math.abs(deltaX) / dragDistanceMax));
        } else if (dragMode == DragMode.ColUp) {
            if (deltaY > 0) {
                rotateColDown(dragColIndex);
                rotateColDown(dragColIndex);
                dragMode = DragMode.ColDown;
            }
            dragAnimationProgress.set(Math.min(1, Math.abs(deltaY) / dragDistanceMax));
        } else if (dragMode == DragMode.ColDown) {
            if (deltaY < 0) {
                rotateColUp(dragColIndex);
                rotateColUp(dragColIndex);
                dragMode = DragMode.ColUp;
            }
            dragAnimationProgress.set(Math.min(1, Math.abs(deltaY) / dragDistanceMax));
        }
    }

    function onDragEnd() {
        wheelDragStarted = false;
        if (dragMode == DragMode.Inactive) return;

        // Cancel if we haven't dragged far enough
        if (
            (dragAnimationProgress.value < 0.25) &&
            (dragAnimationProgress.getAverageDelta() < 0.05)
        ) {
            if (dragMode == DragMode.RowLeft) {
                rotateRowRight(dragRowIndex);
            } else if (dragMode == DragMode.RowRight) {
                rotateRowLeft(dragRowIndex);
            } else if (dragMode == DragMode.ColUp) {
                rotateColDown(dragColIndex);
            } else if (dragMode == DragMode.ColDown) {
                rotateColUp(dragColIndex);
            }
            animProgress = 1 - dragAnimationProgress.value;
        }

        dragMode = DragMode.Inactive;
    }

    function onTouchStart(event: TouchEvent) {
        // So, this is gonna be a hack
        // When you assign a touchStart handler on an element and the element disappears,
        // the touchMove events don't fire after that, even if they're not assigned to the same element.
        // So, we need to attach the touchMove event to the window instead.
        // fun

        // Check target has class ".game-tile"
        const eTile = event.target as HTMLElement;
        if (!eTile.classList.contains("game-tile")) return;
        
        // We need to know which tile was touched, so we need to get some data attributes from the element and cast to int
        const rowIndexStr = eTile.getAttribute("data-y");
        const colIndexStr = eTile.getAttribute("data-x");
        if (!rowIndexStr || !colIndexStr) return;
        const rowIndex = parseInt(rowIndexStr);
        const colIndex = parseInt(colIndexStr);

        // No seriously, why the FUCK does this work
        // Like, target still gets destroyed with the element right?
        // So why does this work and the normal way doesn't?
        // Stupid fucking JS bullshit
        const touchMoveHandler = (e: Event) => onTouchMove(e as TouchEvent);
        const touchEndHandler = () => {
            event.target?.removeEventListener("touchmove", touchMoveHandler);
            event.target?.removeEventListener("touchend", touchEndHandler);
            onDragEnd();
        }
        event.target?.addEventListener("touchmove", touchMoveHandler);
        event.target?.addEventListener("touchend", touchEndHandler);

        // Finally, start the drag
        dragMode = DragMode.Free;
        dragStartX = event.touches[0].clientX;
        dragStartY = event.touches[0].clientY;
        dragRowIndex = rowIndex;
        dragColIndex = colIndex;
        dragAnimationProgress.set(0);
        dragAnimationProgress.clearHistory();
    }

    let wheelDragStarted = false;
    let wheelDragDeltaX = 0;
    let wheelDragDeltaY = 0;
    let wheelDragTimeout: number;
    let wheelDragTimeLast = 0;

    function onMouseWheel(event: WheelEvent) {
        event.preventDefault();

        let timeSinceLastDragEvent = performance.now() - wheelDragTimeLast;
        wheelDragTimeLast = performance.now();
        
        if (timeSinceLastDragEvent > 70) {
            // Check target has class ".game-tile"
            const eTile = event.target as HTMLElement;
            if (!eTile.classList.contains("game-tile")) return;
            
            // We need to know which tile was touched, so we need to get some data attributes from the element and cast to int
            const rowIndexStr = eTile.getAttribute("data-y");
            const colIndexStr = eTile.getAttribute("data-x");
            if (!rowIndexStr || !colIndexStr) return;
            
            dragMode = DragMode.Free;
            wheelDragStarted = true;
            wheelDragDeltaX = 0;
            wheelDragDeltaY = 0;
            dragRowIndex = parseInt(rowIndexStr);
            dragColIndex = parseInt(colIndexStr);
            dragAnimationProgress.set(0);
            dragAnimationProgress.clearHistory();
        } 

        if (!wheelDragStarted) return;

        let fac = .5;
        let deltaX = absCap(
            event.deltaX * fac,
            dragDistanceMax * 0.05
        );
        let deltaY = absCap(
            event.deltaY * fac,
            dragDistanceMax * 0.05
        );

        wheelDragDeltaX = absCap(
            wheelDragDeltaX - deltaX,
            dragDistanceMax
        );
        wheelDragDeltaY = absCap(
            wheelDragDeltaY - deltaY,
            dragDistanceMax
        );

        onDragMove(wheelDragDeltaX, wheelDragDeltaY);

        clearInterval(wheelDragTimeout);
        wheelDragTimeout = setTimeout(() => {
            onDragEnd();
        }, 250);

        if (dragAnimationProgress.value > 0.25) {
            onDragEnd();
        }
    }
</script>

<svelte:window
    on:mousemove={onMouseMove}
    on:mouseup={onDragEnd}
    on:touchstart|nonpassive={onTouchStart}
    on:wheel|nonpassive={onMouseWheel}
/>

<KeyHandler
    bind:this={handler}
    onKeyDown={onKeyDown}
    onKeyUp={onKeyUp}
/>

<div class="game-container" style={cssVarStyles}>
    <Face
        state={faceStates[0]}
        onFaceClick={clickCenterFace}
        onFaceMouseDown={onFaceMouseDown}
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

    * {
        user-select: none;
        touch-action: none;
    }

    html, body {
       overscroll-behavior-x: none;
    } 
</style>