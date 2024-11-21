export function getBrowserId() {
	if (typeof window === 'undefined') return null;
	let browserId = localStorage.getItem('browserId');
	if (!browserId) {
		browserId = crypto.randomUUID();
		localStorage.setItem('browserId', browserId);
	}
	return browserId;
}
