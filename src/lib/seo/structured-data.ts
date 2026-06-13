import { getBaseUrl, siteConfig } from "./site-config";

export function organizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.name.en,
		alternateName: siteConfig.name.ar,
		url: getBaseUrl(),
		logo: `${getBaseUrl()}${siteConfig.logo}`,
		sameAs: [
			siteConfig.social.linkedin,
			siteConfig.social.x,
			siteConfig.social.youtube,
			siteConfig.social.instagram,
			siteConfig.social.facebook,
		],
		contactPoint: {
			"@type": "ContactPoint",
			telephone: "+964-776-262-6777",
			contactType: "customer service",
			email: "info@emaalbs.com",
			availableLanguage: ["English", "Arabic"],
		},
	};
}

export function websiteJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name.en,
		alternateName: siteConfig.name.ar,
		url: getBaseUrl(),
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${getBaseUrl()}/en/news?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

export function articleJsonLd({
	title,
	description,
	image,
	datePublished,
	dateModified,
	slug,
	locale,
}: {
	title: string;
	description: string;
	image: string;
	datePublished?: string;
	dateModified?: string;
	slug: string;
	locale: "en" | "ar";
}) {
	const base = getBaseUrl();
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description,
		image: image.startsWith("http") ? image : `${base}${image}`,
		datePublished: datePublished ? new Date(datePublished).toISOString() : undefined,
		dateModified: dateModified ? new Date(dateModified).toISOString() : undefined,
		author: {
			"@type": "Organization",
			name: siteConfig.name[locale],
			url: base,
		},
		publisher: {
			"@type": "Organization",
			name: siteConfig.name[locale],
			logo: {
				"@type": "ImageObject",
				url: `${base}${siteConfig.logo}`,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${base}/${locale}/news/${slug}`,
		},
	};
}

export function eventJsonLd({
	title,
	description,
	image,
	startDate,
	endDate,
	location,
	slug,
	locale,
}: {
	title: string;
	description: string;
	image?: string;
	startDate?: string;
	endDate?: string;
	location?: string;
	slug: string;
	locale: "en" | "ar";
}) {
	const base = getBaseUrl();
	return {
		"@context": "https://schema.org",
		"@type": "Event",
		name: title,
		description,
		image: image ? (image.startsWith("http") ? image : `${base}${image}`) : `${base}${siteConfig.logo}`,
		startDate: startDate ? new Date(startDate).toISOString() : undefined,
		endDate: endDate ? new Date(endDate).toISOString() : undefined,
		eventStatus: "https://schema.org/EventScheduled",
		eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
		location: location
			? {
					"@type": "Place",
					name: location,
					address: {
						"@type": "PostalAddress",
						addressLocality: location,
						addressCountry: "IQ",
					},
				}
			: undefined,
		organizer: {
			"@type": "Organization",
			name: siteConfig.name[locale],
			url: base,
		},
		url: `${base}/${locale}/ibs/${slug}`,
	};
}
