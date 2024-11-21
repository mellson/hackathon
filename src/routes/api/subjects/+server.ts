import { db } from '$lib/server/db';
import { subjectsTable } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = cookies.get('session');
	if (!session || session !== 'authenticated') {
		return new Response('Unauthorized', { status: 401 });
	}

	const subject = await request.json();
	const [created] = await db.insert(subjectsTable).values(subject).returning();
	return json(created);
};
