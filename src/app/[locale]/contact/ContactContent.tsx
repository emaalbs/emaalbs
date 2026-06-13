"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import Image from "next/image";

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.7, ease: "easeOut" as const },
	viewport: { once: true, amount: 0.2 },
};

export function ContactContent() {
	const { t, locale } = useI18n();
	const searchParams = useSearchParams();
	const subject = searchParams.get("subject");

	const isAr = locale === "ar";

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
						src="/images/cta.JPG"
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
			<section className="relative bg-[#f7f8fa] py-20">
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

									<form className="mt-7 space-y-4">
										<div className="grid gap-4 md:grid-cols-2">
											<input
												type="text"
												placeholder={t.contact.form.name}
												className={inputClass}
											/>
											<input
												type="email"
												placeholder={t.contact.form.email}
												className={inputClass}
											/>
										</div>

										<div className="grid gap-4 md:grid-cols-2">
											<input
												type="text"
												placeholder={t.contact.form.phone}
												className={inputClass}
											/>
											<input
												type="text"
												placeholder={t.contact.form.company}
												className={inputClass}
											/>
										</div>

										<textarea
											rows={5}
											placeholder={t.contact.form.message}
											defaultValue={
											subject === "partner"
												? (isAr ? "أرغب في استكشاف فرصة الشراكة مع أعمال." : "I would like to explore a partnership opportunity with EMAAL.")
											: subject === "sponsor"
												? (isAr ? "أهتم بفرص الرعاية مع قمة الأعمال العراقية / أعمال." : "I am interested in sponsorship opportunities with EMAAL / IBS.")
											: subject === "contact"
												? (isAr ? "أرغب بالتواصل مع فريق أعمال." : "I would like to get in touch with the EMAAL team.")
												: ""
										}
											className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-[var(--color-navy-dark)] outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:shadow-[0_0_0_3px_rgba(0,180,170,0.10)]"
										/>

										<div className="pt-2">
											<Button
												href="#"
												variant="gold"
												size="md"
												withArrow
											>
												{t.contact.form.button}
											</Button>
										</div>
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
