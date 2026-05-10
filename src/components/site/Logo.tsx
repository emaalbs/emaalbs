import Image from "next/image";

type Props = {
	tone?: "light" | "dark";
	className?: string;
	height?: number;
};

export function Logo({ tone = "light", className = "", height = 40 }: Props) {
	const filter = tone === "dark" ? "invert" : "";
	const width = Math.round(height * 3.14);
	return (
		<div
			className={`relative inline-block shrink-0 ${className}`}
			style={{ width, height }}
		>
			<Image
				src="/Logo.png"
				alt="EMAAL Business Space"
				fill
				priority
				className={`object-contain ${filter}`}
				sizes={`${width}px`}
			/>
		</div>
	);
}
