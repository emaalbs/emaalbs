export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

import { blogs } from "@/data/blogs";

type Props = {
	params: Promise<{
		slug: string;
		locale: string;
	}>;
};

export default async function BlogDetailsPage({
	params,
}: Props) {
	const { slug, locale } = await params;

	const post = blogs.find((item) => item.slug === slug);

	if (!post) {
		notFound();
	}

	const isAr = locale === "ar";

	const currentLocale: "en" | "ar" =
		locale === "ar" ? "ar" : "en";

	const content = post.content[currentLocale];

	return (
		<main
			dir={isAr ? "rtl" : "ltr"}
			className="overflow-hidden bg-[var(--color-navy-dark)] text-white"
		>
			<Header />

			{/* HERO */}
			<section className="relative isolate overflow-hidden pb-24 pt-32 lg:pb-28">
				{/* background */}
				<div className="absolute inset-0 -z-10 bg-[var(--color-navy-dark)]">
					<div
						className="absolute inset-0 opacity-[0.04]"
						style={{
							backgroundImage:
								"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
							backgroundSize: "65px 65px",
						}}
					/>
				</div>

				<Container>
					<div className="mx-auto max-w-5xl text-center">
						{/* date */}
						<div className="inline-flex rounded-full border border-[var(--color-gold)]/20 bg-white/[0.04] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)] backdrop-blur-sm">
							{post.date}
						</div>

						{/* title */}
						<h1 className="mt-8 font-display text-[clamp(2.8rem,6vw,6rem)] font-black leading-[0.95] tracking-[-0.04em] text-[var(--color-gold)]">
							{post.title[currentLocale]}
						</h1>

						{/* description */}
						<p className="mx-auto mt-8 max-w-3xl text-[16px] leading-[2] text-[var(--color-silver)] md:text-[18px]">
							{post.description[currentLocale]}
						</p>

						<div className="mx-auto mt-10 h-[2px] w-40 bg-[var(--color-gold)]/40" />
					</div>

					{/* image */}
					<div className="relative mt-20 overflow-hidden rounded-[36px] border border-white/10">
						<Image
							src={post.image}
							alt={post.title[currentLocale]}
							width={1600}
							height={900}
							priority
							className="h-auto w-full object-cover"
						/>
					</div>
				</Container>
			</section>

			{/* CONTENT */}
			<section className="relative overflow-hidden bg-[var(--color-warm)] py-24 text-[var(--color-navy)] lg:py-32">
				{/* pattern */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.35]"
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, rgba(1,51,77,0.08) 1px, transparent 0)",
						backgroundSize: "28px 28px",
					}}
				/>

				<Container>
					<div className="mx-auto max-w-4xl">
						<div className="overflow-hidden rounded-[36px] border border-[var(--color-line)] bg-white/70 p-8 backdrop-blur-sm sm:p-12">
							<div className="prose prose-lg max-w-none prose-headings:font-display prose-p:text-[var(--color-slate)] prose-p:leading-[2]">
								<p>{content.intro}</p>

								<h2 className="mt-14 text-[var(--color-gold-deep)]">
									{content.section1Title}
								</h2>

								<p>{content.section1Text}</p>

								<h2 className="mt-14 text-[var(--color-gold-deep)]">
									{content.section2Title}
								</h2>

								<p>{content.section2Text}</p>

								<blockquote className="my-12 border-l-2 border-[var(--color-gold)] bg-[var(--color-gold)]/5 py-6 pl-6 text-[24px] font-semibold leading-[1.6] italic text-[var(--color-navy)]">
									{content.quote}
								</blockquote>

								<p>{content.conclusion}</p>
							</div>
						</div>
					</div>
				</Container>
			</section>

			<Footer />
		</main>
	);
}