"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, LoaderCircle } from "lucide-react";
import type { SocialPlatform } from "@/data/social-posts";
import { getSocialEmbedDescriptor, getSocialPlatformLabel } from "@/lib/social-platforms";

declare global {
	interface Window {
		instgrm?: { Embeds?: { process: () => void } };
		twttr?: { widgets?: { load: (element?: HTMLElement) => void } };
	}
}

function loadScript(id: string, src: string, onLoad: () => void) {
	const existing = document.getElementById(id) as HTMLScriptElement | null;
	if (existing) {
		if (existing.dataset.loaded === "true") onLoad();
		else existing.addEventListener("load", onLoad, { once: true });
		return;
	}
	const script = document.createElement("script");
	script.id = id;
	script.async = true;
	script.src = src;
	script.addEventListener("load", () => {
		script.dataset.loaded = "true";
		onLoad();
	}, { once: true });
	document.body.appendChild(script);
}

export function SocialEmbed({
	url,
	platform,
	locale,
	compact = false,
}: {
	url: string;
	platform: SocialPlatform;
	locale: "en" | "ar";
	compact?: boolean;
}) {
	const rootRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);
	const descriptor = useMemo(() => getSocialEmbedDescriptor(url), [url]);
	const isAr = locale === "ar";

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		if (!("IntersectionObserver" in window)) {
			setActive(true);
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setActive(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "400px 0px" },
		);
		observer.observe(root);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!active || !descriptor?.supported) return;
		if (platform === "instagram") {
			loadScript("instagram-embed-script", "https://www.instagram.com/embed.js", () => window.instgrm?.Embeds?.process());
		}
		if (platform === "x") {
			loadScript("x-embed-script", "https://platform.twitter.com/widgets.js", () => {
				if (rootRef.current) window.twttr?.widgets?.load(rootRef.current);
			});
		}
	}, [active, descriptor, platform, url]);

	if (!descriptor?.supported) {
		return (
			<div ref={rootRef} className="grid min-h-52 place-items-center rounded-2xl bg-slate-50 px-6 py-10 text-center">
				<div>
					<p className="text-sm text-slate-500">
						{isAr ? "لا يمكن عرض هذا المنشور داخل الصفحة." : "This post cannot be embedded on the page."}
					</p>
					<a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-teal)] hover:underline">
						{isAr ? "فتح المنشور الأصلي" : "Open original post"}
						<ExternalLink className="h-4 w-4" />
					</a>
				</div>
			</div>
		);
	}

	if (!active) {
		return (
			<div ref={rootRef} className={`grid place-items-center rounded-2xl bg-slate-50 text-slate-400 ${compact ? "min-h-48" : "min-h-72"}`}>
				<div className="flex items-center gap-2 text-sm font-medium">
					<LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" />
					{isAr ? `جاري تحميل ${getSocialPlatformLabel(platform)}` : `Loading ${getSocialPlatformLabel(platform)}`}
				</div>
			</div>
		);
	}

	if (platform === "youtube" || platform === "linkedin" || platform === "facebook") {
		return (
			<div ref={rootRef} className={platform === "youtube" ? "aspect-video w-full overflow-hidden rounded-2xl" : "w-full overflow-hidden rounded-2xl bg-white"}>
				<iframe
					src={descriptor.embedUrl}
					title={`${getSocialPlatformLabel(platform)} post`}
					loading="lazy"
					allow={platform === "youtube" ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" : "fullscreen"}
					allowFullScreen
					referrerPolicy="strict-origin-when-cross-origin"
					className={platform === "youtube" ? "h-full w-full border-0" : `${compact ? "h-[420px]" : "h-[650px]"} w-full border-0`}
				/>
			</div>
		);
	}

	if (platform === "instagram") {
		return (
			<div ref={rootRef} className="social-instagram-embed flex min-h-72 justify-center overflow-hidden rounded-2xl bg-white">
				<blockquote
					className="instagram-media"
					data-instgrm-permalink={url}
					data-instgrm-version="14"
					style={{ width: "100%", minWidth: 0, margin: 0 }}
				>
					<a href={url} target="_blank" rel="noopener noreferrer">Instagram</a>
				</blockquote>
			</div>
		);
	}

	return (
		<div ref={rootRef} className="social-x-embed flex min-h-72 justify-center overflow-hidden rounded-2xl bg-white px-2">
			<blockquote className="twitter-tweet" data-dnt="true">
				<a href={url}>X</a>
			</blockquote>
		</div>
	);
}
