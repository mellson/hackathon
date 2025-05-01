export function getBrowserId() {
	if (typeof window === 'undefined') return null;

	let browserId = localStorage.getItem('browserId');
	if (!browserId) {
		// Use crypto.randomUUID if available, otherwise fallback to a simple UUID generator
		if (crypto && typeof crypto.randomUUID === 'function') {
			browserId = crypto.randomUUID();
		} else {
			// Simple fallback for browsers that don't support crypto.randomUUID
			browserId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				const r = Math.random() * 16 | 0;
				const v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		try {
			localStorage.setItem('browserId', browserId);
		} catch (error) {
			console.error('Failed to store browserId in localStorage:', error);
			// Return the generated ID even if we can't store it
		}
	}
	return browserId;
}
