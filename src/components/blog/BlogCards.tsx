"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type BlogCardProps = {
	post: {
		id: number;
		slug: string;
		title: {
			en: string;
			ar: string;
		};
		description: {
			en: string;
			ar: string;
		};
		image: string;
		date: string;
	};
	locale: string;
};

export function BlogCard({ post, locale }: BlogCardProps) {
	const isAr = locale === "ar";

	return (
		<motion.article
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			viewport={{ once: true }}
			className="group overflow-hidden rounded-[28px] border border-white/10 bg-[var(--color-navy-dark)]/90 shadow-[0_15px_50px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-teal)]/30"
		>
			{/* IMAGE */}
			<Link href={`/${locale}/blog/${post.slug}`}>
				<div className="relative h-[260px] overflow-hidden">
					<Image
						src={post.image}
						alt={post.title[locale as "en" | "ar"]}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
					/>

					{/* overlays */}
					<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.88)] via-transparent to-transparent" />

					<div className="absolute top-4 left-4 rounded-full border border-white/10 bg-[rgba(1,30,47,0.75)] px-4 py-2 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
						{post.date}
					</div>
				</div>
			</Link>

			{/* CONTENT */}
			<div className="relative p-7">
				{/* subtle glow */}
				<div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--color-teal)]/10 blur-[60px]" />

				<div className="relative">
					<h3 className="line-clamp-2 font-display text-[1.55rem] font-bold leading-[1.25] text-white transition-colors duration-300 group-hover:text-[var(--color-gold)]">
						<Link href={`/${locale}/blog/${post.slug}`}>
							{post.title[locale as "en" | "ar"]}
						</Link>
					</h3>

					<p className="mt-4 line-clamp-3 text-[15px] leading-[1.9] text-[var(--color-silver)]">
						{post.description[locale as "en" | "ar"]}
					</p>

					{/* divider */}
					<div className="mt-6 h-px w-full bg-gradient-to-r from-[var(--color-teal)]/30 to-transparent" />

					{/* read more */}
					<Link
						href={`/${locale}/blog/${post.slug}`}
						className="mt-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[var(--color-gold)] transition-all duration-300 hover:gap-3"
					>
						{isAr ? "قراءة المقال" : "Read Article"}

						<ArrowUpRight
							size={17}
							className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
						/>
					</Link>
				</div>
			</div>
		</motion.article>
	);
}