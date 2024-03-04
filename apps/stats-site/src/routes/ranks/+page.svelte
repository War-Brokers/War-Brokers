<script lang="ts">
    import Title from "$lib/components/title.svelte"

    import RankBadge from "./RankBadge.svelte"
</script>

<Title title="Ranks" />

<div class="flex flex-wrap justify-center">
    <RankBadge rank="Godlike" />
    <RankBadge rank="Legendary" />
    <RankBadge rank="Master" />
    <RankBadge rank="Pro" />
    <RankBadge rank="Advanced" />
    <RankBadge rank="Competent" />
    <RankBadge rank="Adequate" />
    <RankBadge rank="Novice" />
</div>
