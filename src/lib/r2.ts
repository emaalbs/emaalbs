/**
 * R2 helper for uploading and reading media from the MEDIA bucket.
 */

export async function uploadToR2(
	bucket: R2Bucket,
	key: string,
	file: File | Buffer | ArrayBuffer | Uint8Array,
	contentType?: string,
): Promise<{ key: string; url: string }> {
	let body: ArrayBuffer | Uint8Array;
	if (file instanceof File) {
		body = await file.arrayBuffer();
		if (!contentType) contentType = file.type || "application/octet-stream";
	} else if (Buffer.isBuffer(file)) {
		body = new Uint8Array(file);
	} else {
		body = file;
	}

	await bucket.put(key, body, {
		httpMetadata: { contentType: contentType || "application/octet-stream" },
	});

	// Public URL pattern: customize if you add a custom domain
	const url = `/api/media/${key}`;
	return { key, url };
}

export async function getR2Object(
	bucket: R2Bucket,
	key: string,
): Promise<ReadableStream | null> {
	const obj = await bucket.get(key);
	if (!obj) return null;
	return obj.body;
}
