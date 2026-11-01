import { json } from '@sveltejs/kit';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { db } from '$lib/server/db.js';

export async function POST({ request }) {
	const formData = await request.formData();

	const image = formData.get('image');
	const deviceCode = formData.get('device_id');
	const capturedAtInput = formData.get('captured_at');

	if (!image || typeof image.arrayBuffer !== 'function') {
		return json(
			{ error: 'Bild fehlt.' },
			{ status: 400 }
		);
	}

	if (!deviceCode) {
		return json(
			{ error: 'device_id fehlt.' },
			{ status: 400 }
		);
	}

	const allowedTypes = ['image/jpeg', 'image/png'];

	if (!allowedTypes.includes(image.type)) {
		return json(
			{ error: 'Nur JPEG- und PNG-Bilder sind erlaubt.' },
			{ status: 400 }
		);
	}

	if (image.size > 10 * 1024 * 1024) {
		return json(
			{ error: 'Das Bild ist zu groß.' },
			{ status: 400 }
		);
	}

	const [devices] = await db.execute(
		`SELECT id
		 FROM devices
		 WHERE device_code = ?
		 LIMIT 1`,
		[deviceCode]
	);

	if (devices.length === 0) {
		return json(
			{ error: 'Gerät wurde nicht gefunden.' },
			{ status: 400 }
		);
	}

	const capturedDate = capturedAtInput
		? new Date(capturedAtInput)
		: new Date();

	if (Number.isNaN(capturedDate.getTime())) {
		return json(
			{ error: 'captured_at ist ungültig.' },
			{ status: 400 }
		);
	}

	const extension = image.type === 'image/png' ? 'png' : 'jpg';

	const fileName = `${Date.now()}-${randomUUID()}.${extension}`;

	const uploadFolder = join(
		process.cwd(),
		'static',
		'uploads',
		'plants'
	);

	await mkdir(uploadFolder, {
		recursive: true
	});

	const filePath = join(uploadFolder, fileName);

	const imageBuffer = Buffer.from(
		await image.arrayBuffer()
	);

	await writeFile(filePath, imageBuffer);

	const browserPath = `/uploads/plants/${fileName}`;

	const capturedAt = capturedDate
		.toISOString()
		.slice(0, 23)
		.replace('T', ' ');

	const [result] = await db.execute(
		`INSERT INTO images (
			device_id,
			captured_at,
			file_name,
			file_path,
			mime_type,
			file_size_bytes
		)
		VALUES (?, ?, ?, ?, ?, ?)`,
		[
			devices[0].id,
			capturedAt,
			fileName,
			browserPath,
			image.type,
			image.size
		]
	);

	return json(
		{
			message: 'Bild wurde gespeichert.',
			image_id: result.insertId,
			image_url: browserPath
		},
		{ status: 201 }
	);
}