import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SocialPost } from "@/data/social-posts";
import { Container } from "@/components/ui/Container";
import { SocialPlatformBadge } from "@/components/social/SocialPlatformBadge";
import { getSocialPlatformLabel, getYouTubeVideoId } from "@/lib/social-platforms";

function previewImage(post: SocialPost): string {
	if (post.imageUrl) return post.imageUrl;
	if (post.platform === "youtube") {
		const id = getYouTubeVideoId(post.postUrl);
		if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
	}
	return "";
}

const platformTone: Record<SocialPost["platform"], string> = {
	linkedin: "from-[#0A66C2] to-[#01334D]",
	x: "from-slate-950 to-slate-700",
	instagram: "from-fuchsia-700 via-rose-500 to-amber-400",
	youtube: "from-red-700 to-red-500",
	facebook: "from-[#1877F2] to-[#01334D]",
};

export function HomeSocialPulse({ posts, locale }: { posts: SocialPost[]; locale: "en" | "ar" }) {
	if (!posts.length) return null;
	const isAr = locale === "ar";
	return (
		<section className="relative overflow-hidden bg-white py-24 lg:py-32">
			<div className="absolute -end-24 top-12 h-72 w-72 rounded-full bg-[var(--color-teal)]/5 blur-3xl" />
			<Container>
				<div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
					<div>
						<p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">{isAr ? "نبض أعمال" : "EMAAL Social Pulse"}</p>
						<h2 className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,5vw,4.8rem)] font-black leading-[1.04] text-[var(--color-navy)]">
							{isAr ? "أحدث ما نشاركه عبر منصاتنا" : "The latest from across our channels"}
						</h2>
					</div>
					<Link href={`/${locale}/social`} className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full border border-[var(--color-navy)] px-5 text-sm font-bold text-[var(--color-navy)] transition duration-300 hover:bg-[var(--color-navy)] hover:text-white sm:self-auto">
						{isAr ? "عرض كل المنشورات" : "View all posts"}
						<ArrowUpRight className="h-4 w-4 rtl:-rotate-90" />
					</Link>
				</div>

				<div className="mt-14 grid gap-6 lg:grid-cols-3">
					{posts.slice(0, 3).map((post, index) => {
						const image = previewImage(post);
						const title = post.title[locale] || post.caption[locale] || (isAr ? `تابع أحدث منشوراتنا على ${getSocialPlatformLabel(post.platform)}` : `See our latest update on ${getSocialPlatformLabel(post.platform)}`);
						return (
							<a key={post.id} href={post.postUrl} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-[26px] border border-[var(--color-line)] bg-[var(--color-warm)] transition duration-500 hover:-translate-y-1 hover:border-[var(--color-teal)]/35 hover:shadow-[0_22px_60px_rgba(1,51,77,0.12)] motion-reduce:transition-none">
								<div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${platformTone[post.platform]}`}>
									{image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] motion-reduce:transition-none" /> : null}
									<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-dark)]/65 via-transparent to-transparent" />
									<div className="absolute inset-x-5 top-5 flex items-center justify-between">
										<SocialPlatformBadge platform={post.platform} compact />
										<span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--color-navy)] shadow-sm backdrop-blur-sm"><ArrowUpRight className="h-4 w-4" /></span>
									</div>
									<span className="absolute bottom-5 start-5 font-numeric text-5xl font-black text-white/20">0{index + 1}</span>
								</div>
								<div className="p-6">
									<h3 className="line-clamp-3 text-lg font-bold leading-7 text-[var(--color-navy)]">{title}</h3>
									<p className="mt-4 text-sm font-bold text-[var(--color-teal)]">{isAr ? "فتح المنشور الأصلي" : "Open original post"}</p>
								</div>
							</a>
						);
					})}
				</div>
			</Container>
		</section>
	);
}
