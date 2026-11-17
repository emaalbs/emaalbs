"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminHome, canAccessAdmin, type AdminRole } from "@/lib/admin-access";
import { AdminSessionContext } from "@/components/admin/AdminSession";
import { LayoutDashboard, FileText, CalendarDays, Mail, Users, Shield, LogOut, Menu, X, BookOpen, PanelsTopLeft, Share2, Images, Sparkles, Wallet } from "lucide-react";

const baseNav = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Homepage Banners", href: "/admin/hero-slides", icon: PanelsTopLeft },
	{ label: "Homepage Feature", href: "/admin/home-feature", icon: Sparkles },
	{ label: "Social Media", href: "/admin/social-posts", icon: Share2 },
	{ label: "Gallery Portfolio", href: "/admin/gallery", icon: Images },
	{ label: "Blogs", href: "/admin/blogs", icon: FileText },
	{ label: "Magazines", href: "/admin/magazines", icon: BookOpen },
	{ label: "IBS Editions", href: "/admin/ibs/editions", icon: CalendarDays },
	{ label: "IBS Bookings", href: "/admin/bookings", icon: CalendarDays },
	{ label: "Payments / المدفوعات", href: "/admin/payments", icon: Wallet },
	{ label: "Contacts", href: "/admin/contacts", icon: Mail },
	{ label: "Subscribers", href: "/admin/subscribers", icon: Users },
];

type Me = { id: number; username: string; isSuperAdmin: boolean; role: AdminRole };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [me, setMe] = useState<Me | null>(null);

	useEffect(() => {
		if (pathname === "/admin/login") { setMe(null); return; }
		let active = true;
		setMe(null);
		fetch("/api/admin/me", { credentials: "same-origin", cache: "no-store" })
			.then((r) => (r.ok ? r.json() as Promise<Me> : null))
			.then((data: Me | null) => {
				if (!active) return;
				if (!data) { router.replace("/admin/login"); return; }
				if (!canAccessAdmin(data.role, pathname)) { router.replace(adminHome(data.role)); return; }
				setMe(data);
			})
			.catch(() => { if (active) router.replace("/admin/login"); });
		return () => { active = false; };
	}, [pathname, router]);

	const nav = me ? (me.isSuperAdmin ? [...baseNav, { label: "Users", href: "/admin/users", icon: Shield }] : baseNav)
		.filter(item => canAccessAdmin(me.role, item.href)) : [];

	async function logout() {
		await fetch("/api/admin/logout", { method: "POST" });
		window.location.assign("/admin/login");
	}

	if (pathname === "/admin/login") {
		return <div dir="ltr" className="min-h-screen bg-gray-50">{children}</div>;
	}
	if (!me || !canAccessAdmin(me.role, pathname)) {
		return <div role="status" className="p-8 text-gray-500">Loading… / جارٍ التحقق من الصلاحيات</div>;
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
				<main className="flex-1 overflow-y-auto p-6 lg:p-8"><AdminSessionContext.Provider value={me}>{children}</AdminSessionContext.Provider></main>
			</div>
		</div>
	);
}
