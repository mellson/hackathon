import type { Message } from '@ai-sdk/svelte';
import { z } from 'zod';

const SubjectSchema = z.object({
	name: z.string(),
	description: z.string(),
	emoji: z.string()
});

export function parseToolResult(toolInvocations: Message['toolInvocations']) {
	try {
		const invocation = toolInvocations?.find((invocation) => invocation.state === 'result');
		const subjectWithoutId = SubjectSchema.parse(invocation?.result);
		return subjectWithoutId;
	} catch (error) {
		console.error('Failed to parse tool result:', error);
		return null;
	}
}
