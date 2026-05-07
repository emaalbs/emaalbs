"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Header } from "@/components/site/Header";
import { useI18n } from "@/i18n/provider";

export default function WhatWeDoPage() {
  const { t, dir } = useI18n();

  const fadeUp = {
    initial: {
      opacity: 0,
      y: 50,
    },

    whileInView: {
      opacity: 1,
      y: 0,
    },

    transition: {
      duration: 0.8,
      ease: "easeOut",
    },

    viewport: {
      once: true,
      amount: 0.2,
    },
  };

  const focusItems = [
    {
      title: t.whatWeDo.focus.items[0].title,
      description: t.whatWeDo.focus.items[0].description,
    },

    {
      title: t.whatWeDo.focus.items[1].title,
      description: t.whatWeDo.focus.items[1].description,
    },

    {
      title: t.whatWeDo.focus.items[2].title,
      description: t.whatWeDo.focus.items[2].description,
    },

    {
      title: t.whatWeDo.focus.items[3].title,
      description: t.whatWeDo.focus.items[3].description,
    },
  ];

  const platforms = [
    {
      title: t.whatWeDo.delivery.platforms[0].title,
      description: t.whatWeDo.delivery.platforms[0].description,
    },

    {
      title: t.whatWeDo.delivery.platforms[1].title,
      description: t.whatWeDo.delivery.platforms[1].description,
    },

    {
      title: t.whatWeDo.delivery.platforms[2].title,
      description: t.whatWeDo.delivery.platforms[2].description,
    },
  ];

  return (
    <main dir={dir} className="overflow-hidden">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07131F] py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_40%)]" />

        <div className="absolute -top-40 left-0 h-96 w-96 animate-pulse rounded-full bg-teal-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 animate-pulse rounded-full bg-[#C8A45D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
            }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="mb-6 inline-flex rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/10 px-5 py-2 text-sm font-medium text-[#E5C98B] backdrop-blur">
              {t.whatWeDo.badge}
            </span>

            <h1 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">
              <span className="bg-gradient-to-r from-white to-[#C8A45D] bg-clip-text text-transparent">
                {t.whatWeDo.hero.title}
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
              {t.whatWeDo.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <motion.section {...fadeUp} className="bg-white py-24 text-[#07131F]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              {t.whatWeDo.intro.title}
            </h2>

            <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />

            <p className="mt-8 text-lg leading-9 text-gray-600">
              {t.whatWeDo.intro.description}
            </p>
          </div>
        </div>
      </motion.section>

      {/* CORE FOCUS */}
			<motion.section
				{...fadeUp}
				className="relative overflow-hidden bg-[#07131F] py-24 text-white"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,164,93,0.08),transparent_60%)]" />

				<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-4xl font-bold md:text-5xl">
							{
								t
									.whatWeDo
									.focus
									.title
							}
						</h2>

						<div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />
					</div>

					<div className="mt-16 grid gap-8 md:grid-cols-2">
						{focusItems.map(
							(
								item,
								index,
							) => (
								<motion.div
									key={
										index
									}
									initial={{
										opacity: 0,
										y: 40,
									}}
									whileInView={{
										opacity: 1,
										y: 0,
									}}
									transition={{
										duration: 0.6,
										delay:
											index *
											0.15,
									}}
									viewport={{
										once: true,
									}}
									className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-[#C8A45D]/40 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-[#C8A45D]/10"
								>
									<div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />

									<div className="relative z-10">
										<div className="mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400 transition-all duration-500 group-hover:w-28" />

										<h3 className="mb-4 text-2xl font-semibold text-white">
											{
												item.title
											}
										</h3>

										<p className="leading-8 text-white/70">
											{
												item.description
											}
										</p>
									</div>
								</motion.div>
							),
						)}
					</div>
				</div>
			</motion.section>
      {/* DELIVERY */}
      <motion.section {...fadeUp} className="bg-white py-24 text-[#07131F]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              {t.whatWeDo.delivery.title}
            </h2>

            <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />

            <p className="mt-6 text-lg text-gray-600">
              {t.whatWeDo.delivery.description}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                viewport={{
                  once: true,
                }}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-4 hover:border-[#C8A45D]/40 hover:bg-[#07131F] hover:text-white hover:shadow-2xl hover:shadow-[#07131F]/20"
              >
                <div className="relative z-10">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#07131F] text-2xl font-bold text-white transition-all duration-500 group-hover:bg-white group-hover:text-[#07131F]">
                    0{index + 1}
                  </div>

                  <h3 className="mb-4 text-2xl font-semibold">
                    {platform.title}
                  </h3>

                  <p className="leading-8 text-gray-600 transition duration-300 group-hover:text-white/70">
                    {platform.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* INTERNATIONAL */}
      <motion.section
        {...fadeUp}
        className="relative bg-[#07131F] py-24 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(20,184,166,0.12),transparent_45%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-white/[0.04] p-12 text-center backdrop-blur-xl">
            <h2 className="text-4xl font-bold md:text-5xl">
              {t.whatWeDo.international.title}
            </h2>

            <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />

            <p className="mt-8 text-lg leading-9 text-white/70">
              {t.whatWeDo.international.description}
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section {...fadeUp} className="bg-white pb-28 pt-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] border border-[#C8A45D]/20 bg-gradient-to-br from-[#0D1B2A] to-[#102638] px-8 py-20 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,164,93,0.15),transparent_45%)]" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="text-4xl font-bold md:text-5xl">
                {t.whatWeDo.cta.title}
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/70">
                {t.whatWeDo.cta.description}
              </p>

              <div className="mt-10">
                <Link href="/contact">
                  <button className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-gold)] px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-navy-dark)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9F7A33] hover:text-white hover:shadow-[0_10px_30px_rgba(201,169,110,0.28)]">
                    {t.whatWeDo.cta.button}

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      ↗
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
