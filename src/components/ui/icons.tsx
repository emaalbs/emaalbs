import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
	viewBox: "0 0 24 24",
};

export function ArrowRightIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	);
}

export function ArrowDownIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M12 5v14M6 13l6 6 6-6" />
		</svg>
	);
}

export function CheckIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M5 12.5l4.5 4.5L19 7.5" />
		</svg>
	);
}

export function PlayIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M7 5l12 7-12 7V5z" />
		</svg>
	);
}

export function PauseIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M6 4h4v16H6zM14 4h4v16h-4z" />
		</svg>
	);
}

export function VolumeIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			<path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a9 9 0 010 14.14" />
		</svg>
	);
}

export function VolumeOffIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			<line x1="23" y1="9" x2="17" y2="15" />
			<line x1="17" y1="9" x2="23" y2="15" />
		</svg>
	);
}

export function MenuIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M4 7h16M4 12h16M4 17h16" />
		</svg>
	);
}

export function CloseIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	);
}

export function GlobeIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18M12 3c2.5 3 4 6.5 4 9s-1.5 6-4 9c-2.5-3-4-6.5-4-9s1.5-6 4-9z" />
		</svg>
	);
}

export function MailIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="M3 7l9 6 9-6" />
		</svg>
	);
}

export function PhoneIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M5 4h3l2 5-2 1a11 11 0 005 5l1-2 5 2v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
		</svg>
	);
}

export function MapPinIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z" />
			<circle cx="12" cy="9" r="2.5" />
		</svg>
	);
}

export function BuildingIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16" />
			<path d="M16 9h2a2 2 0 012 2v10" />
			<path d="M8 7h2M8 11h2M8 15h2" />
			<path d="M3 21h18" />
		</svg>
	);
}

export function TrendingUpIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M3 17l6-6 4 4 8-8" />
			<path d="M14 7h7v7" />
		</svg>
	);
}

export function HandshakeIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M11 17l-2 2-3-3 7-7 3 3" />
			<path d="M14 12l3 3 3-3-6-6-3 1-3-1-4 4 3 3" />
		</svg>
	);
}

export function GlobeNetworkIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 3v18M3 12h18M5.5 6.5l13 11M5.5 17.5l13-11" />
		</svg>
	);
}

export function BriefcaseIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<rect x="3" y="7" width="18" height="13" rx="2" />
			<path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
			<path d="M3 13h18" />
		</svg>
	);
}

export function SparkleIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
		</svg>
	);
}

export function LinkedInIcon(props: IconProps) {
	return (
		<svg {...baseProps} fill="currentColor" stroke="none" {...props}>
			<path d="M4.98 3.5A2.5 2.5 0 117.5 6 2.5 2.5 0 014.98 3.5zM3 9h4.95v12H3zM10 9h4.74v1.7h.07a5.2 5.2 0 014.68-2.57c5 0 5.93 3.3 5.93 7.6V21h-4.95v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21H10z" />
		</svg>
	);
}

export function InstagramIcon(props: IconProps) {
	return (
		<svg {...baseProps} {...props}>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
		</svg>
	);
}

export function XIcon(props: IconProps) {
	return (
		<svg {...baseProps} fill="currentColor" stroke="none" {...props}>
			<path d="M17.53 3H21l-7.39 8.45L22 21h-6.84l-5.36-6.55L3.6 21H.13l7.9-9.04L0 3h7.02l4.84 6.06L17.53 3zm-1.2 16h1.95L7.78 5H5.7l10.63 14z" />
		</svg>
	);
}

export function YouTubeIcon(props: IconProps) {
	return (
		<svg {...baseProps} fill="currentColor" stroke="none" {...props}>
			<path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
		</svg>
	);
}

export function FacebookIcon(props: IconProps) {
	return (
		<svg {...baseProps} fill="currentColor" stroke="none" {...props}>
			<path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.12 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49H13.88V24C19.61 23.1 24 18.1 24 12.07z" />
		</svg>
	);
}
