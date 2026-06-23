"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown, Calendar, Users, Lightbulb, Rocket, HeartHandshake, Images } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";
import {
	CloseIcon,
	GlobeIcon,
	MenuIcon,
} from "@/components/ui/icons";

import { useI18n } from "@/i18n/provider";
import { getEditionsSync, ibsOverview } from "@/data/ibs";

export function Header({ forceLight }: { forceLight?: boolean } = {}) {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { locale, t, toggleLanguage } = useI18n();
	const isAr = locale === "ar";
	const pathname = usePathname();
	const router = useRouter();

	function handleToggleLanguage() {
		const newLocale = locale === "en" ? "ar" : "en";
		const newPath = pathname.replace(new RegExp(`^/${locale}(/|$)`), `/${newLocale}$1`);
		toggleLanguage();
		startTransition(() => {
			router.push(newPath);
		});
	}

	const [editions, setEditions] = useState<ReturnType<typeof getEditionsSync>>(getEditionsSync);
	useEffect(() => {
		fetch("/api/ibs/editions")
			.then((r) => r.ok ? r.json() : null)
			.then((data) => { if (Array.isArray(data) && data.length > 0) setEditions(data); })
			.catch(() => {});
	}, []);
	const [ibsOpen, setIbsOpen] = useState(false);
	const [ibsMobileOpen, setIbsMobileOpen] = useState(false);
	const [hoveredEdition, setHoveredEdition] = useState<string | null>(null);
	const ibsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const ibsRef = useRef<HTMLDivElement | null>(null);

	const quickSections = [
		{ id: "agenda", icon: Calendar, label: { en: "Agenda", ar: "الأجندة" } },
		{ id: "themes", icon: Lightbulb, label: { en: "Themes", ar: "المواضيع" } },
		{ id: "speakers", icon: Users, label: { en: "Speakers", ar: "المتحدثون" } },
		{ id: "initiatives", icon: Rocket, label: { en: "Initiatives", ar: "المبادرات" } },
		{ id: "sponsors", icon: HeartHandshake, label: { en: "Sponsors", ar: "الرعاة" } },
		{ id: "gallery", icon: Images, label: { en: "Gallery", ar: "المعرض" } },
	];
	const openIbs = () => {
		if (ibsTimeout.current) clearTimeout(ibsTimeout.current);
		setIbsOpen(true);
	};
	const closeIbsLater = () => {
		if (ibsTimeout.current) clearTimeout(ibsTimeout.current);
		ibsTimeout.current = setTimeout(() => setIbsOpen(false), 150);
	};
	useEffect(() => {
		if (!ibsOpen) return;
		const onDoc = (e: MouseEvent) => {
			if (
				ibsRef.current &&
				!ibsRef.current.contains(e.target as Node)
			)
				setIbsOpen(false);
		};
		const onEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIbsOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		document.addEventListener("keydown", onEsc);
		return () => {
			document.removeEventListener("mousedown", onDoc);
			document.removeEventListener("keydown", onEsc);
		};
	}, [ibsOpen]);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);

	const onLight = forceLight || scrolled;

	return (
		<>
			<header
				className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
					onLight
						? "bg-white/90 backdrop-blur-md border-b border-[var(--color-line)] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
						: "bg-transparent border-b border-transparent"
				}`}
			>
			<Container>
				<div
					className={`flex items-center justify-between transition-all duration-300 ${
						onLight ? "h-[68px]" : "h-[80px]"
					}`}
				>
					<Link href={`/${locale}`} className="shrink-0">
						<Logo
							tone={onLight ? "light" : "dark"}
							height={onLight ? 32 : 36}
						/>
					</Link>

					<nav className="hidden lg:flex items-center gap-9">
						{t.header.nav.map((item) => {
							const isIbs =
								item.href === "/ibs" || item.href === "#ibs";
							const isActive = item.href === "/" ? pathname === `/${locale}` : pathname === `/${locale}${item.href}`;
							if (isIbs) {
								const isActiveIbs = pathname.startsWith(`/${locale}/ibs`);
								return (
									<div
										key="ibs"
										ref={ibsRef}
										className="relative"
										onMouseEnter={openIbs}
										onMouseLeave={closeIbsLater}
									>
										<div className="inline-flex items-center">
											<Link
												href={`/${locale}/ibs`}
												className={`group relative text-[13.5px] font-medium transition-colors ${
													onLight
														? isActiveIbs
															? "text-[var(--color-navy)]"
															: "text-[var(--color-ink)] hover:text-[var(--color-navy)]"
														: isActiveIbs
															? "text-white"
															: "text-white/85 hover:text-white"
												}`}
												onFocus={openIbs}
											>
												{item.label}
												<span
													className={`absolute -bottom-1.5 h-[2px] bg-[var(--color-teal)] transition-all duration-300 ${
														isActiveIbs ? "w-full" : "w-0 group-hover:w-full"
													} ${
														isAr ? "right-0" : "left-0"
													}`}
												/>
											</Link>
											<button
												type="button"
												aria-label="Toggle IBS editions menu"
												aria-expanded={ibsOpen}
												onClick={() => setIbsOpen((v) => !v)}
												className={`ms-1 grid h-5 w-5 place-items-center rounded transition-colors ${
													onLight
														? "text-[var(--color-slate)] hover:text-[var(--color-navy)]"
														: "text-white/70 hover:text-white"
												}`}
											>
												<ChevronDown
													className={`h-3.5 w-3.5 transition-transform ${
														ibsOpen ? "rotate-180" : ""
													}`}
												/>
											</button>
										</div>
										<div
											className={`absolute top-full ${
												isAr ? "right-0" : "left-0"
											} z-[60] pt-3 min-w-[300px] origin-top transition-all duration-200 ${
												ibsOpen
													? "opacity-100 translate-y-0 pointer-events-auto"
													: "opacity-0 -translate-y-1 pointer-events-none"
											}`}
										>
										<div className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-white shadow-[0_18px_40px_rgba(1,51,77,0.15)]">
											<Link
												href={`/${locale}/ibs`}
												className="flex items-start gap-3 rounded-t-xl px-5 py-4 hover:bg-[var(--color-warm)]"
											>
												<span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
												<span>
													<span className="block text-[13.5px] font-semibold text-[var(--color-ink)]">
														{isAr ? "عن القمة" : "About IBS"}
													</span>
													<span className="mt-0.5 block text-[12px] text-[var(--color-slate)]">
														{isAr
															? "ما هي قمة الأعمال العراقية"
															: "What the Iraq Business Summit is"}
													</span>
												</span>
											</Link>
											<div className="border-t border-[var(--color-line)]">
												<div className="px-5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-slate)]">
													{ibsOverview.editions.overline[locale]}
												</div>
												{editions.map((e) => (
													<div
														key={e.slug}
														className="relative"
														onMouseEnter={() => setHoveredEdition(e.slug)}
														onMouseLeave={() => setHoveredEdition(null)}
													>
														<Link
															href={`/${locale}/ibs/${e.slug}`}
															className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[var(--color-warm)]"
														>
															<span className="text-[13.5px] font-medium text-[var(--color-ink)]">
																{e.title[locale]}
															</span>
															<span
																className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
																	e.status === "upcoming"
																		? "bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)]"
																		: "bg-[var(--color-line)] text-[var(--color-slate)]"
																}`}
															>
																{e.year}
															</span>
														</Link>
														<div
															className={`flex flex-wrap gap-1.5 px-5 pb-3 transition-all ${
																hoveredEdition === e.slug
																	? "opacity-100 max-h-40"
																	: "opacity-0 max-h-0 overflow-hidden pointer-events-none"
															}`}
														>
															{quickSections.map((q) => {
																const Icon = q.icon;
																return (
																	<Link
																		key={q.id}
																		href={`/${locale}/ibs/${e.slug}#${q.id}`}
																		className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--color-warm)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-navy)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-deep)] transition-colors"
																	>
																		<Icon size={11} />
																		{q.label[locale]}
																	</Link>
																);
															})}
														</div>
													</div>
												))}
											</div>
										</div>
										</div>
									</div>
								);
							}
							return (
								<Link
									key={item.href}
									href={`/${locale}${item.href}`}
									className={`group relative text-[13.5px] font-medium transition-colors ${
										onLight
											? isActive
												? "text-[var(--color-navy)]"
												: "text-[var(--color-ink)] hover:text-[var(--color-navy)]"
											: isActive
												? "text-white"
												: "text-white/85 hover:text-white"
									}`}
								>
									{item.label}
									<span
										className={`absolute -bottom-1.5 h-[2px] bg-[var(--color-teal)] transition-all duration-300 ${
											isActive ? "w-full" : "w-0 group-hover:w-full"
										} ${
											isAr ? "right-0" : "left-0"
										}`}
									/>
								</Link>
							);
						})}
					</nav>

					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={handleToggleLanguage}
							className={`hidden sm:inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wider px-2.5 h-9 rounded-md transition-colors ${
								onLight
									? "text-[var(--color-slate)] hover:text-[var(--color-navy)]"
									: "text-white/70 hover:text-white"
							}`}
							aria-label={t.header.langToggleLabel}
						>
							<GlobeIcon className="h-4 w-4" />
							{isAr ? "EN" : "AR"}
						</button>

						<div className="hidden sm:block">
							<Link
								href={`/${locale}/contact`}
								className={`group inline-flex items-center gap-2 h-10 ps-5 pe-2 rounded-full text-[13px] font-semibold transition-all ${
									onLight
										? "bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-dark)]"
										: "bg-white text-[var(--color-navy)] hover:bg-[var(--color-gold)]"
								}`}
							>
								<span>{t.header.cta}</span>
								<span
									className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${
										onLight
											? "bg-[var(--color-teal)] text-white group-hover:bg-[var(--color-gold)]"
											: "bg-[var(--color-navy)] text-white"
									}`}
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-3.5 w-3.5"
										style={{
											transform: isAr ? "scaleX(-1)" : undefined,
										}}
									>
										<path d="M5 12h14M13 6l6 6-6 6" />
									</svg>
								</span>
							</Link>
						</div>

						<button
							type="button"
							onClick={() => setOpen(true)}
							className={`lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md ${
								onLight
									? "text-[var(--color-ink)] hover:bg-[var(--color-line)]/40"
									: "text-white hover:bg-white/10"
							}`}
							aria-label={t.header.mobileMenu.open}
						>
							<MenuIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			</Container>
		</header>

		{open && (
			<div className="fixed inset-0 z-50 bg-[var(--color-navy-dark)] lg:hidden">
				<Container>
					<div className="flex h-[88px] items-center justify-between">
						<Logo tone="dark" />
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white"
							aria-label={t.header.mobileMenu.close}
						>
							<CloseIcon className="h-5 w-5" />
						</button>
					</div>
				</Container>

				<Container>
					<nav className="mt-6 flex flex-col">
						{t.header.nav.map((item) => {
							const isIbs =
								item.href === "/ibs" || item.href === "#ibs";
							const isActive = item.href === "/" ? pathname === `/${locale}` : pathname === `/${locale}${item.href}`;
							if (isIbs) {
								const isActiveIbs = pathname.startsWith(`/${locale}/ibs`);
								return (
									<div key="ibs" className="border-b border-white/10">
										<button
											type="button"
											onClick={() => setIbsMobileOpen((v) => !v)}
											className={`flex w-full items-center justify-between py-5 text-start text-2xl font-display font-semibold ${
												isActiveIbs ? "text-[var(--color-gold)]" : "text-white"
											}`}
										>
											<span>{item.label}</span>
											<ChevronDown
												className={`h-5 w-5 transition-transform ${
													ibsMobileOpen ? "rotate-180" : ""
												} ${
													isActiveIbs ? "text-[var(--color-gold)]" : "text-[var(--color-gold)]"
												}`}
											/>
										</button>
										{ibsMobileOpen ? (
											<div className="mb-4 ms-4 flex flex-col gap-1 border-s border-white/10 ps-4">
												<Link
													href={`/${locale}/ibs`}
													onClick={() => setOpen(false)}
													className="py-2 text-base font-medium text-white/90"
												>
													{isAr ? "عن القمة" : "About IBS"}
												</Link>
												{editions.map((e) => (
													<Link
														key={e.slug}
														href={`/${locale}/ibs/${e.slug}`}
														onClick={() => setOpen(false)}
														className="py-2 text-base font-medium text-white/80"
													>
														{e.title[locale]}
													</Link>
												))}
											</div>
										) : null}
									</div>
								);
							}
							return (
								<Link
									key={item.href}
									href={`/${locale}${item.href}`}
									onClick={() => setOpen(false)}
									className={`group flex items-center justify-between border-b border-white/10 py-5 text-2xl font-display font-semibold ${
										isActive ? "text-[var(--color-gold)]" : "text-white"
									}`}
								>
									{item.label}
									<span className={`opacity-0 transition-opacity group-hover:opacity-100 ${
										isActive ? "text-[var(--color-gold)]" : "text-[var(--color-gold)]"
									}`}>
										{isAr ? "←" : "→"}
									</span>
								</Link>
							);
						})}
					</nav>

					<div className="mt-8 flex flex-col gap-3">
						<Button href={`/${locale}/contact`} variant="gold" size="lg" withArrow>
							{t.header.cta}
						</Button>
						<button
							type="button"
							onClick={() => {
								handleToggleLanguage();
								setOpen(false);
							}}
							className="inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-white/20 text-white text-sm font-semibold tracking-wider"
						>
							<GlobeIcon className="h-4 w-4" />
							{t.header.mobileMenu.switchTo}{" "}
							{isAr
								? t.header.mobileMenu.english
								: t.header.mobileMenu.arabic}
						</button>
					</div>
				</Container>
			</div>
		)}

		{isPending && (
			<div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-navy-dark)]/95 backdrop-blur-sm transition-opacity duration-300">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-gold)]/20 border-t-[var(--color-gold)]" />
				<p className="mt-4 text-sm font-medium text-white/80">
					{locale === "en" ? "Switching language..." : "جاري تغيير اللغة..."}
				</p>
			</div>
		)}
	</>
	);
}
