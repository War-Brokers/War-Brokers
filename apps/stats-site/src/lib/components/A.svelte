<script lang="ts">
    export let href: string
    export let class_: string

    export { class_ as class }
</script>

<a
    {href}
    class="text-orange-500 underline-offset-4 hover:text-orange-600 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 {class_}"
>
    <slot />
</a>
