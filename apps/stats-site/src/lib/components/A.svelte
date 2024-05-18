<script lang="ts">
    export let href: string
    export let class_: string

    export { class_ as class }
</script>

<a
    {href}
    class="text-orange-500 underline-offset-4 hover:text-orange-600 hover:underline {class_}"
>
    <slot />
</a>
