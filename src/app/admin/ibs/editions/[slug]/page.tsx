"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Check,
	AlertCircle,
	Copy,
	Globe,
	BarChart3,
	Lightbulb,
	Users,
	Rocket,
	HeartHandshake,
	Images,
	Calendar,
	Play,
} from "lucide-react";
import type {
	IbsEdition,
	Stat,
	Theme,
	Speaker,
	Initiative,
	Sponsor,
	GalleryItem,
	AgendaDay,
	AgendaItem,
	AgendaSpeaker,
	SectorShare,
	VideoItem,
} from "@/data/ibs/types";
import { SectionCard } from "@/components/admin/ibs/SectionCard";
import { BasicInfoSection } from "@/components/admin/ibs/sections/BasicInfoSection";
import { StatsSection } from "@/components/admin/ibs/sections/StatsSection";
import { ThemesSection } from "@/components/admin/ibs/sections/ThemesSection";
import { SpeakersSection } from "@/components/admin/ibs/sections/SpeakersSection";
import { InitiativesSection } from "@/components/admin/ibs/sections/InitiativesSection";
import { SponsorsSection } from "@/components/admin/ibs/sections/SponsorsSection";
import { GallerySection } from "@/components/admin/ibs/sections/GallerySection";
import { AgendaSection } from "@/components/admin/ibs/sections/AgendaSection";
import { SectorSharesSection } from "@/components/admin/ibs/sections/SectorSharesSection";
import { VideosSection } from "@/components/admin/ibs/sections/VideosSection";

type SectionId = "basic" | "stats" | "themes" | "speakers" | "initiatives" | "sponsors" | "gallery" | "agenda" | "sectorShares" | "videos";

const SECTIONS = [
	{ id: "basic" as SectionId, label: "Basic Info", icon: Globe },
	{ id: "stats" as SectionId, label: "Stats", icon: BarChart3 },
	{ id: "themes" as SectionId, label: "Themes", icon: Lightbulb },
	{ id: "speakers" as SectionId, label: "Speakers", icon: Users },
	{ id: "initiatives" as SectionId, label: "Initiatives", icon: Rocket },
	{ id: "sponsors" as SectionId, label: "Sponsors", icon: HeartHandshake },
	{ id: "gallery" as SectionId, label: "Gallery", icon: Images },
	{ id: "agenda" as SectionId, label: "Agenda", icon: Calendar },
	{ id: "sectorShares" as SectionId, label: "Sector Shares", icon: BarChart3 },
	{ id: "videos" as SectionId, label: "Videos", icon: Play },
];

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
		agenda: [],
		videos: [],
	};
}

export default function IbsEditionEditorPage({ params }: { params: Promise<{ slug: string }> }) {
	const router = useRouter();
	const [slug, setSlug] = useState<string | null>(null);
	const [edition, setEdition] = useState<IbsEdition>(emptyEdition());
	const [originalEdition, setOriginalEdition] = useState<IbsEdition>(emptyEdition());
	const [saving, setSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<string | null>(null);
	const [slugAuto, setSlugAuto] = useState(true);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>({
		basic: true, stats: false, themes: false, speakers: false,
		initiatives: false, sponsors: false, gallery: false, agenda: false, sectorShares: false, videos: false,
	});
	const [allEditions, setAllEditions] = useState<IbsEdition[]>([]);

	const isNew = slug === "new";
	const hasChanges = JSON.stringify(edition) !== JSON.stringify(originalEdition);

	useEffect(() => {
		params.then((p) => {
			setSlug(p.slug);
			if (p.slug !== "new") {
				setSlugAuto(false);
				fetch(`/api/ibs/editions/${p.slug}`)
					.then((r) => {
						if (!r.ok) {
							alert(`Failed to load edition: ${r.status} ${r.statusText}`);
							throw new Error(`HTTP ${r.status}`);
						}
						return r.json();
					})
					.then((data) => {
						const e = data as IbsEdition;
						const loaded = { ...emptyEdition(), ...e, agenda: e.agenda ?? [], videos: e.videos ?? [] };
						setEdition(loaded);
						setOriginalEdition(loaded);
						setExpandedSections((prev) => ({
							...prev,
							stats: loaded.stats.length > 0,
							themes: loaded.themes.length > 0,
							speakers: loaded.keynoteSpeakers.length > 0,
							initiatives: loaded.initiatives.length > 0,
							sponsors: loaded.sponsors.length > 0,
							gallery: loaded.gallery.length > 0,
							agenda: (loaded.agenda ?? []).length > 0,
							sectorShares: loaded.sectorShares.length > 0,
							videos: loaded.videos.length > 0,
						}));
					})
					.catch(() => {});
			}
		});
	}, [params]);

	useEffect(() => {
		fetch("/api/ibs/editions")
			.then((r) => r.json())
			.then((data) => setAllEditions((data as IbsEdition[]).filter((e) => e.slug !== slug)))
			.catch(() => {});
	}, [slug]);

	const completion = useMemo(() => {
		return {
			basic: !!(edition.title.en && edition.title.ar && edition.tagline.en && edition.tagline.ar && edition.summary.en && edition.summary.ar && edition.dates.en && edition.dates.ar && edition.location.en && edition.location.ar && edition.heroImage),
			stats: edition.stats.length > 0,
			themes: edition.themes.length > 0,
			speakers: edition.keynoteSpeakers.length > 0,
			initiatives: edition.initiatives.length > 0,
			sponsors: edition.sponsors.length > 0,
			gallery: edition.gallery.length > 0,
			agenda: (edition.agenda ?? []).length > 0,
			sectorShares: edition.sectorShares.length > 0,
			videos: (edition.videos ?? []).length > 0,
		};
	}, [edition]);

	const completedCount = Object.values(completion).filter(Boolean).length;

	function toggleSection(id: SectionId) {
		setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
	}

	function scrollToSection(id: SectionId) {
		const el = document.getElementById(`section-${id}`);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
			setExpandedSections((prev) => ({ ...prev, [id]: true }));
		}
	}

	function clearErr(key: string) {
		setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
	}

	function validate(): boolean {
		const e: Record<string, string> = {};
		const req = [
			["title_en", edition.title.en, "Title (EN)"],
			["title_ar", edition.title.ar, "Title (AR)"],
			["tagline_en", edition.tagline.en, "Tagline (EN)"],
			["tagline_ar", edition.tagline.ar, "Tagline (AR)"],
			["summary_en", edition.summary.en, "Summary (EN)"],
			["summary_ar", edition.summary.ar, "Summary (AR)"],
			["dates_en", edition.dates.en, "Dates (EN)"],
			["dates_ar", edition.dates.ar, "Dates (AR)"],
			["location_en", edition.location.en, "Location (EN)"],
			["location_ar", edition.location.ar, "Location (AR)"],
		] as const;
		for (const [key, val, label] of req) {
			if (!val.trim()) e[key] = `${label} is required`;
		}
		if (!edition.heroImage) e["heroImage"] = "Hero image is required";
		setErrors(e);
		return Object.keys(e).length === 0;
	}

	async function save() {
		if (!validate()) return;
		setSaving(true);
		const url = isNew ? "/api/ibs/editions" : `/api/ibs/editions/${edition.slug}`;
		const method = isNew ? "POST" : "PUT";
		const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(edition) });
		setSaving(false);
		if (res.ok) {
			setOriginalEdition(edition);
			setLastSaved(new Date().toLocaleTimeString());
			if (isNew) router.push("/admin/ibs/editions");
		}
	}

	async function duplicate() {
		if (!confirm("Create a duplicate of this edition with a new slug?")) return;
		const newSlug = `${edition.slug}-copy`;
		const copy = { ...edition, slug: newSlug };
		const res = await fetch("/api/ibs/editions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(copy) });
		if (res.ok) router.push(`/admin/ibs/editions/${newSlug}`);
	}

	function updateEdition(patch: Partial<IbsEdition>) {
		setEdition((prev) => ({ ...prev, ...patch }));
	}

	// --- Stats ---
	const addStat = () => setEdition((p) => ({ ...p, stats: [...p.stats, { value: "", label: { en: "", ar: "" } }] }));
	const updateStat = (i: number, s: Stat) => setEdition((p) => { const a = [...p.stats]; a[i] = s; return { ...p, stats: a }; });
	const removeStat = (i: number) => setEdition((p) => ({ ...p, stats: p.stats.filter((_, j) => j !== i) }));

	// --- Themes ---
	const addTheme = () => setEdition((p) => ({ ...p, themes: [...p.themes, { title: { en: "", ar: "" }, description: { en: "", ar: "" } }] }));
	const updateTheme = (i: number, t: Theme) => setEdition((p) => { const a = [...p.themes]; a[i] = t; return { ...p, themes: a }; });
	const removeTheme = (i: number) => setEdition((p) => ({ ...p, themes: p.themes.filter((_, j) => j !== i) }));

	// --- Speakers ---
	const addSpeaker = () => setEdition((p) => ({ ...p, keynoteSpeakers: [...p.keynoteSpeakers, { id: crypto.randomUUID(), name: { en: "", ar: "" }, title: { en: "", ar: "" }, org: { en: "", ar: "" } }] }));
	const updateSpeaker = (i: number, s: Speaker) => setEdition((p) => { const a = [...p.keynoteSpeakers]; a[i] = s; return { ...p, keynoteSpeakers: a }; });
	const removeSpeaker = (i: number) => setEdition((p) => ({ ...p, keynoteSpeakers: p.keynoteSpeakers.filter((_, j) => j !== i) }));

	// --- Initiatives ---
	const addInitiative = () => setEdition((p) => ({ ...p, initiatives: [...p.initiatives, { title: { en: "", ar: "" }, description: { en: "", ar: "" }, highlight: { en: "", ar: "" }, partners: [] }] }));
	const updateInitiative = (i: number, init: Initiative) => setEdition((p) => { const a = [...p.initiatives]; a[i] = init; return { ...p, initiatives: a }; });
	const removeInitiative = (i: number) => setEdition((p) => ({ ...p, initiatives: p.initiatives.filter((_, j) => j !== i) }));

	// --- Sponsors ---
	const addSponsor = () => setEdition((p) => ({ ...p, sponsors: [...p.sponsors, { id: crypto.randomUUID(), name: "", tier: "gold", logo: "", href: "" }] }));
	const updateSponsor = (i: number, s: Sponsor) => setEdition((p) => { const a = [...p.sponsors]; a[i] = s; return { ...p, sponsors: a }; });
	const removeSponsor = (i: number) => setEdition((p) => ({ ...p, sponsors: p.sponsors.filter((_, j) => j !== i) }));

	// --- Gallery ---
	const addGalleryItem = () => setEdition((p) => ({ ...p, gallery: [...p.gallery, { id: crypto.randomUUID(), src: "", alt: { en: "", ar: "" } }] }));
	const updateGalleryItem = (i: number, g: GalleryItem) => setEdition((p) => { const a = [...p.gallery]; a[i] = g; return { ...p, gallery: a }; });
	const removeGalleryItem = (i: number) => setEdition((p) => ({ ...p, gallery: p.gallery.filter((_, j) => j !== i) }));

	// --- Agenda ---
	const addAgendaDay = () => setEdition((p) => ({ ...p, agenda: [...(p.agenda ?? []), { dateLabel: { en: "", ar: "" }, items: [] }] }));
	const updateAgendaDay = (di: number, d: AgendaDay) => setEdition((p) => { const a = [...(p.agenda ?? [])]; a[di] = d; return { ...p, agenda: a }; });
	const removeAgendaDay = (di: number) => setEdition((p) => ({ ...p, agenda: (p.agenda ?? []).filter((_, j) => j !== di) }));
	const addAgendaItem = (di: number) => {
		setEdition((p) => {
			const days = [...(p.agenda ?? [])];
			days[di] = { ...days[di], items: [...days[di].items, { time: "", title: { en: "", ar: "" }, description: { en: "", ar: "" }, note: { en: "", ar: "" }, speakers: [] }] };
			return { ...p, agenda: days };
		});
	};
	const updateAgendaItem = (di: number, ii: number, item: AgendaItem) => {
		setEdition((p) => {
			const days = [...(p.agenda ?? [])];
			const items = [...days[di].items]; items[ii] = item;
			days[di] = { ...days[di], items };
			return { ...p, agenda: days };
		});
	};
	const removeAgendaItem = (di: number, ii: number) => {
		setEdition((p) => {
			const days = [...(p.agenda ?? [])];
			days[di] = { ...days[di], items: days[di].items.filter((_, j) => j !== ii) };
			return { ...p, agenda: days };
		});
	};
	const addAgendaSpeaker = (di: number, ii: number) => {
		setEdition((p) => {
			const days = [...(p.agenda ?? [])];
			const items = [...days[di].items];
			items[ii] = { ...items[ii], speakers: [...(items[ii].speakers ?? []), { id: crypto.randomUUID(), name: { en: "", ar: "" }, org: { en: "", ar: "" }, photo: "" }] };
			days[di] = { ...days[di], items };
			return { ...p, agenda: days };
		});
	};
	const updateAgendaSpeaker = (di: number, ii: number, si: number, sp: AgendaSpeaker) => {
		setEdition((p) => {
			const days = [...(p.agenda ?? [])];
			const items = [...days[di].items];
			const speakers = [...(items[ii].speakers ?? [])]; speakers[si] = sp;
			items[ii] = { ...items[ii], speakers };
			days[di] = { ...days[di], items };
			return { ...p, agenda: days };
		});
	};
	const removeAgendaSpeaker = (di: number, ii: number, si: number) => {
		setEdition((p) => {
			const days = [...(p.agenda ?? [])];
			const items = [...days[di].items];
			items[ii] = { ...items[ii], speakers: (items[ii].speakers ?? []).filter((_, j) => j !== si) };
			days[di] = { ...days[di], items };
			return { ...p, agenda: days };
		});
	};

	// --- Sector Shares ---
	const addSectorShare = () => setEdition((p) => ({ ...p, sectorShares: [...p.sectorShares, { sector: { en: "", ar: "" }, percent: 0 }] }));
	const updateSectorShare = (i: number, s: SectorShare) => setEdition((p) => { const a = [...p.sectorShares]; a[i] = s; return { ...p, sectorShares: a }; });
	const removeSectorShare = (i: number) => setEdition((p) => ({ ...p, sectorShares: p.sectorShares.filter((_, j) => j !== i) }));

	// --- Videos ---
	const addVideo = () => setEdition((p) => ({ ...p, videos: [...(p.videos ?? []), { id: crypto.randomUUID(), youtubeUrl: "", title: { en: "", ar: "" }, description: { en: "", ar: "" } }] }));
	const updateVideo = (i: number, v: VideoItem) => setEdition((p) => { const a = [...(p.videos ?? [])]; a[i] = v; return { ...p, videos: a }; });
	const removeVideo = (i: number) => setEdition((p) => ({ ...p, videos: (p.videos ?? []).filter((_, j) => j !== i) }));

	return (
		<div className="min-h-screen bg-gray-50">
			{/* ── Sticky top bar ── */}
			<div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
				<div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3">
					<button
						onClick={() => router.push("/admin/ibs/editions")}
						className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>

					<div className="flex-1 min-w-0">
						<h1 className="text-lg font-bold text-gray-900 truncate">
							{isNew ? "New IBS Edition" : edition.title.en || "Edit IBS Edition"}
						</h1>
						<div className="flex items-center gap-2 text-xs text-gray-500">
							{hasChanges && (
								<span className="inline-flex items-center gap-1 text-amber-600">
									<span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
									Unsaved changes
								</span>
							)}
							{lastSaved && <span>Saved at {lastSaved}</span>}
							<span>·</span>
							<span className="text-gray-400">{completedCount}/{SECTIONS.length} sections complete</span>
						</div>
					</div>

					{!isNew && (
						<button
							onClick={duplicate}
							className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
						>
							<Copy className="h-3.5 w-3.5" /> Duplicate
						</button>
					)}

					<button
						onClick={save}
						disabled={saving || !hasChanges}
						className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-navy)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-navy-dark)] disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{saving ? "Saving..." : "Save Edition"}
					</button>
				</div>
			</div>

			{/* ── Main layout ── */}
			<div className="mx-auto flex max-w-[1400px] gap-6 px-6 py-6">
				{/* ── Sidebar ── */}
				<div className="hidden lg:block w-64 shrink-0">
					<div className="sticky top-24 space-y-1">
						{SECTIONS.map((s) => {
							const Icon = s.icon;
							const isComplete = completion[s.id];
							return (
								<button
									key={s.id}
									onClick={() => scrollToSection(s.id)}
									className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
										isComplete
											? "text-[var(--color-teal)] hover:bg-gray-100"
											: "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
									}`}
								>
									{isComplete ? (
										<Check className="h-4 w-4 shrink-0" />
									) : (
										<Icon className="h-4 w-4 shrink-0" />
									)}
									<span className="flex-1">{s.label}</span>
									{!isComplete && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
								</button>
							);
						})}
					</div>
				</div>

				{/* ── Content ── */}
				<div className="flex-1 space-y-5 pb-20">
					{/* Validation banner */}
					{Object.keys(errors).length > 0 && (
						<div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
							<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
							<div>
								<span className="font-semibold">Fix errors before saving.</span> Both English and Arabic fields are required.
								<ul className="mt-1 list-disc pl-4 text-xs text-red-500/70">
									{Object.values(errors).map((msg, i) => (
										<li key={i}>{msg}</li>
									))}
								</ul>
							</div>
						</div>
					)}

					{/* ── Basic Info ── */}
					<SectionCard
						id="basic"
						label="Basic Info"
						count={0}
						isComplete={completion.basic}
						isExpanded={expandedSections.basic}
						onToggle={() => toggleSection("basic")}
					>
						<BasicInfoSection
							edition={edition}
							isNew={isNew}
							slugAuto={slugAuto}
							allEditions={allEditions}
							errors={errors}
							onChange={updateEdition}
							onSetSlugAuto={setSlugAuto}
							onClearErr={clearErr}
						/>
					</SectionCard>

					{/* ── Stats ── */}
					<SectionCard
						id="stats"
						label="Stats"
						count={edition.stats.length}
						isComplete={completion.stats}
						isExpanded={expandedSections.stats}
						onToggle={() => toggleSection("stats")}
					>
						<StatsSection stats={edition.stats} onAdd={addStat} onUpdate={updateStat} onRemove={removeStat} />
					</SectionCard>

					{/* ── Themes ── */}
					<SectionCard
						id="themes"
						label="Themes"
						count={edition.themes.length}
						isComplete={completion.themes}
						isExpanded={expandedSections.themes}
						onToggle={() => toggleSection("themes")}
					>
						<ThemesSection themes={edition.themes} onAdd={addTheme} onUpdate={updateTheme} onRemove={removeTheme} />
					</SectionCard>

					{/* ── Speakers ── */}
					<SectionCard
						id="speakers"
						label="Speakers"
						count={edition.keynoteSpeakers.length}
						isComplete={completion.speakers}
						isExpanded={expandedSections.speakers}
						onToggle={() => toggleSection("speakers")}
					>
						<SpeakersSection speakers={edition.keynoteSpeakers} onAdd={addSpeaker} onUpdate={updateSpeaker} onRemove={removeSpeaker} />
					</SectionCard>

					{/* ── Initiatives ── */}
					<SectionCard
						id="initiatives"
						label="Initiatives"
						count={edition.initiatives.length}
						isComplete={completion.initiatives}
						isExpanded={expandedSections.initiatives}
						onToggle={() => toggleSection("initiatives")}
					>
						<InitiativesSection initiatives={edition.initiatives} onAdd={addInitiative} onUpdate={updateInitiative} onRemove={removeInitiative} />
					</SectionCard>

					{/* ── Sponsors ── */}
					<SectionCard
						id="sponsors"
						label="Sponsors"
						count={edition.sponsors.length}
						isComplete={completion.sponsors}
						isExpanded={expandedSections.sponsors}
						onToggle={() => toggleSection("sponsors")}
					>
						<SponsorsSection sponsors={edition.sponsors} onAdd={addSponsor} onUpdate={updateSponsor} onRemove={removeSponsor} />
					</SectionCard>

					{/* ── Gallery ── */}
					<SectionCard
						id="gallery"
						label="Gallery"
						count={edition.gallery.length}
						isComplete={completion.gallery}
						isExpanded={expandedSections.gallery}
						onToggle={() => toggleSection("gallery")}
					>
						<GallerySection gallery={edition.gallery} onAdd={addGalleryItem} onUpdate={updateGalleryItem} onRemove={removeGalleryItem} />
					</SectionCard>

					{/* ── Agenda ── */}
					<SectionCard
						id="agenda"
						label="Agenda"
						count={(edition.agenda ?? []).length}
						isComplete={completion.agenda}
						isExpanded={expandedSections.agenda}
						onToggle={() => toggleSection("agenda")}
					>
						<AgendaSection
							agenda={edition.agenda ?? []}
							onAddDay={addAgendaDay}
							onUpdateDay={updateAgendaDay}
							onRemoveDay={removeAgendaDay}
							onAddItem={addAgendaItem}
							onUpdateItem={updateAgendaItem}
							onRemoveItem={removeAgendaItem}
							onAddSpeaker={addAgendaSpeaker}
							onUpdateSpeaker={updateAgendaSpeaker}
							onRemoveSpeaker={removeAgendaSpeaker}
						/>
					</SectionCard>

					{/* ── Sector Shares ── */}
					<SectionCard
						id="sectorShares"
						label="Sector Shares"
						count={edition.sectorShares.length}
						isComplete={completion.sectorShares}
						isExpanded={expandedSections.sectorShares}
						onToggle={() => toggleSection("sectorShares")}
					>
						<SectorSharesSection sectorShares={edition.sectorShares} onAdd={addSectorShare} onUpdate={updateSectorShare} onRemove={removeSectorShare} />
					</SectionCard>

					{/* ── Videos ── */}
					<SectionCard
						id="videos"
						label="Videos"
						count={(edition.videos ?? []).length}
						isComplete={completion.videos}
						isExpanded={expandedSections.videos}
						onToggle={() => toggleSection("videos")}
					>
						<VideosSection videos={edition.videos ?? []} onAdd={addVideo} onUpdate={updateVideo} onRemove={removeVideo} />
					</SectionCard>
				</div>
			</div>
		</div>
	);
}
