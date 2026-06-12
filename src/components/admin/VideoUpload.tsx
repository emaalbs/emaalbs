"use client";

import { useState, useRef } from "react";
import { Upload, X, Film, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
	value: string;
	onChange: (url: string) => void;
	label?: React.ReactNode;
	hint?: string;
	prefix?: string;
}

const MAX_SIZE_MB = 2048; // 2GB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];

export function VideoUpload({ value, onChange, label = "Video", hint, prefix = "ibs/videos/" }: Props) {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	function validate(file: File): string | null {
		if (!ALLOWED_TYPES.includes(file.type)) {
			return `Unsupported format: ${file.type}. Use MP4, WebM, or MOV.`;
		}
		const sizeMB = file.size / (1024 * 1024);
		if (sizeMB > MAX_SIZE_MB) {
			return `File too large (${sizeMB.toFixed(1)} MB). Max: ${MAX_SIZE_MB} MB.`;
		}
		return null;
	}

	async function handleFile(file: File) {
		setError(null);
		setProgress(0);

		const validationError = validate(file);
		if (validationError) {
			setError(validationError);
			return;
		}

		setUploading(true);

		try {
			// 1. Try presigned URL for direct R2 upload (production)
			const presignRes = await fetch("/api/media/presign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileName: file.name,
					contentType: file.type,
					prefix,
				}),
			});

			if (presignRes.ok) {
				const { presignedUrl, publicUrl } = (await presignRes.json()) as {
					presignedUrl: string;
					publicUrl: string;
				};

				// Upload directly to R2 with XMLHttpRequest for progress
				await new Promise<void>((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					xhr.open("PUT", presignedUrl, true);
					xhr.setRequestHeader("Content-Type", file.type);

					xhr.upload.onprogress = (e) => {
						if (e.lengthComputable) {
							setProgress(Math.round((e.loaded / e.total) * 100));
						}
					};

					xhr.onload = () => {
						if (xhr.status >= 200 && xhr.status < 300) {
							resolve();
						} else {
							reject(new Error(`Upload failed: ${xhr.statusText}`));
						}
					};

					xhr.onerror = () => reject(new Error("Network error during upload"));
					xhr.send(file);
				});

				onChange(publicUrl);
				return;
			}

			// 2. Fallback: upload via Workers API (local dev / small files)
			const formData = new FormData();
			formData.append("file", file);
			formData.append("prefix", prefix);

			const res = await fetch("/api/media/upload", {
				method: "POST",
				body: formData,
			});

			const data = (await res.json()) as { url: string } | { error: string };
			if ("url" in data) {
				onChange(data.url);
			} else {
				setError("error" in data ? (data as { error: string }).error : "Upload failed");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
			setProgress(0);
		}
	}

	return (
		<div>
			{label && (
				<div className="mb-1">
					<div className="block text-sm font-medium text-gray-700">{label}</div>
					{hint && <p className="text-xs text-gray-400">{hint}</p>}
					{error && (
						<p className="mt-1 flex items-center gap-1 text-xs text-red-500">
							<AlertCircle className="h-3 w-3" />
							{error}
						</p>
					)}
				</div>
			)}

			{value ? (
				<div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
					<div className="flex items-center gap-3 p-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-navy)] text-white">
							<Film className="h-5 w-5" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900 truncate">Video uploaded</p>
							<p className="text-xs text-gray-400 truncate">{value}</p>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => inputRef.current?.click()}
								className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50"
								title="Replace"
							>
								<Upload className="h-4 w-4" />
							</button>
							<button
								onClick={() => onChange("")}
								className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-red-500 shadow-sm hover:bg-red-50"
								title="Remove"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			) : (
				<button
					onClick={() => inputRef.current?.click()}
					disabled={uploading}
					className={`flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition disabled:opacity-50 ${
						error
							? "border-red-300 text-red-400 hover:border-red-400 hover:text-red-500"
							: "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
					}`}
				>
					{uploading ? (
						<div className="w-full max-w-xs px-4">
							<div className="flex items-center justify-between mb-1.5">
								<span className="text-sm font-medium text-gray-600">Uploading...</span>
								<span className="text-sm font-medium text-[var(--color-navy)]">{progress}%</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
								<div
									className="h-full rounded-full bg-[var(--color-navy)] transition-all duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					) : (
						<>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
								<Film className="h-6 w-6" />
							</div>
							<div className="text-center">
								<span className="block text-sm font-medium">Click to upload video</span>
								<span className="block text-xs text-gray-400 mt-1">MP4, WebM, MOV — up to 2GB</span>
							</div>
						</>
					)}
				</button>
			)}

			<input
				ref={inputRef}
				type="file"
				accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
					e.target.value = "";
				}}
				className="hidden"
			/>
		</div>
	);
}
