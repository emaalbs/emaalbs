export const socialPlatforms = ["linkedin", "x", "instagram", "youtube", "facebook"] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];
export type SocialDisplayMode = "embed" | "custom";

export type LocalizedSocialText = {
	en: string;
	ar: string;
};

export type SocialPost = {
	id: number;
	platform: SocialPlatform;
	postUrl: string;
	displayMode: SocialDisplayMode;
	title: LocalizedSocialText;
	caption: LocalizedSocialText;
	imageUrl: string;
	postDate: string;
	published: boolean;
	pinned: boolean;
	sortOrder: number;
	createdAt: number;
	updatedAt: number;
};

export type SocialPostInput = Omit<SocialPost, "id" | "platform" | "createdAt" | "updatedAt"> & {
	platform?: SocialPlatform;
};
