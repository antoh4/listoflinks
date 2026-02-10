<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { enhance } from "$app/forms";
  import type { LayoutServerData } from "./$types";
  import "../style.css";

  let { data, children }: { data: LayoutServerData; children: any } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header>
  <div class="title-tagline">
    <a href="/"><h1>Listoflinks</h1></a>
    <p>Social media made of lists of links</p>
  </div>
  <div class="user-actions">
    {#if data.user}
      <p>Hi, <a href="/profile/{data.user.name}">{data.user.name}</a>!</p>
      <form method="post" action="/logout" use:enhance>
        <button>Sign out</button>
      </form>
    {:else}
      <a href="/login">Log in / register</a>
    {/if}
  </div>
</header>

{@render children()}

<style>
  h1 {
    font-size: medium;
  }
  header {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 2rem;
  }

  .title-tagline {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .title-tagline h1 {
    font-size: medium;
    font-weight: bold;
  }

  .title-tagline p {
    font-size: medium;
    margin: 0;
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-actions p {
      margin: 0;
  }
</style>
