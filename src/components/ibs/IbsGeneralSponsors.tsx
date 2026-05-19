"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function IbsGeneralSponsors() {
	const { locale } = useI18n();
	const data = ibsOverview.generalSponsors;
	if (!data.logos.length) return null;

	return (
		<section className="bg-white py-20 lg:py-24">
			<Container>
				<IbsSectionHeading
					overline={data.overline[locale]}
					title={data.title[locale]}
					description={data.description[locale]}
					align="center"
					className="mx-auto"
				/>
				<div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
					{data.logos.map((logo, i) => (
						<div
							key={i}
							className="group flex h-20 items-center justify-center rounded-xl border border-[var(--color-line)] bg-[var(--color-warm)] px-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:shadow-[0_12px_32px_rgba(238,193,59,0.18)]"
						>
							<Image
								src={logo.src}
								alt={logo.alt[locale]}
								width={120}
								height={48}
								className="max-h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
								unoptimized
							/>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
