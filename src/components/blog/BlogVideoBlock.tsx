import { ExternalLink } from "lucide-react";
import { getVideoSource } from "@/lib/video-embed";

type Props = {
	url: string;
	caption?: string;
	isAr: boolean;
};

export function BlogVideoBlock({ url, caption = "", isAr }: Props) {
	const source = getVideoSource(url);
	if (!source) return null;

	const frameTitle = caption.trim() || (isAr ? "فيديو المقال" : "Article video");

	return (
		<figure className="my-12 overflow-hidden rounded-[22px] border border-[var(--color-line)] bg-[var(--color-navy-dark)] shadow-[0_24px_70px_rgba(1,30,47,0.16)]">
			<div className="relative aspect-video w-full bg-[#061923]">
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
				) : (
					<iframe
						src={source.src}
						title={frameTitle}
						loading="lazy"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
						referrerPolicy="strict-origin-when-cross-origin"
						sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
						className="absolute inset-0 h-full w-full border-0"
					/>
				)}
			</div>
			<figcaption className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
				<span className="text-sm leading-7 text-white/75">
					{caption.trim() || (isAr ? "شاهد الفيديو المرتبط بهذا الخبر" : "Watch the video featured in this story")}
				</span>
				<a
					href={source.originalUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-[var(--color-gold)]/45 px-4 text-xs font-bold text-[var(--color-gold)] transition-[background-color,color,transform] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-navy-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] motion-reduce:transform-none"
				>
					{isAr ? "فتح الفيديو" : "Open video"}
					<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
				</a>
			</figcaption>
		</figure>
	);
}
