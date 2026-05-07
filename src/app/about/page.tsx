"use client";

import Image from "next/image";
import { useState } from "react";

import { Briefcase, TrendingUp, Users, Handshake } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Overline";
import { useI18n } from "@/i18n/provider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function AboutPage() {
  const { dir, locale, t } = useI18n();

  const isRtl = dir === "rtl";
  const isAr = locale === "ar";

  const [activeImage, setActiveImage] = useState(0);

  const images = [
    "/images/about-meeting.JPG",
    "/images/about-2.jpg",
    "/images/about-3.jpg",
  ];

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className={`bg-white overflow-hidden ${
        isAr ? "font-[var(--font-arabic)]" : ""
      }`}
    >
      <Header />

      {/* HERO */}
      <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-28">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/Screenshot 2026-05-06 223809.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[rgba(1,30,47,0.78)]" />

          <div className="absolute -left-20 top-10 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/20 blur-[100px]" />

          <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-[var(--color-gold)]/10 blur-[100px]" />
        </div>

        <Container>
          <div className="max-w-3xl py-20">
            <div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              <span className="inline-block h-px w-8 bg-[var(--color-teal)]" />

              {t.aboutp.overline}
            </div>

            <h1
              className={`mt-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold tracking-display text-white ${
                isAr ? "leading-[1.35]" : "leading-[1.05]"
              }`}
            >
              {t.aboutp.title1}

              <br />

              <span className="text-[var(--color-gold)]">
                {t.aboutp.title2}
              </span>
            </h1>

            <p
              className={`mt-6 max-w-2xl border-${
                isRtl ? "r" : "l"
              }-2 border-[var(--color-teal)]/50 ${
                isRtl ? "pr-4 text-right" : "pl-4 text-left"
              } text-[15px] leading-[1.8] text-[var(--color-silver)]`}
            >
              {t.aboutp.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#contact" variant="gold" withArrow>
                {t.aboutp.contact}
              </Button>

              <Button href="#ventures" variant="outline-teal">
                {t.aboutp.explore}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* WHO WE ARE */}
      <section className="relative py-20 lg:py-28 bg-white">
        <Container>
          <div
            className={`flex flex-col gap-14 lg:items-center ${
              isAr ? "lg:flex-row" : "lg:flex-row"
            }`}
          >
            <div className="w-full lg:w-1/2">
              <SectionHeading
                overline={t.aboutp.whoWeAre}
                title={
                  <>
                    {t.aboutp.businessTitle}

                    <br />

                    <span className="text-[var(--color-gold-deep)]">
                      {t.aboutp.ecosystemTitle}
                    </span>
                  </>
                }
                subtitle={t.aboutp.whoSubtitle}
              />

              <p
                className={`mt-6 text-[15px] leading-[1.8] ${
                  isAr ? "text-right" : "text-left"
                } text-[var(--color-slate)]`}
              >
                {t.aboutp.whoDescription}
              </p>
            </div>

            <div className="relative w-full lg:w-1/2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-line)] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <Image
                  src={images[activeImage]}
                  alt=""
                  fill
                  className="object-cover transition-all duration-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      activeImage === index
                        ? "bg-black scale-110"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* VISION & MISSION */}
      <section className="relative overflow-hidden bg-[var(--color-navy)] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-0 top-0 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/20 blur-[100px]" />
        </div>

        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className={`rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm ${
                isAr ? "text-right" : "text-left"
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                {t.aboutp.visionLabel}
              </div>

              <h3 className="mt-4 font-display text-3xl font-bold text-white">
                {t.aboutp.visionTitle1}
                <br />
                {t.aboutp.visionTitle2}
              </h3>

              <p className="mt-5 text-[15px] leading-[1.8] text-[var(--color-silver)]">
                {t.aboutp.visionText}
              </p>
            </div>

            <div
              className={`rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm ${
                isAr ? "text-right" : "text-left"
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                {t.aboutp.missionLabel}
              </div>

              <h3 className="mt-4 font-display text-3xl font-bold text-white">
                {t.aboutp.missionTitle1}
                <br />
                {t.aboutp.missionTitle2}
              </h3>

              <p className="mt-5 text-[15px] leading-[1.8] text-[var(--color-silver)]">
                {t.aboutp.missionText}
              </p>
            </div>
          </div>
        </Container>
      </section>
      {/* WHAT WE DO */}
      <section className="py-20 lg:py-28 bg-white">
        <Container>
          <SectionHeading
            overline={t.aboutp.whatWeDoLabel}
            title={
              <>
                {t.aboutp.whatWeDoTitle1}
                <br />
                <span className="text-[var(--color-gold-deep)]">
                  {t.aboutp.whatWeDoTitle2}
                </span>
              </>
            }
            subtitle={t.aboutp.whatWeDoText}
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {t.aboutp.whatWeDoCards.map((item) => (
              <div
                key={item}
                className={`rounded-2xl border border-[var(--color-line)] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-teal)] hover:shadow-[0_20px_40px_rgba(0,102,102,0.12)] ${
                  isAr ? "text-right" : "text-left"
                }`}
              >
                <div className="h-1 w-14 rounded-full bg-[var(--color-gold)]" />

                <h3 className="mt-6 text-xl font-bold text-[var(--color-navy)]">
                  {item}
                </h3>

                <p className="mt-4 text-[14px] leading-[1.75] text-[var(--color-slate)]">
                  {t.aboutp.whatWeDoDescription}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      {/* APPROACH */}
      <section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-20 lg:py-24">
        <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/10 blur-[120px]" />

        <Container>
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              {t.aboutp.approachLabel}
            </div>

            <h2 className="mt-5 font-display text-4xl font-bold text-white">
              {t.aboutp.approachTitle1}

              <span className="text-[var(--color-gold)]">
                {" "}
                {t.aboutp.approachTitle2}
              </span>
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: t.aboutp.approachCards[0],
                icon: <Briefcase size={28} />,
              },
              {
                title: t.aboutp.approachCards[1],
                icon: <TrendingUp size={28} />,
              },
              {
                title: t.aboutp.approachCards[2],
                icon: <Users size={28} />,
              },
              {
                title: t.aboutp.approachCards[3],
                icon: <Handshake size={28} />,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[var(--color-gold)]/30 hover:bg-white/[0.05]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--color-gold)]/20">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-lg font-semibold leading-[1.5] text-white">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* VENTURES */}
      <section id="ventures" className="relative bg-white py-20 lg:py-28">
        <Container>
          <SectionHeading
            overline={t.aboutp.venturesLabel}
            title={
              <>
                {t.aboutp.venturesTitle1}
                <br />
                {t.aboutp.venturesTitle2}
              </>
            }
            subtitle={t.aboutp.venturesText}
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                image: "/images/group-ibs.jpg",
                data: t.aboutp.ventureCards[0],
              },
              {
                image: "/images/group-iraq24.jpg",
                data: t.aboutp.ventureCards[1],
              },
              {
                image: "/images/group-tech.jpg",
                data: t.aboutp.ventureCards[2],
              },
              {
                image: "/images/group-gaming.jpg",
                data: t.aboutp.ventureCards[3],
              },
            ].map((item) => (
              <div
                key={item.data.title}
                className="group overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-teal)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.data.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className={`p-6 ${isAr ? "text-right" : "text-left"}`}>
                  <h3 className="text-xl font-bold text-[var(--color-navy)]">
                    {item.data.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-[1.7] text-[var(--color-slate)]">
                    {item.data.description}
                  </p>

                  <div className="mt-5">
                    <Button href="#" variant="outline-navy">
                      {item.data.button}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      {/* INTERNATIONAL */}
      <section className="relative overflow-hidden bg-[var(--color-navy)] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--color-gold)]/10 blur-[120px]" />
        </div>

        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              {t.aboutp.internationalLabel}
            </div>

            <h2
              className={`mt-5 font-display text-4xl font-bold text-white ${
                isAr ? "leading-[1.4]" : "leading-tight"
              }`}
            >
              {t.aboutp.internationalTitle1}

              <br />

              {t.aboutp.internationalTitle2}
            </h2>

            <p className="mt-6 text-[15px] leading-[1.9] text-[var(--color-silver)]">
              {t.aboutp.internationalText}
            </p>
          </div>
        </Container>
      </section>
      {/* IMPACT */}
      <section className="bg-white py-20 lg:py-24">
        <Container>
          <div className="rounded-3xl bg-[var(--color-navy-dark)] px-8 py-16 text-center lg:px-16">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              {t.aboutp.impactLabel}
            </div>

            <h2
              className={`mt-5 font-display text-4xl font-bold text-white ${
                isAr ? "leading-[1.4]" : ""
              }`}
            >
              {t.aboutp.impactTitle1}

              <span className="text-[var(--color-gold)]">
                {" "}
                {t.aboutp.impactTitle2}
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-[15px] leading-[1.9] text-[var(--color-silver)]">
              {t.aboutp.impactText}
            </p>

            <div className="mt-10">
              <Button href="#contact" variant="gold" withArrow>
                {t.aboutp.impactButton}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
