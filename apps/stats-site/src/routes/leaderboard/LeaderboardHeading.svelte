<script lang="ts">
    export let href: string = ""
</script>

<h3 class="mb-3 mt-10 w-full text-xl font-semibold">
    {#if href}
        <a
            {href}
            class="underline underline-offset-4 hover:dark:text-orange-500"
        >
            <slot />
        </a>
    {:else}
        <slot />
    {/if}
</h3>
