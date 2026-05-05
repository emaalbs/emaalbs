import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
	return (
		<section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-24">
			{/* Background image */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/hero-summit.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center blur-[3px]"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.82)] via-[rgba(1,51,77,0.7)] to-[rgba(1,30,47,0.95)]" />
				<div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,30,47,0.75)] via-transparent to-transparent" />
				{/* Teal ambient glow — bottom-left */}
				<div className="absolute -left-20 bottom-0 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/25 blur-[100px]" />
				{/* Teal ambient glow — top-right */}
				<div className="absolute -right-32 top-20 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/15 blur-[100px]" />
			</div>

			<Container>
				<div className="max-w-3xl py-16">
					<div className="reveal flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />
						EMAAL Business Space
					</div>

					<h1 className="reveal mt-6 font-display font-bold tracking-display text-white text-[clamp(1.9rem,4.2vw,3.75rem)] leading-[1.05]">
						Building Businesses.
						<br />
						Scaling Growth.
						<br />
						<span className="text-[var(--color-gold)]">Connecting Opportunity.</span>
					</h1>

					<p className="reveal mt-6 max-w-xl border-l-2 border-[var(--color-teal)]/50 pl-4 text-[15px] sm:text-[16px] leading-[1.65] text-[var(--color-silver)]">
						A business platform builder and investment-driven group operating across Iraq and the
						region — building ventures, investing in growth, and helping companies expand through
						market access and high-level business platforms.
					</p>

					{/* Teal accent line */}
					<div className="reveal mt-8 h-[2px] w-32 bg-gradient-to-r from-[var(--color-teal)] via-[var(--color-teal)]/50 to-transparent" />

					<div className="reveal mt-6 flex flex-col gap-3 sm:flex-row">
						<Button href="#ibs" variant="gold" size="md" withArrow>
							Explore Iraq Business Summit
						</Button>
						<Button href="#group" variant="outline-teal" size="md">
							Discover EMAAL Group
						</Button>
					</div>
				</div>
			</Container>
		</section>
	);
}
