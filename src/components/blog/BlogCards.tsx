"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, FileText } from "lucide-react";

import type { Blog } from "@/data/blogs";

type Props = {
	post: Blog;
	locale: "en" | "ar";
	index: number;
	href?: string;
	isPdf?: boolean;
};

export function BlogCard({
	post,
	locale,
	index: _index,
	href,
	isPdf = false,
}: Props) {
	const isAr = locale === "ar";
	const resolvedHref = href ?? `/${locale}/news/${post.slug}`;

	const cardClass =
		"group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-[var(--color-line)] bg-white/70 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-30px_rgba(1,30,47,0.28)]";

	const inner = (
		<>
			{/* image */}
			<div className="relative h-[260px] overflow-hidden">
				<Image
					src={post.image}
					alt={post.title[locale]}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-110"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,20,35,0.45)] to-transparent" />

				{isPdf && (
					<div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#01334D]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
						<FileText className="h-3 w-3" />
						PDF
					</div>
				)}
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

				{post.description[locale] && (
					<p className="mt-4 text-[14px] leading-[1.9] text-[var(--color-slate)]">
						{post.description[locale]}
					</p>
				)}

				<div className="mt-7 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.24em] text-[var(--color-navy)]">
					<span>
						{isPdf
							? isAr ? "عرض المجلة" : "View Magazine"
							: isAr ? "عرض المدونة" : "View Blog"}
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
		</>
	);

	if (isPdf) {
		return (
			<a href={resolvedHref} target="_blank" rel="noopener noreferrer" className={cardClass}>
				{inner}
			</a>
		);
	}

	return (
		<Link href={resolvedHref} className={cardClass}>
			{inner}
		</Link>
	);
}