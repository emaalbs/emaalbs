import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Overline";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

const POSTS = [
	{
		category: "IBS 2025",
		date: "April 2025",
		title: "How IBS 2025 reshaped Iraq's investment conversation in three days",
		img: "/images/highlight-1.jpg",
		readTime: "6 min read",
	},
	{
		category: "Insights",
		date: "March 2025",
		title: "Six sectors, one platform: why Iraq's growth story needs coordination",
		img: "/images/highlight-2.jpg",
		readTime: "4 min read",
	},
	{
		category: "Announcement",
		date: "February 2025",
		title: "EMAAL launches Ports & Logistics Summit ahead of IBS 2026",
		img: "/images/highlight-3.jpg",
		readTime: "3 min read",
	},
];

export function Highlights() {
	return (
		<section id="insights" className="relative bg-warm py-20 lg:py-28">
			<Container>
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
					<SectionHeading
						overline="Latest Highlights"
						title={
							<>
								Stories, signals, and{" "}
								<span className="text-[var(--color-teal)]">market intelligence.</span>
							</>
						}
						subtitle="From the EMAAL platform — what we're seeing across Iraq's sectors, our IBS events, and the partnerships we're enabling."
					/>
					<Button href="#" variant="ghost-navy" withArrow>
						View all insights
					</Button>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					{POSTS.map((post, i) => (
						<a
							key={post.title}
							href="#"
							className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(1,30,47,0.12)] ${
								i === 0 ? "md:col-span-2 lg:col-span-1" : ""
							}`}
						>
							<div className="relative aspect-[16/10] overflow-hidden">
								<Image
									src={post.img}
									alt={post.title}
									fill
									sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute left-5 top-5 inline-flex items-center rounded-full bg-[var(--color-teal)] px-3 py-1 text-[10px] font-bold uppercase tracking-overline text-white backdrop-blur">
									{post.category}
								</div>
							</div>
							<div className="flex flex-1 flex-col p-7">
								<div className="flex items-center gap-3 text-[12px] uppercase tracking-overline text-[var(--color-slate)]">
									<span>{post.date}</span>
									<span className="h-1 w-1 rounded-full bg-[var(--color-slate)]" />
									<span>{post.readTime}</span>
								</div>
								<h3 className="mt-4 font-display text-xl font-semibold leading-snug text-[var(--color-navy)] transition-colors group-hover:text-[var(--color-teal)]">
									{post.title}
								</h3>
								<div className="mt-auto pt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-teal)] transition-all group-hover:gap-3">
									Read story <ArrowRightIcon className="h-4 w-4" />
								</div>
							</div>
						</a>
					))}
				</div>
			</Container>
		</section>
	);
}
