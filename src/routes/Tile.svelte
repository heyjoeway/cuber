<script lang="ts">
    export let colorID: number = 0;
    export let visible: boolean = true;

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
/>

<style lang="scss">
    .game-tile {
        width: 33.33333333%;
        height: 100%;
        background-color: #eee;
        box-sizing: border-box;
        display: inline-block;
        transform: scale(0.9);

        position: relative;
        overflow: hidden;

        &::after {
            font-weight: bold;
            font-family: "Arial";
            font-size: 156px;
            display: block;
            position: absolute;
            top: -59px;
            left: -4px;
        }
    }   

    .game-tile-color-0 {
        background-color: #d21972;
        &::after {
            color: #b20157;
            content: "⚀";
        }
    }

    .game-tile-color-1 {
        background-color: #648FFF;
        &::after {
            color: #3b72ff;
            content: "⚁";
        }
    }

    .game-tile-color-2 {
        background-color: #502deb;
        &::after {
            color: #380fea;
            content: "⚂";
        }
    }

    .game-tile-color-3 {
        background-color: #ff4d00;
        &::after {
            color: #dc4200;
            content: "⚃";
        }
    }

    .game-tile-color-4 {
        background-color: #FFFFFF;
        &::after {
            color: #dedede;
            content: "⚄";
        }
    }

    .game-tile-color-5 {
        background-color: #FFB000;
        &::after {
            color: #da8e00;
            content: "⚅";
        }
    }
</style>