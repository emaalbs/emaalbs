import type { SocialPlatform, SocialPost } from "@/data/social-posts";

// "Latest" means added to this website, not an editable post date or last edit.
export function newestSocialPosts(posts: readonly SocialPost[]): SocialPost[] {
	return posts.filter(post => post.published).sort((a, b) => b.createdAt - a.createdAt || b.id - a.id);
}

export function latestSocialPostsByPlatform(posts: readonly SocialPost[]): SocialPost[] {
	const seen = new Set<SocialPlatform>();
	return newestSocialPosts(posts).filter(post => {
		if (seen.has(post.platform)) return false;
		seen.add(post.platform);
		return true;
	});
}
