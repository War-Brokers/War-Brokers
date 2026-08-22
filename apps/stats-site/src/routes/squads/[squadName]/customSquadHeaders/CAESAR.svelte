<script lang="ts">
    import type { PageData } from "../$types"
    import SquadHeader from "../SquadHeader.svelte"

    const data: PageData = $props()
</script>

<SquadHeader {...data}>
    <p class="mb-10 font-bold italic">"Res, non verba"</p>

    <div class="mb-4 w-full text-center">
        <h3 class="mb-1 text-xl font-black">Requirements</h3>
        <ul class="font-bold">
            <li>Burning will to improve</li>
            <li>Be chivalrous</li>
            <li>Level 25 or above</li>
        </ul>
    </div>
</SquadHeader>
