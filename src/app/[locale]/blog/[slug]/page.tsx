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
	<div
		className="pointer-events-none absolute inset-0 opacity-[0.35]"
		style={{
			backgroundImage:
				"radial-gradient(circle at 1px 1px, rgba(1,51,77,0.08) 1px, transparent 0)",
			backgroundSize: "28px 28px",
		}}
	/>

	<Container>
		<div className="mx-auto max-w-5xl">
			<div className="overflow-hidden rounded-[36px] border border-[var(--color-line)] bg-white/70 p-8 backdrop-blur-sm sm:p-14">
				<div className="prose prose-lg max-w-none prose-headings:font-display prose-p:leading-[2] prose-p:text-[var(--color-slate)]">

					{/* INTRO */}
					<p className="text-[20px] leading-[2]">
						{content.intro}
					</p>

					{/* HIGHLIGHTS */}
					<div className="my-14 grid gap-4 md:grid-cols-2">
						{content.highlights.map((item, index) => (
							<div
								key={index}
								className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-warm)]/60 p-5"
							>
								<div className="flex items-center gap-3">
									<div className="h-3 w-3 rounded-full bg-[var(--color-gold)]" />

									<p className="m-0 font-semibold text-[var(--color-navy)]">
										{item}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* SECTION 1 */}
					<h2 className="mt-14 text-[var(--color-gold-deep)]">
						{content.section1Title}
					</h2>

					<p>{content.section1Text}</p>

					<div className="my-10 overflow-hidden rounded-[28px]">
						<Image
							src={content.section1Image}
							alt={content.section1Title}
							width={1400}
							height={800}
							className="h-auto w-full object-cover"
						/>
					</div>

					{/* SECTION 2 */}
					<h2 className="mt-16 text-[var(--color-gold-deep)]">
						{content.section2Title}
					</h2>

					<p>{content.section2Text}</p>

					<div className="my-10 overflow-hidden rounded-[28px]">
						<Image
							src={content.section2Image}
							alt={content.section2Title}
							width={1400}
							height={800}
							className="h-auto w-full object-cover"
						/>
					</div>

					{/* QUOTE */}
					<blockquote className="my-16 border-l-4 border-[var(--color-gold)] bg-[var(--color-gold)]/5 py-8 pl-8 text-[26px] font-semibold italic leading-[1.7] text-[var(--color-navy)]">
						{content.quote}
					</blockquote>

					{/* GALLERY */}
					<div className="mt-16 grid gap-6 md:grid-cols-3">
						{content.gallery.map((image, index) => (
							<div
								key={index}
								className="overflow-hidden rounded-[24px]"
							>
								<Image
									src={image}
									alt="Gallery"
									width={600}
									height={500}
									className="h-full w-full object-cover transition duration-500 hover:scale-105"
								/>
							</div>
						))}
					</div>

					{/* CONCLUSION */}
					<div className="mt-16 rounded-[30px] bg-[var(--color-navy)] p-10 text-white">
						<h3 className="font-display text-3xl font-bold text-[var(--color-gold)]">
							{isAr ? "الخلاصة" : "Conclusion"}
						</h3>

						<p className="mt-6 text-[18px] leading-[2] text-white/80">
							{content.conclusion}
						</p>
					</div>
				</div>
			</div>
		</div>
	</Container>
</section>

			<Footer />
		</main>
	);
}