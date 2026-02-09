import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: LayoutServerLoad = async (event) => {
  return { user: event.locals.user ?? null };
  // to redirect instead:
	// if (!event.locals.user) {
	// 	return redirect(302, '/login');
	// }
	// return { user: event.locals.user };
};
