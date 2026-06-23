"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import Image from "next/image";

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.7, ease: "easeOut" as const },
	viewport: { once: true, amount: 0.2 },
};

const prefilledMessages: Record<string, Record<string, string>> = {
  partner: {
    en: "I am interested in becoming a partner for the Iraq Business Summit (IBS). Please provide more information about partnership opportunities and packages available.",
    ar: "أرغب في أن أصبح شريكاً لقمة العراق للأعمال (IBS). يرجى تزويدي بمزيد من المعلومات حول فرص الشراكة والباقات المتاحة.",
  },
  interest: {
    en: "I would like to register my interest in participating in the Iraq Business Summit (IBS). Please share details on how I can get involved and the next steps.",
    ar: "أود التسجيل لإبداء اهتمامي بالمشاركة في قمة العراق للأعمال (IBS). يرجى مشاركة التفاصيل حول كيفية المشاركة والخطوات التالية.",
  },
  sponsor: {
    en: "I am interested in becoming a sponsor for the Iraq Business Summit (IBS). Please provide more information about sponsorship opportunities, packages, and pricing.",
    ar: "أرغب في أن أصبح راعياً لقمة العراق للأعمال (IBS). يرجى تزويدي بمزيد من المعلومات حول فرص الرعاية والباقات والأسعار.",
  },
};

export default function ContactPage() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const isAr = locale === "ar";

  const subject = searchParams.get("subject");
  const initialMessage =
    subject && prefilledMessages[subject]
      ? prefilledMessages[subject][locale] || prefilledMessages[subject].en
      : "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (initialMessage) {
      setForm((prev) => ({ ...prev, message: initialMessage }));
    }
  }, [initialMessage]);

  useEffect(() => {
    const el = document.getElementById("contact-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: subject || "other" }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-[var(--color-navy-dark)] outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:shadow-[0_0_0_3px_rgba(0,180,170,0.10)]";

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className={`overflow-hidden bg-[#f7f8fa] ${
        isAr ? "font-[var(--font-arabic)]" : ""
      }`}
    >
      <Header />

      {/* HERO */}
      <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-28">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/cta-bg.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[rgba(1,30,47,0.86)]" />
        </div>

        <Container>
          <motion.div
            {...fadeUp}
            className="mx-auto flex max-w-3xl flex-col items-center py-16 text-center"
          >
            <div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              <span className="inline-block h-px w-8 bg-[var(--color-gold)]/60" />
              {t.contact.hero.overline}
            </div>

            <h1 className={`mt-5 font-display text-[clamp(2.2rem,4.5vw,4.2rem)] font-bold tracking-display text-white ${isAr ? "leading-[1.35]" : "leading-[1.1]"}`}>
              {t.contact.hero.title[0]}{" "}
              <span className="text-[var(--color-gold)]">
                {t.contact.hero.title[1]}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-[1.9] text-white/75">
              {t.contact.hero.description}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact-form" className="relative bg-[#f7f8fa] py-20">
        <Container className="flex justify-center">
          <motion.div
            {...fadeUp}
            className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,42,60,0.06)]"
          >
            <div className="grid items-stretch lg:grid-cols-5">
              {/* INFO SIDE */}
              <div className="relative flex items-center bg-[var(--color-navy-dark)] px-7 py-10 sm:px-10 lg:col-span-2 lg:px-10">
                <div className="relative w-full">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                    {t.contact.info.title}
                  </p>

                  <h2 className={`mt-3 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-bold text-white ${isAr ? "leading-[1.4]" : "leading-[1.15]"}`}>
                    {t.contact.hero.title[0]}{" "}
                    {t.contact.hero.title[1]}
                  </h2>

                  <p className="mt-4 leading-[1.85] text-white/70">
                    {t.contact.info.description}
                  </p>

                  <div className="mt-8 space-y-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-gold)]/90">
                        {t.contact.info.addressLabel}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-[1.7] text-white/90">
                        Baghdad · Al-Salihiya
                        <br />
                        near Al-Rashid Cinema
                      </p>
                    </div>

                    <div className="h-px w-full bg-white/10" />

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-gold)]/90">
                        {t.contact.info.phoneLabel}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-[1.8] text-white/90" dir="ltr">
                        +964 776 262 6777
                        <br />
                        +971 54 530 1452
                      </p>
                    </div>

                    <div className="h-px w-full bg-white/10" />

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-gold)]/90">
                        {t.contact.info.emailLabel}
                      </p>
                      <p className="mt-1.5 break-all text-[15px] text-white/90" dir="ltr">
                        info@emaalbs.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM SIDE */}
              <div className="relative flex items-center bg-white px-7 py-10 sm:px-10 lg:col-span-3 lg:px-12">
                <div className="relative w-full">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-teal)]">
                    {t.contact.form.title}
                  </p>

                  <h2 className={`mt-3 font-display text-[clamp(1.7rem,2.8vw,2.4rem)] font-bold text-[var(--color-navy-dark)] ${isAr ? "leading-[1.4]" : "leading-[1.15]"}`}>
                    {t.contact.cta.title}
                  </h2>

                  <p className="mt-3 max-w-xl leading-[1.75] text-slate-500">
                    {t.contact.form.description}
                  </p>

                  <form
                    className="mt-7 space-y-4"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="name"
                        placeholder={t.contact.form.name}
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className={inputClass}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder={t.contact.form.email}
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="phone"
                        placeholder={t.contact.form.phone}
                        value={form.phone}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className={inputClass}
                      />
                      <input
                        type="text"
                        name="company"
                        placeholder={t.contact.form.company}
                        value={form.company}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </div>

                    <textarea
                      name="message"
                      rows={5}
                      placeholder={t.contact.form.message}
                      value={form.message}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-[var(--color-navy-dark)] outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:shadow-[0_0_0_3px_rgba(0,180,170,0.10)]"
                    />

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-gold)] px-5 h-11 text-sm font-semibold text-[var(--color-navy)] transition-all duration-200 hover:bg-[var(--color-gold-deep)] hover:text-white shadow-[0_4px_24px_rgba(238,193,59,0.25)] hover:shadow-[0_6px_30px_rgba(238,193,59,0.45)] disabled:opacity-60"
                      >
                        <span>{status === "loading" ? (isAr ? "جاري الإرسال..." : "Sending...") : t.contact.form.button}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isAr ? "rotate-180" : ""}
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    {status === "success" && (
                      <p className="text-sm text-[var(--color-teal)]">
                        {isAr ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!"}
                      </p>
                    )}
                    {status === "error" && (
                      <p className="text-sm text-red-500">
                        {isAr ? "حدث خطأ أثناء الإرسال. حاول مرة أخرى." : "Something went wrong. Please try again."}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
