/**
 * Generate presigned URLs for direct browser-to-R2 uploads.
 * Falls back to local upload when credentials are unavailable.
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client(): S3Client | null {
	const accountId = process.env.R2_ACCOUNT_ID;
	const accessKeyId = process.env.R2_ACCESS_KEY_ID;
	const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

	if (!accountId || !accessKeyId || !secretAccessKey) {
		return null;
	}

	return new S3Client({
		region: "auto",
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});
}

export function isPresignAvailable(): boolean {
	return !!getS3Client();
}

export async function getPresignedUploadUrl(
	key: string,
	contentType: string,
	bucketName = "emmal",
	expiresIn = 600, // 10 minutes
): Promise<{ url: string; publicUrl: string } | null> {
	const client = getS3Client();
	if (!client) return null;

	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: key,
		ContentType: contentType,
	});

	const url = await getSignedUrl(client, command, { expiresIn });
	const publicUrl = `/api/media/${key}`;
	return { url, publicUrl };
}
