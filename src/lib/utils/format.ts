import type { Message } from '@ai-sdk/svelte';

export function formatRole(role: Message['role']): string {
	switch (role) {
		case 'user':
			return 'bruger';
		case 'assistant':
			return 'strømbot';
		default:
			return role;
	}
}
