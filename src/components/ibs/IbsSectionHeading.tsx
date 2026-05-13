import type { ReactNode } from "react";

type Props = {
	overline?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	tone?: "dark" | "light";
	align?: "start" | "center";
	className?: string;
};

export function IbsSectionHeading({
	overline,
	title,
	description,
	tone = "light",
	align = "start",
	className = "",
}: Props) {
	const titleColor =
		tone === "dark" ? "text-white" : "text-[var(--color-ink)]";
	const descColor =
		tone === "dark"
			? "text-[var(--color-silver)]"
			: "text-[var(--color-slate)]";
	const overlineColor =
		tone === "dark"
			? "text-[var(--color-gold)]"
			: "text-[var(--color-teal)]";
	const ruleColor =
		tone === "dark" ? "bg-[var(--color-gold)]" : "bg-[var(--color-teal)]";
	const alignment =
		align === "center" ? "text-center mx-auto items-center" : "text-start";

	return (
		<div className={`flex flex-col ${alignment} ${className}`}>
			{overline ? (
				<div
					className={`flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] ${overlineColor}`}
				>
					<span className={`inline-block h-px w-8 ${ruleColor}`} />
					{overline}
				</div>
			) : null}
			<h2
				className={`mt-4 font-display font-bold tracking-display text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.15] ${titleColor}`}
			>
				{title}
			</h2>
			{description ? (
				<p
					className={`mt-5 max-w-2xl text-[15.5px] leading-[1.7] ${descColor}`}
				>
					{description}
				</p>
			) : null}
		</div>
	);
}
