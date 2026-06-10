"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { IbsEdition } from "@/data/ibs/types";

export default function AdminIbsEditionsPage() {
	const [editions, setEditions] = useState<IbsEdition[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		setLoading(true);
		const res = await fetch("/api/ibs/editions");
		const data = (await res.json()) as IbsEdition[];
		setEditions(data);
		setLoading(false);
	}

	useEffect(() => {
		load();
	}, []);

	async function deleteEdition(slug: string) {
		if (!confirm("Delete this edition and all its data?")) return;
		await fetch(`/api/ibs/editions/${slug}`, { method: "DELETE" });
		load();
	}

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">IBS Editions</h1>
				<Link
					href="/admin/ibs/editions/new"
					className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F]"
				>
					+ New Edition
				</Link>
			</div>
			{loading ? (
				<div className="text-gray-400">Loading...</div>
			) : editions.length === 0 ? (
				<div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
					<p className="text-gray-500">No IBS editions yet.</p>
					<Link href="/admin/ibs/editions/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
						Create your first edition
					</Link>
				</div>
			) : (
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
					<table className="w-full text-left text-sm text-gray-600">
						<thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
							<tr>
								<th className="px-6 py-3">Title</th>
								<th className="px-6 py-3">Slug</th>
								<th className="px-6 py-3">Year</th>
								<th className="px-6 py-3">Status</th>
								<th className="px-6 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{editions.map((e) => (
								<tr key={e.slug} className="hover:bg-gray-50">
									<td className="px-6 py-3 font-medium text-gray-900">{e.title.en}</td>
									<td className="px-6 py-3">{e.slug}</td>
									<td className="px-6 py-3">{e.year}</td>
									<td className="px-6 py-3">
										<span
											className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
												e.status === "live"
													? "bg-green-100 text-green-700"
													: e.status === "upcoming"
														? "bg-blue-100 text-blue-700"
														: "bg-gray-100 text-gray-600"
											}`}
										>
											{e.status}
										</span>
									</td>
									<td className="px-6 py-3 text-right">
										<Link
											href={`/admin/ibs/editions/${e.slug}`}
											className="mr-4 text-sm font-medium text-blue-600 hover:text-blue-800"
										>
											Edit
										</Link>
										<button
											onClick={() => deleteEdition(e.slug)}
											className="text-sm font-medium text-red-600 hover:text-red-800"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
