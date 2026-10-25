import { redirect } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

export async function POST({ cookies, request }) {
	const sessionToken = cookies.get('session');

	if (sessionToken) {
		const tokenHash = createHash('sha256')
			.update(sessionToken)
			.digest('hex');

		await db.execute(
			'DELETE FROM sessions WHERE token_hash = ?',
			[tokenHash]
		);
	}

	cookies.delete('session', {
		path: '/'
	});

	const formData = await request.formData();
	const redirectTo = formData.get('redirectTo');

	if (redirectTo === 'home') {
		throw redirect(303, '/');
	}

	throw redirect(303, '/login');
}