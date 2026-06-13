"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Overline";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/provider";
import type { Blog } from "@/data/blogs";

type Props = {
	blogs: Blog[];
	locale: string;
};

export function HomeHighlights({ blogs, locale }: Props) {
	const { t, dir } = useI18n();
	const isRtl = dir === "rtl";

	if (blogs.length === 0) return null;

	return (
		<section id="insights" className="relative bg-warm py-20 lg:py-28">
			<Container>
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
					<SectionHeading
						overline={t.highlights.overline}
						title={
							<>
								{t.highlights.title[0]}{" "}
								<span className="text-[var(--color-teal)]">{t.highlights.title[1]}</span>
								{t.highlights.title[2]}
							</>
						}
						subtitle={t.highlights.subtitle}
					/>
					<Button href={`/${locale}/news`} variant="ghost-navy" withArrow>
						{t.highlights.cta}
					</Button>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					{blogs.map((blog, i) => (
						<Link
							key={blog.slug}
							href={`/${locale}/news/${blog.slug}`}
							className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(1,30,47,0.12)] ${
								i === 0 ? "md:col-span-2 lg:col-span-1" : ""
							}`}
						>
							<div className="relative aspect-[16/10] overflow-hidden">
								<Image
									src={blog.image}
									alt={blog.title[locale as "en" | "ar"]}
									fill
									sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute left-5 top-5 inline-flex items-center rounded-full bg-[var(--color-teal)] px-3 py-1 text-[10px] font-bold uppercase tracking-overline text-white backdrop-blur">
									{locale === "ar" ? "مقالة" : "Insight"}
								</div>
							</div>
							<div className="flex flex-1 flex-col p-7">
								<div className="flex items-center gap-3 text-[12px] uppercase tracking-overline text-[var(--color-slate)]">
									<span>{blog.date}</span>
								</div>
								<h3 className="mt-4 font-display text-xl font-semibold leading-snug text-[var(--color-navy)] transition-colors group-hover:text-[var(--color-teal)]">
									{blog.title[locale as "en" | "ar"]}
								</h3>
								<div className="mt-auto pt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-teal)] transition-all group-hover:gap-3">
									{t.highlights.readStory} <ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
								</div>
							</div>
						</Link>
					))}
				</div>
			</Container>
		</section>
	);
}
