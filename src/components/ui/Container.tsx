import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
	as?: keyof React.JSX.IntrinsicElements;
	size?: "default" | "wide";
};

export function Container({ children, className = "", as: Tag = "div", size = "default" }: Props) {
	const max = size === "wide" ? "max-w-[1400px]" : "max-w-[1240px]";
	return (
		<Tag className={`mx-auto w-full ${max} px-6 sm:px-8 lg:px-12 ${className}`}>{children}</Tag>
	);
}
