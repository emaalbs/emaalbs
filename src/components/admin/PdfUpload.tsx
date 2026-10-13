"use client";

import { useState, useRef, useId } from "react";
import { Upload, X, FileText } from "lucide-react";

interface Props {
	value: string;
	onChange: (url: string) => void;
	label?: React.ReactNode;
	hint?: string;
	error?: string;
	prefix?: string;
	disabled?: boolean;
	onUploadingChange?: (busy: boolean) => void;
}

export function PdfUpload({
	value,
	onChange,
	label = "PDF File",
	hint,
	error,
	prefix = "magazines/",
	disabled = false,
	onUploadingChange,
}: Props) {
	const [uploading, setUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const labelId = useId();
	const [uploadError, setUploadError] = useState("");

	function fileName(url: string): string {
		try {
			const parts = url.split("/");
			return decodeURIComponent(parts[parts.length - 1]);
		} catch {
			return url;
		}
	}

	async function handleFile(file: File) {
		if (uploading || disabled) return;
		setUploadError("");
		if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== "application/pdf")) { setUploadError("Please choose a PDF file."); return; }
		setUploading(true);
		onUploadingChange?.(true);
		try {
			if (!(await file.slice(0, 5).text()).startsWith("%PDF-")) throw new Error("This file is not a valid PDF.");
			const formData = new FormData();
			formData.append("file", file, file.name);
			formData.append("prefix", prefix);
			const res = await fetch("/api/media/upload", {
				method: "POST",
				body: formData,
			});
			const data = (await res.json()) as { key: string; url: string } | { error: string };
			if (!res.ok || !("url" in data)) throw new Error("error" in data ? data.error : "PDF upload failed. Please try again.");
			if ("url" in data) {
				onChange(data.url);
			}
		} catch (e) {
			setUploadError(e instanceof Error ? e.message : "PDF upload failed. Please try again.");
		} finally {
			setUploading(false);
			onUploadingChange?.(false);
		}
	}

	return (
		<div className="min-w-0" aria-busy={uploading}>
			{label && (
				<div className="mb-1">
					<div id={labelId} className="block text-sm font-medium text-gray-700">{label}</div>
					{hint && <p className="text-xs leading-5 text-gray-600">{hint}</p>}
					{error && <p className="text-xs text-red-500">{error}</p>}
				</div>
			)}

			{value ? (
				<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
					<FileText className="h-5 w-5 shrink-0 text-[#01334D]" />
					<a href={value} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm text-gray-700 underline hover:text-[var(--color-teal)] focus-visible:outline-2" title={fileName(value)}>
						{fileName(value)}
					</a>
					<button
						type="button" disabled={disabled || uploading}
						onClick={() => inputRef.current?.click()}
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm hover:text-gray-800 focus-visible:outline-2 disabled:opacity-50"
						title="Replace PDF"
						aria-label="Replace PDF"
					>
						<Upload className="h-3.5 w-3.5" />
					</button>
					<button
						type="button" disabled={disabled || uploading}
						onClick={() => onChange("")}
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-red-500 shadow-sm hover:text-red-600 focus-visible:outline-2 disabled:opacity-50"
						title="Remove PDF"
						aria-label="Remove PDF"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				</div>
			) : (
				<button
					type="button" aria-labelledby={labelId}
					onClick={() => inputRef.current?.click()}
					disabled={uploading || disabled}
					className={`flex h-20 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition disabled:opacity-50 ${
						error
							? "border-red-300 text-red-400 hover:border-red-400 hover:text-red-500"
							: "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
					}`}
				>
					{uploading ? (
						<span className="text-sm">Uploading...</span>
					) : (
						<>
							<FileText className="h-6 w-6" />
							<span className="text-sm font-medium">Click to upload PDF</span>
						</>
					)}
				</button>
			)}

			<input
				aria-labelledby={labelId}
				disabled={uploading || disabled}
				ref={inputRef}
				type="file"
				accept="application/pdf"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
					e.target.value = "";
				}}
				className="hidden"
			/>
			{uploading && value && <p role="status" className="mt-2 text-sm text-gray-600">Uploading replacement…</p>}
			{uploadError && <p role="alert" className="mt-2 text-sm text-red-600">{uploadError}</p>}
		</div>
	);
}
