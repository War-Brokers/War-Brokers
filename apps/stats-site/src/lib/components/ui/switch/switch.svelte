<script lang="ts">
    import { Switch as SwitchPrimitive } from "bits-ui"

    import { cn } from "$lib/utils"

    const { class: className, ...restProps }: SwitchPrimitive.RootProps = $props()
</script>

<SwitchPrimitive.Root
    data-slot="switch"
    class={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-gray-500 bg-gray-600 p-0.5 outline-hidden transition-[background-color,border-color] duration-150 hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-orange-400 data-[state=checked]:bg-orange-500 data-[state=checked]:hover:bg-orange-400",
        className,
    )}
    {...restProps}
>
    <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        class="pointer-events-none block size-4 rounded-full bg-gray-100 shadow-sm transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 motion-reduce:transition-none"
    />
</SwitchPrimitive.Root>
