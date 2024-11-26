import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (password === env.PASSWORD) {
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
};
