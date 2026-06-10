"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, CalendarDays, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
	const [stats, setStats] = useState({ blogs: 0, editions: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const [blogsRes, editionsRes] = await Promise.all([
					fetch("/api/blogs"),
					fetch("/api/ibs/editions"),
				]);
				const blogs = (await blogsRes.json()) as unknown[];
				const editions = (await editionsRes.json()) as unknown[];
				setStats({ blogs: blogs.length, editions: editions.length });
			} catch {
				// ignore
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	if (loading) return <div className="text-gray-400">Loading...</div>;

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

			{/* Stats cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
							<FileText className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<div className="text-sm text-gray-500">Total Blogs</div>
							<div className="text-2xl font-bold text-gray-900">{stats.blogs}</div>
						</div>
					</div>
				</div>
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
							<CalendarDays className="h-5 w-5 text-amber-600" />
						</div>
						<div>
							<div className="text-sm text-gray-500">IBS Editions</div>
							<div className="text-2xl font-bold text-gray-900">{stats.editions}</div>
						</div>
					</div>
				</div>
			</div>

			{/* Quick actions */}
			<h2 className="mt-8 mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
			<div className="grid gap-4 sm:grid-cols-2">
				<Link
					href="/admin/blogs/new"
					className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
				>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
							<FileText className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<div className="font-medium text-gray-900">Create Blog Post</div>
							<div className="text-sm text-gray-500">Write a new article</div>
						</div>
					</div>
					<ArrowRight className="h-5 w-5 text-gray-400" />
				</Link>
				<Link
					href="/admin/ibs/editions/new"
					className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
				>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
							<CalendarDays className="h-5 w-5 text-amber-600" />
						</div>
						<div>
							<div className="font-medium text-gray-900">Create IBS Edition</div>
							<div className="text-sm text-gray-500">Add a new summit edition</div>
						</div>
					</div>
					<ArrowRight className="h-5 w-5 text-gray-400" />
				</Link>
			</div>
		</div>
	);
}
