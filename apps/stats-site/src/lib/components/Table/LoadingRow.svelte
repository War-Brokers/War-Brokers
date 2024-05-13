<tr class="appear">
    <td colspan="999" class="w-full text-center">Loading...</td>
</tr>

<style lang="postcss">
    @keyframes appear {
        /* 0s */
        0% {
            opacity: 0;
        }

        /* 1s */
        50% {
            opacity: 0;
        }

        /* 2s */
        100% {
            opacity: 1;
        }
    }

    .appear {
        animation-name: appear;
        animation-duration: 2s;
        animation-timing-function: linear;
    }
</style>
