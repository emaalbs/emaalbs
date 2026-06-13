import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCards";

import { Container } from "@/components/ui/Container";

import { listBlogs } from "@/lib/db/blogs";
import { listMagazines } from "@/lib/db/magazines";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Blog } from "@/data/blogs";

export const dynamic = "force-dynamic";

type NewsItem = Blog & { isPdf?: boolean; resolvedHref?: string };

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ type: "blog", locale: locale === "ar" ? "ar" : "en" });
}

export default async function BlogPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const isAr = locale === "ar";
	const loc = locale as "en" | "ar";

	const [blogs, magazines] = await Promise.all([listBlogs(), listMagazines()]);

	const blogItems: NewsItem[] = blogs.map((b) => ({
		...b,
		isPdf: false,
		resolvedHref: `/${locale}/blog/${b.slug}`,
	}));

	const magazineItems: NewsItem[] = magazines.map((m) => ({
		id: m.id,
		slug: m.slug,
		title: m.title,
		description: m.description,
		content: { en: [], ar: [] },
		image: m.cover_image,
		date: m.date,
		featured: false,
		isPdf: true,
		resolvedHref: m.pdf_url,
	}));

	const allItems: NewsItem[] = [...blogItems, ...magazineItems];
	const featuredItem = allItems[0];
	const otherItems = allItems.slice(1);

	return (
		<main className="overflow-hidden bg-[var(--color-navy-dark)] text-white">
			<Header />

			{/* HERO */}
			{featuredItem ? (
				<BlogHero
					featuredPost={featuredItem}
					locale={loc}
					href={featuredItem.resolvedHref}
					isPdf={featuredItem.isPdf}
				/>
			) : (
				<div className="flex flex-col items-center justify-center py-32 text-center">
					<h2 className="font-display text-3xl font-bold text-white">
						{isAr ? "لا توجد مقالات بعد" : "No posts yet"}
					</h2>
					<p className="mt-4 text-white/60">
						{isAr ? "تحقق لاحقاً" : "Check back soon"}
					</p>
				</div>
			)}

			{/* ARTICLES */}
			<section className="relative overflow-hidden bg-[var(--color-warm)] py-24 text-[var(--color-navy)] lg:py-32">
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
					<div className="flex items-end justify-between gap-6">
						<div>
							<div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">
								{isAr
									? "أحدث المقالات"
									: "Latest Articles"}
							</div>

							<h2 className="mt-4 font-display text-[clamp(2rem,4vw,4rem)] font-black leading-[1.05]">
								{isAr
									? "رؤى وتحليلات متعمقة"
									: "Deep Insights & Analysis"}
							</h2>
						</div>
					</div>

					<div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
						{otherItems.map((item, index) => (
							<BlogCard
								key={`${item.isPdf ? "mag" : "blog"}-${item.id}`}
								post={item}
								locale={loc}
								index={index}
								href={item.resolvedHref}
								isPdf={item.isPdf}
							/>
						))}
					</div>
				</Container>
			</section>

			<Footer />
		</main>
	);
}