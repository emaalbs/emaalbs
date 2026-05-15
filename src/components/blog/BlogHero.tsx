"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import type { Blog } from "@/data/blogs";

type Props = {
	featuredPost: Blog;
	locale: "en" | "ar";
};

export function BlogHero({
	featuredPost,
	locale,
}: Props) {
	const isAr = locale === "ar";

	return (
		<section className="relative isolate overflow-hidden pb-24 pt-32 lg:pb-32">
			{/* background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-teal)]/15 blur-[140px]" />

				
				<div
					className="absolute inset-0 opacity-[0.045]"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
						backgroundSize: "70px 70px",
					}}
				/>
			</div>

			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* heading */}
				<div className="mx-auto max-w-5xl text-center">
					<div className="inline-flex rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)] backdrop-blur-sm">
						{isAr
							? "مقالات ورؤى استراتيجية"
							: "Strategic Insights & Articles"}
					</div>

					<h1 className="mt-8 font-display text-[clamp(3rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.04em] text-white">
						{isAr ? (
							<>
								أفكار تقود
								<br />
								<span className=" text-[var(--color-gold)]  bg-clip-text ">
									المستقبل
								</span>
							</>
						) : (
							<>
								Ideas That
								<br />
								<span className=" text-[var(--color-gold)] bg-clip-text">
									Shape The Future
								</span>
							</>
						)}
					</h1>

					<p className="mx-auto mt-8 max-w-3xl text-[16px] leading-[2] text-[var(--color-silver)] md:text-[18px]">
						{isAr
							? "استكشف أحدث الرؤى المتعلقة بالأعمال والاستثمار والتطوير والشراكات الاستراتيجية."
							: "Explore the latest insights in business, investment, development, and strategic partnerships."}
					</p>

					<div className="mx-auto mt-10 h-[2px] w-40 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
				</div>

				{/* featured article */}
				<Link
					href={`/${locale}/blog/${featuredPost.slug}`}
					className="group relative mt-20 block overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04]"
				>
					<div className="relative h-[580px] overflow-hidden">
						<Image
							src={featuredPost.image}
							alt={featuredPost.title[locale]}
							fill
							priority
							className="object-cover transition-transform duration-700 group-hover:scale-105"
						/>

						<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,20,35,0.98)] via-[rgba(1,20,35,0.45)] to-transparent" />

						<div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,20,35,0.75)] via-transparent to-transparent" />
					</div>

					{/* content */}
					<div className="absolute bottom-0 left-0 z-10 w-full p-8 md:p-14">
						<div className="max-w-4xl">
							<div className="flex flex-wrap items-center gap-4">
								<div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)] backdrop-blur-md">
									{featuredPost.date}
								</div>

								<div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80 backdrop-blur-md">
									{isAr
										? "مقال مميز"
										: "Featured Article"}
								</div>
							</div>

							<h2 className="mt-7 font-display text-[clamp(2rem,5vw,5rem)] font-black leading-[1] tracking-[-0.03em] text-white">
								{featuredPost.title[locale]}
							</h2>

							<p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-[var(--color-silver)] md:text-[17px]">
								{featuredPost.description[locale]}
							</p>

							<div className="mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
								<span>
									{isAr
										? "اقرأ المقال"
										: "Read Article"}
								</span>

								<ArrowUpRight
									size={18}
									className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
								/>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</section>
	);
}