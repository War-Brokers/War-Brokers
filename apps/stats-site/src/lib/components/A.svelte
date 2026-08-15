<script lang="ts">
    import { cn } from "$lib/utils"

    export let href: string
    export let class_: string
    export let target: string | undefined = undefined
    export let rel: string | undefined = undefined
    export let external = false

    export { class_ as class }

    $: classes = cn(
        "text-orange-500 underline-offset-4 hover:text-orange-400 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400",
        class_,
    )
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
    {href}
    target={target ?? (external ? "_blank" : undefined)}
    rel={external ? ["external", "noopener", "noreferrer", rel].filter(Boolean).join(" ") : rel}
    class={classes}
>
    <slot />
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
