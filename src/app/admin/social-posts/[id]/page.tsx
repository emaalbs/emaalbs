"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, FilePenLine, Link2, LoaderCircle, Trash2 } from "lucide-react";
import type { SocialPost, SocialPostInput } from "@/data/social-posts";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SocialEmbed } from "@/components/social/SocialEmbed";
import { SocialPostCard } from "@/components/social/SocialPostCard";
import { SocialPlatformBadge } from "@/components/social/SocialPlatformBadge";
import { detectSocialPlatform, getSocialEmbedDescriptor } from "@/lib/social-platforms";

function emptyPost(): SocialPostInput {
	return {
		postUrl: "",
		displayMode: "embed",
		title: { en: "", ar: "" },
		caption: { en: "", ar: "" },
		imageUrl: "",
		postDate: new Date().toISOString().slice(0, 10),
		published: false,
		pinned: false,
		sortOrder: 0,
	};
}

function postToInput(post: SocialPost): SocialPostInput {
	return {
		postUrl: post.postUrl,
		displayMode: post.displayMode,
		title: post.title,
		caption: post.caption,
		imageUrl: post.imageUrl,
		postDate: post.postDate,
		published: post.published,
		pinned: post.pinned,
		sortOrder: post.sortOrder,
	};
}

export default function SocialPostEditor({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const [id, setId] = useState<string | null>(null);
	const [post, setPost] = useState<SocialPostInput>(emptyPost());
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const platform = useMemo(() => detectSocialPlatform(post.postUrl), [post.postUrl]);
	const descriptor = useMemo(() => getSocialEmbedDescriptor(post.postUrl), [post.postUrl]);

	useEffect(() => {
		params.then(async ({ id: value }) => {
			setId(value);
			if (value !== "new") {
				const response = await fetch(`/api/social-posts/${value}`);
				const data = (await response.json()) as SocialPost | { error?: string };
				if (response.ok && "id" in data) setPost(postToInput(data));
				else setError("error" in data ? data.error || "Failed to load post" : "Failed to load post");
			}
			setLoading(false);
		});
	}, [params]);

	function setLocalized(field: "title" | "caption", locale: "en" | "ar", value: string) {
		setPost((current) => ({ ...current, [field]: { ...current[field], [locale]: value } }));
	}

	async function save() {
		setSaving(true);
		setError("");
		setSuccess(false);
		try {
			const response = await fetch(id === "new" ? "/api/social-posts" : `/api/social-posts/${id}`, {
				method: id === "new" ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(post),
			});
			const data = (await response.json()) as { id?: number; error?: string };
			if (!response.ok) throw new Error(data.error || "Failed to save social post");
			setSuccess(true);
			if (id === "new" && data.id) router.replace(`/admin/social-posts/${data.id}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save social post");
		} finally {
			setSaving(false);
		}
	}

	async function remove() {
		if (!id || id === "new" || !confirm("Delete this social post? This cannot be undone.")) return;
		const response = await fetch(`/api/social-posts/${id}`, { method: "DELETE" });
		if (response.ok) router.push("/admin/social-posts");
	}

	if (loading) return <div className="flex items-center gap-2 text-sm text-gray-400"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading post...</div>;

	const previewPost: SocialPost = {
		id: Number(id) || 0,
		platform: platform || "linkedin",
		...post,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};

	return (
		<div className="pb-12">
			<div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-3">
					<button type="button" onClick={() => router.push("/admin/social-posts")} className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50" aria-label="Back">
						<ArrowLeft className="h-4 w-4" />
					</button>
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007F84]">Social Media</p>
						<h1 className="mt-1 text-2xl font-bold text-gray-900">{id === "new" ? "Add social post" : "Edit social post"}</h1>
					</div>
				</div>
				<div className="flex gap-2">
					{id !== "new" ? <button type="button" onClick={() => void remove()} className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</button> : null}
					<button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#01334D] px-5 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50">
						{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{saving ? "Saving..." : "Save post"}
					</button>
				</div>
			</div>

			{error ? <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
			{success ? <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Saved. Your preview is ready to review.</div> : null}

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
				<div className="space-y-6">
					<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-center gap-2"><Link2 className="h-5 w-5 text-[#007F84]" /><h2 className="font-bold text-gray-900">Post source</h2></div>
						<p className="mt-1 text-sm text-gray-500">Paste a public post URL. The platform is detected automatically; no token or account login is needed.</p>
						<label className="mt-5 block text-sm font-medium text-gray-700">Public post URL <span className="text-red-500">*</span></label>
						<input value={post.postUrl} onChange={(event) => { setPost((current) => ({ ...current, postUrl: event.target.value })); setSuccess(false); }} placeholder="https://www.linkedin.com/posts/..." dir="ltr" className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#007F84]/20 ${post.postUrl && !platform ? "border-red-300" : "border-gray-200 focus:border-[#007F84]"}`} />
						<div className="mt-3 flex flex-wrap items-center gap-3">
							{platform ? <SocialPlatformBadge platform={platform} /> : <span className="text-xs text-gray-400">Supported: LinkedIn, X, Instagram, YouTube, Facebook</span>}
							{post.postUrl && descriptor ? <span className={`text-xs font-semibold ${descriptor.supported ? "text-emerald-600" : "text-red-600"}`}>{descriptor.supported ? "Embed link recognized" : descriptor.reason}</span> : null}
						</div>
					</section>

					<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-center gap-2"><FilePenLine className="h-5 w-5 text-[#007F84]" /><h2 className="font-bold text-gray-900">Display style</h2></div>
						<div className="mt-5 grid gap-3 sm:grid-cols-2">
							<button type="button" onClick={() => setPost((current) => ({ ...current, displayMode: "embed" }))} className={`rounded-xl border p-4 text-left transition ${post.displayMode === "embed" ? "border-[#007F84] bg-[#007F84]/5 ring-2 ring-[#007F84]/10" : "border-gray-200 hover:border-gray-300"}`}>
								<strong className="block text-sm text-gray-900">Official embed</strong><span className="mt-1 block text-xs leading-5 text-gray-500">Use only the link. The platform supplies the original post details.</span>
							</button>
							<button type="button" onClick={() => setPost((current) => ({ ...current, displayMode: "custom" }))} className={`rounded-xl border p-4 text-left transition ${post.displayMode === "custom" ? "border-[#007F84] bg-[#007F84]/5 ring-2 ring-[#007F84]/10" : "border-gray-200 hover:border-gray-300"}`}>
								<strong className="block text-sm text-gray-900">Custom card</strong><span className="mt-1 block text-xs leading-5 text-gray-500">Upload your own image and edit all Arabic and English copy.</span>
							</button>
						</div>
					</section>

					<section className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${post.displayMode === "embed" ? "opacity-70" : ""}`}>
						<div className="flex items-center justify-between gap-4"><div><h2 className="font-bold text-gray-900">Custom content</h2><p className="mt-1 text-sm text-gray-500">Editable content used by the custom card and as a fallback if an embed becomes unavailable.</p></div>{post.displayMode === "embed" ? <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">Optional</span> : null}</div>
						<div className="mt-6 space-y-6">
							<ImageUpload value={post.imageUrl} onChange={(imageUrl) => setPost((current) => ({ ...current, imageUrl }))} label="Post image" hint="Upload, replace, or remove the image at any time." preset="blog-cover" prefix="social/" />
							<BilingualField label="Title" enValue={post.title.en} arValue={post.title.ar} onEnChange={(value) => setLocalized("title", "en", value)} onArChange={(value) => setLocalized("title", "ar", value)} placeholderEn="English title" placeholderAr="العنوان بالعربية" />
							<BilingualField label="Caption / post text" multiline rows={7} enValue={post.caption.en} arValue={post.caption.ar} onEnChange={(value) => setLocalized("caption", "en", value)} onArChange={(value) => setLocalized("caption", "ar", value)} placeholderEn="English post text" placeholderAr="نص المنشور بالعربية" />
						</div>
					</section>

					<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="font-bold text-gray-900">Publishing & order</h2>
						<div className="mt-5 grid gap-4 sm:grid-cols-2">
							<label className="text-sm font-medium text-gray-700">Post date<input type="date" value={post.postDate} onChange={(event) => setPost((current) => ({ ...current, postDate: event.target.value }))} className="mt-2 block w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#007F84]" /></label>
							<label className="text-sm font-medium text-gray-700">Sort order<input type="number" value={post.sortOrder} onChange={(event) => setPost((current) => ({ ...current, sortOrder: Number(event.target.value) || 0 }))} className="mt-2 block w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#007F84]" /></label>
						</div>
						<div className="mt-5 grid gap-3 sm:grid-cols-2">
							<label className="flex min-h-12 cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700"><span>Published on website</span><input type="checkbox" checked={post.published} onChange={(event) => setPost((current) => ({ ...current, published: event.target.checked }))} className="h-5 w-5 accent-[#007F84]" /></label>
							<label className="flex min-h-12 cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700"><span>Pin to the top</span><input type="checkbox" checked={post.pinned} onChange={(event) => setPost((current) => ({ ...current, pinned: event.target.checked }))} className="h-5 w-5 accent-[#007F84]" /></label>
						</div>
					</section>
				</div>

				<aside className="xl:sticky xl:top-6 xl:self-start">
					<div className="rounded-2xl border border-gray-200 bg-[#F5F7F8] p-4 shadow-sm sm:p-5">
						<div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#007F84]">Live preview</p><p className="mt-1 text-sm text-gray-500">This is how the post will appear.</p></div>{post.postUrl ? <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white text-gray-600 shadow-sm" aria-label="Open original"><ExternalLink className="h-4 w-4" /></a> : null}</div>
						{platform && post.postUrl && descriptor?.supported ? (
							post.displayMode === "embed" ? <SocialEmbed url={post.postUrl} platform={platform} locale="en" compact /> : <SocialPostCard post={previewPost} locale="en" />
						) : (
							<div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center"><div><Link2 className="mx-auto h-8 w-8 text-gray-300" /><p className="mt-3 text-sm text-gray-500">Paste a supported public post URL to see the preview.</p></div></div>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
}
