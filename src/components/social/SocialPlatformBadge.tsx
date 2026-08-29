import type { ComponentType, SVGProps } from "react";
import type { SocialPlatform } from "@/data/social-posts";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/ui/icons";
import { getSocialPlatformLabel } from "@/lib/social-platforms";

const icons: Record<SocialPlatform, ComponentType<SVGProps<SVGSVGElement>>> = {
	linkedin: LinkedInIcon,
	x: XIcon,
	instagram: InstagramIcon,
	youtube: YouTubeIcon,
	facebook: FacebookIcon,
};

const tones: Record<SocialPlatform, string> = {
	linkedin: "bg-[#0A66C2]/10 text-[#0A66C2]",
	x: "bg-slate-950/10 text-slate-950",
	instagram: "bg-fuchsia-500/10 text-fuchsia-700",
	youtube: "bg-red-500/10 text-red-600",
	facebook: "bg-[#1877F2]/10 text-[#1877F2]",
};

export function SocialPlatformBadge({ platform, compact = false }: { platform: SocialPlatform; compact?: boolean }) {
	const Icon = icons[platform];
	return (
		<span className={`inline-flex items-center gap-2 rounded-full font-bold ${tones[platform]} ${compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"}`}>
			<Icon className={compact ? "h-3 w-3" : "h-4 w-4"} />
			{getSocialPlatformLabel(platform)}
		</span>
	);
}
