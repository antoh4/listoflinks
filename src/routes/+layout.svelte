<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="/"><h1>Listoflinks</h1></a>
<p>Social media made of lists of links</p>

{@render children()}
