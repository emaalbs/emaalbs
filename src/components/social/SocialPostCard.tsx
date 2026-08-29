import { ExternalLink, Pin } from "lucide-react";
import type { SocialPost } from "@/data/social-posts";
import { SocialEmbed } from "@/components/social/SocialEmbed";
import { SocialPlatformBadge } from "@/components/social/SocialPlatformBadge";

export function SocialPostCard({ post, locale }: { post: SocialPost; locale: "en" | "ar" }) {
	const isAr = locale === "ar";
	const title = post.title[locale] || post.title[isAr ? "en" : "ar"];
	const caption = post.caption[locale] || post.caption[isAr ? "en" : "ar"];

	if (post.displayMode === "custom") {
		return (
			<article className="group overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white shadow-[0_18px_60px_rgba(1,30,47,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(1,30,47,0.14)] motion-reduce:transition-none">
				{post.imageUrl ? (
					<div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-navy-dark)]">
						<img src={post.imageUrl} alt={title || ""} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025] motion-reduce:transition-none" />
						<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-dark)]/45 via-transparent to-transparent" />
					</div>
				) : null}
				<div className="p-6 sm:p-7">
					<div className="flex items-center justify-between gap-4">
						<SocialPlatformBadge platform={post.platform} />
						{post.pinned ? <Pin className="h-4 w-4 text-[var(--color-gold-deep)]" aria-label={isAr ? "مثبت" : "Pinned"} /> : null}
					</div>
					{title ? <h2 className="mt-5 font-display text-2xl font-black leading-tight text-[var(--color-navy)]">{title}</h2> : null}
					{caption ? <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-[var(--color-slate)]">{caption}</p> : null}
					<div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-5">
						<span className="text-xs font-medium text-[var(--color-slate)]">{post.postDate}</span>
						<a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-teal)] transition-colors hover:text-[var(--color-navy)]">
							{isAr ? "مشاهدة المنشور" : "View post"}
							<ExternalLink className="h-4 w-4" />
						</a>
					</div>
				</div>
			</article>
		);
	}

	return (
		<article className="overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white p-3 shadow-[0_18px_60px_rgba(1,30,47,0.08)] sm:p-4">
			<div className="mb-3 flex items-center justify-between gap-3 px-2 pt-1">
				<SocialPlatformBadge platform={post.platform} />
				<a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full text-[var(--color-slate)] transition hover:bg-[var(--color-warm)] hover:text-[var(--color-navy)]" aria-label={isAr ? "فتح المنشور الأصلي" : "Open original post"}>
					<ExternalLink className="h-4 w-4" />
				</a>
			</div>
			<SocialEmbed url={post.postUrl} platform={post.platform} locale={locale} />
		</article>
	);
}
