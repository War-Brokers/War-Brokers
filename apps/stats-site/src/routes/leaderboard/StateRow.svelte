<script lang="ts">
    export let colspan: number
    export let rows: number
    export let tone: "empty" | "error"
</script>

<tr>
    <td {colspan} class="p-0! text-center">
        <div
            class:text-gray-400={tone === "empty"}
            class:text-red-400={tone === "error"}
            class:font-bold={tone === "error"}
            class="flex items-center justify-center px-4"
            style:min-height={`${rows * 2.5}rem`}
        >
            <span role="status"><slot /></span>
        </div>
    </td>
</tr>
