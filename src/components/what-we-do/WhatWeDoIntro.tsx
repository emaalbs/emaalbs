"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { fadeUp } from "./motion";

export function WhatWeDoIntro() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";

	return (
		<motion.section {...fadeUp} className="relative bg-white py-28 text-[#07131F]">
			<div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2 lg:px-8">
				<div className="relative">
					<div className="grid grid-cols-2 gap-5">
						<Image
							src="/images/intro1.png"
							alt=""
							width={500}
							height={700}
							className="h-[420px] rounded-[30px] object-cover"
						/>
						<div className="space-y-5 pt-12">
							<Image
								src="/images/intro2.jpg"
								alt=""
								width={500}
								height={300}
								className="h-[200px] rounded-[30px] object-cover"
							/>
							<div className="rounded-[30px] bg-[#07131F] p-10 text-white">
								<h3 className="text-4xl font-bold text-[#C8A45D]">2026</h3>
								<p className="mt-3 text-white/70">Building future ready experiences</p>
							</div>
						</div>
					</div>
				</div>

				<div>
					<h2 className={`text-4xl font-bold md:text-5xl ${isAr ? "leading-[1.35]" : "leading-tight"}`}>{t.whatWeDo.intro.title}</h2>
					<div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />
					<p className="mt-8 text-lg leading-9 text-gray-600">
						{t.whatWeDo.intro.description}
					</p>
				</div>
			</div>
		</motion.section>
	);
}
