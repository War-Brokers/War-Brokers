<script lang="ts">
    export let title: string
    export let data: string | number
</script>

<div class="flex w-24 flex-col">
    <span class="font-bold dark:text-gray-400">{title}</span>
    <span class="text-2xl font-black">{data}</span>
</div>
