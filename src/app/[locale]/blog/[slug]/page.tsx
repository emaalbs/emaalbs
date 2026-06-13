export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

import { getBlogBySlug } from "@/lib/db/blogs";
import type { BlogBlock } from "@/data/blogs";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd } from "@/lib/seo/structured-data";

type Props = {
	params: Promise<{
		slug: string;
		locale: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug, locale } = await params;
	const post = await getBlogBySlug(slug);
	if (!post) return {};
	const isAr = locale === "ar";
	return buildMetadata({
		type: "blogDetail",
		locale: isAr ? "ar" : "en",
		slug,
		title: post.title[isAr ? "ar" : "en"],
		description: post.description[isAr ? "ar" : "en"],
		image: post.image,
		date: post.date,
	});
}

function renderBlock(block: BlogBlock, index: number, isAr: boolean) {
	switch (block.type) {
		case "heading":
			return (
				<h2
					key={index}
					className="mt-14 mb-6 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--color-navy)]"
				>
					{block.text}
				</h2>
			);
		case "paragraph":
			return (
				<p
					key={index}
					className="mb-6 text-[17px] leading-[1.9] text-[var(--color-slate)] md:text-[18px]"
				>
					{block.text}
				</p>
			);
		case "image":
			return (
				<div
					key={index}
					className="my-10 overflow-hidden rounded-[20px]"
				>
					<Image
						src={block.src}
						alt={block.alt}
						width={1200}
						height={700}
						className="h-auto w-full object-cover"
					/>
				</div>
			);
		case "quote":
			return (
				<blockquote
					key={index}
					className={`my-12 border-s-[3px] border-[var(--color-gold)] bg-[var(--color-gold)]/5 py-6 px-6 md:py-8 md:px-10 text-[20px] md:text-[24px] font-semibold italic leading-[1.7] text-[var(--color-navy)] ${isAr ? "border-e-[3px] border-s-0" : ""}`}
				>
					{block.text}
				</blockquote>
			);
		case "highlights":
			return (
				<div key={index} className="my-12 grid gap-3 md:grid-cols-2">
					{block.items.map((item, i) => (
						<div
							key={i}
							className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-white/60 p-4"
						>
							<div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
							<p className="text-[15px] font-semibold text-[var(--color-navy)]">
								{item}
							</p>
						</div>
					))}
				</div>
			);
		case "gallery":
			return (
				<div key={index} className="my-12 grid gap-4 md:grid-cols-3">
					{block.images.map((img, i) => (
						<div
							key={i}
							className="overflow-hidden rounded-[16px]"
						>
							<Image
								src={img}
								alt="Gallery"
								width={600}
								height={450}
								className="h-full w-full object-cover transition duration-500 hover:scale-105"
							/>
						</div>
					))}
				</div>
			);
		default:
			return null;
	}
}

export default async function BlogDetailsPage({
	params,
}: Props) {
	const { slug, locale } = await params;

	const post = await getBlogBySlug(slug);

	if (!post) {
		notFound();
	}

	const isAr = locale === "ar";
	const currentLocale: "en" | "ar" = locale === "ar" ? "ar" : "en";
	const content = post.content[currentLocale];

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						articleJsonLd({
							title: post.title[currentLocale],
							description: post.description[currentLocale],
							image: post.image,
							datePublished: post.date,
							dateModified: post.date,
							slug,
							locale: currentLocale,
						})
					),
				}}
			/>
			<main
				dir={isAr ? "rtl" : "ltr"}
				className="overflow-hidden bg-white text-[var(--color-navy)]"
			>
			<Header />

			{/* HERO */}
			<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] pb-20 pt-28 lg:pb-24 lg:pt-32">
				<div className="absolute inset-0 -z-10 opacity-[0.04]"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
						backgroundSize: "65px 65px",
					}}
				/>

				<Container>
					<div className="mx-auto max-w-4xl">
						<div className="inline-flex rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							{post.date}
						</div>

						<h1 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.1] tracking-[-0.03em] text-white">
							{post.title[currentLocale]}
						</h1>

						<p className="mt-6 max-w-3xl text-[16px] leading-[1.8] text-[var(--color-silver)] md:text-[18px]">
							{post.description[currentLocale]}
						</p>
					</div>

					<div className="relative mt-12 overflow-hidden rounded-[24px] border border-white/10">
						<Image
							src={post.image}
							alt={post.title[currentLocale]}
							width={1400}
							height={750}
							priority
							className="h-auto w-full object-cover"
						/>
					</div>
				</Container>
			</section>

			{/* CONTENT */}
			<section className="relative bg-white py-16 lg:py-24">
				<Container>
					<div className="mx-auto max-w-3xl">
						<article className="blog-article">
							{content.map((block, index) =>
								renderBlock(block, index, isAr)
							)}
						</article>
					</div>
				</Container>
			</section>

			<Footer />
		</main>
		</>
	);
}