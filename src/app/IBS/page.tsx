"use client";

import Image from "next/image";
import Link from "next/link";

import { motion, useScroll, useTransform } from "framer-motion";

import { useRef, useState } from "react";

import { ArrowRight, Check, Volume2, VolumeX } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/Button";

import { useI18n } from "@/i18n/provider";

export default function IBSPage() {
  const [activePackage, setActivePackage] = useState(0);
  const { t, dir, locale } = useI18n();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);

  const heroVideo =
    locale === "ar" ? "/images/عربي.mp4" : "/images/انكليزي.mp4";

  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const fadeUp = {
    initial: {
      opacity: 0,
      y: 60,
    },

    whileInView: {
      opacity: 1,
      y: 0,
    },

    transition: {
      duration: 0.8,
    },

    viewport: {
      once: true,
      amount: 0.2,
    },
  };

  return (
    <main dir={dir} className="overflow-hidden bg-[#07131F]">
      <Header />

     {/* HERO */}
<section
  ref={heroRef}
  className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] pt-32 pb-24 text-white"
>
  

  <motion.div
    style={{ y }}
    className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8"
  >
    {/* TOP CONTENT */}
    <div className="text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
        <span className="inline-block h-px w-8 bg-[var(--color-teal)]" />

        {t.ibsPage.badge}
      </div>

      {/* Title */}
      <h1 className="mx-auto mt-6 max-w-6xl font-display font-bold tracking-display text-white text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.08]">
        <span className="text-[var(--color-gold)] leading-[1.4]">
          {t.ibsPage.hero.title}
        </span>
      </h1>

      {/* Description */}
      <p className="mx-auto mt-6 max-w-3xl text-[15px] sm:text-[17px] leading-[1.9] text-[var(--color-silver)]">
        {t.ibsPage.hero.description}
      </p>

      {/* Accent Line */}
      <div className="mx-auto mt-8 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--color-teal)]/70 to-transparent" />

      {/* Buttons */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          href="#partner"
          variant="gold"
          size="md"
          withArrow
        >
          {t.ibsPage.hero.ctaPrimary}
        </Button>

        <Button
          href="#participation"
          variant="outline-teal"
          size="md"
        >
          {t.ibsPage.hero.ctaSecondary}
        </Button>
      </div>
    </div>

    {/* VIDEO */}
    <div className="relative mt-20">
      {/* Outer Glow */}
      <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-r from-[var(--color-gold)]/20 to-[var(--color-teal)]/20 blur-3xl" />

      {/* Frame */}
      <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
        <div className="relative overflow-hidden rounded-[28px]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="aspect-video w-full object-cover"
          >
            <source
              src={heroVideo}
              type="video/mp4"
            />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.88)] via-transparent to-transparent" />

          {/* Bottom Content */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Iraq Business Summit
              </p>

              <h3 className="mt-2 text-3xl font-bold text-white">
                Baghdad 2026
              </h3>
            </div>

            {/* Sound Button */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute -left-8 top-10 hidden xl:block">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
          <p className="text-sm text-white/60">
            Investment
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Opportunities
          </h3>
        </div>
      </div>

      <div className="absolute -bottom-8 right-10 hidden xl:block">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
          <p className="text-sm text-white/60">
            Direct Access
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Government
          </h3>
        </div>
      </div>
    </div>
  </motion.div>
</section>

      {/* WHY IBS */}
<section className="relative overflow-hidden bg-white py-32">
  {/* Ambient Glow */}
  <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-[var(--color-gold)]/8 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-[var(--color-teal)]/8 blur-[120px]" />

  <div className="relative z-10 mx-auto grid max-w-7xl gap-24 px-6 lg:grid-cols-2 lg:px-8">
    {/* Images */}
    <motion.div
      {...fadeUp}
      className="relative"
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Main Image */}
        <Image
          src="/images/whyIBS.png"
          alt=""
          width={1200}
          height={800}
          className="h-[520px] w-full rounded-[32px] border border-[var(--color-line)] object-cover shadow-[0_20px_60px_rgba(1,30,47,0.08)]"
        />

        <div className="space-y-5 pt-14">
          {/* Secondary Image */}
          <Image
            src="/images/ibs.png"
            alt=""
            width={500}
            height={300}
            className="h-[240px]  rounded-[32px] border border-[var(--color-line)] object-cover shadow-[0_20px_60px_rgba(1,30,47,0.08)]"
          />

          {/* Card */}
<div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-navy)] p-10 text-white shadow-[0_20px_60px_rgba(1,30,47,0.18)]">
  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
    Iraq Business Summit
  </p>

  <h3 className="mt-4 text-5xl font-black text-[var(--color-gold)]">
    IBS
  </h3>

  <div className="mt-6 h-[2px] w-20 bg-gradient-to-r from-[var(--color-teal)] to-transparent" />

  <p className="mt-6 leading-8 text-white/70">
    Connecting business, investment, and
    decision-making across Iraq and the region.
  </p>
</div>
        </div>
      </div>
    </motion.div>

    {/* Content */}
    <motion.div
      {...fadeUp}
      className="flex flex-col justify-center"
    >
      {/* Overline */}
      <div className="flex items-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold-deep)]/50" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
          WHY IBS
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-navy)]">
        {t.ibsPage.why.title}
      </h2>

      {/* Description */}
      <p className="mt-8 max-w-2xl text-[16px] leading-[1.85] text-[var(--color-slate)]">
        {t.ibsPage.why.description}
      </p>

      {/* Accent */}
      <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[var(--color-gold-deep)] to-transparent" />

      {/* Features */}
      <div className="mt-12 grid gap-5">
        {t.ibsPage.why.items.map(
          (item, index) => (
            <div
              key={index}
              className="group flex gap-5 rounded-[24px] border border-[var(--color-line)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-teal)] hover:shadow-[0_20px_40px_rgba(0,102,102,0.12)]"
            >
              {/* Icon */}
<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-gold)] transition duration-300 group-hover:bg-[var(--color-teal)] group-hover:text-white">
  <Check className="h-5 w-5" />
</div>

              {/* Text */}
              <p className="text-[16px] leading-8 text-[var(--color-slate)]">
                {item}
              </p>
            </div>
          ),
        )}
      </div>
    </motion.div>
  </div>
</section>  

  {/* PARTICIPANTS */}
<section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-32 text-white">

  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    
    {/* Header */}
    <motion.div
      {...fadeUp}
      className="text-center"
    >
      {/* Overline */}
      <div className="flex items-center justify-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
        <span className="inline-block h-px w-8 bg-[var(--color-teal)]" />

        PARTICIPANTS
      </div>

      {/* Title */}
      <h2 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.15] tracking-display text-white">
        {t.ibsPage.participants.title}
      </h2>

      {/* Description */}
      <p className="mx-auto mt-8 max-w-3xl text-[16px] leading-[1.9] text-[var(--color-silver)]">
        {t.ibsPage.participants.description}
      </p>

      {/* Accent */}
      <div className="mx-auto mt-8 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--color-teal)]/70 to-transparent" />
    </motion.div>

    {/* Cards */}
    <div className="mt-20 grid gap-8 md:grid-cols-3">
      {t.ibsPage.participants.groups.map(
        (group, index) => (
          <motion.div
            key={index}
            {...fadeUp}
            className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-gold)]/30"
          >
            {/* Number */}
            <div className="absolute right-6 top-2 text-[110px] font-black leading-none text-white/[0.03]">
              0{index + 1}
            </div>

            {/* Title */}
            <h3 className="relative z-10 text-3xl font-bold leading-tight text-white">
              {group.title}
            </h3>

            {/* Line */}
            <div className="relative z-10 mt-6 h-[2px] w-16 bg-gradient-to-r from-[var(--color-teal)] to-transparent" />

            {/* Items */}
            <div className="relative z-10 mt-8 space-y-6">
              {group.items.map(
                (item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                  >
                    {/* Bullet */}
                    <div className="mt-[10px] flex h-3 w-3 shrink-0 rounded-full bg-[var(--color-gold)]" />

                    {/* Text */}
                    <p className="leading-8 text-white/70">
                      {item}
                    </p>
                  </div>
                ),
              )}
            </div>
          </motion.div>
        ),
      )}
    </div>
  </div>
</section>
{/* SECTORS */}
<section className="relative overflow-hidden bg-white py-32">

  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    
    {/* Header */}
    <motion.div
      {...fadeUp}
      className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end"
    >
      <div className="max-w-3xl">
        {/* Overline */}
        <div className="flex items-center gap-5">
          <span className="h-px w-10 bg-[var(--color-gold-deep)]/50" />

          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
            SECTORS
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-navy)]">
          {t.ibsPage.sectors.title}
        </h2>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-[16px] leading-[1.85] text-[var(--color-slate)]">
          Key industries shaping Iraq’s future and creating
          high-value opportunities for investment,
          partnerships, and growth.
        </p>
      </div>

      {/* Accent Line */}
      <div className="hidden h-[2px] w-48 bg-gradient-to-r from-[var(--color-gold-deep)] to-transparent lg:block" />
    </motion.div>

    {/* Cards */}
    <div className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {t.ibsPage.sectors.items.map((sector, index) => (
        <motion.div
          key={index}
          {...fadeUp}
          className="group relative overflow-hidden rounded-[36px] border border-[var(--color-line)] bg-white p-10 transition-all duration-500 hover:-translate-y-3 hover:border-[var(--color-teal)] hover:shadow-[0_20px_40px_rgba(0,102,102,0.12)]"
        >
          {/* Top Number */}
          <div className="flex items-center justify-between">
            <div className="text-7xl font-black leading-none text-[var(--color-gold-deep)]/30 transition duration-500 group-hover:text-[var(--color-gold-deep)]/45">
              0{index + 1}
            </div>

            <div className="h-12 w-12 rounded-2xl border border-[var(--color-line)] bg-[var(--color-gold)]/10 backdrop-blur-sm" />
          </div>

          {/* Sector Name */}
          <div className="mt-12">
            <h3 className="text-3xl font-black leading-snug text-[var(--color-navy)] transition duration-300 group-hover:text-[var(--color-teal)]">
              {sector}
            </h3>

            <p className="mt-5 leading-8 text-[var(--color-slate)]">
              Strategic industry contributing to Iraq’s economic
              transformation and long-term regional development.
            </p>
          </div>

          {/* Bottom Line */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-[2px] w-12 bg-[var(--color-gold-deep)]" />

            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
              IBS 2026
            </span>
          </div>

          {/* Hover Glow */}
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[var(--color-gold-deep)]/0 blur-3xl transition-all duration-500 group-hover:bg-[var(--color-gold-deep)]/10" />
        </motion.div>
      ))}
    </div>
  </div>
</section>
      {/* LEADERS */}
<section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-32 text-white">

  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    
    {/* Header */}
    <motion.div
      {...fadeUp}
      className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-3xl">
        {/* Overline */}
        <div className="flex items-center gap-5">
          <span className="h-px w-10 bg-[var(--color-gold)]/40" />

          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
            LEADERS
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
          {t.ibsPage.leaders.title}
        </h2>
      </div>

      {/* Image */}
      <Image
        src="/images/leaders.JPG"
        alt=""
        width={300}
        height={200}
        className="hidden rounded-[28px] border border-white/10 object-cover shadow-[0_20px_60px_rgba(0,0,0,0.25)] lg:block"
      />
    </motion.div>

    {/* Cards */}
    <div className="mt-20 grid gap-8 md:grid-cols-2">
      {t.ibsPage.leaders.items.map((leader, index) => (
        <motion.div
          key={index}
          {...fadeUp}
          className="group flex items-start gap-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-teal)] hover:bg-white/[0.06] hover:shadow-[0_20px_40px_rgba(0,102,102,0.12)]"
        >
          {/* Number */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-xl font-black text-[var(--color-gold)] transition duration-300 group-hover:bg-[var(--color-teal)] group-hover:text-white">
            0{index + 1}
          </div>

          {/* Text */}
          <p className="text-xl leading-9 text-white/80">
            {leader}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* SPONSORSHIP */}
<section
  id="partner"
  className="relative overflow-hidden bg-white py-32"
>
  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    
    {/* Header */}
    <motion.div
      {...fadeUp}
      className="text-center"
    >
      {/* Overline */}
      <div className="flex items-center justify-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold-deep)]/50" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
          PARTNERSHIP
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-navy)]">
        {t.ibsPage.sponsorship.title}
      </h2>

      {/* Description */}
      <p className="mx-auto mt-8 max-w-3xl text-[16px] leading-[1.85] text-[var(--color-slate)]">
        {t.ibsPage.sponsorship.description}
      </p>
    </motion.div>

    {/* Packages */}
    <div className="mt-20 grid gap-8 xl:grid-cols-2">
      {t.ibsPage.sponsorship.packages.map((pkg, index) => {
        const isActive = activePackage === index;

        return (
          <motion.div
            key={index}
            {...fadeUp}
            onMouseEnter={() =>
              setActivePackage(index)
            }
            className={`group relative overflow-hidden rounded-[40px] border p-10 transition-all duration-500 ${
              isActive
                ? "border-[var(--color-teal)] bg-[var(--color-navy-dark)] text-white shadow-[0_25px_80px_rgba(1,30,47,0.30)]"
                : "border-[var(--color-line)] bg-white text-[var(--color-navy)] hover:-translate-y-2 hover:border-[var(--color-teal)] hover:shadow-[0_20px_40px_rgba(0,102,102,0.12)]"
            }`}
          >
            {/* Glow */}
            {isActive && (
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
            )}

            {/* Title */}
            <h3
              className={`relative z-10 text-4xl font-black transition duration-300 ${
                isActive
                  ? "text-[var(--color-gold)]"
                  : "text-[var(--color-navy)]"
              }`}
            >
              {pkg.name}
            </h3>

            {/* Description */}
            <p
              className={`relative z-10 mt-5 text-lg leading-8 ${
                isActive
                  ? "text-white/70"
                  : "text-[var(--color-slate)]"
              }`}
            >
              {pkg.description}
            </p>

            {/* Features */}
            <div className="relative z-10 mt-10 space-y-5">
              {pkg.features.map(
                (feature, i) => (
                  <div
                    key={i}
                    className="flex gap-4"
                  >
                    {/* Icon */}
                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold transition duration-300 ${
                        isActive
                          ? "bg-[var(--color-gold)] text-[var(--color-navy-dark)]"
                          : "bg-[var(--color-navy)] text-[var(--color-gold)]"
                      }`}
                    >
                      ✓
                    </div>

                    {/* Text */}
                    <p
                      className={
                        isActive
                          ? "text-white/75"
                          : "text-[var(--color-slate)]"
                      }
                    >
                      {feature}
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* Bottom */}
            <div className="relative z-10 mt-10 flex items-center gap-3">
              <div className="h-[2px] w-12 bg-[var(--color-gold)]" />

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                IBS 2026
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
</section>
{/* HOUSE */}
<section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-32 text-white">

  <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2 lg:px-8">
    
    {/* Content */}
    <motion.div {...fadeUp}>
      {/* Overline */}
      <div className="flex items-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold)]/40" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
          HOUSE
        </span>
      </div>

      {/* Title */}
      <div className="mt-8 space-y-2">
        <h2 className="font-display text-[clamp(3.5rem,6vw,6.5rem)] font-black leading-[0.95] tracking-[-0.05em] text-white">
          {locale === "ar" ? (
            <>
              منصة HOUSE
              <br />
              للشريك
            </>
          ) : (
            <>
              HOUSE Platform
            </>
          )}
        </h2>

        <h2 className="font-display text-[clamp(3.5rem,6vw,6.5rem)] font-black leading-[0.95] tracking-[-0.05em] text-[var(--color-gold)]">
          {locale === "ar" ? (
            <>
              الاستراتيجي
            </>
          ) : (
            <>
              Strategic Partner
            </>
          )}
        </h2>
      </div>

      {/* Description */}
      <p className="mt-10 max-w-2xl text-[16px] leading-[1.9] text-white/70">
        {t.ibsPage.house.description}
      </p>

      {/* Accent */}
      <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[var(--color-teal)] via-[var(--color-teal)]/50 to-transparent" />

      {/* Features */}
      <div className="mt-12 space-y-5">
        {t.ibsPage.house.items.map((item, index) => (
          <div
            key={index}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-[var(--color-teal)] hover:bg-white/[0.05]"
          >
            {/* Bullet */}
            <div className="mt-2 flex h-3 w-3 shrink-0 rounded-full bg-[var(--color-gold)]" />

            {/* Text */}
            <p className="leading-8 text-white/75">
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-10 text-2xl font-semibold text-[var(--color-gold)]">
        {t.ibsPage.house.footer}
      </p>
    </motion.div>

    {/* Image */}
    <motion.div
      {...fadeUp}
      className="relative"
    >
      {/* Image Frame */}
      <div className="h-[550px] top-[50px] relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
        <Image
          src="/images/House.JPG"
          alt=""
          width={10000}
          height={1000}
          className=" h-full w-full rounded-[30px] object-cover"
        />

        {/* Overlay Card */}
        <div className="absolute bottom-8 left-8 rounded-3xl border border-white/10 bg-[rgba(1,30,47,0.72)] p-6 backdrop-blur-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Strategic Partner
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            HOUSE Platform
          </h3>
        </div>
      </div>
    </motion.div>
  </div>
</section>

     {/* CTA */}
<section className="relative overflow-hidden bg-white py-32">

  <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2 lg:px-8">
    
    {/* LEFT CONTENT */}
    <motion.div
      {...fadeUp}
      className="max-w-2xl"
    >
      {/* Overline */}
      <div className="flex items-center gap-5">
        <span className="h-px w-10 bg-[var(--color-gold-deep)]/50" />

        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">
          JOIN IBS
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-8 font-display text-[clamp(3rem,5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-navy)]">
        <span className="text-[var(--color-gold-deep)]">
          {t.ibsPage.cta.title}
        </span>
      </h2>

      {/* Description */}
      <p className="mt-8 max-w-xl text-[16px] leading-[1.85] text-[var(--color-slate)]">
        {t.ibsPage.cta.description}
      </p>

      {/* Accent */}
      <div className="mt-8 h-[2px] w-32 bg-gradient-to-r from-[var(--color-gold-deep)] to-transparent" />

      {/* Buttons */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button
          href="#partner"
          variant="gold"
          size="md"
          withArrow
        >
          {t.ibsPage.cta.primary}
        </Button>

        <Button
          href="#participation"
          variant="outline-navy"
          size="md"
          className="text-[var(--color-navy)]"
        >
          {t.ibsPage.cta.secondary}
        </Button>
      </div>
    </motion.div>

    {/* RIGHT IMAGE */}
    <motion.div
      {...fadeUp}
      className="relative"
    >
      {/* Frame */}
      <div className="w-[700px] left-[30px] relative overflow-hidden rounded-[40px] border border-[var(--color-line)] bg-white p-3 shadow-[0_30px_80px_rgba(1,30,47,0.08)]">
        <Image
          src="/images/cta.JPG"
          alt="Business Partnership"
          width={800}
          height={600}
          className="h-[500px] w-full rounded-[30px] object-cover"
        />

        {/* Overlay Card */}
        <div className="absolute bottom-8 left-8 rounded-3xl border border-white/10 bg-[rgba(1,30,47,0.72)] p-6 backdrop-blur-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            IBS 2026
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            Strategic Partnerships
          </h3>
        </div>
      </div>
    </motion.div>
  </div>
</section>
    </main>
  );
}
