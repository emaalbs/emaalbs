"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/provider";

type Variant = "gold" | "outline-navy" | "outline-white" | "ghost-navy" | "outline-teal" | "teal";
type Size = "md" | "lg";

const base =
	"inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-gold)] disabled:opacity-50";

const variants: Record<Variant, string> = {
	gold:
		"bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold-deep)] hover:text-white shadow-[0_4px_24px_rgba(238,193,59,0.25)] hover:shadow-[0_6px_30px_rgba(238,193,59,0.45)]",
	"outline-navy":
		"border-2 border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white",
	"outline-white":
		"border border-white/40 text-white hover:bg-white hover:text-[var(--color-navy)] backdrop-blur-sm",
	"ghost-navy":
		"text-[var(--color-navy)] hover:text-[var(--color-gold-deep)]",
	"outline-teal":
		"border-2 border-[var(--color-teal)] text-white hover:bg-[var(--color-teal)] hover:text-white",
	teal:
		"bg-[var(--color-teal)] text-white hover:bg-[#005252] shadow-[0_4px_24px_rgba(0,102,102,0.25)] hover:shadow-[0_6px_30px_rgba(0,102,102,0.45)]",
};

const sizes: Record<Size, string> = {
	md: "h-11 px-5 text-sm",
	lg: "h-14 px-8 text-base",
};

type Props = {
	href?: string;
	children: ReactNode;
	variant?: Variant;
	size?: Size;
	className?: string;
	withArrow?: boolean;
	external?: boolean;
	onClick?: () => void;
};

export function Button({
	href,
	children,
	variant = "gold",
	size = "md",
	className = "",
	withArrow = false,
	external = false,
	onClick,
}: Props) {
	const { dir } = useI18n();
	const isRtl = dir === "rtl";
	const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
	const inner = (
		<>
			<span>{children}</span>
			{withArrow ? <ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} /> : null}
		</>
	);
	if (href) {
		if (external) {
			return (
				<a href={href} className={cls} target="_blank" rel="noopener noreferrer">
					{inner}
				</a>
			);
		}
		return (
			<Link href={href} className={cls}>
				{inner}
			</Link>
		);
	}
	return <button className={cls} onClick={onClick}>{inner}</button>;
}
