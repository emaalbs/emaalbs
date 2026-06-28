"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, Lightbulb, Rocket, HeartHandshake, Images, Play } from "lucide-react";

const navItems = [
	{ id: "themes", icon: Lightbulb, label: { en: "Themes", ar: "المواضيع" } },
	{ id: "agenda", icon: Calendar, label: { en: "Agenda", ar: "الأجندة" } },
	{ id: "speakers", icon: Users, label: { en: "Speakers", ar: "المتحدثون" } },
	{ id: "initiatives", icon: Rocket, label: { en: "Initiatives", ar: "المبادرات" } },
	{ id: "sponsors", icon: HeartHandshake, label: { en: "Sponsors", ar: "الرعاة" } },
	{ id: "videos", icon: Play, label: { en: "Videos", ar: "الفيديوهات" } },
	{ id: "gallery", icon: Images, label: { en: "Gallery", ar: "المعرض" } },
];

function getTop(el: HTMLElement) {
	return el.getBoundingClientRect().top + window.scrollY;
}

export function EditionQuickNav({ locale }: { locale: "en" | "ar" }) {
	const [active, setActive] = useState<string>("");
	const [visibleIds, setVisibleIds] = useState<string[]>([]);
	const isAr = locale === "ar";

	useEffect(() => {
		// Determine which sections are in the DOM on mount
		const ids = navItems.map((item) => item.id).filter((id) => document.getElementById(id) !== null);
		setVisibleIds(ids);

		const handle = () => {
			const offset = window.scrollY + window.innerHeight * 0.35;
			for (let i = navItems.length - 1; i >= 0; i--) {
				const id = navItems[i].id;
				if (!ids.includes(id)) continue;
				const el = document.getElementById(id);
				if (el && getTop(el) <= offset) {
					setActive(id);
					return;
				}
			}
			setActive("");
		};
		window.addEventListener("scroll", handle);
		handle();
		return () => window.removeEventListener("scroll", handle);
	}, []);

	const scrollTo = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	if (visibleIds.length === 0) return null;

	return (
		<nav
			className={`fixed bottom-6 z-50 flex gap-2 rounded-full border border-white/10 bg-[var(--color-navy)]/90 px-3 py-2 shadow-[0_12px_40px_rgba(1,30,47,0.45)] backdrop-blur-md transition-transform duration-300 ${
				isAr ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-1/2"
			}`}
		>
			{navItems.filter((item) => visibleIds.includes(item.id)).map((item) => {
				const Icon = item.icon;
				const isActive = active === item.id;
				return (
					<button
						key={item.id}
						onClick={() => scrollTo(item.id)}
						className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
							isActive
								? "bg-[var(--color-gold)] text-[var(--color-navy)]"
								: "text-white/70 hover:bg-white/10 hover:text-white"
						}`}
					>
						<Icon size={14} />
						<span className="hidden sm:inline">{item.label[locale]}</span>
					</button>
				);
			})}
		</nav>
	);
}
