"use client";

import { useEffect, useState } from "react";

export default function IbsOverviewEditorPage() {
	const [locale, setLocale] = useState<"en" | "ar">("en");
	const [blocks, setBlocks] = useState<Record<string, unknown>>({});
	const [json, setJson] = useState("{}");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	async function load() {
		setLoading(true);
		const res = await fetch(`/api/ibs/overview?locale=${locale}`);
		const data = (await res.json()) as Record<string, unknown>;
		setBlocks(data);
		setJson(JSON.stringify(data, null, 2));
		setLoading(false);
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locale]);

	async function save() {
		setSaving(true);
		setError("");
		try {
			const parsed = JSON.parse(json) as Record<string, unknown>;
			for (const [block, payload] of Object.entries(parsed)) {
				const res = await fetch("/api/ibs/overview", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ block, locale, payload }),
				});
				if (!res.ok) throw new Error(`Failed to save block: ${block}`);
			}
			setBlocks(parsed);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">IBS Overview Editor</h1>
				<button
					onClick={save}
					disabled={saving}
					className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50"
				>
					{saving ? "Saving..." : "Save"}
				</button>
			</div>

			<div className="mb-4 flex gap-2">
				{(["en", "ar"] as const).map((loc) => (
					<button
						key={loc}
						onClick={() => setLocale(loc)}
						className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
							locale === loc
								? "bg-[#01334D] text-white"
								: "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
						}`}
					>
						{loc.toUpperCase()}
					</button>
				))}
			</div>

			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
					{error}
				</div>
			)}

			{loading ? (
				<div className="text-gray-400">Loading...</div>
			) : (
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<textarea
						value={json}
						onChange={(e) => setJson(e.target.value)}
						className="h-[60vh] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 outline-none focus:border-blue-500"
						spellCheck={false}
					/>
				</div>
			)}
		</div>
	);
}
