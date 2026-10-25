import { db } from '$lib/server/db.js';

export async function load() {
	const [rows] = await db.execute(`
		SELECT
			images.id AS image_id,
			images.captured_at,
			images.file_name,
			images.file_path,

			vision_analysis.leaf_area_cm2,
			vision_analysis.canopy_cover_pct,
			vision_analysis.greenness_index,
			vision_analysis.yellow_fraction_pct,

			health_assessments.health_score,
			health_assessments.health_category,
			health_assessments.health_trend_24h,
			health_assessments.health_warnings,
			health_assessments.computed_at

		FROM images

		LEFT JOIN vision_analysis
			ON vision_analysis.image_id = images.id

		LEFT JOIN health_assessments
			ON health_assessments.image_id = images.id

		ORDER BY images.captured_at DESC
		LIMIT 1
	`);

	return {
		analysis: rows.length > 0 ? rows[0] : null
	};
}