export function isSafeHref(value: string): boolean {
	const href = value.trim();
	if (!href) return false;
	if (href.startsWith("/") || href.startsWith("#")) return true;

	try {
		const url = new URL(href);
		return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
	} catch {
		return false;
	}
}

export function isExternalHref(value: string): boolean {
	return /^https?:\/\//i.test(value.trim());
}
