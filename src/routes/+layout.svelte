<script lang='ts'>
    import favicon from '$lib/assets/favicon.svg';
    import { initialize } from '$lib/auth/index.svelte';
    import { untrack } from 'svelte';
    import './layout.css';

    const { data, children } = $props();

    $effect(() => {
        const user = data.user;
        const accessToken = data.accessToken;
        untrack(() => initialize({ user, accessToken }));
    });
</script>

<svelte:head>
    <link rel='icon' href={favicon} />
</svelte:head>

{@render children()}
