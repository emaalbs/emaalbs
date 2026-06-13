"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";

interface Props {
	value: string;
	onChange: (url: string) => void;
	label?: React.ReactNode;
	hint?: string;
	error?: string;
	prefix?: string;
}

export function PdfUpload({
	value,
	onChange,
	label = "PDF File",
	hint,
	error,
	prefix = "magazines/",
}: Props) {
	const [uploading, setUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	function fileName(url: string): string {
		try {
			const parts = url.split("/");
			return decodeURIComponent(parts[parts.length - 1]);
		} catch {
			return url;
		}
	}

	async function handleFile(file: File) {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file, file.name);
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
				<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
					<FileText className="h-5 w-5 shrink-0 text-[#01334D]" />
					<span className="flex-1 truncate text-sm text-gray-700" title={fileName(value)}>
						{fileName(value)}
					</span>
					<button
						onClick={() => inputRef.current?.click()}
						className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm hover:text-gray-800"
						title="Replace PDF"
					>
						<Upload className="h-3.5 w-3.5" />
					</button>
					<button
						onClick={() => onChange("")}
						className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-red-500 shadow-sm hover:text-red-600"
						title="Remove PDF"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				</div>
			) : (
				<button
					onClick={() => inputRef.current?.click()}
					disabled={uploading}
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
		</div>
	);
}
