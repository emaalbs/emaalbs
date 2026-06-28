"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

// Helper to extract YouTube video ID
function getYoutubeId(url: string): string | null {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	const match = url.match(regExp);
	return match && match[2].length === 11 ? match[2] : null;
}

export function EditionVideos({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

	if (!edition.videos || edition.videos.length === 0) return null;

	const handleVideoClick = (url: string) => {
		const videoId = getYoutubeId(url);
		if (videoId) {
			setActiveVideoId(videoId);
		} else {
			window.open(url, "_blank");
		}
	};

	const closePlayer = () => {
		setActiveVideoId(null);
	};

	return (
		<section className="bg-[var(--color-warm)] py-20 lg:py-24">
			<Container>
				<IbsSectionHeading
					overline={labels.videos ? labels.videos[locale] : (locale === "ar" ? "فيديوهات الفعالية" : "Event Videos")}
					title={
						locale === "ar"
							? "شاهد لقطات وجلسات من الفعالية."
							: "Watch key sessions and summit recaps."
					}
				/>

				<div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{edition.videos.map((vid) => {
						const videoId = getYoutubeId(vid.youtubeUrl);
						const thumbnailUrl = videoId
							? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
							: "/images/video-placeholder.webp";

						return (
							<div
								key={vid.id}
								className="group flex flex-col justify-between rounded-xl border border-[var(--color-line)] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-teal)] hover:shadow-[0_12px_32px_rgba(1,51,77,0.08)]"
							>
								<div>
									{/* Thumbnail / Video container */}
									<button
										onClick={() => handleVideoClick(vid.youtubeUrl)}
										className="relative aspect-video w-full overflow-hidden rounded-lg bg-black text-left cursor-pointer focus:outline-none block"
									>
										<img
											src={thumbnailUrl}
											alt={vid.title[locale]}
											className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
										/>
										<div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--color-navy)] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--color-teal)] group-hover:text-white">
												<Play className="h-5 w-5 fill-current ml-0.5" />
											</div>
										</div>
									</button>

									{/* Metadata */}
									<h3 className="mt-4 font-display text-base font-semibold leading-snug text-[var(--color-ink)] transition-colors duration-300 group-hover:text-[var(--color-teal)]">
										{vid.title[locale]}
									</h3>
								</div>
								
								<p className="mt-2 text-[13px] leading-[1.6] text-[var(--color-slate)]">
									{vid.description[locale]}
								</p>
							</div>
						);
					})}
				</div>
			</Container>

			{/* Inline Lightbox Video Modal using Framer Motion */}
			<AnimatePresence>
				{activeVideoId && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={closePlayer}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
					>
						<motion.div
							initial={{ scale: 0.95, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.95, y: 20 }}
							transition={{ type: "spring", duration: 0.4 }}
							className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close button */}
							<button
								onClick={closePlayer}
								className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 hover:scale-105 transition-all duration-200 border border-white/20 focus:outline-none cursor-pointer"
								aria-label="Close video player"
							>
								<X className="h-5 w-5" />
							</button>

							{/* Responsive Iframe Wrapper */}
							<div className="relative aspect-video w-full">
								<iframe
									src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
									title="YouTube Video Player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
									className="absolute inset-0 h-full w-full"
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
