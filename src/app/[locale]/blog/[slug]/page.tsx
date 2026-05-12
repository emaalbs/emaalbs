import Image from "next/image";
import { notFound } from "next/navigation";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

import { blogs } from "@/data/blogs";

type Props = {
	params: {
		slug: string;
		locale: string;
	};
};

export default function BlogDetailsPage({ params }: Props) {
	const post = blogs.find((item) => item.slug === params.slug);

	if (!post) {
		notFound();
	}

	const isAr = params.locale === "ar";

	return (
		<main
			dir={isAr ? "rtl" : "ltr"}
			className="overflow-hidden bg-[var(--color-navy-dark)]"
		>
			<Header />

			{/* HERO */}
			<section className="relative isolate overflow-hidden pt-32 pb-20">
				{/* background */}
				<div className="absolute inset-0 -z-10">
					<Image
						src={post.image}
						alt=""
						fill
						priority
						className="object-cover object-center blur-[3px]"
					/>

					<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.82)] via-[rgba(1,51,77,0.72)] to-[rgba(1,30,47,0.96)]" />

					<div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,30,47,0.78)] via-transparent to-transparent" />

					<div className="absolute -left-20 bottom-0 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/20 blur-[100px]" />
				</div>

				<Container>
					<div className="mx-auto max-w-4xl text-center">
						<div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
							{post.date}
						</div>

						<h1 className="mt-7 font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[1.05] tracking-display text-white">
							{post.title[isAr ? "ar" : "en"]}
						</h1>

						<p className="mx-auto mt-6 max-w-2xl text-[16px] leading-[1.9] text-[var(--color-silver)]">
							{post.description[isAr ? "ar" : "en"]}
						</p>

						<div className="mx-auto mt-8 h-[2px] w-36 bg-gradient-to-r from-transparent via-[var(--color-teal)] to-transparent" />
					</div>
				</Container>
			</section>

			{/* CONTENT */}
			<section className="relative py-20">
				{/* background */}
				<div className="absolute inset-0">
					<div className="absolute right-0 top-20 h-[320px] w-[320px] rounded-full bg-[var(--color-teal)]/10 blur-[100px]" />

					<div className="absolute inset-0 opacity-[0.035]">
						<div
							className="h-full w-full"
							style={{
								backgroundImage:
									"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
								backgroundSize: "65px 65px",
							}}
						/>
					</div>
				</div>

				<Container>
					<div className="mx-auto max-w-4xl">
						{/* featured image */}
						<div className="relative overflow-hidden rounded-[32px] border border-white/10">
							<Image
								src={post.image}
								alt={post.title[isAr ? "ar" : "en"]}
								width={1400}
								height={800}
								className="h-auto w-full object-cover"
							/>
						</div>

						{/* article */}
						<div className="mt-14 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10 backdrop-blur-sm">
							<div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-[var(--color-silver)] prose-p:leading-[2] prose-strong:text-white">
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Doloribus possimus
									perspiciatis pariatur consequatur magni
									ipsam impedit voluptate quae eveniet
									molestiae.
								</p>

								<h2>
									{isAr
										? "فرص النمو والتوسع"
										: "Growth & Expansion Opportunities"}
								</h2>

								<p>
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Facilis voluptate
									temporibus accusamus dignissimos dolore
									aperiam.
								</p>

								<p>
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Voluptates aliquid quas
									aliquam officiis repellendus voluptas.
								</p>

								<h2>
									{isAr
										? "الاستثمار والتطوير"
										: "Investment & Development"}
								</h2>

								<p>
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Quos perferendis harum
									illum sapiente exercitationem saepe.
								</p>

								<blockquote>
									{isAr
										? "النجاح يبدأ من اتخاذ القرار الصحيح في الوقت المناسب."
										: "Success starts with making the right decision at the right time."}
								</blockquote>

								<p>
									Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Laudantium atque facere
									ipsa pariatur ullam dignissimos.
								</p>
							</div>
						</div>
					</div>
				</Container>
			</section>

			<Footer />
		</main>
	);
}