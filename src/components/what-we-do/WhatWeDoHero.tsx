"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";

export function WhatWeDoHero() {
	const { t } = useI18n();

	const [partners, setPartners] = useState(0);
	const [projects, setProjects] = useState(0);
	const [focus, setFocus] = useState(0);

	useEffect(() => {
		const animateValue = (
			setter: React.Dispatch<React.SetStateAction<number>>,
			end: number,
			duration: number
		) => {
			let start = 0;
			const increment = end / (duration / 16);
			const timer = setInterval(() => {
				start += increment;
				if (start >= end) {
					setter(end);
					clearInterval(timer);
				} else {
					setter(Math.floor(start));
				}
			}, 16);
		};

		animateValue(setPartners, 10, 1200);
		animateValue(setProjects, 25, 1400);
		animateValue(setFocus, 100, 1600);
	}, []);

	return (
		<section className="relative overflow-hidden bg-[#07131F] py-28 text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_40%)]" />
			<div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
			<div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#C8A45D]/10 blur-3xl" />

			<div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9 }}
				>
					<span className="mb-6 inline-flex rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/10 px-5 py-2 text-sm font-medium text-[#E5C98B] backdrop-blur">
						{t.whatWeDo.badge}
					</span>
					<h1 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">
						<span className="bg-gradient-to-r from-white to-[#C8A45D] bg-clip-text text-transparent">
							{t.whatWeDo.hero.title}
						</span>
					</h1>
					<p className="max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
						{t.whatWeDo.hero.description}
					</p>

					<div className="mt-12 flex flex-wrap gap-8">
						<div>
							<h3 className="text-3xl font-bold text-[#C8A45D]">{partners}+</h3>
							<p className="mt-1 text-sm text-white/60">Global Partners</p>
						</div>
						<div>
							<h3 className="text-3xl font-bold text-[#C8A45D]">{projects}+</h3>
							<p className="mt-1 text-sm text-white/60">Active Projects</p>
						</div>
						<div>
							<h3 className="text-3xl font-bold text-[#C8A45D]">{focus}%</h3>
							<p className="mt-1 text-sm text-white/60">Client Focus</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1 }}
					className="relative"
				>
					<div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
						<Image
							src="/images/WwdHero.png"
							alt="Hero"
							width={800}
							height={900}
							priority
							className="h-[600px] w-full rounded-[30px] object-cover"
						/>
					</div>
					<div className="absolute -bottom-8 -left-8 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
						<p className="text-sm text-white/60">Innovative Solutions</p>
						<h3 className="mt-2 text-2xl font-bold">Premium Experience</h3>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
