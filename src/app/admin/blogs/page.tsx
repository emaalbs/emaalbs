"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Pencil, Trash2, Calendar } from "lucide-react";
import type { Blog } from "@/data/blogs";

export default function AdminBlogsPage() {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		setLoading(true);
		const res = await fetch("/api/blogs");
		const data = (await res.json()) as Blog[];
		setBlogs(data);
		setLoading(false);
	}

	useEffect(() => {
		load();
	}, []);

	async function deleteBlog(slug: string) {
		if (!confirm("Delete this blog?")) return;
		await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
		load();
	}

	async function toggleFeatured(blog: Blog) {
		const next = !blog.featured;
		await fetch(`/api/blogs/${blog.slug}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ featured: next }),
		});
		load();
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
				<Link
					href="/admin/blogs/new"
					className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F]"
				>
					+ New Blog
				</Link>
			</div>

			{loading ? (
				<div className="text-gray-400">Loading...</div>
			) : blogs.length === 0 ? (
				<div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
					<p className="text-gray-500">No blog posts yet.</p>
					<Link href="/admin/blogs/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
						Create your first post
					</Link>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
					{blogs.map((blog) => (
						<div
							key={blog.id}
							className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
								blog.featured ? "border-amber-300 ring-1 ring-amber-200" : "border-gray-200"
							}`}
						>
							<div className="relative h-40 overflow-hidden bg-gray-100">
								{blog.image ? (
									<img
										src={blog.image}
										alt=""
										className="h-full w-full object-cover transition group-hover:scale-105"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-gray-300">
										No image
									</div>
								)}
								{blog.featured && (
									<div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-[#01334D] shadow-sm">
										<Star className="h-3 w-3 fill-current" />
										Featured
									</div>
								)}
								<button
									onClick={() => toggleFeatured(blog)}
									className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition ${
										blog.featured
											? "bg-amber-400 text-[#01334D] hover:bg-amber-500"
											: "bg-white/90 text-gray-400 hover:text-amber-500"
									}`}
									title={blog.featured ? "Unfeature" : "Set as featured"}
								>
									<Star className={`h-4 w-4 ${blog.featured ? "fill-current" : ""}`} />
								</button>
							</div>

							<div className="flex flex-1 flex-col p-4">
								<h3 className="line-clamp-2 text-base font-semibold text-gray-900">{blog.title.en}</h3>
								<p className="mt-1 line-clamp-2 text-sm text-gray-500">{blog.description.en}</p>
								<div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
									<Calendar className="h-3.5 w-3.5" />
									{blog.date}
								</div>

								<div className="mt-4 flex items-center gap-2">
									<Link
										href={`/admin/blogs/${blog.slug}`}
										className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
									>
										<Pencil className="h-3.5 w-3.5" />
										Edit
									</Link>
									<button
										onClick={() => deleteBlog(blog.slug)}
										className="inline-flex items-center justify-center rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
