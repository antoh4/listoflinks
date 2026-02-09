import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
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
    };
};