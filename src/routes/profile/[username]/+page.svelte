<script lang="ts">
    import type { PageData } from "./$types";
    import ConfirmationPopup from "$lib/components/ConfirmationPopup.svelte";
    import { enhance } from '$app/forms';

    export let data: PageData;

    const { profileUser, sessionUser } = data;

    let newListTitle = '';
    let showDeleteConfirmation = false;
    let linkToDelete: { id: string; title: string } | null = null;

    function confirmDelete() {
        if (linkToDelete) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `?/deleteLink`;
            
            const linkIdInput = document.createElement('input');
            linkIdInput.type = 'hidden';
            linkIdInput.name = 'linkId';
            linkIdInput.value = linkToDelete.id;
            form.appendChild(linkIdInput);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    }

    function cancelDelete() {
        linkToDelete = null;
    }
</script>

<div>
    <h1>{profileUser.name}'s Profile</h1>

    {#if sessionUser && sessionUser.id === profileUser.id}
        <div>
            <h2>Create New List</h2>
            <form method="POST" action="?/createList">
                <input
                    type="text"
                    name="title"
                    placeholder="List Title"
                    bind:value={newListTitle}
                   
                />
                <button
                    type="submit"
                   
                >
                    Create List
                </button>
            </form>
        </div>
    {/if}

    <h2>Lists</h2>
    {#if profileUser.lists && profileUser.lists.length > 0}
        {#each profileUser.lists as list}
            <div>
                <h3>{list.title}</h3>
                {#if list.links && list.links.length > 0}
                    <ul>
                        {#each list.links as link}
                            <li>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a> ({link.year ? link.year : ""})
                                {#if sessionUser && sessionUser.id === profileUser.id}
                                    <button on:click={() => { showDeleteConfirmation = true; linkToDelete = { id: link.id, title: link.title }; }}>Delete</button>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p>No links in this list.</p>
                {/if}

                {#if sessionUser && sessionUser.id === profileUser.id}
                    <form method="POST" action="?/createLink">
                        <input type="hidden" name="listId" value={list.id} />
                        <div>
                            <input
                                type="text"
                                name="title"
                                placeholder="Link Title"
                               
                                required
                            />
                            <input
                                type="url"
                                name="url"
                                placeholder="Link URL (e.g., https://example.com)"
                               
                                required
                            />
                            <input
                                type="number"
                                name="year"
                                placeholder="Year (optional)"
                               
                                min="1900"
                                max="2100"
                            />
                            <button
                                type="submit"
                               
                            >
                                Add Link
                            </button>
                        </div>
                    </form>
                {/if}
            </div>
        {/each}
    {:else}
        <p>This user has no lists yet.</p>
    {/if}
</div>

<ConfirmationPopup
    show={showDeleteConfirmation}
    message={`Are you sure you want to delete the link "${linkToDelete?.title}"?`}
    on:confirm={confirmDelete}
    on:cancel={cancelDelete}
/>