export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Quote } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { BlogVideoBlock } from "@/components/blog/BlogVideoBlock";
import { getBlogBySlug } from "@/lib/db/blogs";
import type { BlogBlock } from "@/data/blogs";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd } from "@/lib/seo/structured-data";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug, locale } = await params;
	const post = await getBlogBySlug(slug);
	if (!post) return {};
	const isAr = locale === "ar";
	return buildMetadata({ type: "blogDetail", locale: isAr ? "ar" : "en", slug, title: post.title[isAr ? "ar" : "en"], description: post.description[isAr ? "ar" : "en"], image: post.image, date: post.date });
}

function sectionId(index: number) {
	return `article-section-${index + 1}`;
}

function renderBlock(block: BlogBlock, index: number, isAr: boolean) {
	switch (block.type) {
		case "heading":
			return <h2 id={sectionId(index)} key={index} className="scroll-mt-28 pt-8 font-display text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold leading-[1.16] tracking-[-0.03em] text-[var(--color-navy)] rtl:leading-[1.45] rtl:tracking-normal">{block.text}</h2>;
		case "paragraph":
			return <p key={index} className="mt-5 text-[17px] leading-[1.9] text-[#526A76] md:text-[18px] rtl:leading-[2]">{block.text}</p>;
		case "image":
			return <figure key={index} className="relative my-10 aspect-[3/2] overflow-hidden rounded-[1.5rem] bg-[#EDF2F4] shadow-[0_22px_60px_rgba(1,30,47,0.12)]"><Image src={block.src} alt={block.alt || (isAr ? "صورة من المقال" : "Article image")} fill sizes="(max-width: 1024px) 100vw, 820px" className="object-cover" /></figure>;
		case "quote":
			return <blockquote key={index} className="relative my-12 overflow-hidden rounded-[1.5rem] bg-[var(--color-navy-dark)] px-7 py-9 text-[20px] font-semibold leading-[1.75] text-white shadow-[0_24px_70px_rgba(1,30,47,0.16)] md:px-10 md:text-[24px] rtl:leading-[1.9]"><Quote className="mb-5 h-8 w-8 text-[var(--color-gold)]" aria-hidden="true" /><span className={isAr ? "" : "italic"}>{block.text}</span><span className="absolute inset-y-0 start-0 w-1 bg-[var(--color-gold)]" aria-hidden="true" /></blockquote>;
		case "highlights":
			return <div key={index} className="my-8 grid gap-3 md:grid-cols-2">{block.items.map((item, itemIndex) => <div key={itemIndex} className="group flex gap-3.5 rounded-[1.1rem] border border-[#DDE5E8] bg-[#F8FAFA] p-5 transition-[transform,border-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-gold)]/60 hover:shadow-[0_14px_35px_rgba(1,51,77,0.08)] motion-reduce:transform-none"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-gold)]/18 text-[var(--color-gold-deep)]"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span><p className="text-[14px] font-semibold leading-6 text-[var(--color-navy)] md:text-[15px]">{item}</p></div>)}</div>;
		case "gallery":
			if (!block.images.length) return null;
			return <div key={index} className="my-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{block.images.map((img, imageIndex) => <figure key={imageIndex} className={`group relative min-h-[250px] overflow-hidden rounded-[1.25rem] bg-[#EDF2F4] ${imageIndex === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}><Image src={img} alt={isAr ? "صورة من المعرض" : "Gallery image"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] motion-reduce:transition-none" /></figure>)}</div>;
		case "video":
			return <BlogVideoBlock key={index} url={block.url} caption={block.caption} isAr={isAr} />;
		default:
			return null;
	}
}

function renderArticleContent(content: BlogBlock[], isAr: boolean) {
	const result: React.ReactNode[] = [];
	for (let index = 0; index < content.length;) {
		const block = content[index];
		const next = content[index + 1];
		const third = content[index + 2];

		if (block?.type === "heading" && next?.type === "paragraph" && third?.type === "image") {
			const reverse = result.length % 2 === 1;
			result.push(<section id={sectionId(index)} key={`feature-${index}`} className="scroll-mt-28 my-8 grid overflow-hidden rounded-[1.6rem] border border-[#DDE5E8] bg-white shadow-[0_18px_55px_rgba(1,51,77,0.09)] lg:grid-cols-[1.08fr_.92fr]"><figure className={`relative min-h-[260px] bg-[#EDF2F4] lg:min-h-[330px] ${reverse ? "lg:order-2" : ""}`}><Image src={third.src} alt={third.alt || block.text} fill loading="eager" sizes="(max-width: 1024px) 100vw, 470px" className="object-cover" /></figure><div className="flex flex-col justify-center px-7 py-8 md:px-10 lg:py-10"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold-deep)] rtl:tracking-normal">{isAr ? "من القمة" : "From the summit"}</span><h2 className="mt-3 font-display text-[clamp(1.65rem,3vw,2.5rem)] font-bold leading-[1.2] tracking-[-0.03em] text-[var(--color-navy)] rtl:leading-[1.5] rtl:tracking-normal">{block.text}</h2><p className="mt-4 text-[16px] leading-8 text-[#607783] rtl:leading-9">{next.text}</p></div></section>);
			index += 3;
			continue;
		}

		if (block?.type === "video") {
			const videos: Extract<BlogBlock, { type: "video" }>[] = [];
			let cursor = index;
			while (content[cursor]?.type === "video") {
				videos.push(content[cursor] as Extract<BlogBlock, { type: "video" }>);
				cursor += 1;
			}
			result.push(<section key={`videos-${index}`} className="my-14 rounded-[1.75rem] bg-[#F1F5F6] p-5 sm:p-7 lg:p-8"><div className="mb-7 flex items-end justify-between gap-4"><div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold-deep)] rtl:tracking-normal">{isAr ? "شاهد" : "Watch"}</span><h2 className="mt-2 font-display text-2xl font-bold text-[var(--color-navy)] md:text-3xl">{isAr ? "أصوات من القمة" : "Voices from the summit"}</h2></div><span className="font-numeric text-sm font-bold text-[#78909C]" dir="ltr">{String(videos.length).padStart(2, "0")}</span></div><div className="grid gap-5 md:grid-cols-2">{videos.map((video, videoIndex) => <BlogVideoBlock key={videoIndex} url={video.url} caption={video.caption} isAr={isAr} compact />)}</div></section>);
			index = cursor;
			continue;
		}

		result.push(renderBlock(block, index, isAr));
		index += 1;
	}
	return result;
}

export default async function BlogDetailsPage({ params }: Props) {
	const { slug, locale } = await params;
	const post = await getBlogBySlug(slug);
	if (!post) notFound();

	const isAr = locale === "ar";
	const currentLocale: "en" | "ar" = isAr ? "ar" : "en";
	const content = post.content[currentLocale];
	const headings = content.flatMap((block, index) => block.type === "heading" ? [{ text: block.text, id: sectionId(index) }] : []).slice(0, 8);
	const wordCount = content.reduce((total, block) => total + (block.type === "paragraph" || block.type === "heading" || block.type === "quote" ? block.text.split(/\s+/).length : 0), 0);
	const readingMinutes = Math.max(3, Math.ceil(wordCount / (isAr ? 180 : 220)));
	const BackIcon = isAr ? ArrowRight : ArrowLeft;

	return <>
		<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title: post.title[currentLocale], description: post.description[currentLocale], image: post.image, datePublished: post.date, dateModified: post.date, slug, locale: currentLocale })) }} />
		<main dir={isAr ? "rtl" : "ltr"} className="overflow-hidden bg-[#F7F9F9] text-[var(--color-navy)]">
			<Header />
			<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] pb-16 pt-28 lg:pb-20 lg:pt-32">
				<div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_16%,rgba(0,102,102,.35),transparent_34%),radial-gradient(circle_at_15%_90%,rgba(238,193,59,.12),transparent_28%)]" />
				<div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:72px_72px]" />
				<Container size="wide">
					<Link href={`/${currentLocale}/blog`} className="blog-hero-enter inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-bold text-white/70 transition-colors duration-200 hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"><BackIcon className="h-4 w-4" aria-hidden="true" />{isAr ? "العودة إلى المقالات" : "Back to insights"}</Link>
					<div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
						<div className="blog-hero-enter blog-hero-enter-delay-1 lg:col-span-7"><div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-bold text-white/55"><span className="rounded-full bg-[var(--color-gold)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-navy-dark)] rtl:tracking-normal">{isAr ? "مقالات أعمال" : "EMAAL Insights"}</span><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[var(--color-gold)]" />{post.date}</span><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[var(--color-gold)]" />{readingMinutes} {isAr ? "دقائق قراءة" : "min read"}</span></div><h1 className="mt-6 max-w-5xl font-display text-[clamp(2.6rem,5.5vw,5.25rem)] font-semibold leading-[1.01] tracking-[-0.055em] text-white rtl:leading-[1.25] rtl:tracking-normal">{post.title[currentLocale]}</h1><p className="mt-7 max-w-3xl text-[16px] leading-[1.85] text-white/65 md:text-[18px] rtl:leading-[2]">{post.description[currentLocale]}</p></div>
						<figure className="blog-hero-enter blog-hero-enter-delay-2 group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,.3)] lg:col-span-5"><Image src={post.image} alt={post.title[currentLocale]} fill priority sizes="(max-width: 1024px) 100vw, 520px" className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025] motion-reduce:transition-none" /><div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-dark)]/45 via-transparent to-transparent" /></figure>
					</div>
				</Container>
			</section>
			<section className="py-14 lg:py-24">
				<Container size="wide"><div className="grid items-start gap-12 lg:grid-cols-[230px_minmax(0,900px)] lg:justify-center lg:gap-16"><aside className="hidden lg:sticky lg:top-28 lg:block"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold-deep)] rtl:tracking-normal">{isAr ? "في هذا المقال" : "In this story"}</span><nav className="mt-5 border-s border-[#D6E0E3] ps-5" aria-label={isAr ? "أقسام المقال" : "Article sections"}>{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="block py-2 text-[13px] font-semibold leading-5 text-[#718690] transition-colors duration-200 hover:text-[var(--color-navy)]">{heading.text}</a>)}</nav></aside><article className="min-w-0 rounded-[2rem] bg-white px-6 py-8 shadow-[0_24px_80px_rgba(1,51,77,.07)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">{renderArticleContent(content, isAr)}</article></div></Container>
			</section>
			<Footer />
		</main>
	</>;
}
