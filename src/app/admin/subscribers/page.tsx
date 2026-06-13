"use client";

import { useEffect, useState } from "react";
import { Mail, Calendar, Search } from "lucide-react";

type Subscriber = {
	id: number;
	email: string;
	created_at: number;
};

export default function SubscribersPage() {
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		async function load() {
			try {
				const res = await fetch("/api/subscribers");
				if (res.ok) {
					const data = (await res.json()) as Subscriber[];
					setSubscribers(data);
				}
			} catch {
				// ignore
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	const filtered = subscribers.filter((s) =>
		s.email.toLowerCase().includes(search.toLowerCase())
	);

	if (loading) return <div className="text-gray-400">Loading subscribers...</div>;

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
				<div className="relative max-w-sm">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search emails..."
						className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
					/>
				</div>
			</div>

			<div className="rounded-xl border border-gray-200 bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500">
								<th className="px-4 py-3 font-medium">Email</th>
								<th className="px-4 py-3 font-medium">Date</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={2} className="px-4 py-8 text-center text-gray-400">
										No subscribers found.
									</td>
								</tr>
							) : (
								filtered.map((s) => (
									<tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<Mail className="h-3.5 w-3.5 text-gray-400" />
												<a href={`mailto:${s.email}`} className="font-medium text-blue-600 hover:underline">
													{s.email}
												</a>
											</div>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2 text-gray-500">
												<Calendar className="h-3.5 w-3.5" />
												<span>
													{new Date(s.created_at).toLocaleDateString()}
												</span>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
