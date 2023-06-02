<script lang="ts">
    let mode: "none" | "vert" | "horiz" = "none";

    let horizDown = false;
    let vertDown = false;

    function updateMode() {
        if (horizDown) mode = "horiz";
        else if (vertDown) mode = "vert";
        else mode = "none";
    }

    function onKeyDown(event: KeyboardEvent) {
        if (event.key === "x") vertDown = true;
        else if (event.key === "z") horizDown = true;
        updateMode();
    }

    function onKeyUp(event: KeyboardEvent) {
        if (event.key === "x") vertDown = false;
        else if (event.key === "z") horizDown = false;
        updateMode();
    }
</script>

<div class="game-keyhints">
    <div class="game-keyhints-vert" style="opacity: {mode === "vert" ? 1 : 0}">
        <div class="game-keyhint top-left"> 7 </div>
        <div class="game-keyhint top-mid"> 8 </div>
        <div class="game-keyhint top-right"> 9 </div>

        <div class="game-keyhint bottom-left"> 1 </div>
        <div class="game-keyhint bottom-mid"> 2 </div>
        <div class="game-keyhint bottom-right"> 3 </div>
    </div>

    <div class="game-keyhints-horiz" style="opacity: {mode === "horiz" ? 1 : 0}">
        <div class="game-keyhint top-left"> 7 </div>
        <div class="game-keyhint mid-left"> 4 </div>
        <div class="game-keyhint bottom-left"> 1 </div>

        <div class="game-keyhint top-right"> 9 </div>
        <div class="game-keyhint mid-right"> 6 </div>
        <div class="game-keyhint bottom-right"> 3 </div>
    </div>

    <div class="game-keyhints-modeshift">
        z&nbsp;↔&nbsp;&nbsp;&nbsp;x&nbsp;↕
    </div>
</div>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<style lang="scss">
.game-keyhints {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    transform: translateZ(0);
    font-family: sans-serif;

    color: white;
    font-weight: bold;
    font-size: 64px;
    -webkit-text-stroke: 4px black;
    filter: drop-shadow(0 0 8px white);

    pointer-events: none;
}

.game-keyhints-horiz {
    opacity: 1;
    transition: opacity 0.05s linear;

    & > * {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        opacity: 75%;
    }

    & > .top-left {
        top: -84px;
        left: -152px;
    }

    & > .mid-left {
        top: 0px;
        left: -152px;
    }

    & > .bottom-left {
        top: 84px;
        left: -152px;
    }

    & > .top-right {
        top: -84px;
        left: 152px;
    }

    & > .mid-right {
        top: 0px;
        left: 152px;
    }

    & > .bottom-right {
        top: 84px;
        left: 152px;
    }
}

.game-keyhints-vert {
    opacity: 1;
    transition: opacity 0.05s linear;

    & > * {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        opacity: 75%;
    }

    & > .top-left {
        top: -160px;
        left: -84px;
    }

    & > .top-mid {
        top: -160px;
        left: 0px;
    }

    & > .top-right {
        top: -160px;
        left: 84px;
    }

    & > .bottom-left {
        top: 160px;
        left: -84px;
    }

    & > .bottom-mid {
        top: 160px;
        left: 0px;
    }

    & > .bottom-right {
        top: 160px;
        left: 84px;
    }
}

.game-keyhints-modeshift {
    position: absolute;
    
    top: 225px;
    left: 0;
    transform: translateX(-50%);

}
</style>