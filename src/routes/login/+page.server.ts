import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (password === env.PASSWORD) {
			// Set expiration to 24 hours from now
			const expires = new Date();
			expires.setHours(expires.getHours() + 24);

			cookies.set('session', 'authenticated', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				domain: env.NODE_ENV === 'production' ? 'energinet-hackathon.vercel.app' : undefined
			});
			throw redirect(303, '/');
		}

		return fail(401, { success: false });
	}
} satisfies Actions;
