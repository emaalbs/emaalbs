import type { Metadata } from "next";
import { ArrowDown, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { SocialFeed } from "@/components/social/SocialFeed";
import { listSocialPosts } from "@/lib/db/social-posts";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ type: "social", locale: locale === "ar" ? "ar" : "en" });
}

export default async function SocialPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale: localeParam } = await params;
	const locale = localeParam === "ar" ? "ar" : "en";
	const isAr = locale === "ar";
	const posts = await listSocialPosts();

	return (
		<main className="overflow-hidden bg-[var(--color-warm)]">
			<Header />
			<section className="relative isolate flex min-h-[620px] items-end overflow-hidden bg-[var(--color-navy-dark)] pb-20 pt-40 text-white lg:pb-28 lg:pt-52">
				<div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_20%,rgba(0,127,132,0.35),transparent_38%),radial-gradient(circle_at_10%_80%,rgba(238,193,59,0.15),transparent_34%)]" />
				<div className="absolute inset-0 -z-10 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
				<Container>
					<div className="max-w-5xl reveal">
						<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)] backdrop-blur-sm">
							<Radio className="h-3.5 w-3.5" />
							{isAr ? "نبض أعمال" : "EMAAL Social Pulse"}
						</div>
						<h1 className="mt-7 max-w-4xl font-display text-[clamp(3rem,8vw,6.8rem)] font-black leading-[1.02] tracking-[-0.045em] rtl:tracking-normal">
							{isAr ? "منصاتنا. حوار واحد." : "Across every platform. One conversation."}
						</h1>
						<p className="mt-7 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
							{isAr
								? "تابع أحدث أخبار أعمال وفعالياتها ورؤاها كما نشاركها عبر منصاتنا الاجتماعية."
								: "Follow EMAAL's latest updates, events, and perspectives as they unfold across our social channels."}
						</p>
						<a href="#social-feed" className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]">
							{isAr ? "استكشف المنشورات" : "Explore the feed"}
							<ArrowDown className="h-4 w-4" />
						</a>
					</div>
				</Container>
			</section>

			<section id="social-feed" className="relative py-20 lg:py-28">
				<Container>
					<div className="mb-12 grid gap-5 border-b border-[var(--color-line)] pb-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:items-end">
						<div>
							<p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">{isAr ? "آخر التحديثات" : "Latest updates"}</p>
							<h2 className="mt-3 font-display text-[clamp(2rem,4vw,4rem)] font-black leading-tight text-[var(--color-navy)]">{isAr ? "اختر المنصة وتابع القصة" : "Choose a channel. Follow the story."}</h2>
						</div>
						<div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-[var(--color-slate)] shadow-sm">
							<Sparkles className="h-5 w-5 text-[var(--color-gold-deep)]" />
							<span>{posts.length} {isAr ? "منشورات مختارة" : "curated posts"}</span>
						</div>
						<div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-[var(--color-slate)] shadow-sm">
							<ShieldCheck className="h-5 w-5 text-[var(--color-teal)]" />
							<span>{isAr ? "من المصادر الأصلية" : "From original sources"}</span>
						</div>
					</div>
					<SocialFeed posts={posts} locale={locale} />
				</Container>
			</section>
			<Footer />
		</main>
	);
}
