"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { Blog, BlogBlock } from "@/data/blogs";
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

function emptyBlog(): Omit<Blog, "id"> {
	return {
		slug: "",
		title: { en: "", ar: "" },
		description: { en: "", ar: "" },
		content: { en: [], ar: [] },
		image: "",
		date: new Date().toISOString().split("T")[0],
		featured: false,
	};
}

function makeEmptyCopy(block: BlogBlock): BlogBlock {
	switch (block.type) {
		case "heading":
			return { type: "heading", text: "" };
		case "paragraph":
			return { type: "paragraph", text: "" };
		case "quote":
			return { type: "quote", text: "" };
		case "highlights":
			return { type: "highlights", items: [] };
		case "image":
			return { type: "image", src: block.src, alt: "" };
		case "gallery":
			return { type: "gallery", images: [...block.images] };
	}
}

export default function BlogEditorPage({ params }: { params: Promise<{ slug: string }> }) {
	const router = useRouter();
	const [slug, setSlug] = useState<string | null>(null);
	const [blog, setBlog] = useState<Omit<Blog, "id">>(emptyBlog());
	const [saving, setSaving] = useState(false);
	const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
	const [slugAuto, setSlugAuto] = useState(true);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		params.then((p) => {
			setSlug(p.slug);
			if (p.slug !== "new") {
				fetch(`/api/blogs/${p.slug}`)
					.then((r) => r.json())
					.then((data) => {
						const b = data as Blog;
						setBlog({
							slug: b.slug,
							title: b.title,
							description: b.description,
							content: b.content,
							image: b.image,
							date: b.date,
							featured: b.featured,
						});
					});
			}
		});
	}, [params]);

	function setField<K extends keyof Omit<Blog, "id">>(field: K, value: Omit<Blog, "id">[K]) {
		setBlog((prev) => ({ ...prev, [field]: value }));
	}

	function addBlock(type: BlogBlock["type"]) {
		const block: BlogBlock =
			type === "heading"
				? { type: "heading", text: "" }
				: type === "paragraph"
					? { type: "paragraph", text: "" }
					: type === "image"
						? { type: "image", src: "", alt: "" }
						: type === "quote"
							? { type: "quote", text: "" }
							: type === "highlights"
								? { type: "highlights", items: [""] }
								: { type: "gallery", images: [""] };
		const otherLocale = activeLocale === "en" ? "ar" : "en";
		setBlog((prev) => ({
			...prev,
			content: {
				...prev.content,
				[activeLocale]: [...prev.content[activeLocale], block],
				[otherLocale]: [...prev.content[otherLocale], makeEmptyCopy(block)],
			},
		}));
	}

	function updateBlock(index: number, block: BlogBlock) {
		setBlog((prev) => {
			const updated = [...prev.content[activeLocale]];
			updated[index] = block;
			return { ...prev, content: { ...prev.content, [activeLocale]: updated } };
		});
	}

	function removeBlock(index: number) {
		setBlog((prev) => {
			const updated = [...prev.content[activeLocale]];
			updated.splice(index, 1);
			return { ...prev, content: { ...prev.content, [activeLocale]: updated } };
		});
	}

	function moveBlock(index: number, dir: number) {
		setBlog((prev) => {
			const updated = [...prev.content[activeLocale]];
			const newIndex = index + dir;
			if (newIndex < 0 || newIndex >= updated.length) return prev;
			[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
			return { ...prev, content: { ...prev.content, [activeLocale]: updated } };
		});
	}

	function hasLocaleContent(locale: "en" | "ar"): boolean {
		return blog.content[locale].some((b) => {
			if (b.type === "heading" || b.type === "paragraph" || b.type === "quote") return b.text.trim().length > 0;
			if (b.type === "image") return b.src.length > 0;
			if (b.type === "highlights") return b.items.length > 0;
			if (b.type === "gallery") return b.images.length > 0;
			return false;
		});
	}

	function validate(): boolean {
		const nextErrors: Record<string, string> = {};
		if (!blog.title.en.trim()) nextErrors.titleEn = "English title is required";
		if (!blog.title.ar.trim()) nextErrors.titleAr = "Arabic title is required";
		if (!blog.description.en.trim()) nextErrors.descriptionEn = "English description is required";
		if (!blog.description.ar.trim()) nextErrors.descriptionAr = "Arabic description is required";
		if (!blog.date) nextErrors.date = "Date is required";
		if (!blog.image) nextErrors.image = "Cover image is required";
		if (!hasLocaleContent("en")) nextErrors.contentEn = "English content cannot be empty";
		if (!hasLocaleContent("ar")) nextErrors.contentAr = "Arabic content cannot be empty";
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}

	function localeErrorCount(locale: "en" | "ar"): number {
		const keys = Object.keys(errors).filter((k) => k.toLowerCase().endsWith(locale));
		return keys.length;
	}

	async function save() {
		if (!validate()) return;
		setSaving(true);
		const url = slug === "new" ? "/api/blogs" : `/api/blogs/${blog.slug}`;
		const method = slug === "new" ? "POST" : "PUT";
		await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(blog),
		});
		setSaving(false);
		router.push("/admin/blogs");
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">
					{slug === "new" ? "New Blog" : "Edit Blog"}
				</h1>
				<div className="flex gap-3">
					<button
						onClick={() => router.push("/admin/blogs")}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={save}
						disabled={saving}
						className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50"
					>
						{saving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>

			<div className="space-y-6">
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-4 flex gap-2">
						{(["en", "ar"] as const).map((loc) => {
							const count = localeErrorCount(loc);
							return (
								<button
									key={loc}
									onClick={() => setActiveLocale(loc)}
									className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition ${
										activeLocale === loc
											? "bg-[#01334D] text-white"
											: "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
									}`}
								>
									{loc.toUpperCase()}
									{count > 0 && (
										<span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
											{count}
										</span>
										)}
								</button>
							);
						})}
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm text-gray-500">
								Title ({activeLocale}) <span className="text-red-500">*</span>
							</label>
							<input
								value={blog.title[activeLocale]}
								onChange={(e) => {
									const value = e.target.value;
									setBlog((prev) => {
										const next = { ...prev, title: { ...prev.title, [activeLocale]: value } };
										if (activeLocale === "en" && slugAuto) {
											next.slug = toSlug(value);
										}
										return next;
									});
									if (errors[`title${activeLocale === "en" ? "En" : "Ar"}`]) {
										setErrors((prev) => { const n = { ...prev }; delete n[`title${activeLocale === "en" ? "En" : "Ar"}`]; return n; });
									}
								}}
								className={`w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 ${
									errors[`title${activeLocale === "en" ? "En" : "Ar"}`] ? "border-red-300 focus:border-red-500" : "border-gray-200"
								}`}
							/>
							{errors[`title${activeLocale === "en" ? "En" : "Ar"}`] && (
								<p className="mt-1 text-xs text-red-500">{errors[`title${activeLocale === "en" ? "En" : "Ar"}`]}</p>
							)}
						</div>
						<div>
							<label className="mb-1 block text-sm text-gray-500">
								Description ({activeLocale}) <span className="text-red-500">*</span>
							</label>
							<textarea
								value={blog.description[activeLocale]}
								onChange={(e) => {
									setBlog((prev) => ({
										...prev,
										description: { ...prev.description, [activeLocale]: e.target.value },
									}));
									if (errors[`description${activeLocale === "en" ? "En" : "Ar"}`]) {
										setErrors((prev) => { const n = { ...prev }; delete n[`description${activeLocale === "en" ? "En" : "Ar"}`]; return n; });
									}
								}}
								rows={3}
								className={`w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 ${
									errors[`description${activeLocale === "en" ? "En" : "Ar"}`] ? "border-red-300 focus:border-red-500" : "border-gray-200"
								}`}
							/>
							{errors[`description${activeLocale === "en" ? "En" : "Ar"}`] && (
								<p className="mt-1 text-xs text-red-500">{errors[`description${activeLocale === "en" ? "En" : "Ar"}`]}</p>
							)}
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm text-gray-500">Date <span className="text-red-500">*</span></label>
							<input
								type="date"
								value={blog.date}
								onChange={(e) => setField("date", e.target.value)}
								className={`w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 ${
									errors.date ? "border-red-300 focus:border-red-500" : "border-gray-200"
								}`}
							/>
							{errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
						</div>
						<div>
							<label className="mb-1 block text-sm text-gray-500">Featured</label>
							<label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 transition hover:bg-gray-50">
								<input
									type="checkbox"
									checked={blog.featured}
									onChange={(e) => setField("featured", e.target.checked)}
									className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
								/>
								<span className="text-sm text-gray-700">Featured post</span>
							</label>
						</div>
					</div>

					<div>
						<label className="mb-1 block text-sm text-gray-400">Slug</label>
						<div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
							<span className="text-sm text-gray-400">{blog.slug || "—"}</span>
						</div>
						<p className="mt-1 text-xs text-gray-400">Auto-generated from the English title</p>
					</div>

					<div>
						<ImageUpload
							value={blog.image}
							onChange={(url) => {
								setField("image", url);
								if (errors.image && url) setErrors((prev) => { const n = { ...prev }; delete n.image; return n; });
							}}
							label={<>Featured Image <span className="text-red-500">*</span></>}
							hint="Recommended: 1200 × 630 (2:1)"
							error={errors.image}
							preset="blog-cover"
							prefix="blogs/"
						/>
					</div>
				</div>

				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					{errors[`content${activeLocale === "en" ? "En" : "Ar"}`] && (
						<div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							<span className="font-semibold">Warning:</span> {errors[`content${activeLocale === "en" ? "En" : "Ar"}`]} — add at least one block with content.
						</div>
					)}
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-semibold text-gray-900">Content Blocks ({activeLocale})</h2>
						<div className="flex gap-2">
							{(["heading", "paragraph", "image", "quote", "highlights", "gallery"] as const).map((t) => (
								<button
									key={t}
									onClick={() => addBlock(t)}
									className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
								>
									+ {t}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-3">
						{blog.content[activeLocale].map((block, i) => (
							<div
								key={i}
								className="rounded-xl border border-gray-200 bg-white p-4"
							>
								<div className="mb-2 flex items-center justify-between">
									<span className="text-xs font-medium uppercase tracking-wider text-gray-400">
										{block.type}
									</span>
									<div className="flex gap-2">
										<button
											onClick={() => moveBlock(i, -1)}
											className="text-xs text-gray-400 hover:text-gray-900"
										>
											↑
										</button>
										<button
											onClick={() => moveBlock(i, 1)}
											className="text-xs text-gray-400 hover:text-gray-900"
										>
											↓
										</button>
										<button
											onClick={() => removeBlock(i)}
											className="text-xs text-red-600 hover:text-red-500"
										>
											×
										</button>
									</div>
								</div>

								{block.type === "heading" && (
									<input
										value={block.text}
										onChange={(e) =>
											updateBlock(i, { ...block, text: e.target.value })
										}
										placeholder="Heading text"
										className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
									/>
								)}
								{block.type === "paragraph" && (
									<textarea
										value={block.text}
										onChange={(e) =>
											updateBlock(i, { ...block, text: e.target.value })
										}
										placeholder="Paragraph text"
										rows={4}
										className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
									/>
								)}
								{block.type === "image" && (
									<div className="grid gap-3 md:grid-cols-2">
										<div>
											<ImageUpload
												value={block.src}
												onChange={(url) => updateBlock(i, { ...block, src: url })}
												hint="Recommended: 800 × 450 (16:9)"
												compact
											/>
										</div>
										<input
											value={block.alt}
											onChange={(e) =>
												updateBlock(i, { ...block, alt: e.target.value })
											}
											placeholder="Alt text"
											className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
										/>
									</div>
								)}
								{block.type === "quote" && (
									<textarea
										value={block.text}
										onChange={(e) =>
											updateBlock(i, { ...block, text: e.target.value })
										}
										placeholder="Quote text"
										rows={3}
										className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
									/>
								)}
								{block.type === "highlights" && (
									<div className="space-y-2">
										{block.items.map((item, idx) => (
											<div key={idx} className="flex gap-2">
												<input
													value={item}
													onChange={(e) => {
														const items = [...block.items];
														items[idx] = e.target.value;
														updateBlock(i, { ...block, items });
													}}
													className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500"
												/>
												<button
													onClick={() => {
														const items = block.items.filter((_, j) => j !== idx);
														updateBlock(i, { ...block, items });
													}}
													className="text-red-600 hover:text-red-500"
												>
													×
												</button>
											</div>
										))}
										<button
											onClick={() =>
												updateBlock(i, { ...block, items: [...block.items, ""] })
											}
											className="text-sm text-blue-600 hover:underline"
										>
											+ Add item
										</button>
									</div>
								)}
								{block.type === "gallery" && (
									<div className="space-y-3">
										{block.images.map((img, idx) => (
											<div key={idx} className="flex items-start gap-2">
												<div className="flex-1">
													<ImageUpload
														value={img}
														onChange={(url) => {
															const images = [...block.images];
															images[idx] = url;
															updateBlock(i, { ...block, images });
														}}
														compact
													/>
												</div>
												<button
													onClick={() => {
														const images = block.images.filter((_, j) => j !== idx);
														updateBlock(i, { ...block, images });
													}}
													className="mt-1 text-red-600 hover:text-red-500"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										))}
										<button
											onClick={() =>
												updateBlock(i, { ...block, images: [...block.images, ""] })
											}
											className="text-sm text-blue-600 hover:underline"
										>
											+ Add image
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
