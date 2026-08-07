"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionGallery({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	if (!edition.gallery.length) return null;
	return (
		<section className="bg-[var(--color-warm)] py-20 lg:py-24">
			<Container>
				<IbsSectionHeading
					overline={labels.gallery[locale]}
					title={
						locale === "ar"
							? "لقطات من القمة."
							: "Frames from the floor."
					}
				/>
				<div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
					{edition.gallery.map((g, i) => (
						<div
							key={g.id}
							className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-line)] bg-white"
						>
							<Image
								src={g.src}
								alt={g.alt[locale]}
								fill
								sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.75)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							<div className="absolute inset-x-0 bottom-0 p-3 text-[12px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
								{g.alt[locale]}
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
