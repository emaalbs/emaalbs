"use client";

import { useEffect, useState } from "react";
import { Mail, User, Building, Phone, Calendar, Search, X, Eye } from "lucide-react";

type Contact = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	company: string | null;
	message: string;
	subject: string;
	created_at: number;
};

export default function ContactsPage() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<Contact | null>(null);

	useEffect(() => {
		async function load() {
			try {
				const res = await fetch("/api/contact");
				if (res.ok) {
					const data = (await res.json()) as Contact[];
					setContacts(data);
				}
			} catch {
				// ignore
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	const filtered = contacts.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase()) ||
			c.message.toLowerCase().includes(search.toLowerCase())
	);

	if (loading) return <div className="text-gray-400">Loading contacts...</div>;

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
				<div className="relative max-w-sm">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search contacts..."
						className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
					/>
				</div>
			</div>

			<div className="rounded-xl border border-gray-200 bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500">
								<th className="px-4 py-3 font-medium">Name</th>
								<th className="px-4 py-3 font-medium">Email</th>
								<th className="px-4 py-3 font-medium">Phone</th>
								<th className="px-4 py-3 font-medium">Company</th>
								<th className="px-4 py-3 font-medium">Subject</th>
								<th className="px-4 py-3 font-medium">Message</th>
								<th className="px-4 py-3 font-medium">Date</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-4 py-8 text-center text-gray-400">
										No contacts found.
									</td>
								</tr>
							) : (
								filtered.map((c) => (
									<tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<User className="h-3.5 w-3.5 text-gray-400" />
												<span className="font-medium text-gray-900">{c.name}</span>
											</div>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<Mail className="h-3.5 w-3.5 text-gray-400" />
												<a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">
													{c.email}
												</a>
											</div>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<Phone className="h-3.5 w-3.5 text-gray-400" />
												<span className="text-gray-600">{c.phone || "—"}</span>
											</div>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<Building className="h-3.5 w-3.5 text-gray-400" />
												<span className="text-gray-600">{c.company || "—"}</span>
											</div>
										</td>
										<td className="px-4 py-3">
											<span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
												{c.subject}
											</span>
										</td>
										<td className="max-w-xs px-4 py-3">
											<button
												onClick={() => setSelected(c)}
												className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
											>
												<Eye className="h-3 w-3" />
												View
											</button>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2 text-gray-500">
												<Calendar className="h-3.5 w-3.5" />
												<span>
													{new Date(c.created_at).toLocaleDateString()}
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

			{/* Modal */}
			{selected && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-lg">
						<div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
							<h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
							<button
								onClick={() => setSelected(null)}
								className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<div className="space-y-4 px-6 py-5">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<div className="text-xs font-medium uppercase tracking-wider text-gray-400">Name</div>
									<div className="mt-0.5 text-sm font-medium text-gray-900">{selected.name}</div>
								</div>
								<div>
									<div className="text-xs font-medium uppercase tracking-wider text-gray-400">Email</div>
									<a href={`mailto:${selected.email}`} className="mt-0.5 block text-sm text-blue-600 hover:underline">
										{selected.email}
									</a>
								</div>
								<div>
									<div className="text-xs font-medium uppercase tracking-wider text-gray-400">Phone</div>
									<div className="mt-0.5 text-sm text-gray-700">{selected.phone || "—"}</div>
								</div>
								<div>
									<div className="text-xs font-medium uppercase tracking-wider text-gray-400">Company</div>
									<div className="mt-0.5 text-sm text-gray-700">{selected.company || "—"}</div>
								</div>
							</div>
							<div>
								<div className="text-xs font-medium uppercase tracking-wider text-gray-400">Subject</div>
								<span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
									{selected.subject}
								</span>
							</div>
							<div>
								<div className="text-xs font-medium uppercase tracking-wider text-gray-400">Date</div>
								<div className="mt-0.5 text-sm text-gray-700">
									{new Date(selected.created_at).toLocaleString()}
								</div>
							</div>
							<div>
								<div className="text-xs font-medium uppercase tracking-wider text-gray-400">Message</div>
								<div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm leading-relaxed text-gray-800">
									{selected.message}
								</div>
							</div>
						</div>
						<div className="border-t border-gray-100 px-6 py-4">
							<button
								onClick={() => setSelected(null)}
								className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
