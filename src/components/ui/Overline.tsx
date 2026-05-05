import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
	color?: "gold" | "teal" | "white";
};

export function Overline({ children, className = "", color = "gold" }: Props) {
	const colorCls =
		color === "gold"
			? "text-[var(--color-gold-deep)]"
			: color === "teal"
			? "text-[var(--color-teal)]"
			: "text-[var(--color-gold)]";
	return (
		<div
			className={`tracking-overline text-[11px] font-bold uppercase ${colorCls} flex items-center gap-3 ${className}`}
		>
			<span className="inline-block h-px w-8 bg-current opacity-60" />
			<span>{children}</span>
		</div>
	);
}

type HeadingProps = {
	overline?: ReactNode;
	overlineColor?: "gold" | "teal" | "white";
	title: ReactNode;
	subtitle?: ReactNode;
	align?: "left" | "center";
	tone?: "light" | "dark";
	className?: string;
};

export function SectionHeading({
	overline,
	overlineColor = "gold",
	title,
	subtitle,
	align = "left",
	tone = "light",
	className = "",
}: HeadingProps) {
	const titleColor = tone === "light" ? "text-[var(--color-navy)]" : "text-white";
	const subColor = tone === "light" ? "text-[var(--color-slate)]" : "text-[var(--color-silver)]";
	const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
	const overlineAlign = align === "center" ? "justify-center" : "justify-start";
	return (
		<div className={`max-w-2xl ${alignCls} ${className}`}>
			{overline ? (
				<Overline color={overlineColor} className={overlineAlign}>
					{overline}
				</Overline>
			) : null}
			<h2
				className={`mt-4 font-display font-bold tracking-display ${titleColor} text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.2]`}
			>
				{title}
			</h2>
			{subtitle ? (
				<p className={`mt-4 text-[15px] leading-[1.65] ${subColor}`}>{subtitle}</p>
			) : null}
		</div>
	);
}
