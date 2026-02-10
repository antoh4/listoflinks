<script lang="ts">
    import type { PageData } from "./$types";
    import ConfirmationPopup from "$lib/components/ConfirmationPopup.svelte";
    import { enhance } from '$app/forms';
    import { profileBackgroundColor, profileTextColor } from '$lib/stores/profileColors';
    import { onMount, onDestroy } from 'svelte';

    export let data: PageData;

    const { profileUser, sessionUser } = data;

    let newListTitle = '';
    let profileBackgroundColorInput = profileUser.backgroundColor || '';
    let profileTextColorInput = profileUser.textColor || '';
    let showDeleteConfirmation = false;
    let linkToDelete: { id: string; title: string } | null = null;
    let listToDelete: { id: string; title: string } | null = null;
    let showDeleteAccountConfirmation = false;
    let accountToDelete: { id: string; name: string } | null = null;

    onMount(() => {
        profileBackgroundColor.set(profileUser.backgroundColor || null);
        profileTextColor.set(profileUser.textColor || null);
    });

    onDestroy(() => {
        profileBackgroundColor.set(null);
        profileTextColor.set(null);
    });

    function confirmDeleteLink() {
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

    function cancelDeleteLink() {
        linkToDelete = null;
    }

    function confirmDeleteList() {
        if (listToDelete) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `?/deleteList`;
            
            const listIdInput = document.createElement('input');
            listIdInput.type = 'hidden';
            listIdInput.name = 'listId';
            listIdInput.value = listToDelete.id;
            form.appendChild(listIdInput);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    }

    function cancelDeleteList() {
        listToDelete = null;
    }

    function confirmDeleteAccount() {
        if (accountToDelete) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `?/deleteAccount`;
            
            const userIdInput = document.createElement('input');
            userIdInput.type = 'hidden';
            userIdInput.name = 'userId';
            userIdInput.value = accountToDelete.id;
            form.appendChild(userIdInput);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    }

    function cancelDeleteAccount() {
        accountToDelete = null;
    }
</script>


<svelte:head>
  <title>{profileUser.name}'s lists | Listoflinks</title>
</svelte:head>

<div>
    <h1>{profileUser.name}'s lists</h1>

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
        <div>
            <h2>Profile Customization</h2>
            <form method="POST" action="?/updateProfileColors" use:enhance>
                <label for="backgroundColor">Background Color (Hex):</label>
                <input
                    type="text"
                    id="backgroundColor"
                    name="backgroundColor"
                    placeholder="e.g., FFFFFF"
                    bind:value={profileBackgroundColorInput}
                />
                <label for="textColor">Text Color (Hex):</label>
                <input
                    type="text"
                    id="textColor"
                    name="textColor"
                    placeholder="e.g., 000000"
                    bind:value={profileTextColorInput}
                />
                <button type="submit">Update Colors</button>
            </form>
        </div>
        <div>
            <h2>Account Actions</h2>
            <button on:click={() => { showDeleteAccountConfirmation = true; accountToDelete = { id: sessionUser.id, name: sessionUser.name }; }}>Delete Account</button>
        </div>
        
        <h2>Lists</h2>
    {/if}

    {#if profileUser.lists && profileUser.lists.length > 0}
        {#each profileUser.lists as list}
            <div>
                <h3>{list.title}</h3>
                {#if sessionUser && sessionUser.id === profileUser.id}
                    <button on:click={() => { showDeleteConfirmation = true; listToDelete = { id: list.id, title: list.title }; }}>Delete List</button>
                {/if}
                {#if list.links && list.links.length > 0}
                    <ul>
                        {#each list.links as link}
                            <li>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a> ({link.year ? link.year : ""})
                                {#if sessionUser && sessionUser.id === profileUser.id}
                                    <button on:click={() => { showDeleteConfirmation = true; linkToDelete = { id: link.id, title: link.title }; }}>Delete Link</button>
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
    show={showDeleteConfirmation && !!linkToDelete}
    message={`Are you sure you want to delete the link "${linkToDelete?.title}"?`}
    on:confirm={confirmDeleteLink}
    on:cancel={cancelDeleteLink}
/>

<ConfirmationPopup
    show={showDeleteConfirmation && !!listToDelete}
    message={`Are you sure you want to delete the list "${listToDelete?.title}"?`}
    on:confirm={confirmDeleteList}
    on:cancel={cancelDeleteList}
/>

<ConfirmationPopup
    show={showDeleteAccountConfirmation && !!accountToDelete}
    message={`Are you sure you want to delete your account \"${accountToDelete?.name}\" and all associated data? This action cannot be undone.`}
    on:confirm={confirmDeleteAccount}
    on:cancel={cancelDeleteAccount}
/>