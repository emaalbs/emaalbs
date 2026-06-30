import type { Localized } from "./types";

// Content for the IBS overview page (`/[locale]/ibs`).
// Sourced from `Ibs Content/main.md` — kept in the data layer so it can later
// be edited from the admin dashboard via D1 without touching components.

export type ParticipantGroup = {
	title: Localized;
	items: Localized[];
};
export type SponsorshipPackage = {
	id: string;
	name: Localized;
	tagline: Localized;
	features: Localized[];
	featured?: boolean;
};
export type FeaturedLeader = {
	name: Localized;
	role: Localized;
	photo?: string;
};

export const ibsOverview = {
	hero: {
		overline: { en: "Iraq Business Summit", ar: "قمة الأعمال العراقية" } as Localized,
		title: { en: "Iraq Business Summit (IBS)", ar: "قمة الأعمال العراقية" } as Localized,
		subtitle: { en: "A platform for business.", ar: "منصة للأعمال." } as Localized,
		description: {
			en: "A high-level platform bringing together government decision-makers, investors, and private sector leaders to enable partnerships, investment, and real business outcomes in Iraq.",
			ar: "منصة رفيعة المستوى تجمع صنّاع القرار الحكوميين والمستثمرين وقادة القطاع الخاص لتمكين الشراكات والاستثمار وتحقيق نتائج أعمال حقيقية في العراق.",
		} as Localized,
		ctaPrimary: { en: "Become a Partner", ar: "كن شريكاً" } as Localized,
		ctaSecondary: {
			en: "Request Participation",
			ar: "اطلب المشاركة",
		} as Localized,
	},
	why: {
		title: { en: "Why IBS", ar: "لماذا القمة" } as Localized,
		description: {
			en: "IBS is designed as a deal-driven platform where companies engage directly with decision-makers, explore opportunities, and position themselves within Iraq’s key sectors.",
			ar: "تم تصميم قمة الأعمال العراقية كمنصة قائمة على الصفقات تتفاعل فيها الشركات مباشرة مع صنّاع القرار، وتستكشف الفرص، وترسّخ موقعها في القطاعات الرئيسية للعراق.",
		} as Localized,
		items: [
			{ en: "Direct access to ministers and regulators", ar: "وصول مباشر إلى الوزراء والجهات التنظيمية" },
			{ en: "High-level business and investment discussions", ar: "نقاشات رفيعة المستوى حول الأعمال والاستثمار" },
			{ en: "Exposure to key sectors shaping Iraq’s economy", ar: "التواجد ضمن القطاعات المؤثرة في اقتصاد العراق" },
			{ en: "Structured engagement beyond traditional events", ar: "تجربة تفاعلية منظّمة تتجاوز الفعاليات التقليدية" },
		] as Localized[],
	},
	who: {
		title: { en: "Who Participated?", ar: "من شارك؟" } as Localized,
		description: {
			en: "IBS brings together a curated group of decision-makers, industry leaders, and institutions shaping Iraq’s economic landscape.",
			ar: "تجمع قمة الأعمال العراقية نخبة منتقاة من صنّاع القرار وقادة القطاعات والمؤسسات التي تشكّل المشهد الاقتصادي في العراق.",
		} as Localized,
		groups: [
			{
				title: { en: "Government & Decision-Makers", ar: "الحكومة وصنّاع القرار" } as Localized,
				items: [
					{ en: "Ministers and senior officials from key ministries", ar: "وزراء وكبار المسؤولين في الوزارات الرئيسية" },
					{ en: "Heads of regulatory authorities and public institutions", ar: "رؤساء الهيئات التنظيمية والمؤسسات العامة" },
					{ en: "Directors General and senior policymakers", ar: "مدراء عامون وكبار صانعي السياسات" },
				],
			},
			{
				title: { en: "Private Sector Leaders", ar: "قادة القطاع الخاص" } as Localized,
				items: [
					{ en: "CEOs and Managing Directors of leading companies", ar: "رؤساء تنفيذيون ومدراء عامون لشركات رائدة" },
					{ en: "Chairmen and executives from major Iraqi and regional groups", ar: "رؤساء مجالس إدارة وتنفيذيون من مجموعات عراقية وإقليمية كبرى" },
				],
			},
			{
				title: { en: "International & Regional Stakeholders", ar: "الجهات الدولية والإقليمية" } as Localized,
				items: [
					{ en: "Representatives from international organizations and financial institutions", ar: "ممثلون عن المنظمات الدولية والمؤسسات المالية" },
					{ en: "Embassy and trade representatives", ar: "ممثلو السفارات والملحقيات التجارية" },
					{ en: "Regional business leaders and investors", ar: "قادة أعمال ومستثمرون إقليميون" },
				],
			},
		] as ParticipantGroup[],
	},
	sectors: {
		title: { en: "Key Sectors Represented", ar: "القطاعات الممثلة" } as Localized,
		items: [
			{ en: "Energy & Oil", ar: "الطاقة والنفط" },
			{ en: "Banking & Financial Services", ar: "المصارف والخدمات المالية" },
			{ en: "Infrastructure & Construction", ar: "البنية التحتية والإنشاءات" },
			{ en: "Telecom & Digital", ar: "الاتصالات والرقمنة" },
			{ en: "Logistics & Transport", ar: "اللوجستيات والنقل" },
			{ en: "Investment & Development", ar: "الاستثمار والتنمية" },
		] as Localized[],
	},
	leaders: {
		title: { en: "Notable Voices", ar: "أصوات بارزة" } as Localized,
		items: [
			{
				name: { en: "Hayam Al-Yasri", ar: "هيام الياسري" } as Localized,
				role: { en: "The Minister of Communication", ar: "وزيرة الاتصالات" } as Localized,
				photo: "/images/people/hayam-al-yasri.webp",
			},
			{
				name: { en: "Khalid Batal", ar: "خالد بتال" } as Localized,
				role: { en: "The Minister of Industry", ar: "وزير الصناعة" } as Localized,
				photo: "/images/people/khalid-batal.webp",
			},
			{
				name: { en: "Dr. Farhan Al-Fartusi", ar: "د. فرحان الفرطوسي" } as Localized,
				role: { en: "Director General of the General Company for Iraqi Ports", ar: "المدير العام، الشركة العامة لموانئ العراق" } as Localized,
				photo: "/images/people/dr-farhan-al-fartusi.webp",
			},
			{
				name: { en: "Fadi Al-Faqiyah", ar: "فادي الفقيه" } as Localized,
				role: { en: "CEO of Bank of International Development", ar: "الرئيس التنفيذي، بنك التنمية الدولي" } as Localized,
				photo: "/images/people/fadi-al-faqiyah.webp",
			},
			{
				name: { en: "Saman Bojan", ar: "سامان بوجان" } as Localized,
				role: { en: "Central Region General Manager, Asiacell", ar: "المدير العام للمنطقة الوسطى، آسياسيل" } as Localized,
				photo: "/images/people/saman-bojan.webp",
			},
		] as FeaturedLeader[],
	},
	sponsorship: {
		title: { en: "Sponsorship Opportunities", ar: "فرص الرعاية" } as Localized,
		description: {
			en: "IBS offers different levels of participation, allowing companies to engage based on their strategic objectives and level of involvement.",
			ar: "تقدّم قمة الأعمال العراقية مستويات متعددة من المشاركة، تتيح للشركات التفاعل وفقاً لأهدافها الاستراتيجية ومستوى انخراطها.",
		} as Localized,
		packages: [
			{
				id: "strategic",
				name: { en: "Strategic Partner", ar: "شريك استراتيجي" } as Localized,
				tagline: {
					en: "Full sector leadership and high-level influence.",
					ar: "قيادة قطاعية كاملة وتأثير رفيع المستوى.",
				} as Localized,
				features: [
					{ en: "Private ministerial dialogue with relevant government entities", ar: "حوار وزاري خاص مع الجهات الحكومية المعنية" },
					{ en: "Keynote speech in main summit session", ar: "كلمة رئيسية في الجلسة الرئيسية للقمة" },
					{ en: "Executive presentation of company vision and projects", ar: "عرض تنفيذي لرؤية الشركة ومشاريعها" },
					{ en: "Lead participation in high-level panel discussions", ar: "مشاركة قيادية في جلسات النقاش رفيعة المستوى" },
					{ en: "Participation and chairing of executive roundtables", ar: "المشاركة وترؤس الطاولات المستديرة التنفيذية" },
					{ en: "Direct access to decision-makers and curated meetings", ar: "وصول مباشر لصنّاع القرار ولقاءات منظّمة" },
					{ en: "Ability to invite targeted government entities", ar: "القدرة على دعوة جهات حكومية مستهدفة" },
					{ en: "Access to full attendee network", ar: "الوصول لكامل شبكة الحاضرين" },
					{ en: "Participation in exclusive closed sessions", ar: "المشاركة في الجلسات المغلقة الحصرية" },
					{ en: "Dedicated branded platform (HOUSE) to host discussions, launch projects, and sign agreements", ar: "منصة خاصة تحمل هوية الشركة (HOUSE) لاستضافة النقاشات وإطلاق المشاريع وتوقيع الاتفاقيات" },
				],
				featured: true,
			},
			{
				id: "platinum",
				name: { en: "Platinum Partner", ar: "شريك بلاتيني" } as Localized,
				tagline: {
					en: "High-level engagement and strong positioning.",
					ar: "تفاعل رفيع المستوى وتموضع قوي.",
				} as Localized,
				features: [
					{ en: "Speaking role in main sector panel", ar: "دور تحدث في الجلسة الرئيسية للقطاع" },
					{ en: "Executive presentation opportunity", ar: "فرصة لعرض تنفيذي" },
					{ en: "Participation in executive roundtables", ar: "المشاركة في الطاولات المستديرة التنفيذية" },
					{ en: "Direct engagement with government entities", ar: "تفاعل مباشر مع الجهات الحكومية" },
					{ en: "Invitation to targeted stakeholders", ar: "دعوة الجهات المستهدفة" },
					{ en: "Business Club membership (network access)", ar: "عضوية نادي الأعمال (الوصول للشبكة)" },
					{ en: "Coordinated B2B meetings", ar: "اجتماعات أعمال منظّمة" },
					{ en: "Strong brand visibility across summit platforms", ar: "حضور قوي للعلامة عبر منصات القمة" },
					{ en: "Media exposure and interview opportunities", ar: "حضور إعلامي وفرص مقابلات" },
				],
			},
			{
				id: "gold",
				name: { en: "Gold Partner", ar: "شريك ذهبي" } as Localized,
				tagline: {
					en: "Focused engagement and sector presence.",
					ar: "تفاعل مركّز وحضور قطاعي.",
				} as Localized,
				features: [
					{ en: "Speaker participation in selected sessions", ar: "مشاركة كمتحدث في جلسات مختارة" },
					{ en: "Access to executive roundtables", ar: "الوصول للطاولات المستديرة التنفيذية" },
					{ en: "Direct engagement with stakeholders", ar: "تفاعل مباشر مع الأطراف المعنية" },
					{ en: "Exhibition presence and branding", ar: "حضور في المعرض ووجود للعلامة" },
					{ en: "Visibility across summit materials", ar: "حضور عبر مواد القمة" },
					{ en: "Media coverage through official partners", ar: "تغطية إعلامية عبر الشركاء الرسميين" },
				],
			},
			{
				id: "silver",
				name: { en: "Silver Partner", ar: "شريك فضي" } as Localized,
				tagline: {
					en: "Access and participation.",
					ar: "وصول ومشاركة.",
				} as Localized,
				features: [
					{ en: "Attendance at sessions and discussions", ar: "حضور الجلسات والنقاشات" },
					{ en: "Access to networking spaces", ar: "الوصول لمساحات التواصل" },
					{ en: "Participation in selected roundtables", ar: "المشاركة في طاولات مستديرة مختارة" },
					{ en: "Visibility across summit channels", ar: "حضور عبر قنوات القمة" },
				],
			},
		] as SponsorshipPackage[],
	},
	enables: {
		title: { en: "What Participation Enables", ar: "ماذا تتيح المشاركة" } as Localized,
		items: [
			{ en: "Direct engagement with government and regulators", ar: "تفاعل مباشر مع الحكومة والجهات التنظيمية" },
			{ en: "Access to high-level business and investment discussions", ar: "الوصول إلى نقاشات الأعمال والاستثمار رفيعة المستوى" },
			{ en: "Curated meetings with relevant stakeholders", ar: "لقاءات منظّمة مع الأطراف المعنية" },
			{ en: "Strong institutional positioning and visibility", ar: "تموضع وحضور مؤسسي قوي" },
			{ en: "Participation in sector-defining conversations", ar: "المشاركة في النقاشات التي تشكّل القطاعات" },
		] as Localized[],
	},
	house: {
		title: { en: "HOUSE Platform For Strategic Partner", ar: "منصة HOUSE للشريك الاستراتيجي" } as Localized,
		description: {
			en: "The HOUSE Platform is a private, fully branded stage under the Strategic Partner’s name — designed as a mini-summit within IBS.",
			ar: "منصة HOUSE هي مساحة خاصة بالكامل باسم الشريك الاستراتيجي — مصممة كقمة مصغّرة داخل قمة الأعمال العراقية.",
		} as Localized,
		items: [
			{ en: "Lead investment and economic discussions aligned with company priorities", ar: "قيادة نقاشات الاستثمار والاقتصاد بما يتماشى مع أولويات الشركة" },
			{ en: "Present projects, launch initiatives, and sign agreements", ar: "عرض المشاريع وإطلاق المبادرات وتوقيع الاتفاقيات" },
			{ en: "Engage directly with government stakeholders and key decision-makers", ar: "التفاعل المباشر مع الجهات الحكومية وصنّاع القرار" },
			{ en: "Invite partners and targeted participants to a focused executive session", ar: "دعوة الشركاء والمشاركين المستهدفين لجلسة تنفيذية مركّزة" },
			{ en: "Build partnerships and accelerate investment opportunities", ar: "بناء الشراكات وتسريع فرص الاستثمار" },
		] as Localized[],
		footer: {
			en: "A platform for leadership, visibility, and real execution.",
			ar: "منصة للقيادة والحضور والتنفيذ الفعلي.",
		} as Localized,
	},
	beyond: {
		title: { en: "Beyond a Summit", ar: "أكثر من مجرد قمة" } as Localized,
		description: {
			en: "IBS is not just about attendance it is about outcomes.",
			ar: "قمة الأعمال العراقية ليست مجرد حضور بل نتائج حقيقية.",
		} as Localized,
		items: [
			{ en: "Executive roundtables focused on real opportunities", ar: "طاولات مستديرة تنفيذية تركّز على الفرص الحقيقية" },
			{ en: "Structured B2B meetings", ar: "اجتماعات أعمال منظّمة" },
			{ en: "Sector-driven discussions", ar: "نقاشات مدفوعة بالقطاعات" },
			{ en: "Project launches and partnership announcements", ar: "إطلاق مشاريع وإعلان شراكات" },
		] as Localized[],
	},
	cta: {
		title: { en: "Join IBS", ar: "انضم إلى قمة الأعمال العراقية" } as Localized,
		description: {
			en: "Be part of a platform that connects business with decision-making.",
			ar: "كن جزءاً من منصة تربط الأعمال بصناعة القرار.",
		} as Localized,
		primary: { en: "Become a Partner", ar: "كن شريكاً" } as Localized,
		secondary: {
			en: "Request Participation",
			ar: "اطلب المشاركة",
		} as Localized,
	},
	editions: {
		overline: { en: "Editions", ar: "النسخ" } as Localized,
		title: {
			en: "Every edition. One platform.",
			ar: "كل نسخة. منصة واحدة.",
		} as Localized,
		description: {
			en: "Explore IBS editions — past summits and what's coming next.",
			ar: "استكشف نسخ قمة الأعمال العراقية — القمم السابقة وما هو قادم.",
		} as Localized,
		viewEdition: { en: "View edition", ar: "عرض النسخة" } as Localized,
		statusPast: { en: "Past", ar: "سابقة" } as Localized,
		statusUpcoming: { en: "Upcoming", ar: "قادمة" } as Localized,
		statusLive: { en: "Live", ar: "مباشر" } as Localized,
	},
	editionLabels: {
		stats: { en: "By the numbers", ar: "بالأرقام" } as Localized,
		themes: { en: "What was discussed", ar: "ما الذي نوقش" } as Localized,
		speakers: { en: "Keynote speakers", ar: "المتحدثون الرئيسيون" } as Localized,
		initiatives: { en: "Initiatives & outcomes", ar: "المبادرات والنتائج" } as Localized,
		sectorShares: {
			en: "Market influence",
			ar: "التأثير في السوق",
		} as Localized,
		sponsors: { en: "Sponsors & partners", ar: "الرعاة والشركاء" } as Localized,
		gallery: { en: "From the floor", ar: "من القمة" } as Localized,
		videos: { en: "Event videos", ar: "فيديوهات الفعالية" } as Localized,
		joinNext: { en: "Join the next edition", ar: "انضم إلى النسخة القادمة" } as Localized,
		register: { en: "Register interest", ar: "سجّل اهتمامك" } as Localized,
		watchRecap: { en: "Watch recap", ar: "شاهد الملخص" } as Localized,
		agenda: { en: "Agenda", ar: "الأجندة" } as Localized,
		dayOne: { en: "Day 1", ar: "اليوم الأول" } as Localized,
		dayTwo: { en: "Day 2", ar: "اليوم الثاني" } as Localized,
		dayThree: { en: "Day 3", ar: "اليوم الثالث" } as Localized,
		tierStrategic: { en: "Strategic", ar: "استراتيجي" } as Localized,
		tierPlatinum: { en: "Platinum", ar: "بلاتيني" } as Localized,
		tierGold: { en: "Gold", ar: "ذهبي" } as Localized,
		tierSilver: { en: "Silver", ar: "فضي" } as Localized,
		tierSupporting: { en: "Supporting", ar: "داعم" } as Localized,
	},
};
