"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

import { Container } from "@/components/ui/Container";

import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCards";

import { blogs } from "@/data/blogs";

import { useI18n } from "@/i18n/provider";

export default function BlogPage() {
	const { locale } = useI18n();

	return (
		<main className="overflow-hidden bg-[var(--color-navy-dark)]">
			<Header />

			{/* HERO */}
			<BlogHero />

			{/* BLOGS */}
			<section className="relative overflow-hidden py-20 lg:py-24">
				{/* background */}
				<div className="absolute inset-0">
					{/* left glow */}
					<div className="absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-[var(--color-teal)]/10 blur-[100px]" />

					{/* right glow */}
					<div className="absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-[var(--color-gold)]/10 blur-[100px]" />

					{/* grid */}
					<div className="absolute inset-0 opacity-[0.035]">
						<div
							className="h-full w-full"
							style={{
								backgroundImage:
									"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
								backgroundSize: "65px 65px",
							}}
						/>
					</div>
				</div>

				<Container>
					{/* section heading */}
					<div className="mx-auto max-w-3xl text-center">
						<p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
							{locale === "ar"
								? "أحدث المقالات"
								: "Latest Articles"}
						</p>

						<h2 className="mt-5 font-display text-[clamp(2rem,4vw,4rem)] font-bold leading-[1.05] text-white">
							{locale === "ar"
								? "رؤى وأفكار واستراتيجيات"
								: "Insights, Ideas & Strategies"}
						</h2>

						<p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.9] text-[var(--color-silver)]">
							{locale === "ar"
								? "تابع أحدث المقالات المتعلقة بالأعمال والاستثمار والتطوير والفرص الاستراتيجية."
								: "Stay updated with the latest articles related to business, investment, development, and strategic opportunities."}
						</p>

						<div className="mx-auto mt-8 h-[2px] w-36 bg-gradient-to-r from-transparent via-[var(--color-teal)] to-transparent" />
					</div>

					{/* cards */}
					<div className="relative mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
						{blogs.map((post) => (
							<BlogCard
								key={post.id}
								post={post}
								locale={locale}
							/>
						))}
					</div>
				</Container>
			</section>

			<Footer />
		</main>
	);
}