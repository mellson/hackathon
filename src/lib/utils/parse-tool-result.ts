import type { UIMessage } from '@ai-sdk/svelte';
import { isToolOrDynamicToolUIPart } from 'ai';
import { z } from 'zod/v3';

const SubjectSchema = z.object({
	name: z.string(),
	description: z.string(),
	emoji: z.string()
});

export function parseToolResult(messageParts: UIMessage['parts']) {
	try {
		const toolPart = messageParts?.find(
			(part) => isToolOrDynamicToolUIPart(part) && part.state === 'output-available'
		);
		if (toolPart && 'output' in toolPart) {
			const subjectWithoutId = SubjectSchema.parse(toolPart.output);
			return subjectWithoutId;
		}
		return null;
	} catch (error) {
		console.error('Failed to parse tool result:', error);
		return null;
	}
}
