import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';

export const load: PageServerLoad = async (event) => {
  // Return user if authenticated, null otherwise
  return {
    user: event.locals.user ?? null,
    users: await db.select().from(user).all()
  };

	// to redirect instead:
	// if (!event.locals.user) {
	// 	return redirect(302, '/login');
	// }
	// return { user: event.locals.user };
};

export const actions: Actions = {
  signOut: async (event) => {
    await auth.api.signOut({
      headers: event.request.headers
    });
    return redirect(302, '/login');
  }
};