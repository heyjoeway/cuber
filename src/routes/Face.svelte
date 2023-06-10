<script lang="ts">
	import { createEventDispatcher } from 'svelte';

    import Row from "./Row.svelte";
    import Tile from "./Tile.svelte";
    import { FaceState, Tilt } from "./FaceState";

    export let visible: boolean = true;
    export let tilt: Tilt = Tilt.None;
    export let state: FaceState;
    export let onFaceClick: (
        rowIndex: number,
        colIndex: number
    ) => void = () => {};
    export let onFaceMouseDown: (
        rowIndex: number,
        colIndex: number,
        clientX: number,
        clientY: number
    ) => void = () => {};

    let { _tiles, faceChangedPrev, _animation, keyIncrement } = state;
</script>

<slot state={state} />

{#if visible}
    {#key $keyIncrement}
        <div
            class="game-face game-face-anim tilt-{tilt.toString()} anim-{$_animation.toString()}"
            style="pointerEvents:none"
        >
            {#each {length: 3} as _, y}
                {#key y}
                    <Row>
                        {#each {length: 3} as _, x}
                            {#key x}
                                <Tile
                                    colorID={$_tiles[y][x]}
                                    visible={$faceChangedPrev[y][x]}
                                    x={x} y={y}
                                />
                            {/key}
                        {/each}
                    </Row>
                {/key}
            {/each}
        </div>

        <div
            class="game-face tilt-{tilt.toString()}"
            style="pointerEvents:none"
        >
            {#each {length: 3} as _, y}
                {#key y}
                    <Row>
                        {#each {length: 3} as _, x}
                            {#key x}
                            <!-- on:touchstart={ e => onFaceMouseDown(y, x, e.touches[0].clientX, e.touches[0].clientY) } -->
                                <Tile
                                    colorID={$_tiles[y][x]}
                                    visible={!$faceChangedPrev[y][x]}
                                    on:click={ () => onFaceClick(y, x) }
                                    on:mousedown={ e => onFaceMouseDown(y, x, e.clientX, e.clientY) }
                                    x={x} y={y}
                                />
                            {/key}
                        {/each}
                    </Row>
                {/key}
            {/each}
        </div>
    {/key}
{/if}

<style lang="scss">

.game-face {
    width: 256px;
    height: 256px;
    transform-style: preserve-3d;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    transform-origin: 50% 50% var(--game-tilt-origin-z);
    animation-fill-mode: forwards;
    animation-duration: var(--game-anim-time);
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    box-sizing: border-box;
}

.game-face-anim {
    z-index: 10 !important;
    // filter: grayscale(100%);
}

.tilt-up,
.tilt-down,
.tilt-left,
.tilt-right {
    z-index: 100;
    // filter: saturate(0.9) brightness(0.9);
}

.tilt-none {
    z-index: 1000;
}

.tilt-none {
    &.anim-left {
        transform: translateX(-50%) translateY(-50%) rotateY(calc(var(--game-tilt-deg) * var(--game-anim-progress-inv)));
    }

    &.anim-right {
        transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg) * var(--game-anim-progress-inv)));
    }

    &.anim-up {
        transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg) * var(--game-anim-progress-inv)));
    }

    &.anim-down {
        transform: translateX(-50%) translateY(-50%) rotateX(calc(var(--game-tilt-deg) * var(--game-anim-progress-inv)));
    }

    transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
}

.tilt-down {    
    &.anim-rotate-cw {
        transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg))) rotateZ(calc(-1 * var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-rotate-ccw {
        transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg))) rotateZ(calc(var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-down {
        transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-anim-progress) * var(--game-tilt-deg)));
    }

    &.anim-up {
        opacity: var(--game-anim-progress);
        transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * (1 + var(--game-anim-progress-inv)) * var(--game-tilt-deg))); 
        z-index: -9999 !important;
    }

    transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg)));
}

.tilt-up {
    &.anim-rotate-cw {
        transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg)) rotateZ(calc(-1 * var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-rotate-ccw {
        transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg)) rotateZ(calc(var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-up {
        transform: translateX(-50%) translateY(-50%) rotateX(calc(var(--game-tilt-deg) * var(--game-anim-progress)));
    }

    &.anim-down {
        transform: translateX(-50%) translateY(-50%) rotateX(calc((1 + var(--game-anim-progress-inv)) * var(--game-tilt-deg))); 
        opacity: var(--game-anim-progress);
        z-index: -9999 !important;
    }

    transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg));
}

.tilt-left {
    &.anim-rotate-cw {
        transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg))) rotateZ(calc(-1 * var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-rotate-ccw {
        transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg))) rotateZ(calc(var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-left {
        transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-anim-progress) * var(--game-tilt-deg)));
    }

    &.anim-right {
        opacity: var(--game-anim-progress);
        transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * (1 + var(--game-anim-progress-inv)) * var(--game-tilt-deg)));
        z-index: -9999 !important;
    }

    transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg)));
}

.tilt-right {
    &.anim-rotate-cw {
        transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg)) rotateZ(calc(-1 * var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-rotate-ccw {
        transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg)) rotateZ(calc(var(--game-anim-progress-inv) * 90deg));
    }

    &.anim-right {
        transform: translateX(-50%) translateY(-50%) rotateY(calc(var(--game-anim-progress) * var(--game-tilt-deg)));
    }

    &.anim-left {
        transform: translateX(-50%) translateY(-50%) rotateY(calc((1 + var(--game-anim-progress-inv)) * var(--game-tilt-deg)));
        z-index: -9999 !important;
    }

    transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg));
}

.tilt-test2 {
    transform: translateX(50%) translateY(-150%) scale(70%);
}

.tilt-behind {
    opacity: 0;
    pointer-events: none;
    z-index: -9999 !important;

    &.anim-right {
        opacity: var(--game-anim-progress-inv);
        transform: translateX(-50%) translateY(-50%) rotateY(calc((1 + var(--game-anim-progress)) * var(--game-tilt-deg)));
    }
    &.anim-left {
        opacity: var(--game-anim-progress-inv);
        transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * (1 + var(--game-anim-progress)) * var(--game-tilt-deg)));
    }
    &.anim-up {
        opacity: var(--game-anim-progress-inv);
        transform: translateX(-50%) translateY(-50%) rotateX(calc((1 + var(--game-anim-progress)) * var(--game-tilt-deg)));
    }
    &.anim-down {
        opacity: var(--game-anim-progress-inv);
        transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * (1 + var(--game-anim-progress)) * var(--game-tilt-deg)));
    }
}
</style>