import type { PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';

export const load: PageServerLoad = async () => {
  return {
    users: await db.select().from(user).all()
  };
};