"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Calendar, FileText } from "lucide-react";
import type { Magazine } from "@/data/magazines";

export default function AdminMagazinesPage() {
	const [magazines, setMagazines] = useState<Magazine[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		setLoading(true);
		const res = await fetch("/api/magazines");
		const data = (await res.json()) as Magazine[];
		setMagazines(data);
		setLoading(false);
	}

	useEffect(() => {
		load();
	}, []);

	async function deleteMagazine(slug: string) {
		if (!confirm("Delete this magazine?")) return;
		await fetch(`/api/magazines/${slug}`, { method: "DELETE" });
		load();
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Magazines</h1>
				<Link
					href="/admin/magazines/new"
					className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F]"
				>
					+ New Magazine
				</Link>
			</div>

			{loading ? (
				<div className="text-gray-400">Loading...</div>
			) : magazines.length === 0 ? (
				<div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
					<p className="text-gray-500">No magazines yet.</p>
					<Link href="/admin/magazines/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
						Upload your first magazine
					</Link>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
					{magazines.map((mag) => (
						<div
							key={mag.id}
							className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
						>
							<div className="relative h-40 overflow-hidden bg-gray-100">
								{mag.cover_image ? (
									<img
										src={mag.cover_image}
										alt=""
										className="h-full w-full object-cover transition group-hover:scale-105"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-gray-300">
										No cover
									</div>
								)}
								<div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#01334D]/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
									<FileText className="h-3 w-3" />
									PDF
								</div>
							</div>

							<div className="flex flex-1 flex-col p-4">
								<h3 className="line-clamp-2 text-base font-semibold text-gray-900">{mag.title.en}</h3>
								<p className="mt-1 line-clamp-1 text-sm text-gray-400">{mag.title.ar}</p>
								{mag.date && (
									<div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
										<Calendar className="h-3.5 w-3.5" />
										{mag.date}
									</div>
								)}

								<div className="mt-4 flex items-center gap-2">
									<Link
										href={`/admin/magazines/${mag.slug}`}
										className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
									>
										<Pencil className="h-3.5 w-3.5" />
										Edit
									</Link>
									<a
										href={mag.pdf_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
										title="Preview PDF"
									>
										<FileText className="h-3.5 w-3.5" />
									</a>
									<button
										onClick={() => deleteMagazine(mag.slug)}
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
