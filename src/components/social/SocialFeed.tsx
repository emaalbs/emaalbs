"use client";

import { useMemo, useState } from "react";
import type { SocialPlatform, SocialPost } from "@/data/social-posts";
import { SocialPostCard } from "@/components/social/SocialPostCard";

type Filter = "all" | SocialPlatform;

const filters: { value: Filter; en: string; ar: string }[] = [
	{ value: "all", en: "All", ar: "الكل" },
	{ value: "linkedin", en: "LinkedIn", ar: "لينكدإن" },
	{ value: "x", en: "X", ar: "إكس" },
	{ value: "instagram", en: "Instagram", ar: "إنستغرام" },
	{ value: "youtube", en: "YouTube", ar: "يوتيوب" },
	{ value: "facebook", en: "Facebook", ar: "فيسبوك" },
];

export function SocialFeed({ posts, locale }: { posts: SocialPost[]; locale: "en" | "ar" }) {
	const [filter, setFilter] = useState<Filter>("all");
	const visiblePosts = useMemo(
		() => filter === "all" ? posts : posts.filter((post) => post.platform === filter),
		[filter, posts],
	);

	return (
		<>
			<div className="flex flex-wrap gap-2" role="tablist" aria-label={locale === "ar" ? "تصفية المنصات" : "Filter platforms"}>
				{filters.map((item) => {
					const active = item.value === filter;
					return (
						<button
							key={item.value}
							type="button"
							onClick={() => setFilter(item.value)}
							className={`min-h-11 rounded-full border px-5 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] motion-reduce:transition-none ${active ? "border-[var(--color-navy)] bg-[var(--color-navy)] text-white shadow-lg" : "border-[var(--color-line)] bg-white text-[var(--color-slate)] hover:border-[var(--color-teal)] hover:text-[var(--color-navy)]"}`}
							role="tab"
							aria-selected={active}
						>
							{item[locale]}
						</button>
					);
				})}
			</div>

			{visiblePosts.length ? (
				<div className="mt-12 columns-1 gap-7 lg:columns-2">
					{visiblePosts.map((post) => (
						<div key={post.id} className="mb-7 break-inside-avoid">
							<SocialPostCard post={post} locale={locale} />
						</div>
					))}
				</div>
			) : (
				<div className="mt-12 rounded-3xl border border-dashed border-[var(--color-line)] bg-white px-6 py-16 text-center text-[var(--color-slate)]">
					{locale === "ar" ? "لا توجد منشورات من هذه المنصة حاليًا." : "No posts from this platform yet."}
				</div>
			)}
		</>
	);
}
