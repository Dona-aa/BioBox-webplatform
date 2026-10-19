export async function load({ fetch, url }) {
	const metric = url.searchParams.get('metric') || 'temperature';
	const period = url.searchParams.get('period') || '24h';

	let hours = 24;
	let periodLabel = 'letzte 24 Stunden';

	if (period === '7d') {
		hours = 24 * 7;
		periodLabel = 'letzte 7 Tage';
	}

	if (period === '30d') {
		hours = 24 * 30;
		periodLabel = 'letzte 30 Tage';
	}

	const to = new Date();
	const from = new Date(Date.now() - hours * 60 * 60 * 1000);

	const response = await fetch(
		`/api/v1/telemetry?from=${from.toISOString()}&to=${to.toISOString()}`
	);

	const history = await response.json();

	let field = 'air_temp_c';
	let label = 'Temperatur';
	let unit = '°C';

	if (metric === 'humidity') {
		field = 'air_humidity_pct';
		label = 'Luftfeuchtigkeit';
		unit = '%';
	}

	if (metric === 'soilMoisture') {
		field = 'soil_moisture_pct';
		label = 'Bodenfeuchtigkeit';
		unit = '%';
	}

	if (metric === 'soilTemperature') {
		field = 'soil_temp_c';
		label = 'Bodentemperatur';
		unit = '°C';
	}

	if (metric === 'light') {
		field = 'light_lux';
		label = 'Licht';
		unit = 'lx';
	}

	const values = history
		.filter((row) => row[field] !== null)
		.map((row) => Number(row[field]));

	if (values.length === 0) {
		return {
			metric,
			period,
			periodLabel,
			label,
			unit,
			current: null,
			minimum: null,
			maximum: null,
			average: null,
			chartPoints: ''
		};
	}

	const current = values[values.length - 1];
	const minimum = Math.min(...values);
	const maximum = Math.max(...values);

	const sum = values.reduce((total, value) => total + value, 0);
	const average = sum / values.length;

	const chartPoints = values
		.map((value, index) => {
			const x =
				values.length === 1
					? 500
					: (index / (values.length - 1)) * 1000;

			const range = maximum - minimum || 1;

			const y = 220 - ((value - minimum) / range) * 160;

			return `${x},${y}`;
		})
		.join(' ');

	return {
		metric,
		period,
		periodLabel,
		label,
		unit,
		current,
		minimum,
		maximum,
		average,
		chartPoints
	};
}