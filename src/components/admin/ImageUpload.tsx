"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface Props {
	value: string;
	onChange: (url: string) => void;
	label?: React.ReactNode;
	hint?: string;
	compact?: boolean;
	error?: string;
}

function resizeImage(file: File, maxWidth = 1920, quality = 0.85): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(url);
			let { width, height } = img;
			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width);
				width = maxWidth;
			}
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) return reject(new Error("Canvas context unavailable"));
			ctx.drawImage(img, 0, 0, width, height);
			canvas.toBlob(
				(blob) => {
					if (blob) resolve(blob);
					else reject(new Error("Canvas toBlob failed"));
				},
				"image/jpeg",
				quality,
			);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Image load failed"));
		};
		img.src = url;
	});
}

export function ImageUpload({ value, onChange, label = "Image", hint, compact, error }: Props) {
	const [uploading, setUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleFile(file: File) {
		setUploading(true);
		try {
			const resized = await resizeImage(file);
			const formData = new FormData();
			formData.append("file", resized, file.name.replace(/\.[^.]+$/, ".jpg"));
			const res = await fetch("/api/media/upload", {
				method: "POST",
				body: formData,
			});
			const data = (await res.json()) as { key: string; url: string } | { error: string };
			if ("url" in data) {
				onChange(data.url);
			}
		} finally {
			setUploading(false);
		}
	}

	const heightClass = compact ? "h-32" : "h-48";

	return (
		<div>
			{label && (
				<div className="mb-1">
					<div className="block text-sm font-medium text-gray-700">{label}</div>
					{hint && <p className="text-xs text-gray-400">{hint}</p>}
					{error && <p className="text-xs text-red-500">{error}</p>}
				</div>
			)}
			{value ? (
				<div className="relative overflow-hidden rounded-lg border border-gray-200">
					<img src={value} alt="" className={`${heightClass} w-full object-cover`} />
					<div className="absolute right-2 top-2 flex gap-2">
						<button
							onClick={() => inputRef.current?.click()}
							className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm hover:bg-white"
							title="Replace"
						>
							<Upload className="h-4 w-4" />
						</button>
						<button
							onClick={() => onChange("")}
							className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 shadow-sm hover:bg-white"
							title="Remove"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => inputRef.current?.click()}
					disabled={uploading}
					className={`flex ${heightClass} w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition disabled:opacity-50 ${
				error
					? "border-red-300 text-red-400 hover:border-red-400 hover:text-red-500"
					: "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
				}`}
				>
					{uploading ? (
						<span className="text-sm">Optimizing & uploading...</span>
					) : (
						<>
							<ImageIcon className="h-8 w-8" />
							<span className="text-sm font-medium">Click to upload image</span>
						</>
					)}
				</button>
			)}
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
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
