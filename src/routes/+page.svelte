<script lang='ts'>
  import type { PageServerData } from './$types';
  
  let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
  <title>Listoflinks</title>
</svelte:head>

<h2>Users</h2>
<ul>
  {#each data.users as user}
    <li>
      <a href="/profile/{user.name}">{user.name}</a>
    </li>
  {/each}
</ul>