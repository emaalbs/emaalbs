"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

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
					<div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
						<label className="block text-sm text-white/50">File</label>
						<span className="inline-flex items-center gap-1 rounded-full border border-[#EEC13B]/20 bg-[#EEC13B]/10 px-2.5 py-1 text-[11px] font-semibold text-[#EEC13B]">
							<Ruler className="h-3 w-3" /> General images: 1600 × 1200 px
						</span>
					</div>
					<input
						type="file"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
						className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white file:bg-transparent file:text-white/70"
					/>
					<p className="mt-1.5 text-xs text-white/35">For banners, portraits, logos, and covers, upload from their editor to see the exact recommended size.</p>
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
