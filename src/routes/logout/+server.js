import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth.js';

export async function POST({ cookies }) {
	await deleteSession(cookies);

	throw redirect(303, '/login');
}