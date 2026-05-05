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
		<div className={`flex items-center ${className}`} style={{ height }}>
			<Image
				src="/Logo.png"
				alt="EMAAL Business Space"
				width={width}
				height={height}
				priority
				className={`${filter} h-auto w-auto`}
				style={{ height, width: "auto" }}
			/>
		</div>
	);
}
