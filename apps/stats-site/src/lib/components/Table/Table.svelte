<div class="overflow-x-auto border border-slate-600">
    <table>
        <slot />
    </table>
</div>

<style lang="postcss">
    ::-webkit-scrollbar {
        @apply h-2;
    }

    :where(table) :global(th) {
        @apply bg-slate-700 py-10 text-left;
    }

    :where(table) :global(td),
    :where(table) :global(th) {
        @apply py-2;
    }

    :where(table) :global(tr:nth-child(even)) {
        @apply bg-slate-700;
    }
</style>
