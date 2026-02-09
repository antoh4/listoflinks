<script lang="ts">
	import favicon from 	'$lib/assets/favicon.svg';
	import { enhance } from '$app/forms';
	import type { LayoutServerData } from './$types';
  import '../style.css';

	let { data, children }: { data: LayoutServerData, children: any } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="/"><h1>Listoflinks</h1></a>
<p>Social media made of lists of links</p>
{#if data.user}
  <h1>Hi, {data.user.name}!</h1>
  <p>Your user ID is {data.user.id}.</p>
  <form method="post" action="/logout" use:enhance>
    <button>Sign out</button>
  </form>
{:else}
  <p>You are not connected.</p>
  <a href="/login">Log in / register</a>
{/if}
{@render children()}


