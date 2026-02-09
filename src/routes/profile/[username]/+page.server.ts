import { db } from "$lib/server/db";
import { list, user, link } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
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
};