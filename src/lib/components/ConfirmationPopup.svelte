<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let show: boolean;
    export let message: string;

    const dispatch = createEventDispatcher();

    function confirm() {
        dispatch('confirm');
        show = false;
    }

    function cancel() {
        dispatch('cancel');
        show = false;
    }
</script>

{#if show}
    <div class="modal-overlay">
        <div class="modal-content">
            <p>{message}</p>
            <button on:click={confirm}>Confirm</button>
            <button on:click={cancel}>Cancel</button>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
    }

    .modal-content button {
        margin: 0 10px;
        padding: 8px 16px;
        cursor: pointer;
    }
</style>