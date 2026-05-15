"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCards";

import { Container } from "@/components/ui/Container";

import { blogs } from "@/data/blogs";

import { useI18n } from "@/i18n/provider";

export default function BlogPage() {
	
	const { locale } = useI18n();
	

	const featuredPost = blogs[0];
	const secondaryPosts = blogs.slice(1);

	return (
		<main className="overflow-hidden bg-[var(--color-navy-dark)] text-white">
			<Header />

			{/* HERO */}
			<BlogHero
				featuredPost={featuredPost}
				locale={locale as "en" | "ar"}
			/>

			{/* ARTICLES */}
			<section className="relative overflow-hidden bg-[var(--color-warm)] py-24 text-[var(--color-navy)] lg:py-32">
				{/* background */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.35]"
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, rgba(1,51,77,0.08) 1px, transparent 0)",
						backgroundSize: "28px 28px",
					}}
				/>

				<div className="absolute -right-20 top-20 h-[320px] w-[320px] rounded-full bg-[var(--color-gold)]/10 blur-[120px]" />

				<div className="absolute -left-20 bottom-10 h-[320px] w-[320px] rounded-full bg-[var(--color-teal)]/10 blur-[120px]" />

				<Container>
					{/* heading */}
					<div className="flex items-end justify-between gap-6">
						<div>
							<div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">
								{locale === "ar"
									? "أحدث المقالات"
									: "Latest Articles"}
							</div>

							<h2 className="mt-4 font-display text-[clamp(2rem,4vw,4rem)] font-black leading-[1.05]">
								{locale === "ar"
									? "رؤى وتحليلات متعمقة"
									: "Deep Insights & Analysis"}
							</h2>
						</div>
					</div>

					{/* cards */}
					<div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
						{secondaryPosts.map((post, index) => (
							<BlogCard
								key={post.id}
								post={post}
								locale={locale as "en" | "ar"}	
								index={index}
							/>
						))}
					</div>
				</Container>
			</section>

			<Footer />
		</main>
	);
}