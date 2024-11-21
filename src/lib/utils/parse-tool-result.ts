import type { Message } from '@ai-sdk/svelte';
import { z } from 'zod';

const SubjectSchema = z.object({
	name: z.string(),
	description: z.string(),
	emoji: z.string()
});

type Subject = z.infer<typeof SubjectSchema>;

export function parseToolResult(toolInvocations: Message['toolInvocations']): Subject | null {
	try {
		const invocation = toolInvocations?.find((invocation) => invocation.state === 'result');
		return SubjectSchema.parse(invocation?.result);
	} catch (error) {
		console.error('Failed to parse tool result:', error);
		return null;
	}
}
