import { db } from '$lib/server/db';
import { subjectLikesTable, subjectsTable } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { count, eq, getTableColumns } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = cookies.get('session');

	if (!session || session !== 'authenticated') {
		throw redirect(303, '/login');
	}

	const subjects = await db
		.select({
			...getTableColumns(subjectsTable),
			likes: count(subjectLikesTable.subjectId)
		})
		.from(subjectsTable)
		.leftJoin(subjectLikesTable, eq(subjectsTable.id, subjectLikesTable.subjectId))
		.groupBy(subjectsTable.id);
	return { subjects };
};
