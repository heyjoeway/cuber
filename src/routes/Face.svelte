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
                                <Tile
                                    colorID={$_tiles[y][x]}
                                    visible={!$faceChangedPrev[y][x]}
                                    on:click={ () => onFaceClick(y, x) }
                                    on:mousedown={ e => onFaceMouseDown(y, x, e.clientX, e.clientY) }
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

:root {
    --game-anim-time: 0.5s;
}

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
    animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
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
    @keyframes anim-tilt-none-left {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg));
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }
    }

    @keyframes anim-tilt-none-right {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg)));
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }
    }

    @keyframes anim-tilt-none-up {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg)));
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }
    }

    @keyframes anim-tilt-none-down {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg));
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }
    }

    &.anim-left {
        animation-name: anim-tilt-none-left;
    }

    &.anim-right {
        animation-name: anim-tilt-none-right;
    }

    &.anim-up {
        animation-name: anim-tilt-none-up;
    }

    &.anim-down {
        animation-name: anim-tilt-none-down;
    }

    transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
}

.tilt-down {
    @keyframes anim-tilt-down-rotate-cw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg))) rotateZ(-90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg))) rotateZ(0deg);
        }
    }

    @keyframes anim-tilt-down-rotate-ccw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg))) rotateZ(90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg))) rotateZ(0deg);
        }
    }

    // Tilt down from none
    @keyframes anim-tilt-down-down {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg)));
        }
    }

    // Tilt up from edge
    @keyframes anim-tilt-down-up {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-2 * var(--game-tilt-deg))); // -90
        }

        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg)));
        }
    }

    &.anim-rotate-cw {
        animation-name: anim-tilt-down-rotate-cw;
    }

    &.anim-rotate-ccw {
        animation-name: anim-tilt-down-rotate-ccw;
    }

    &.anim-down {
        animation-name: anim-tilt-down-down;
    }

    &.anim-up {
        animation-name: anim-tilt-down-up;
        z-index: -9999 !important;
    }

    transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg)));
}

.tilt-up {
    @keyframes anim-tilt-up-rotate-cw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg)) rotateZ(-90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg)) rotateZ(0deg);
        }
    }

    @keyframes anim-tilt-up-rotate-ccw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg)) rotateZ(90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg)) rotateZ(0deg);
        }
    }

    // Tilt up from none
    @keyframes anim-tilt-up-up {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg));
        }
    }

    // Tilt down from edge
    @keyframes anim-tilt-up-down {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateX(calc(2 * var(--game-tilt-deg))) // 90;
        }

        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg));
        }
    }

    &.anim-rotate-cw {
        animation-name: anim-tilt-up-rotate-cw;
    }

    &.anim-rotate-ccw {
        animation-name: anim-tilt-up-rotate-ccw;
    }

    &.anim-up {
        animation-name: anim-tilt-up-up;
    }

    &.anim-down {
        animation-name: anim-tilt-up-down;
        z-index: -9999 !important;
    }

    transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg));
}

.tilt-left {
    @keyframes anim-tilt-left-rotate-cw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg))) rotateZ(-90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg))) rotateZ(0deg);
        }
    }

    @keyframes anim-tilt-left-rotate-ccw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg))) rotateZ(90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg))) rotateZ(0deg);
        }
    }

    // Tilt left from none
    @keyframes anim-tilt-left-left {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg)));
        }
    }

    // Tilt right from edge
    @keyframes anim-tilt-left-right {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-2 * var(--game-tilt-deg))); // -90
        }

        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg)));
        }
    }

    &.anim-rotate-cw {
        animation-name: anim-tilt-left-rotate-cw;
    }

    &.anim-rotate-ccw {
        animation-name: anim-tilt-left-rotate-ccw;
    }

    &.anim-left {
        animation-name: anim-tilt-left-left;
    }

    &.anim-right {
        animation-name: anim-tilt-left-right;
        z-index: -9999 !important;
    }

    transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg)));
}

.tilt-right {
    @keyframes anim-tilt-right-rotate-cw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg)) rotateZ(-90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg)) rotateZ(0deg);
        }
    }

    @keyframes anim-tilt-right-rotate-ccw {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg)) rotateZ(90deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg)) rotateZ(0deg);
        }
    }

    // Tilt right from none
    @keyframes anim-tilt-right-right {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateX(0deg) rotateY(0deg);
        }

        100% {
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg));
        }
    }

    // Tilt left from edge
    @keyframes anim-tilt-right-left {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateY(calc(2 * var(--game-tilt-deg))) // 90;
        }

        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg));
        }
    }

    &.anim-rotate-cw {
        animation-name: anim-tilt-right-rotate-cw;
    }

    &.anim-rotate-ccw {
        animation-name: anim-tilt-right-rotate-ccw;
    }

    &.anim-right {
        animation-name: anim-tilt-right-right;
    }

    &.anim-left {
        animation-name: anim-tilt-right-left;
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

    @keyframes anim-tilt-behind-right {
        0% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateY(var(--game-tilt-deg));
        }
        
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateY(calc(2 * var(--game-tilt-deg)));
        }
    }
    @keyframes anim-tilt-behind-left {
        0% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-1 * var(--game-tilt-deg)));
        }
        
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateY(calc(-2 * var(--game-tilt-deg)));
        }
    }
    @keyframes anim-tilt-behind-up {
        0% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateX(var(--game-tilt-deg));
        }
        
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateX(calc(2 * var(--game-tilt-deg)));
        }        
    }
    @keyframes anim-tilt-behind-down {
        0% {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-1 * var(--game-tilt-deg)));
        }
        
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) rotateX(calc(-2 * var(--game-tilt-deg)));
        }        
    }
    
    &.anim-right {
        animation-name: anim-tilt-behind-right;
    }
    &.anim-left {
        animation-name: anim-tilt-behind-left;
    }
    &.anim-up {
        animation-name: anim-tilt-behind-up;
    }
    &.anim-down {
        animation-name: anim-tilt-behind-down;
    }
}
</style>