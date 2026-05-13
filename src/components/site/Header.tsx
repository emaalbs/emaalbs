"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";
import {
	CloseIcon,
	GlobeIcon,
	MenuIcon,
} from "@/components/ui/icons";

import { useI18n } from "@/i18n/provider";

export function Header() {
	const [scrolled, setScrolled] =
		useState(false);

	const [open, setOpen] =
		useState(false);

	const {
		locale,
		t,
		toggleLanguage,
	} = useI18n();

	const isAr = locale === "ar";

	useEffect(() => {
		const onScroll = () =>
			setScrolled(window.scrollY > 24);

		onScroll();

		window.addEventListener(
			"scroll",
			onScroll,
			{
				passive: true,
			},
		);

		return () =>
			window.removeEventListener(
				"scroll",
				onScroll,
			);
	}, []);

	useEffect(() => {
		document.body.style.overflow =
			open ? "hidden" : "";
	}, [open]);

	const onLight = scrolled;

	return (
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
						onLight
							? "h-[68px]"
							: "h-[80px]"
					}`}
				>
					<Link
						href="/"
						className="shrink-0"
					>
						<Logo
							tone={
								onLight
									? "light"
									: "dark"
							}
							height={
								onLight
									? 32
									: 36
							}
						/>
					</Link>

					<nav className="hidden lg:flex items-center gap-9">
						{t.header.nav.map(
							(item) => (
								<Link
									key={
										item.href
									}
									href={
										item.href
									}
									className={`group relative text-[13.5px] font-medium transition-colors ${
										onLight
											? "text-[var(--color-ink)] hover:text-[var(--color-navy)]"
											: "text-white/85 hover:text-white"
									}`}
								>
									{
										item.label
									}

									<span
										className={`absolute -bottom-1.5 h-[2px] w-0 bg-[var(--color-teal)] transition-all duration-300 group-hover:w-full ${
											isAr
												? "right-0"
												: "left-0"
										}`}
									/>
								</Link>
							),
						)}
					</nav>

					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={
								toggleLanguage
							}
							className={`hidden sm:inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wider px-2.5 h-9 rounded-md transition-colors ${
								onLight
									? "text-[var(--color-slate)] hover:text-[var(--color-navy)]"
									: "text-white/70 hover:text-white"
							}`}
							aria-label={
								t.header
									.langToggleLabel
							}
						>
							<GlobeIcon className="h-4 w-4" />

							{isAr
								? "EN"
								: "AR"}
						</button>

						<div className="hidden sm:block">
						<Link
							href="/contact"
								className={`group inline-flex items-center gap-2 h-10 ps-5 pe-2 rounded-full text-[13px] font-semibold transition-all ${
									onLight
										? "bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-dark)]"
										: "bg-white text-[var(--color-navy)] hover:bg-[var(--color-gold)]"
								}`}
							>
								<span>
									{
										t
											.header
											.cta
									}
								</span>

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
											transform:
												isAr
													? "scaleX(-1)"
													: undefined,
										}}
									>
										<path d="M5 12h14M13 6l6 6-6 6" />
									</svg>
								</span>
							</Link>
						</div>

						<button
							type="button"
							onClick={() =>
								setOpen(
									true,
								)
							}
							className={`lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md ${
								onLight
									? "text-[var(--color-ink)] hover:bg-[var(--color-line)]/40"
									: "text-white hover:bg-white/10"
							}`}
							aria-label={
								t.header
									.mobileMenu
									.open
							}
						>
							<MenuIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			</Container>

			{/* Mobile menu */}
			<div
				className={`fixed inset-0 z-50 bg-[var(--color-navy-dark)] transition-opacity duration-300 lg:hidden ${
					open
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			>
				<Container>
					<div className="flex h-[88px] items-center justify-between">
						<Logo tone="dark" />

						<button
							type="button"
							onClick={() =>
								setOpen(
									false,
								)
							}
							className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white"
							aria-label={
								t.header
									.mobileMenu
									.close
							}
						>
							<CloseIcon className="h-5 w-5" />
						</button>
					</div>
				</Container>

				<Container>
					<nav className="mt-6 flex flex-col">
						{t.header.nav.map(
							(item) => (
								<Link
									key={
										item.href
									}
									href={
										item.href
									}
									onClick={() =>
										setOpen(
											false,
										)
									}
									className="group flex items-center justify-between border-b border-white/10 py-5 text-white text-2xl font-display font-semibold"
								>
									{
										item.label
									}

									<span className="text-[var(--color-gold)] opacity-0 transition-opacity group-hover:opacity-100">
										{isAr
											? "←"
											: "→"}
									</span>
								</Link>
							),
						)}
					</nav>

					<div className="mt-8 flex flex-col gap-3">
					<Button
						href="/contact"
							variant="gold"
							size="lg"
							withArrow
						>
							{
								t.header
									.cta
							}
						</Button>

						<button
							type="button"
							onClick={() => {
								toggleLanguage();
								setOpen(
									false,
								);
							}}
							className="inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-white/20 text-white text-sm font-semibold tracking-wider"
						>
							<GlobeIcon className="h-4 w-4" />

							{
								t.header
									.mobileMenu
									.switchTo
							}{" "}
							{isAr
								? t.header
										.mobileMenu
										.english
								: t.header
										.mobileMenu
										.arabic}
						</button>
					</div>
				</Container>
			</div>
		</header>
	);
}