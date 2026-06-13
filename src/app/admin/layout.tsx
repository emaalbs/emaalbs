"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, CalendarDays, Mail, Users, Shield, LogOut, Menu, X, BookOpen } from "lucide-react";

const baseNav = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Blogs", href: "/admin/blogs", icon: FileText },
	{ label: "Magazines", href: "/admin/magazines", icon: BookOpen },
	{ label: "IBS Editions", href: "/admin/ibs/editions", icon: CalendarDays },
	{ label: "Contacts", href: "/admin/contacts", icon: Mail },
	{ label: "Subscribers", href: "/admin/subscribers", icon: Users },
];

type Me = { id: number; username: string; isSuperAdmin: boolean };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [me, setMe] = useState<Me | null>(null);

	useEffect(() => {
		fetch("/api/admin/me", { credentials: "same-origin" })
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => setMe(data as Me))
			.catch(() => setMe(null));
	}, []);

	const nav = me?.isSuperAdmin ? [...baseNav, { label: "Users", href: "/admin/users", icon: Shield }] : baseNav;

	async function logout() {
		await fetch("/api/admin/logout", { method: "POST" });
		router.push("/admin/login");
	}

	if (pathname === "/admin/login") {
		return <div dir="ltr" className="min-h-screen bg-gray-50">{children}</div>;
	}

	return (
		<div dir="ltr" className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex h-16 items-center border-b border-gray-200 px-6">
					<span className="text-lg font-bold text-[#01334D]">
						EMAAL Admin
					</span>
					<button
						onClick={() => setSidebarOpen(false)}
						className="ml-auto text-gray-400 hover:text-gray-600 lg:hidden"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<nav className="space-y-1 px-3 py-4">
					{nav.map((item) => {
						const Icon = item.icon;
						const active =
							item.href === "/admin"
								? pathname === "/admin"
								: pathname === item.href || pathname?.startsWith(item.href + "/");
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
									active
										? "bg-[#01334D] text-white"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
								}`}
							>
								<Icon className="h-4 w-4" />
								{item.label}
							</Link>
						);
					})}
				</nav>
				<div className="absolute bottom-0 w-full border-t border-gray-200 px-3 py-4">
					<button
						onClick={logout}
						className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
					>
						<LogOut className="h-4 w-4" />
						Logout
					</button>
				</div>
			</aside>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Main content */}
			<div className="flex flex-1 flex-col overflow-hidden">
				<header className="flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 lg:px-8">
					<div className="flex items-center gap-4">
						<button
							onClick={() => setSidebarOpen(true)}
							className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
						>
							<Menu className="h-5 w-5" />
						</button>
						<span className="text-sm font-medium text-gray-500">
							{nav.find((n) => pathname === n.href || pathname?.startsWith(n.href + "/"))?.label || "Dashboard"}
						</span>
					</div>
					{me && (
						<span className="text-sm font-medium text-gray-700">
							{me.isSuperAdmin && <span className="mr-1 text-amber-500">★</span>}
							{me.username}
						</span>
					)}
				</header>
				<main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
