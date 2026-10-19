export async function load({ fetch }) {
	const response = await fetch('/api/v1/telemetry');
	const telemetry = await response.json();

	if (telemetry.message === 'Keine Sensordaten vorhanden') {
		return {
			sensorData: {
				temperature: null,
				humidity: null,
				soilMoisture: null,
				soilTemperature: null,
				light: null,
				measuredAt: null
			}
		};
	}

	return {
		sensorData: {
			temperature: telemetry.air_temp_c,
			humidity: telemetry.air_humidity_pct,
			soilMoisture: telemetry.soil_moisture_pct,
			soilTemperature: telemetry.soil_temp_c,
			light: telemetry.light_lux,
			measuredAt: telemetry.measured_at
		}
	};
}