"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Eye, EyeOff, Pencil, Pin, Plus, Trash2 } from "lucide-react";
import type { SocialPost, SocialPostInput } from "@/data/social-posts";
import { SocialPlatformBadge } from "@/components/social/SocialPlatformBadge";

function toInput(post: SocialPost, changes: Partial<SocialPostInput> = {}): SocialPostInput {
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
		...changes,
	};
}

export default function AdminSocialPostsPage() {
	const [posts, setPosts] = useState<SocialPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	async function load() {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/social-posts?admin=1");
			const data = (await response.json()) as SocialPost[] | { error?: string };
			if (!response.ok || !Array.isArray(data)) throw new Error("error" in data ? data.error : "Failed to load social posts");
			setPosts(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load social posts");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => { void load(); }, []);

	async function togglePublished(post: SocialPost) {
		const response = await fetch(`/api/social-posts/${post.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(toInput(post, { published: !post.published })),
		});
		if (response.ok) await load();
	}

	async function remove(post: SocialPost) {
		if (!confirm("Delete this social post? This cannot be undone.")) return;
		const response = await fetch(`/api/social-posts/${post.id}`, { method: "DELETE" });
		if (response.ok) await load();
	}

	return (
		<div>
			<div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007F84]">Content Hub</p>
					<h1 className="mt-2 text-3xl font-bold text-gray-900">Social Media</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Add a public post link for an official embed, or build a fully editable card with your own image and bilingual copy.</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<a href="/en/social" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#007F84]/40 hover:text-[#01334D]">
						<ExternalLink className="h-4 w-4" /> Preview page
					</a>
					<Link href="/admin/social-posts/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#01334D] px-4 text-sm font-semibold text-white transition hover:bg-[#011E2F]">
						<Plus className="h-4 w-4" /> Add post
					</Link>
				</div>
			</div>

			{error ? <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

			{loading ? (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white" />)}</div>
			) : posts.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
					<h2 className="font-semibold text-gray-900">No social posts yet</h2>
					<p className="mt-2 text-sm text-gray-500">Paste the first public post link to build your social hub.</p>
					<Link href="/admin/social-posts/new" className="mt-4 inline-flex text-sm font-bold text-[#007F84] hover:underline">Add first post</Link>
				</div>
			) : (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{posts.map((post) => {
						const title = post.title.en || post.title.ar || `${post.platform} official embed`;
						return (
							<article key={post.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none">
								<div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-[#011E2F] to-[#007F84]">
									{post.imageUrl ? <img src={post.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <span className="text-6xl font-black uppercase text-white/10">{post.platform.slice(0, 2)}</span>}
									<div className="absolute inset-0 bg-gradient-to-t from-[#011E2F]/75 via-transparent to-transparent" />
									<div className="absolute inset-x-3 top-3 flex items-center justify-between gap-3">
										<SocialPlatformBadge platform={post.platform} compact />
										<span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${post.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
											{post.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{post.published ? "Published" : "Draft"}
										</span>
									</div>
									<div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
										<span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">{post.displayMode}</span>
										{post.pinned ? <Pin className="h-4 w-4 text-[#F4C430]" /> : null}
									</div>
								</div>
								<div className="p-5">
									<h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-gray-900">{title}</h2>
									<p className="mt-2 truncate text-xs text-gray-400" dir="ltr">{post.postUrl}</p>
									<div className="mt-5 flex items-center gap-2">
										<Link href={`/admin/social-posts/${post.id}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:border-[#007F84]/40 hover:bg-[#007F84]/5">
											<Pencil className="h-4 w-4" /> Edit
										</Link>
										<button type="button" onClick={() => void togglePublished(post)} className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50" title={post.published ? "Move to draft" : "Publish"}>
											{post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
										<button type="button" onClick={() => void remove(post)} className="grid h-10 w-10 place-items-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50" title="Delete">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</div>
	);
}
