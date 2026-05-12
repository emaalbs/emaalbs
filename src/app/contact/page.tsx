"use client";

import { motion } from "framer-motion";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import Image from "next/image";

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.7, ease: "easeOut" },
	viewport: { once: true, amount: 0.2 },
};

export default function ContactPage() {
	const { t, locale } = useI18n();

	const isAr = locale === "ar";

	return (
		<main
			dir={isAr ? "rtl" : "ltr"}
			className={`overflow-hidden bg-[var(--color-navy-dark)] ${
				isAr ? "font-[var(--font-arabic)]" : ""
			}`}
		>
			<Header />

			{/* HERO */}
<section className="relative isolate flex min-h-[72vh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-28">
	{/* Background image */}
	<div className="absolute inset-0 -z-10">
		<Image
			src="/images/cta.JPG"
			alt=""
			fill
			priority
			sizes="100vw"
			className="object-cover object-center blur-[3px]"
		/>

		{/* overlays */}
		<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.82)] via-[rgba(1,51,77,0.72)] to-[rgba(1,30,47,0.96)]" />

		<div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,30,47,0.78)] via-transparent to-transparent" />

		{/* teal glow */}
		<div className="absolute -left-20 bottom-0 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/20 blur-[100px]" />

		<div className="absolute -right-32 top-20 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/15 blur-[100px]" />
	</div>

	<Container>
		<motion.div
	{...fadeUp}
	className="mx-auto flex max-w-4xl flex-col items-center py-20 text-center"
>
			<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
				<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />

				{t.contact.hero.overline}
			</div>

			<h1 className="mt-6 font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[1.05] tracking-display text-white">
				{t.contact.hero.title[0]}
				<br />

				<span className="text-[var(--color-gold)]">
					{t.contact.hero.title[1]}
				</span>
			</h1>

			<p className="mt-6 max-w-2xl text-[15px] sm:text-[16px] leading-[1.9] text-[var(--color-silver)]">
				{t.contact.hero.description}
			</p>

			{/* accent line */}
			<div
				className={`mt-8 h-[2px] w-32 bg-gradient-to-${
					isAr ? "l" : "r"
				} from-[var(--color-teal)] via-[var(--color-teal)]/50 to-transparent`}
			/>
		</motion.div>
	</Container>
</section>

			{/* CONTACT SECTION */}
<section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-16 lg:py-20">
{/* TOP DIVIDER */}
<div className="absolute top-0 left-1/2 z-30 flex w-full -translate-x-1/2 justify-center">
	<div className="relative h-[6px] w-[88%] overflow-hidden rounded-full bg-white/5">
		<div className="absolute inset-y-0 left-1/2 w-[35%] -translate-x-1/2 rounded-full bg-[var(--color-teal)] shadow-[0_0_35px_rgba(0,180,170,0.9)]" />
	</div>
</div>
	{/* split background */}
	<div className="absolute inset-0 hidden lg:grid lg:grid-cols-2">
		{/* الفورم */}
		<div className="bg-[#f5f7fa]" />

		{/* المعلومات */}
		<div className="bg-[var(--color-navy-dark)]" />
	</div>

	<Container className="flex justify-center">
		<motion.div
			{...fadeUp}
			className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.22)]"
		>
			<div className="relative grid items-stretch lg:grid-cols-2">
				{/* CENTER DIVIDER */}
<div className="absolute left-1/2 top-0 bottom-0 z-20 hidden -translate-x-1/2 lg:block">
	{/* main line */}
	<div className="relative h-full w-[7px] overflow-hidden bg-white/10">
		{/* teal glow */}
		<div className="absolute top-0 h-1/2 w-full bg-gradient-to-b from-[var(--color-teal)]/0 via-[var(--color-teal)] to-transparent opacity-80 blur-[1px]" />

		{/* gold glow */}
		<div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-[var(--color-gold)]/0 via-[var(--color-gold)] to-transparent opacity-70 blur-[1px]" />

		{/* soft ambient */}
		<div className="absolute inset-0 shadow-[0_0_25px_rgba(0,180,170,0.35)]" />
	</div>

	{/* center orb */}
	<div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-gold)] shadow-[0_0_25px_rgba(0,180,170,0.7)]" />
</div>
				{/* INFO SIDE */}
				<div className="relative flex items-center overflow-hidden bg-[var(--color-navy-dark)] px-7 py-10 sm:px-10 lg:px-12">
					{/* pattern */}
					<div className="absolute inset-0 opacity-[0.04]">
						<div
							className="h-full w-full"
							style={{
								backgroundImage:
									"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
								backgroundSize: "60px 60px",
							}}
						/>
					</div>

					{/* glow */}
					<div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--color-teal)]/15 blur-[90px]" />

					<div className="relative w-full">
						<p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)] lg:text-start">
							{t.contact.info.title}
						</p>

						<h2 className="mt-4 text-center font-display text-[clamp(2rem,4vw,4rem)] font-bold leading-[1.02] text-white lg:text-start">
							{t.contact.hero.title[0]}
							<br />
							{t.contact.hero.title[1]}
						</h2>

						<p className="mx-auto mt-5 max-w-lg text-center leading-[1.9] text-[var(--color-silver)] lg:mx-0 lg:text-start">
							{t.contact.info.description}
						</p>

						{/* divider */}
						<div className="mt-8 h-px w-full bg-gradient-to-r from-[var(--color-teal)]/50 to-transparent" />

						{/* cards */}
						<div className="mt-8 space-y-4">
							{/* address */}
							<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-teal)]/30 hover:bg-white/[0.06]">
								<p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
									{t.contact.info.addressLabel}
								</p>

								<p className="mt-3 text-[15px] leading-[1.8] text-white">
									Baghdad · Al-Salihiya
									<br />
									near Al-Rashid Cinema
								</p>
							</div>

							{/* phones */}
							<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-teal)]/30 hover:bg-white/[0.06]">
								<p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
									{t.contact.info.phoneLabel}
								</p>

								<p className="mt-3 text-[15px] leading-[1.9] text-white">
									+964 776 262 6777
									<br />
									+971 54 530 1452
								</p>
							</div>

							{/* email */}
							<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-teal)]/30 hover:bg-white/[0.06]">
								<p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
									{t.contact.info.emailLabel}
								</p>

								<p className="mt-3 break-all text-[15px] text-white">
									info@emaalbs.com
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* FORM SIDE */}
				<div className="relative flex items-center bg-white px-7 py-10 sm:px-10 lg:px-12">
					{/* subtle pattern */}
					<div className="absolute inset-0 opacity-[0.4]">
						<div
							className="h-full w-full"
							style={{
								backgroundImage:
									"radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
								backgroundSize: "22px 22px",
							}}
						/>
					</div>

					<div className="relative w-full">
						<p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-teal)]">
							{t.contact.form.title}
						</p>

						<h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.3rem)] font-bold leading-[1.05] text-[var(--color-navy-dark)]">
							{t.contact.cta.title}
						</h2>

						<p className="mt-4 max-w-xl leading-[1.8] text-slate-600">
							{t.contact.form.description}
						</p>

						<form className="mt-8 space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<input
									type="text"
									placeholder={t.contact.form.name}
									className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[var(--color-navy-dark)] outline-none transition-all placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,180,170,0.08)]"
								/>

								<input
									type="email"
									placeholder={t.contact.form.email}
									className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[var(--color-navy-dark)] outline-none transition-all placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,180,170,0.08)]"
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<input
									type="text"
									placeholder={t.contact.form.phone}
									className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[var(--color-navy-dark)] outline-none transition-all placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,180,170,0.08)]"
								/>

								<input
									type="text"
									placeholder={t.contact.form.company}
									className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[var(--color-navy-dark)] outline-none transition-all placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,180,170,0.08)]"
								/>
							</div>

							<textarea
								rows={5}
								placeholder={t.contact.form.message}
								className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[var(--color-navy-dark)] outline-none transition-all placeholder:text-slate-400 focus:border-[var(--color-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,180,170,0.08)]"
							/>

							<div className="pt-1">
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
	{/* BOTTOM DIVIDER */}
<div className="absolute bottom-0 left-1/2 z-30 flex w-full -translate-x-1/2 justify-center">
	<div className="relative h-[6px] w-[88%] overflow-hidden rounded-full bg-white/5">
		<div className="absolute inset-y-0 left-1/2 w-[35%] -translate-x-1/2 rounded-full bg-[var(--color-gold)] shadow-[0_0_35px_rgba(212,175,55,0.85)]" />
	</div>
</div>
</section>

			<Footer />
		</main>
	);
}