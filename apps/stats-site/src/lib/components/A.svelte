<script lang="ts">
    import type { HTMLAnchorAttributes } from "svelte/elements"

    import { cn } from "$lib/utils"

    type Props = Omit<HTMLAnchorAttributes, "href"> & {
        external?: boolean
        href: string
    }

    const {
        class: className,
        children,
        external = false,
        rel,
        target,
        ...restProps
    }: Props = $props()

    const classes = $derived(
        cn(
            "text-orange-500 underline-offset-4 hover:text-orange-400 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400",
            className,
        ),
    )
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
    {...restProps}
    target={target ?? (external ? "_blank" : undefined)}
    rel={external ? ["external", "noopener", "noreferrer", rel].filter(Boolean).join(" ") : rel}
    class={classes}
>
    {@render children?.()}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
