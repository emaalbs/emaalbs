"use client";

import { useState, useRef } from "react";
import { Ruler, Upload, X, ImageIcon } from "lucide-react";
import { getImagePresetRecommendation, optimizeImage, type ImagePreset } from "@/lib/image-optimizer";

interface Props {
	value: string;
	onChange: (url: string) => void;
	label?: React.ReactNode;
	hint?: string;
	compact?: boolean;
	fit?: "cover" | "contain";
	error?: string;
	preset?: ImagePreset;
	prefix?: string;
	recommendedSize?: string;
}

export function ImageUpload({ value, onChange, label = "Image", hint, compact, fit = "cover", error, preset = "blog-cover", prefix = "", recommendedSize }: Props) {
	const [uploading, setUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const sizeGuidance = recommendedSize || getImagePresetRecommendation(preset);
	const compactGuidance = sizeGuidance.replace(/\s*px$/i, "").replace(/\s*×\s*/g, "×");

	async function handleFile(file: File) {
		setUploading(true);
		try {
			const optimized = await optimizeImage(file, preset);
			const baseName = file.name.replace(/\.[^.]+$/, "");
			const fileName = `${baseName}.${optimized.extension}`;
			const formData = new FormData();
			formData.append("file", optimized.blob, fileName);
			formData.append("prefix", prefix);
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
			<div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5">
				{label ? <div className="block text-sm font-medium text-gray-700">{label}</div> : <span />}
				<span
					className={`inline-flex items-center rounded-full border border-[#007F84]/15 bg-[#007F84]/[0.07] font-semibold text-[#006C71] ${compact ? "w-full justify-center px-1 py-0.5 text-[8px]" : "gap-1 px-2.5 py-1 text-[11px]"}`}
					title={`Recommended image size: ${sizeGuidance}`}
				>
					{compact ? null : <Ruler className="h-3 w-3" />}
					<span className="whitespace-nowrap">{compact ? compactGuidance : `Recommended ${sizeGuidance}`}</span>
				</span>
			</div>
			{hint || error ? (
				<div className="mb-1.5">
					{hint && <p className="text-xs text-gray-400">{hint}</p>}
					{error && <p className="text-xs text-red-500">{error}</p>}
				</div>
			) : null}
			{value ? (
				<div className="relative overflow-hidden rounded-lg border border-gray-200">
					<img src={value} alt="" className={`${heightClass} w-full object-${fit}`} />
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
