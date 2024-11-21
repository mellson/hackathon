import { db } from '$lib/server/db';
import { subjectLikesTable, subjectsTable } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = cookies.get('session');

	if (!session || session !== 'authenticated') {
		throw redirect(303, '/login');
	}

	const rawSubjects = await db
		.select({
			...getTableColumns(subjectsTable),
			likes: sql<number>`count(${subjectLikesTable.deviceId})::int`,
			deviceIds: sql<string[]>`array_agg(${subjectLikesTable.deviceId})`
		})
		.from(subjectsTable)
		.leftJoin(subjectLikesTable, eq(subjectsTable.id, subjectLikesTable.subjectId))
		.groupBy(subjectsTable.id)
		.orderBy(desc(subjectsTable.id));

	// Clean up null deviceIds (when there are no likes)
	const subjectsWithDeviceIds = rawSubjects.map((subject) => ({
		...subject,
		deviceIds: subject.deviceIds[0] === null ? [] : subject.deviceIds
	}));

	const sortedByNumberOfLikes = subjectsWithDeviceIds.sort((a, b) => b.likes - a.likes);

	return {
		subjects: sortedByNumberOfLikes
	};
};
