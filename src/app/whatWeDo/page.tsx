"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Header } from "@/components/site/Header";
import { useI18n } from "@/i18n/provider";

export default function WhatWeDoPage() {
  const { t, dir } = useI18n();

  /* =========================
     COUNTER ANIMATION
  ========================= */

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

  /* =========================
     PLATFORMS WITH CUSTOM IMAGES
  ========================= */

  const platforms = [
    {
      title: t.whatWeDo.delivery.platforms[0].title,
      description: t.whatWeDo.delivery.platforms[0].description,
      image: "/images/ibs.png",
    },

    {
      title: t.whatWeDo.delivery.platforms[1].title,
      description: t.whatWeDo.delivery.platforms[1].description,
      image: "/images/ibs-feature.jpg",
    },

    {
      title: t.whatWeDo.delivery.platforms[2].title,
      description: t.whatWeDo.delivery.platforms[2].description,
      image: "/images/group-tech.jpg",
    },
  ];

  return (
    <main dir={dir} className="overflow-hidden bg-white">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07131F] py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_40%)]" />

        <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#C8A45D]/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          {/* TEXT */}
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

            {/* STATS */}
            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <h3 className="text-3xl font-bold text-[#C8A45D]">
                  {partners}+
                </h3>

                <p className="mt-1 text-sm text-white/60">
                  Global Partners
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#C8A45D]">
                  {projects}+
                </h3>

                <p className="mt-1 text-sm text-white/60">
                  Active Projects
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#C8A45D]">
                  {focus}%
                </h3>

                <p className="mt-1 text-sm text-white/60">
                  Client Focus
                </p>
              </div>
            </div>
          </motion.div>

          {/* VISUAL */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
            }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <Image
                src="/images/WwdHero.png"
                alt="Hero"
                width={800}
                height={900}
                className="h-[600px] w-full rounded-[30px] object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-8 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm text-white/60">
                Innovative Solutions
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Premium Experience
              </h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <motion.section
        {...fadeUp}
        className="relative bg-white py-28 text-[#07131F]"
      >
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
                  <h3 className="text-4xl font-bold text-[#C8A45D]">
                    2026
                  </h3>

                  <p className="mt-3 text-white/70">
                    Building future-ready experiences
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold md:text-5xl">
              {t.whatWeDo.intro.title}
            </h2>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />

            <p className="mt-8 text-lg leading-9 text-gray-600">
              {t.whatWeDo.intro.description}
            </p>
          </div>
        </div>
      </motion.section>

      {/* CORE FOCUS */}
      <motion.section
        {...fadeUp}
        className="relative overflow-hidden bg-[#07131F] py-28 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,164,93,0.08),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              {t.whatWeDo.focus.title}
            </h2>

            <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {focusItems.map((item, index) => (
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
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-[#C8A45D]/40"
              >
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />

                <div className="relative z-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C8A45D] to-[#8A6A2F] text-2xl font-bold text-[#07131F]">
                    0{index + 1}
                  </div>

                  <h3 className="mb-5 text-3xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="leading-8 text-white/70">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* DELIVERY */}
      <motion.section
        {...fadeUp}
        className="relative bg-white py-28 text-[#07131F]"
      >
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

          <div className="mt-20 grid gap-8 md:grid-cols-3">
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
                className="group overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl"
              >
                <div className="overflow-hidden">
                  <Image
                    src={platform.image}
                    alt={platform.title}
                    width={600}
                    height={400}
                    className="h-[220px] w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#07131F] text-2xl font-bold text-white">
                    0{index + 1}
                  </div>

                  <h3 className="mb-4 text-2xl font-semibold">
                    {platform.title}
                  </h3>

                  <p className="leading-8 text-gray-600">
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
        className="relative overflow-hidden bg-[#07131F] py-28 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(20,184,166,0.12),transparent_45%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Image
              src="/images/about-secondary.jpg"
              alt=""
              width={700}
              height={700}
              className="rounded-[40px] object-cover"
            />
          </div>

          <div className="rounded-[40px] border border-white/10 bg-white/[0.04] p-12 backdrop-blur-xl">
            <h2 className="text-4xl font-bold md:text-5xl">
              {t.whatWeDo.international.title}
            </h2>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />

            <p className="mt-8 text-lg leading-9 text-white/70">
              {t.whatWeDo.international.description}
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section {...fadeUp} className="bg-white pb-28 pt-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] border border-[#C8A45D]/20 bg-gradient-to-br from-[#0D1B2A] to-[#102638] px-8 py-24 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,164,93,0.15),transparent_45%)]" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="text-5xl font-bold">
                {t.whatWeDo.cta.title}
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/70">
                {t.whatWeDo.cta.description}
              </p>

              <div className="mt-10">
                <Link href="/contact">
                  <button className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-gold)] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--color-navy-dark)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#9F7A33] hover:text-white hover:shadow-[0_10px_30px_rgba(201,169,110,0.28)]">
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