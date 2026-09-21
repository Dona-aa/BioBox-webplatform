import { json } from '@sveltejs/kit';

export function GET() {
	return json({
		message: 'BioBox Backend funktioniert'
	});
}