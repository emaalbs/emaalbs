"use client";

import { useState } from "react";

export default function AdminMediaPage() {
	const [file, setFile] = useState<File | null>(null);
	const [prefix, setPrefix] = useState("");
	const [uploading, setUploading] = useState(false);
	const [result, setResult] = useState<{ key: string; url: string } | null>(null);

	async function upload() {
		if (!file) return;
		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("prefix", prefix);
		const res = await fetch("/api/media/upload", {
			method: "POST",
			body: formData,
		});
		const data = (await res.json()) as { key: string; url: string } | { error: string };
		if ("key" in data) {
			setResult(data);
		}
		setUploading(false);
	}

	return (
		<div>
			<h1 className="mb-6 font-display text-2xl font-bold text-white">Media Upload</h1>
			<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
				<div className="mb-4">
					<label className="mb-1 block text-sm text-white/50">Folder prefix (optional)</label>
					<input
						value={prefix}
						onChange={(e) => setPrefix(e.target.value)}
						placeholder="e.g., blogs/ or ibs/2026/"
						className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#EEC13B]"
					/>
				</div>
				<div className="mb-4">
					<label className="mb-1 block text-sm text-white/50">File</label>
					<input
						type="file"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
						className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white file:bg-transparent file:text-white/70"
					/>
				</div>
				<button
					onClick={upload}
					disabled={uploading || !file}
					className="rounded-lg bg-[#EEC13B] px-4 py-2 text-sm font-semibold text-[#01334D] transition hover:bg-[#AB820B] disabled:opacity-50"
				>
					{uploading ? "Uploading..." : "Upload"}
				</button>

				{result && (
					<div className="mt-6 rounded-xl border border-white/10 bg-[#011E2F] p-4">
						<p className="mb-1 text-sm text-white/50">Uploaded successfully</p>
						<p className="text-sm text-white">Key: {result.key}</p>
						<p className="text-sm text-[#EEC13B]">{window.location.origin}{result.url}</p>
					</div>
				)}
			</div>
		</div>
	);
}
