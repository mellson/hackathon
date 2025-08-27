import type { UIMessage } from '@ai-sdk/svelte';

export function formatRole(role: UIMessage['role']): string {
	switch (role) {
		case 'user':
			return 'bruger';
		case 'assistant':
			return 'strømbot';
		default:
			return role;
	}
}
