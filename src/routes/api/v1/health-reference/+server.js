import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function POST({ request }) {
	const data = await request.json();

	const {
		device_id,
		first_image_id,
		last_image_id,
		image_count,
		ref_greenness_index,
		ref_saturation,
		ref_hue,
		ref_yellow_pct,
		ref_brown_pct
	} = data;

	if (!device_id) {
		return json(
			{ error: 'device_id fehlt.' },
			{ status: 400 }
		);
	}

	if (!first_image_id || !last_image_id) {
		return json(
			{ error: 'Bild-IDs fehlen.' },
			{ status: 400 }
		);
	}

	if (!image_count) {
		return json(
			{ error: 'image_count fehlt.' },
			{ status: 400 }
		);
	}

	const [devices] = await db.execute(
		`SELECT id
		 FROM devices
		 WHERE device_code = ?
		 LIMIT 1`,
		[device_id]
	);

	if (devices.length === 0) {
		return json(
			{ error: 'Gerät wurde nicht gefunden.' },
			{ status: 404 }
		);
	}

	const [result] = await db.execute(
		`INSERT INTO health_references (
			device_id,
			first_image_id,
			last_image_id,
			image_count,
			ref_greenness_index,
			ref_saturation,
			ref_hue,
			ref_yellow_pct,
			ref_brown_pct
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			devices[0].id,
			first_image_id,
			last_image_id,
			image_count,
			ref_greenness_index,
			ref_saturation,
			ref_hue,
			ref_yellow_pct,
			ref_brown_pct
		]
	);

	return json(
		{
			message: 'Gesundheitsreferenz wurde gespeichert.',
			reference_id: result.insertId
		},
		{ status: 201 }
	);
}