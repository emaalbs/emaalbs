"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { getVideoSource } from "@/lib/video-embed";

type Props = {
	url: string;
	caption?: string;
	isAr: boolean;
};

export function BlogVideoBlock({ url, caption = "", isAr }: Props) {
	const source = getVideoSource(url);
	const [isPlaying, setIsPlaying] = useState(false);
	if (!source) return null;

	const frameTitle = caption.trim() || (isAr ? "فيديو المقال" : "Article video");
	const showYouTubePoster = source.kind === "youtube" && source.thumbnail && !isPlaying;
	const playerUrl = source.kind === "youtube" && isPlaying
		? `${source.src}?autoplay=1&rel=0`
		: source.src;

	return (
		<figure className="mx-auto my-10 w-full max-w-[620px]">
			<div className="group relative aspect-video w-full overflow-hidden rounded-[18px] border border-[var(--color-line)] bg-[#061923] shadow-[0_18px_50px_rgba(1,30,47,0.14)]">
				{source.kind === "file" ? (
					<video
						src={source.src}
						controls
						playsInline
						preload="metadata"
						className="h-full w-full object-contain"
					>
						{isAr ? "متصفحك لا يدعم تشغيل الفيديو." : "Your browser does not support video playback."}
					</video>
				) : showYouTubePoster ? (
					<button
						type="button"
						onClick={() => setIsPlaying(true)}
						className="absolute inset-0 z-10 h-full w-full cursor-pointer overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold)]"
						aria-label={isAr ? "تشغيل الفيديو" : "Play video"}
					>
						{/* YouTube thumbnails are intentionally loaded as plain images to avoid Next image proxying. */}
						<img
							src={source.thumbnail}
							alt=""
							loading="eager"
							decoding="async"
							onError={(event) => {
								const image = event.currentTarget;
								if (image.src.includes("maxresdefault.jpg")) {
									image.src = image.src.replace("maxresdefault.jpg", "hqdefault.jpg");
								}
							}}
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025] motion-reduce:transition-none"
						/>
						<span className="absolute inset-0 bg-gradient-to-t from-[#011E2F]/90 via-[#011E2F]/10 to-black/10" aria-hidden="true" />
						<span className="absolute inset-0 grid place-items-center">
							<span className="grid h-16 w-16 place-items-center rounded-full border border-white/35 bg-white/95 text-[var(--color-navy-dark)] shadow-[0_12px_36px_rgba(0,0,0,0.28)] transition-transform duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-105 motion-reduce:transform-none sm:h-[4.5rem] sm:w-[4.5rem]">
								<Play className="ms-1 h-6 w-6 fill-current sm:h-7 sm:w-7" aria-hidden="true" />
							</span>
						</span>
						<span className="absolute inset-x-0 bottom-0 z-10 p-5 pe-28 sm:p-6 sm:pe-32">
							<span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold)] rtl:tracking-normal">
								{isAr ? "شاهد الفيديو" : "Watch video"}
							</span>
							<span className="line-clamp-2 block text-sm font-bold leading-6 text-white sm:text-base">
								{frameTitle}
							</span>
						</span>
					</button>
				) : (
					<iframe
						src={playerUrl}
						title={frameTitle}
						loading="lazy"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
						referrerPolicy="strict-origin-when-cross-origin"
						sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
						className="absolute inset-0 h-full w-full border-0"
					/>
				)}
				<a
					href={source.originalUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="absolute end-3 top-3 z-20 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 bg-[#011E2F]/80 px-3.5 text-[11px] font-bold text-white backdrop-blur-md transition-[background-color,color,transform] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] motion-reduce:transform-none"
				>
					{source.kind === "youtube" ? "YouTube" : isAr ? "فتح المصدر" : "Open source"}
					<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
				</a>
			</div>
			<figcaption className="sr-only">{frameTitle}</figcaption>
		</figure>
	);
}
