﻿"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { IbsEdition, Stat, Theme, Speaker } from "@/data/ibs/types";
import { ImageUpload } from "@/components/admin/ImageUpload";

function toSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function emptyEdition(): IbsEdition {
	return {
		slug: "",
		year: new Date().getFullYear(),
		status: "upcoming",
		editionLabel: { en: "", ar: "" },
		title: { en: "", ar: "" },
		tagline: { en: "", ar: "" },
		summary: { en: "", ar: "" },
		dates: { en: "", ar: "" },
		location: { en: "", ar: "" },
		heroImage: "",
		stats: [],
		themes: [],
		keynoteSpeakers: [],
		sectorShares: [],
		initiatives: [],
		sponsors: [],
		gallery: [],
	};
}

export default function IbsEditionEditorPage({ params }: { params: Promise<{ slug: string }> }) {
	const router = useRouter();
	const [slug, setSlug] = useState<string | null>(null);
	const [edition, setEdition] = useState<IbsEdition>(emptyEdition());
	const [saving, setSaving] = useState(false);
	const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
	const [slugAuto, setSlugAuto] = useState(true);

	useEffect(() => {
		params.then((p) => {
			setSlug(p.slug);
			if (p.slug !== "new") {
				fetch(`/api/ibs/editions/${p.slug}`)
					.then((r) => r.json())
					.then((data) => setEdition(data as IbsEdition));
			}
		});
	}, [params]);

	function setField<K extends keyof IbsEdition>(field: K, value: IbsEdition[K]) {
		setEdition((prev) => ({ ...prev, [field]: value }));
	}

	function setLocalized<K extends keyof IbsEdition>(
		field: K,
		value: string,
	) {
		setEdition((prev) => ({
			...prev,
			[field]: { ...((prev[field] as { en: string; ar: string }) ?? {}), [activeLocale]: value },
		}));
	}

	function addStat() {
		setEdition((prev) => ({
			...prev,
			stats: [...prev.stats, { value: "", label: { en: "", ar: "" } }],
		}));
	}

	function updateStat(index: number, stat: Stat) {
		setEdition((prev) => {
			const updated = [...prev.stats];
			updated[index] = stat;
			return { ...prev, stats: updated };
		});
	}

	function removeStat(index: number) {
		setEdition((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
	}

	function addTheme() {
		setEdition((prev) => ({
			...prev,
			themes: [...prev.themes, { title: { en: "", ar: "" }, description: { en: "", ar: "" } }],
		}));
	}

	function updateTheme(index: number, theme: Theme) {
		setEdition((prev) => {
			const updated = [...prev.themes];
			updated[index] = theme;
			return { ...prev, themes: updated };
		});
	}

	function removeTheme(index: number) {
		setEdition((prev) => ({ ...prev, themes: prev.themes.filter((_, i) => i !== index) }));
	}

	function addSpeaker() {
		setEdition((prev) => ({
			...prev,
			keynoteSpeakers: [
				...prev.keynoteSpeakers,
				{ id: crypto.randomUUID(), name: { en: "", ar: "" }, title: { en: "", ar: "" } },
			],
		}));
	}

	function updateSpeaker(index: number, speaker: Speaker) {
		setEdition((prev) => {
			const updated = [...prev.keynoteSpeakers];
			updated[index] = speaker;
			return { ...prev, keynoteSpeakers: updated };
		});
	}

	function removeSpeaker(index: number) {
		setEdition((prev) => ({ ...prev, keynoteSpeakers: prev.keynoteSpeakers.filter((_, i) => i !== index) }));
	}

	async function save() {
		setSaving(true);
		const url = slug === "new" ? "/api/ibs/editions" : `/api/ibs/editions/${edition.slug}`;
		const method = slug === "new" ? "POST" : "PUT";
		await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(edition),
		});
		setSaving(false);
		router.push("/admin/ibs/editions");
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<button
						onClick={() => router.push("/admin/ibs/editions")}
						className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>
					<h1 className="text-2xl font-bold text-gray-900">
						{slug === "new" ? "New IBS Edition" : "Edit IBS Edition"}
					</h1>
				</div>
				<button
					onClick={save}
					disabled={saving}
					className="rounded-lg bg-[#01334D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50"
				>
					{saving ? "Saving..." : "Save"}
				</button>
			</div>

			<div className="space-y-6">
				{/* Locale tabs */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-4 flex gap-2">
						{(["en", "ar"] as const).map((loc) => (
							<button
								key={loc}
								onClick={() => setActiveLocale(loc)}
								className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
									activeLocale === loc
										? "bg-[#01334D] text-white"
										: "border border-gray-200 text-gray-600 hover:bg-gray-50"
								}`}
							>
								{loc.toUpperCase()}
							</button>
						))}
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Title ({activeLocale})</label>
							<input
								value={edition.title[activeLocale]}
								onChange={(e) => {
									const value = e.target.value;
									setEdition((prev) => {
										const next = { ...prev, title: { ...prev.title, [activeLocale]: value } };
										if (activeLocale === "en" && slugAuto) {
											next.slug = toSlug(value);
										}
										return next;
									});
								}}
								className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500" />
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Edition Label ({activeLocale})</label>
							<input
								value={edition.editionLabel[activeLocale]}
								onChange={(e) => setLocalized("editionLabel", e.target.value)}
								className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500" />
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Dates ({activeLocale})</label>
							<input
								value={edition.dates[activeLocale]}
								onChange={(e) => setLocalized("dates", e.target.value)}
								className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500" />
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Location ({activeLocale})</label>
							<input
								value={edition.location[activeLocale]}
								onChange={(e) => setLocalized("location", e.target.value)}
								className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500" />
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Year</label>
							<input
								type="number"
								value={edition.year}
								onChange={(e) => setField("year", Number(e.target.value))}
								className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500" />
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
							<select
								value={edition.status}
								onChange={(e) => setField("status", e.target.value as IbsEdition["status"])}
								className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
							>
								<option value="upcoming">Upcoming</option>
								<option value="live">Live</option>
								<option value="past">Past</option>
							</select>
						</div>
					</div>

					<div>
						<ImageUpload
							value={edition.heroImage}
							onChange={(url) => setField("heroImage", url)}
							label="Hero Image"
							hint="Recommended: 1920 × 1080 (16:9)"
							preset="ibs-hero"
							prefix="ibs/"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm text-gray-400">Slug</label>
						<div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
							<span className="text-sm text-gray-400">{edition.slug || "—"}</span>
						</div>
						<p className="mt-1 text-xs text-gray-400">Auto-generated from the English title</p>
					</div>
				</div>

				{/* Stats */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-gray-900">Stats</h2>
						<button
							onClick={addStat}
							className="flex items-center gap-1 rounded-lg bg-[#01334D] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#011E2F]"
						>
							<Plus className="h-3.5 w-3.5" /> Add Stat
						</button>
					</div>
					<div className="space-y-3">
						{edition.stats.map((stat, i) => (
							<div key={i} className="flex items-center gap-3">
								<input
									value={stat.value}
									onChange={(e) =>
										updateStat(i, { ...stat, value: e.target.value })
									}
									placeholder="Value (e.g. 800)"
									className="w-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
								/>
								<input
									value={stat.label[activeLocale]}
									onChange={(e) =>
										updateStat(i, {
											...stat,
											label: { ...stat.label, [activeLocale]: e.target.value },
										})
									}
									placeholder="Label"
									className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
								/>
								<button
									onClick={() => removeStat(i)}
									className="text-red-600 hover:text-red-500"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						))}
						{edition.stats.length === 0 && (
							<p className="text-sm text-gray-400">No stats yet. Click "Add Stat" to create one.</p>
						)}
					</div>
				</div>

				{/* Themes */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-gray-900">Themes</h2>
						<button
							onClick={addTheme}
							className="flex items-center gap-1 rounded-lg bg-[#01334D] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#011E2F]"
						>
							<Plus className="h-3.5 w-3.5" /> Add Theme
						</button>
					</div>
					<div className="space-y-4">
						{edition.themes.map((theme, i) => (
							<div key={i} className="rounded-lg border border-gray-200 p-4">
								<div className="mb-2 flex items-center justify-between">
									<span className="text-xs font-medium text-gray-400">Theme {i + 1}</span>
									<button
										onClick={() => removeTheme(i)}
										className="text-red-600 hover:text-red-500"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
								<input
									value={theme.title[activeLocale]}
									onChange={(e) =>
										updateTheme(i, {
											...theme,
											title: { ...theme.title, [activeLocale]: e.target.value },
										})
									}
									placeholder="Title"
									className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500" />
								<textarea
									value={theme.description[activeLocale]}
									onChange={(e) =>
										updateTheme(i, {
											...theme,
											description: { ...theme.description, [activeLocale]: e.target.value },
										})
									}
									placeholder="Description"
									rows={2}
									className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500" />
							</div>
						))}
						{edition.themes.length === 0 && (
							<p className="text-sm text-gray-400">No themes yet. Click "Add Theme" to create one.</p>
						)}
					</div>
				</div>

				{/* Speakers */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-gray-900">Keynote Speakers</h2>
						<button
							onClick={addSpeaker}
							className="flex items-center gap-1 rounded-lg bg-[#01334D] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#011E2F]"
						>
							<Plus className="h-3.5 w-3.5" /> Add Speaker
						</button>
					</div>
					<div className="space-y-4">
						{edition.keynoteSpeakers.map((speaker, i) => (
							<div key={speaker.id} className="rounded-lg border border-gray-200 p-4">
								<div className="mb-2 flex items-center justify-between">
									<span className="text-xs font-medium text-gray-400">Speaker {i + 1}</span>
									<button
										onClick={() => removeSpeaker(i)}
										className="text-red-600 hover:text-red-500"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
								<div className="grid gap-3 md:grid-cols-2">
									<input
										value={speaker.name[activeLocale]}
										onChange={(e) =>
											updateSpeaker(i, {
												...speaker,
												name: { ...speaker.name, [activeLocale]: e.target.value },
											})
										}
										placeholder="Name"
										className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500" />
									<input
										value={speaker.title[activeLocale]}
										onChange={(e) =>
											updateSpeaker(i, {
												...speaker,
												title: { ...speaker.title, [activeLocale]: e.target.value },
											})
										}
										placeholder="Title / Role"
										className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500" />
								</div>
							</div>
						))}
						{edition.keynoteSpeakers.length === 0 && (
							<p className="text-sm text-gray-400">No speakers yet. Click "Add Speaker" to create one.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
