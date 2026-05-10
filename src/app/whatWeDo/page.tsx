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
<section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-28 text-white">

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
      <span className="mb-6 inline-flex rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-5 py-2 text-sm font-medium text-[var(--color-gold)] backdrop-blur">
        {t.whatWeDo.badge}
      </span>

      <h1 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">
        <span className="text-[var(--color-gold)]">
          {t.whatWeDo.hero.title}
        </span>
      </h1>

      <p className="max-w-2xl text-lg leading-8 text-[var(--color-silver)] md:text-xl">
        {t.whatWeDo.hero.description}
      </p>

      {/* STATS */}
      <div className="mt-12 flex flex-wrap gap-8">
        <div>
          <h3 className="text-3xl font-bold text-[var(--color-gold)]">
            {partners}+
          </h3>

          <p className="mt-1 text-sm text-white/60">
            Global Partners
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-[var(--color-gold)]">
            {projects}+
          </h3>

          <p className="mt-1 text-sm text-white/60">
            Active Projects
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-[var(--color-gold)]">
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
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <Image
          src="/images/WwdHero.png"
          alt="Hero"
          width={800}
          height={900}
          className="h-[600px] w-full rounded-[30px] object-cover"
        />
      </div>

      <div className="absolute -bottom-8 -left-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
        <p className="text-sm text-[var(--color-silver)]">
          Innovative Solutions
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          Premium Experience
        </h3>
      </div>
    </motion.div>
  </div>
</section>

      {/* INTRO */}
<motion.section
  {...fadeUp}
  className="relative overflow-hidden bg-white py-28 text-[var(--color-navy)]"
>
  {/* Ambient Glow */}
  <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[var(--color-gold)]/8 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-[var(--color-teal)]/8 blur-[120px]" />

  <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2 lg:px-8">
    {/* Images */}
    <div className="relative">
      <div className="grid grid-cols-2 gap-5">
        <Image
          src="/images/intro1.png"
          alt=""
          width={500}
          height={700}
          className="h-[420px] rounded-[30px] border border-[var(--color-line)] object-cover shadow-[0_20px_60px_rgba(1,30,47,0.08)]"
        />

        <div className="space-y-5 pt-12">
          <Image
            src="/images/intro2.jpg"
            alt=""
            width={500}
            height={300}
            className="h-[200px] rounded-[30px] border border-[var(--color-line)] object-cover shadow-[0_20px_60px_rgba(1,30,47,0.08)]"
          />

          {/* Card */}
          <div className="rounded-[30px] border border-[var(--color-line)] bg-[var(--color-navy)] p-10 text-white shadow-[0_20px_60px_rgba(1,30,47,0.18)]">
            <h3 className="text-4xl font-bold text-[var(--color-gold)]">
              2026
            </h3>

            <div className="mt-4 h-[2px] w-20 bg-gradient-to-r from-[var(--color-teal)] to-transparent" />

            <p className="mt-5 text-white/70">
              Building future-ready experiences
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Content */}
    <div>
      {/* Overline */}
      <div className="flex items-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold-deep)]/50" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
          INTRODUCTION
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-navy)]">
        {t.whatWeDo.intro.title}
      </h2>

      {/* Accent */}
      <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[var(--color-gold-deep)] to-transparent" />

      {/* Description */}
      <p className="mt-8 text-[16px] leading-[1.9] text-[var(--color-slate)]">
        {t.whatWeDo.intro.description}
      </p>
    </div>
  </div>
</motion.section>

     {/* CORE FOCUS */}
<motion.section
  {...fadeUp}
  className="relative overflow-hidden bg-[var(--color-navy-dark)] py-28 text-white"
>
  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    
    {/* Header */}
    <div className="text-center">
      {/* Overline */}
      <div className="flex items-center justify-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold)]/40" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
          CORE FOCUS
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
        {t.whatWeDo.focus.title}
      </h2>

      {/* Accent */}
      <div className="mx-auto mt-8 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--color-teal)] to-transparent" />
    </div>

    {/* Cards */}
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
          className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-[var(--color-teal)] hover:bg-white/[0.05] hover:shadow-[0_20px_40px_rgba(0,102,102,0.12)]"
        >
          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />

          <div className="relative z-10">
            {/* Number */}
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-2xl font-black text-[var(--color-gold)] transition duration-300 group-hover:bg-[var(--color-teal)] group-hover:text-white">
              0{index + 1}
            </div>

            {/* Title */}
            <h3 className="mb-5 text-3xl font-semibold text-white">
              {item.title}
            </h3>

            {/* Description */}
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
  className="relative overflow-hidden bg-white py-28 text-[var(--color-navy)]"
>
  {/* Ambient Glow */}
  <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[var(--color-gold)]/8 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-[var(--color-teal)]/8 blur-[120px]" />

  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    {/* Header */}
    <div className="mx-auto max-w-3xl text-center">
      {/* Overline */}
      <div className="flex items-center justify-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold-deep)]/50" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
          DELIVERY
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-navy)]">
        {t.whatWeDo.delivery.title}
      </h2>

      {/* Accent */}
      <div className="mx-auto mt-8 h-[2px] w-32 bg-gradient-to-r from-[var(--color-gold-deep)] to-transparent" />

      {/* Description */}
      <p className="mt-8 text-[16px] leading-[1.9] text-[var(--color-slate)]">
        {t.whatWeDo.delivery.description}
      </p>
    </div>

    {/* Cards */}
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
          className="group overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-white transition-all duration-500 hover:-translate-y-3 hover:border-[var(--color-teal)] hover:shadow-[0_20px_40px_rgba(0,102,102,0.12)]"
        >
          {/* Image */}
          <div className="overflow-hidden">
            <Image
              src={platform.image}
              alt={platform.title}
              width={600}
              height={400}
              className="h-[220px] w-full object-cover transition duration-700 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Number */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-2xl font-black text-[var(--color-gold)] transition duration-300 group-hover:bg-[var(--color-teal)] group-hover:text-white">
              0{index + 1}
            </div>

            {/* Title */}
            <h3 className="mb-4 text-2xl font-semibold text-[var(--color-navy)]">
              {platform.title}
            </h3>

            {/* Description */}
            <p className="leading-8 text-[var(--color-slate)]">
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
  className="relative overflow-hidden bg-[var(--color-navy-dark)] py-28 text-white"
>
  <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
    
    {/* Image */}
    <div className="relative">

      {/* Frame */}
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
        <Image
          src="/images/about-secondary.jpg"
          alt=""
          width={700}
          height={700}
          className="rounded-[30px] object-cover"
        />
      </div>
    </div>

    {/* Content */}
    <div className="rounded-[40px] border border-white/10 bg-white/[0.04] p-12 backdrop-blur-xl">
      {/* Overline */}
      <div className="flex items-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold)]/40" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
          INTERNATIONAL
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
        {t.whatWeDo.international.title}
      </h2>

      {/* Accent */}
      <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[var(--color-teal)] via-[var(--color-teal)]/50 to-transparent" />

      {/* Description */}
      <p className="mt-8 text-[16px] leading-[1.9] text-white/70">
        {t.whatWeDo.international.description}
      </p>
    </div>
  </div>
</motion.section>

     {/* CTA */}
<motion.section
  {...fadeUp}
  className="relative overflow-hidden bg-white pb-28 pt-14"
>
  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    
    <div className="relative overflow-hidden rounded-[40px] border border-[var(--color-line)] bg-[var(--color-navy-dark)] px-8 py-24 text-center text-white shadow-[0_25px_80px_rgba(1,30,47,0.25)]">

      <div className="relative z-10 mx-auto max-w-3xl">
        
        {/* Overline */}
        <div className="flex items-center justify-center gap-5">
          <span className="h-px w-10 bg-[var(--color-gold)]/40" />

          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
            GET STARTED
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
          {t.whatWeDo.cta.title}
        </h2>

        {/* Accent */}
        <div className="mx-auto mt-8 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--color-teal)] to-transparent" />

        {/* Description */}
        <p className="mt-8 text-[16px] leading-[1.9] text-white/70">
          {t.whatWeDo.cta.description}
        </p>

        {/* Button */}
        <div className="mt-12">
          <Link href="/contact">
            <button className="group inline-flex items-center gap-3 rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--color-navy-dark)] shadow-[0_10px_30px_rgba(200,164,93,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-gold-deep)] hover:text-white hover:shadow-[0_14px_40px_rgba(200,164,93,0.35)]">
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