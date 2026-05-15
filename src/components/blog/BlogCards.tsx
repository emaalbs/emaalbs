"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import type { Blog } from "@/data/blogs";

type Props = {
	post: Blog;
	locale: "en" | "ar";
	index: number;
};

export function BlogCard({
	post,
	locale,
	index,
}: Props) {
	const isAr = locale === "ar";

	return (
		<Link
			href={`/${locale}/blog/${post.slug}`}
			className={`group relative overflow-hidden rounded-[30px] border border-[var(--color-line)] bg-white/70 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-30px_rgba(1,30,47,0.28)] ${
				index % 3 === 1
					? "xl:translate-y-10"
					: ""
			}`}
		>
			{/* image */}
			<div className="relative h-[260px] overflow-hidden">
				<Image
					src={post.image}
					alt={post.title[locale]}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-110"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,20,35,0.45)] to-transparent" />
			</div>

			{/* content */}
			<div className="p-7">
				<div className="flex items-center justify-between gap-4">
					<div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">
						{post.date}
					</div>

					<div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-gold)]/40 to-transparent" />
				</div>

				<h3 className="mt-5 font-display text-[26px] font-bold leading-[1.15] transition-colors duration-300 group-hover:text-[var(--color-gold-deep)]">
					{post.title[locale]}
				</h3>

				<p className="mt-4 text-[14px] leading-[1.9] text-[var(--color-slate)]">
					{post.description[locale]}
				</p>

				<div className="mt-7 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.24em] text-[var(--color-navy)]">
					<span>
						{isAr
							? "استكشف أكثر"
							: "Explore More"}
					</span>

					<ArrowUpRight
						size={16}
						className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
					/>
				</div>
			</div>

			{/* hover glow */}
			<div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
				<div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
			</div>
		</Link>
	);
}