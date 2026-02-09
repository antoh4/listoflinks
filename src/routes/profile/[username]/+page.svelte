<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    const { profileUser, sessionUser } = data;

    let newListTitle = '';
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">{profileUser.name}"s Profile</h1>

    {#if sessionUser && sessionUser.id === profileUser.id}
        <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow">
            <h2 class="text-2xl font-semibold mb-3">Create New List</h2>
            <form method="POST" action="?/createList" class="flex flex-col space-y-3">
                <input
                    type="text"
                    name="title"
                    placeholder="List Title"
                    bind:value={newListTitle}
                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    on:click={() => (newListTitle = '')}
                >
                    Create List
                </button>
            </form>
        </div>
    {/if}

    <h2 class="text-2xl font-semibold mb-4">Lists</h2>
    {#if profileUser.lists && profileUser.lists.length > 0}
        {#each profileUser.lists as list}
            <div class="bg-white shadow rounded-lg p-4 mb-4">
                <h3 class="text-xl font-bold mb-2">{list.title}</h3>
                {#if list.links && list.links.length > 0}
                    <ul class="list-disc pl-5">
                        {#each list.links as link}
                            <li><a href={link.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">{link.title} ({link.url})</a></li>
                        {/each}
                    </ul>
                {:else}
                    <p>No links in this list.</p>
                {/if}
            </div>
        {/each}
    {:else}
        <p>This user has no lists yet.</p>
    {/if}
</div>