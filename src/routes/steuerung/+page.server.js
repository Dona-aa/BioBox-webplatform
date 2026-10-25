export async function load({ fetch }) {
	const response = await fetch('/api/v1/status');
	const status = await response.json();

	return {
		status
	};
}