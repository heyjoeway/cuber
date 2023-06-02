<script lang="ts">
    export let onKeyDown: (key: string) => void;
    export let onKeyUp: (key: string) => void;
    
    let _keysHeld = new Set();

    export function isKeyDown(key: string): boolean {
        return _keysHeld.has(key);
    }

    export function areAllKeysDown(keys: string[]): boolean {
        for (let key of keys)
            if (!isKeyDown(key))
                return false;
        return true;
    }

    export function isAnyKeyDown(keys: string[]): boolean {
        for (let key of keys)
            if (isKeyDown(key))
                return true;
        return false;
    }

    function _handleKeyDown(event: KeyboardEvent): void {
        // Prevent repeat keys
        if (_keysHeld.has(event.key))
            return;

        _keysHeld.add(event.key);
        onKeyDown(event.key);
    }
    
    function _handleKeyUp(event: KeyboardEvent): void {
        _keysHeld.delete(event.key);
        onKeyUp(event.key);
    }
</script>

<svelte:window on:keydown={_handleKeyDown} on:keyup={_handleKeyUp} />