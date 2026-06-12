"use client";

import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

export default function IbsNotFound() {
	const { t, locale } = useI18n();
	const tr = t.errors.editionNotFound;
	return (
		<>
			<Header />
			<main className="bg-[var(--color-navy-dark)] py-40 text-white">
				<Container>
					<div className="mx-auto max-w-xl text-center">
						<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							404
						</div>
						<h1 className="mt-4 font-display text-4xl font-bold">
							{tr.title}
						</h1>
						<p className="mt-4 text-[var(--color-silver)]">
							{tr.description}
						</p>
						<Link
							href={`/${locale}/ibs`}
							className="mt-8 inline-flex h-12 items-center rounded-xl bg-[var(--color-gold)] px-6 font-semibold text-[var(--color-navy)]"
						>
							{tr.cta}
						</Link>
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
