export async function load({ fetch }) {
	const to = new Date();
	const from = new Date(Date.now() - 24 * 60 * 60 * 1000);

	const response = await fetch(
		`/api/v1/telemetry?from=${from.toISOString()}&to=${to.toISOString()}`
	);

	const history = await response.json();

	const temperatures = history
		.filter((row) => row.air_temp_c !== null)
		.map((row) => Number(row.air_temp_c));

	if (temperatures.length === 0) {
		return {
			history,
			current: null,
			minimum: null,
			maximum: null,
			average: null,
			chartPoints: ''
		};
	}

	const current = temperatures[temperatures.length - 1];
	const minimum = Math.min(...temperatures);
	const maximum = Math.max(...temperatures);

	const sum = temperatures.reduce((total, value) => total + value, 0);
	const average = sum / temperatures.length;

	const chartPoints = temperatures
		.map((temperature, index) => {
			const x =
				temperatures.length === 1
					? 500
					: (index / (temperatures.length - 1)) * 1000;

			const range = maximum - minimum || 1;

			const y =
				220 - ((temperature - minimum) / range) * 160;

			return `${x},${y}`;
		})
		.join(' ');

	return {
		history,
		current,
		minimum,
		maximum,
		average,
		chartPoints
	};
}