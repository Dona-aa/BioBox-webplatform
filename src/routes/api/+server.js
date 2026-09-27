import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET() {
	try {
		await db.execute('SELECT 1');

		return json({
			backend: 'ok',
			database: 'connected'
		});
	} catch (error) {
		console.error('Database connection failed:', error);

		return json(
			{
				backend: 'ok',
				database: 'not connected'
			},
			{ status: 500 }
		);
	}
}