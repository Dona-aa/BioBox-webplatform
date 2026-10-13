import { redirect } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

export async function POST({ cookies }) {
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

	throw redirect(303, '/login');
}