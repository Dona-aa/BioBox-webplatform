import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function POST({ request }) {
	const data = await request.json();

	const {
		image_id,
		reference_id,
		scoring_version,
		health_score,
		health_score_raw,
		health_category,
		health_trend_24h,
		health_warnings,
		score_green,
		score_yellow,
		score_brown,
		score_saturation,
		score_hue
	} = data;

	if (!image_id) {
		return json(
			{ error: 'image_id fehlt.' },
			{ status: 400 }
		);
	}

	if (!reference_id) {
		return json(
			{ error: 'reference_id fehlt.' },
			{ status: 400 }
		);
	}

	if (!scoring_version) {
		return json(
			{ error: 'scoring_version fehlt.' },
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

	const [references] = await db.execute(
		`SELECT id
		 FROM health_references
		 WHERE id = ?
		 LIMIT 1`,
		[reference_id]
	);

	if (references.length === 0) {
		return json(
			{ error: 'Gesundheitsreferenz wurde nicht gefunden.' },
			{ status: 404 }
		);
	}

	const [existingAssessment] = await db.execute(
		`SELECT id
		 FROM health_assessments
		 WHERE image_id = ?
		 LIMIT 1`,
		[image_id]
	);

	if (existingAssessment.length > 0) {
		await db.execute(
			`UPDATE health_assessments
			 SET
				reference_id = ?,
				scoring_version = ?,
				health_score = ?,
				health_score_raw = ?,
				health_category = ?,
				health_trend_24h = ?,
				health_warnings = ?,
				score_green = ?,
				score_yellow = ?,
				score_brown = ?,
				score_saturation = ?,
				score_hue = ?,
				computed_at = CURRENT_TIMESTAMP
			 WHERE image_id = ?`,
			[
				reference_id,
				scoring_version,
				health_score ?? null,
				health_score_raw ?? null,
				health_category ?? null,
				health_trend_24h ?? null,
				health_warnings ?? null,
				score_green ?? null,
				score_yellow ?? null,
				score_brown ?? null,
				score_saturation ?? null,
				score_hue ?? null,
				image_id
			]
		);

		return json({
			message: 'Gesundheitsbewertung wurde aktualisiert.',
			image_id
		});
	}

	const [result] = await db.execute(
		`INSERT INTO health_assessments (
			image_id,
			reference_id,
			scoring_version,
			health_score,
			health_score_raw,
			health_category,
			health_trend_24h,
			health_warnings,
			score_green,
			score_yellow,
			score_brown,
			score_saturation,
			score_hue
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			image_id,
			reference_id,
			scoring_version,
			health_score ?? null,
			health_score_raw ?? null,
			health_category ?? null,
			health_trend_24h ?? null,
			health_warnings ?? null,
			score_green ?? null,
			score_yellow ?? null,
			score_brown ?? null,
			score_saturation ?? null,
			score_hue ?? null
		]
	);

	return json(
		{
			message: 'Gesundheitsbewertung wurde gespeichert.',
			assessment_id: result.insertId,
			image_id
		},
		{ status: 201 }
	);
}