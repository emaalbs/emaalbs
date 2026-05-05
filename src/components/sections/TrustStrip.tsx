import { Container } from "@/components/ui/Container";
import { BRAND_LOGOS } from "@/components/site/BrandLogos";

export function TrustStrip() {
	// Duplicate the list so the marquee loops seamlessly.
	const loop = [...BRAND_LOGOS, ...BRAND_LOGOS];
	return (
		<section className="relative bg-white py-14 border-y border-[var(--color-line)]">
			{/* Teal accent strip at top */}
			<div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-teal)]/40 to-transparent" />
			<Container>
				<div className="mb-8 flex items-center justify-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-slate)]">
					<span className="inline-block h-px w-8 bg-[var(--color-teal)]/60" />
					Trusted by leaders across sectors
					<span className="inline-block h-px w-8 bg-[var(--color-teal)]/60" />
				</div>
			</Container>

			{/* Marquee */}
			<div
				className="relative overflow-hidden"
				style={{
					maskImage:
						"linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
				}}
			>
				<div className="flex w-max items-center gap-12 py-2 animate-[marquee_45s_linear_infinite]">
					{loop.map(({ name, src, scale = 1 }, i) => (
						<img
							key={`${name}-${i}`}
							src={src}
							alt={name}
							className="shrink-0 w-auto opacity-80 transition-opacity hover:opacity-100"
							style={{ height: `${32 * scale}px` }}
							title={name}
							loading="lazy"
						/>
					))}
				</div>
			</div>
		</section>
	);
}
