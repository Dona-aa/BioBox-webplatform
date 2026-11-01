import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function POST({ request }) {
	const data = await request.json();

	const {
		image_id,
		leaf_area_cm2,
		canopy_cover_pct,
		greenness_index,
		yellow_fraction_pct,
		mean_hue,
		mean_saturation,
		brown_fraction_pct
	} = data;

	if (!image_id) {
		return json(
			{ error: 'image_id fehlt.' },
			{ status: 400 }
		);
	}

	const [images] = await db.execute(
		`SELECT id
		 FROM images
		 WHERE id = ?
		 LIMIT 1`,
		[image_id]
	);

	if (images.length === 0) {
		return json(
			{ error: 'Bild wurde nicht gefunden.' },
			{ status: 404 }
		);
	}

	const [existingAnalysis] = await db.execute(
		`SELECT id
		 FROM vision_analysis
		 WHERE image_id = ?
		 LIMIT 1`,
		[image_id]
	);

	if (existingAnalysis.length > 0) {
		await db.execute(
			`UPDATE vision_analysis
			 SET
				leaf_area_cm2 = ?,
				canopy_cover_pct = ?,
				greenness_index = ?,
				yellow_fraction_pct = ?,
				mean_hue = ?,
				mean_saturation = ?,
				brown_fraction_pct = ?
			 WHERE image_id = ?`,
			[
				leaf_area_cm2 ?? null,
				canopy_cover_pct ?? null,
				greenness_index ?? null,
				yellow_fraction_pct ?? null,
				mean_hue ?? null,
				mean_saturation ?? null,
				brown_fraction_pct ?? null,
				image_id
			]
		);

		return json({
			message: 'Pflanzenanalyse wurde aktualisiert.',
			image_id
		});
	}

	await db.execute(
		`INSERT INTO vision_analysis (
			image_id,
			leaf_area_cm2,
			canopy_cover_pct,
			greenness_index,
			yellow_fraction_pct,
			mean_hue,
			mean_saturation,
			brown_fraction_pct
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			image_id,
			leaf_area_cm2 ?? null,
			canopy_cover_pct ?? null,
			greenness_index ?? null,
			yellow_fraction_pct ?? null,
			mean_hue ?? null,
			mean_saturation ?? null,
			brown_fraction_pct ?? null
		]
	);

	return json(
		{
			message: 'Pflanzenanalyse wurde gespeichert.',
			image_id
		},
		{ status: 201 }
	);
}