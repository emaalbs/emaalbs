"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Overline";
import { useI18n } from "@/i18n/provider";

const images = [
	"/images/about-meeting.JPG",
	"/images/about-2.jpg",
	"/images/about-3.jpg",
];

export function AboutWhoWeAre() {
	const { locale, t } = useI18n();
	const isAr = locale === "ar";
	const [activeImage, setActiveImage] = useState(0);

	return (
		<section className="relative py-20 lg:py-28 bg-white">
			<Container>
				<div
					className={`flex flex-col gap-14 lg:items-center ${
						isAr ? "lg:flex-row" : "lg:flex-row"
					}`}
				>
					<div className="w-full lg:w-1/2">
						<SectionHeading
							overline={t.aboutp.whoWeAre}
							title={
								<>
									{t.aboutp.businessTitle}
									<br />
									<span className="text-[var(--color-gold-deep)]">
										{t.aboutp.ecosystemTitle}
									</span>
								</>
							}
							subtitle={t.aboutp.whoSubtitle}
						/>
						<p
							className={`mt-6 text-[15px] leading-[1.8] ${
								isAr ? "text-right" : "text-left"
							} text-[var(--color-slate)]`}
						>
							{t.aboutp.whoDescription}
						</p>
					</div>

					<div className="relative w-full lg:w-1/2">
						<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-line)] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
							<Image
								src={images[activeImage]}
								alt=""
								fill
								sizes="(min-width: 1024px) 50vw, 100vw"
								className="object-cover transition-all duration-500"
							/>
						</div>

						<div className="mt-6 flex items-center justify-center gap-3">
							{images.map((_, index) => (
								<button
									key={index}
									onClick={() => setActiveImage(index)}
									className={`h-3 w-3 rounded-full transition-all duration-300 ${
										activeImage === index
											? "bg-black scale-110"
											: "bg-gray-300"
									}`}
								/>
							))}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
