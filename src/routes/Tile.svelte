<script lang="ts">
    export let colorID: number = 0;
    export let visible: boolean = true;
    export let x: number;
    export let y: number;

    $: classes = `game-tile game-tile-color-${colorID}`;
    $: style = `opacity: ${visible ? 1 : 0}`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    style={style}
    class={classes}
    on:click
    on:mousedown
    on:mouseup
    data-x={x}
    data-y={y}
/>

<style lang="scss">
    .game-tile {
        width: 33.33333333%;
        height: 100%;
        box-sizing: border-box;
        display: inline-block;

        position: relative;
        overflow: hidden;

        &::before {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            transform: scale(0.89);
        }
        
        &::after {
            transform: scale(0.9);
            display: block;
            position: absolute;

            font-weight: bold;
            font-family: "Arial";
            font-size: 156px;
            top: -59px;
            left: -4px;
        }
    }   

    .game-tile-color-0 {
        &::before {
            background-color: #d21972;
        }

        &::after {
            color: #b20157;
            content: "⚀";
        }
    }

    .game-tile-color-1 {
        &::before {
            background-color: #648FFF;
        }

        &::after {
            color: #3b72ff;
            content: "⚁";
        }
    }

    .game-tile-color-2 {
        &::before {
            background-color: #502deb;
        }

        &::after {
            color: #380fea;
            content: "⚂";
        }
    }

    .game-tile-color-3 {
        &::before {
            background-color: #ff4d00;
        }

        &::after {
            color: #dc4200;
            content: "⚃";
        }
    }

    .game-tile-color-4 {
        &::before {
            background-color: #FFFFFF;
        }

        &::after {
            color: #dedede;
            content: "⚄";
        }
    }

    .game-tile-color-5 {
        &::before {
            background-color: #FFB000;
        }

        &::after {
            color: #da8e00;
            content: "⚅";
        }
    }
</style>