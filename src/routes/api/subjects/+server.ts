import { db, queryWithRetries } from '$lib/server/db';
import { subjectsTable } from '$lib/server/db/schema';
import { createAnthropic } from '@ai-sdk/anthropic';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { generateText } from 'ai';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = cookies.get('session');
	if (!session || session !== 'authenticated') {
		return new Response('Unauthorized', { status: 401 });
	}

	const subject = await request.json();
	if (!subject.emoji) {
		// Ensure API key is set
		if (!env.ANTHROPIC_API_KEY) {
			throw new Error('ANTHROPIC_API_KEY is not set');
		}

		const anthropic = createAnthropic({
			apiKey: env.ANTHROPIC_API_KEY
		});
		const result = await generateText({
			model: anthropic('claude-3-5-haiku-latest'),
			prompt: `Return an emoji for the subject with the name: <name>${subject.name}</name> and description <description>${subject.description}</description>. Only return one or two emojis, and return them directly without further explanation.`
		});
		subject.emoji = result.text;
	}
	const [created] = await queryWithRetries(() => db.insert(subjectsTable).values(subject).returning());
	return json(created);
};
