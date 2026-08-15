<script lang="ts" module>
    import type { HTMLButtonAttributes } from "svelte/elements"
    import { tv, type VariantProps } from "tailwind-variants"

    import { cn } from "$lib/utils"

    export const buttonVariants = tv({
        base: "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variants: {
            variant: {
                default: "bg-orange-500 text-gray-950 hover:bg-orange-400 active:bg-orange-600",
                destructive: "bg-red-500 text-gray-950 hover:bg-red-400 active:bg-red-600",
                outline:
                    "border border-gray-600 bg-transparent text-gray-100 hover:bg-gray-700 active:bg-gray-800",
                secondary: "bg-gray-600 text-gray-100 hover:bg-gray-700 active:bg-gray-800",
                ghost: "text-gray-100 hover:bg-gray-700 active:bg-gray-800",
                link: "text-orange-500 underline-offset-4 hover:text-orange-400 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    })

    export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
    export type ButtonSize = VariantProps<typeof buttonVariants>["size"]

    export type ButtonProps = HTMLButtonAttributes & {
        variant?: ButtonVariant
        size?: ButtonSize
    }
</script>

<script lang="ts">
    const {
        class: className,
        variant = "default",
        size = "default",
        type = "button",
        disabled,
        children,
        ...restProps
    }: ButtonProps = $props()
</script>

<button
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    {...restProps}
>
    {@render children?.()}
</button>
