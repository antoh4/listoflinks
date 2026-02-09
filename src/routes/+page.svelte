<script lang='ts'>
  import { enhance } from '$app/forms';
  import type { PageServerData } from './$types';
  
  let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
  <title>Listoflinks</title>
</svelte:head>
  
<h1>Listoflinks</h1>
<p>Social media made of lists of links</p>

{#if data.user}
  <h1>Hi, {data.user.name}!</h1>
  <p>Your user ID is {data.user.id}.</p>
  <form method="post" action="?/signOut" use:enhance>
    <button>Sign out</button>
  </form>
{:else}
  <p>You are not connected.</p>
  <a href="/login">Log in / register</a>
{/if}


