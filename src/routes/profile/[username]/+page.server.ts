import { db } from "$lib/server/db";
import { list, user, link } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ params, locals }) => {
    const { username } = params;

    const foundUser = await db.query.user.findFirst({
        where: eq(user.name, username),
        with: {
            lists: {
                with: {
                    links: true,
                },
            },
        },
    });

    if (!foundUser) {
        error(404, "User not found");
    }

    return {
        profileUser: foundUser,
        sessionUser: locals.user,
    };
};

export const actions = {
    createList: async ({ request, locals }) => {
        if (!locals.user) {
            error(401, "Unauthorized");
        }

        const data = await request.formData();
        const title = data.get("title");

        if (!title || typeof title !== "string") {
            error(400, "Title is required");
        }

        await db.insert(list).values({
            title,
            userId: locals.user.id,
        });

        // Redirect to the same page to show the new list
        redirect(303, request.url);
    },

    createLink: async ({ request, locals }) => {
        if (!locals.user) {
            error(401, "Unauthorized");
        }

        const data = await request.formData();
        const title = data.get("title");
        const url = data.get("url");
        const listId = data.get("listId");
        const year = data.get("year");

        if (!title || typeof title !== "string" || !url || typeof url !== "string" || !listId || typeof listId !== "string") {
            error(400, "Title, URL, and List ID are required");
        }

        // TODO: Add validation to ensure the listId belongs to the user.
        // For now, we'll proceed with the insertion.

        await db.insert(link).values({
            title,
            url,
            listId,
            year: year ? parseInt(year.toString()) : undefined,
        });

        // No need to redirect, SvelteKit will invalidate the data and update the page
        // redirect(303, request.url);
    },

    deleteLink: async ({ request, locals }) => {
        if (!locals.user) {
            error(401, "Unauthorized");
        }

        const data = await request.formData();
        const linkId = data.get("linkId");

        if (!linkId || typeof linkId !== "string") {
            error(400, "Link ID is required");
        }

        // TODO: Add validation to ensure the linkId belongs to the user and is associated with one of their lists.

        await db.delete(link).where(eq(link.id, linkId));

        // No need to redirect, SvelteKit will invalidate the data and update the page
    },

    deleteList: async ({ request, locals }) => {
        if (!locals.user) {
            error(401, "Unauthorized");
        }

        const data = await request.formData();
        const listId = data.get("listId");

        if (!listId || typeof listId !== "string") {
            error(400, "List ID is required");
        }

        // TODO: Add validation to ensure the listId belongs to the user.
        // It should also delete all associated links.

        await db.delete(list).where(eq(list.id, listId));

        // No need to redirect, SvelteKit will invalidate the data and update the page
    },

    deleteAccount: async ({ request, locals, cookies }) => {
        if (!locals.user) {
            error(401, "Unauthorized");
        }

        const data = await request.formData();
        const userId = data.get("userId");

        if (!userId || typeof userId !== "string" || userId !== locals.user.id) {
            error(400, "Invalid user ID");
        }

        await db.delete(user).where(eq(user.id, userId));

        // Sign out the user after deleting their account
        cookies.set("session", "", {
            path: "/",
            expires: new Date(0),
        });

        redirect(303, "/");
    },
};