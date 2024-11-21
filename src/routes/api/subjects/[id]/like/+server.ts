import { db } from '$lib/server/db';
import { subjectLikesTable } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	const session = cookies.get('session');
	if (!session || session !== 'authenticated') {
		return new Response('Unauthorized', { status: 401 });
	}

	const { browserId } = await request.json();
	if (!browserId) {
		return new Response('Browser ID is required', { status: 400 });
	}

	const subjectId = parseInt(params.id);
	if (isNaN(subjectId)) {
		return new Response('Invalid subject ID', { status: 400 });
	}

	// Check if like already exists
	const existingLike = await db
		.select()
		.from(subjectLikesTable)
		.where(
			and(eq(subjectLikesTable.subjectId, subjectId), eq(subjectLikesTable.deviceId, browserId))
		)
		.limit(1);

	if (existingLike.length > 0) {
		// Unlike: Remove the like if it exists
		await db
			.delete(subjectLikesTable)
			.where(
				and(eq(subjectLikesTable.subjectId, subjectId), eq(subjectLikesTable.deviceId, browserId))
			);
		return json({ liked: false });
	} else {
		// Like: Add new like
		await db.insert(subjectLikesTable).values({
			subjectId,
			deviceId: browserId
		});
		return json({ liked: true });
	}
};

// Get whether user has liked the subject
export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const session = cookies.get('session');
	if (!session || session !== 'authenticated') {
		return new Response('Unauthorized', { status: 401 });
	}

	const browserId = url.searchParams.get('browserId');
	if (!browserId) {
		return new Response('Browser ID is required', { status: 400 });
	}

	const subjectId = parseInt(params.id);
	if (isNaN(subjectId)) {
		return new Response('Invalid subject ID', { status: 400 });
	}

	const existingLike = await db
		.select()
		.from(subjectLikesTable)
		.where(
			and(eq(subjectLikesTable.subjectId, subjectId), eq(subjectLikesTable.deviceId, browserId))
		)
		.limit(1);

	return json({ liked: existingLike.length > 0 });
};
