import type { Localized } from "./types";

// Content for the IBS overview page (`/[locale]/ibs`).
// Sourced from `Ibs Content/main.md` — kept in the data layer so it can later
// be edited from the admin dashboard via D1 without touching components.

export type Pillar = { title: Localized; description: Localized };
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
export type TieredSponsorLogo = {
	src: string;
	alt: Localized;
	href?: string;
};
export type SponsorTierData = {
	id: string;
	name: Localized;
	logos: TieredSponsorLogo[];
};

export const ibsOverview = {
	hero: {
		overline: { en: "Iraq Business Summit", ar: "قمة الأعمال العراقية" } as Localized,
		title: { en: "Iraq Business Summit (IBS)", ar: "قمة الأعمال العراقية" } as Localized,
		description: {
			en: "A high-level platform bringing together government decision-makers, investors, and private sector leaders to enable partnerships, investment, and real business outcomes in Iraq.",
			ar: "منصة رفيعة المستوى تجمع صنّاع القرار الحكوميين والمستثمرين وقادة القطاع الخاص لتمكين الشراكات والاستثمار وتحقيق نتائج أعمال حقيقية في العراق.",
		} as Localized,
		ctaPrimary: { en: "Become a Partner", ar: "كن شريكاً" } as Localized,
		ctaSecondary: {
			en: "Become a Sponsor",
			ar: "كن راعياً",
		} as Localized,
	},
	why: {
		overline: { en: "Why IBS", ar: "لماذا القمة" } as Localized,
		title: {
			en: "A deal-driven platform — not just an event.",
			ar: "منصة مبنية على الصفقات — لا مجرد فعالية.",
		} as Localized,
		description: {
			en: "IBS is designed as a deal-driven platform where companies engage directly with decision-makers, explore opportunities, and position themselves within Iraq's key sectors.",
			ar: "صُممت قمة الأعمال العراقية لتكون منصة مدفوعة بالصفقات تتفاعل فيها الشركات مباشرة مع صنّاع القرار، وتستكشف الفرص، وترسّخ موقعها في القطاعات الرئيسية للعراق.",
		} as Localized,
		pillars: [
			{
				title: { en: "Direct Government Access", ar: "وصول مباشر للحكومة" },
				description: {
					en: "Pre-qualified introductions to ministers and regulators.",
					ar: "تعارف مُعدّ مسبقاً مع الوزراء والجهات التنظيمية.",
				},
			},
			{
				title: {
					en: "High-Level Discussions",
					ar: "نقاشات رفيعة المستوى",
				},
				description: {
					en: "Strategic business and investment dialogue at the table.",
					ar: "حوار استراتيجي للأعمال والاستثمار حول الطاولة.",
				},
			},
			{
				title: { en: "Sector Exposure", ar: "حضور قطاعي" },
				description: {
					en: "Visibility across the sectors shaping Iraq's economy.",
					ar: "حضور وظهور عبر القطاعات التي تشكّل اقتصاد العراق.",
				},
			},
			{
				title: {
					en: "Structured Engagement",
					ar: "تفاعل منظّم",
				},
				description: {
					en: "A platform built for outcomes, beyond traditional events.",
					ar: "منصة مصممة للنتائج، تتجاوز الفعاليات التقليدية.",
				},
			},
		] as Pillar[],
	},
	who: {
		overline: { en: "Who Participated", ar: "من شارك" } as Localized,
		title: {
			en: "Who Participated?",
			ar: "من شارك؟",
		} as Localized,
		description: {
			en: "IBS brings together a curated group of decision-makers, industry leaders, and institutions shaping Iraq’s economic landscape.",
			ar: "تجمع القمة نخبة منتقاة من صنّاع القرار وقادة القطاعات والمؤسسات التي تشكّل المشهد الاقتصادي في العراق.",
		} as Localized,
		groups: [
			{
				title: {
					en: "Government & Decision-Makers",
					ar: "الحكومة وصنّاع القرار",
				},
				items: [
					{
						en: "Ministers and senior officials from key ministries",
						ar: "وزراء وكبار المسؤولين في الوزارات الرئيسية",
					},
					{
						en: "Heads of regulatory authorities and public institutions",
						ar: "رؤساء الهيئات التنظيمية والمؤسسات العامة",
					},
					{
						en: "Directors General and senior policymakers",
						ar: "مدراء عامون وكبار صانعي السياسات",
					},
				],
			},
			{
				title: {
					en: "Private Sector Leaders",
					ar: "قادة القطاع الخاص",
				},
				items: [
					{
						en: "CEOs and Managing Directors of leading companies",
						ar: "رؤساء تنفيذيون ومدراء عامون لشركات رائدة",
					},
					{
						en: "Chairmen and executives from major Iraqi and regional groups",
						ar: "رؤساء مجالس إدارة وتنفيذيون من مجموعات عراقية وإقليمية كبرى",
					},
				],
			},
			{
				title: {
					en: "International & Regional Stakeholders",
					ar: "الجهات الدولية والإقليمية",
				},
				items: [
					{
						en: "Representatives from international organizations and financial institutions",
						ar: "ممثلون عن المنظمات الدولية والمؤسسات المالية",
					},
					{
						en: "Embassy and trade representatives",
						ar: "ممثلو السفارات والملحقيات التجارية",
					},
					{
						en: "Regional business leaders and investors",
						ar: "قادة أعمال ومستثمرون إقليميون",
					},
				],
			},
		] as ParticipantGroup[],
	},
	sectors: {
		overline: { en: "Key Sectors", ar: "القطاعات الرئيسية" } as Localized,
		title: {
			en: "Six sectors driving Iraq's economy.",
			ar: "ستة قطاعات تقود اقتصاد العراق.",
		} as Localized,
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
		overline: { en: "Notable Voices", ar: "أصوات بارزة" } as Localized,
		title: {
			en: "Speakers who set the agenda.",
			ar: "متحدثون يصنعون الأجندة.",
		} as Localized,
		items: [
			{
				name: { en: "Hayam Al-Yasri", ar: "هيام الياسري" },
				role: { en: "Minister of Communication", ar: "وزيرة الاتصالات" },
				photo: "/images/people/hayam-al-yasri.webp",
			},
			{
				name: { en: "Khalid Batal", ar: "خالد بتال" },
				role: { en: "Minister of Industry", ar: "وزير الصناعة" },
				photo: "/images/people/khalid-batal.webp",
			},
			{
				name: {
					en: "Dr. Farhan Al-Fartusi",
					ar: "د. فرحان الفرطوسي",
				},
				role: {
					en: "Director General, General Company for Iraqi Ports",
					ar: "المدير العام، الشركة العامة لموانئ العراق",
				},
				photo: "/images/people/dr-farhan-al-fartusi.webp",
			},
			{
				name: { en: "Fadi Al-Faqiyah", ar: "فادي الفقيه" },
				role: {
					en: "CEO, Bank of International Development",
					ar: "الرئيس التنفيذي، بنك التنمية الدولي",
				},
				photo: "/images/people/fadi-al-faqiyah.webp",
			},
			{
				name: { en: "Saman Bojan", ar: "سامان بوجان" },
				role: {
					en: "Central Region General Manager, Asiacell",
					ar: "المدير العام للمنطقة الوسطى، آسياسيل",
				},
				photo: "/images/people/saman-bojan.webp",
			},
		] as FeaturedLeader[],
	},
	sponsorship: {
		overline: { en: "Sponsorship", ar: "الرعاية" } as Localized,
		title: {
			en: "Choose your level of leadership.",
			ar: "اختر مستوى قيادتك.",
		} as Localized,
		description: {
			en: "IBS offers different levels of participation, allowing companies to engage based on their strategic objectives and level of involvement.",
			ar: "تقدّم القمة مستويات متعددة من المشاركة، تتيح للشركات التفاعل وفقاً لأهدافها الاستراتيجية ومستوى انخراطها.",
		} as Localized,
		packages: [
			{
				id: "strategic",
				name: { en: "Strategic Partner", ar: "شريك استراتيجي" },
				tagline: {
					en: "Full sector leadership and high-level influence.",
					ar: "قيادة قطاعية كاملة وتأثير رفيع المستوى.",
				},
				features: [
					{
						en: "Private ministerial dialogue with relevant government entities",
						ar: "حوار وزاري خاص مع الجهات الحكومية المعنية",
					},
					{
						en: "Keynote speech in main summit session",
						ar: "كلمة رئيسية في الجلسة الرئيسية للقمة",
					},
					{
						en: "Executive presentation of company vision and projects",
						ar: "عرض تنفيذي لرؤية الشركة ومشاريعها",
					},
					{
						en: "Lead participation in high-level panel discussions",
						ar: "مشاركة قيادية في جلسات النقاش رفيعة المستوى",
					},
					{
						en: "Participation and chairing of executive roundtables",
						ar: "المشاركة وترؤس الطاولات المستديرة التنفيذية",
					},
					{
						en: "Direct access to decision-makers and curated meetings",
						ar: "وصول مباشر لصنّاع القرار ولقاءات منظّمة",
					},
					{
						en: "Ability to invite targeted government entities",
						ar: "القدرة على دعوة جهات حكومية مستهدفة",
					},
					{
						en: "Access to full attendee network",
						ar: "الوصول لكامل شبكة الحاضرين",
					},
					{
						en: "Participation in exclusive closed sessions",
						ar: "المشاركة في الجلسات المغلقة الحصرية",
					},
					{
						en: "Dedicated branded HOUSE platform to host discussions, launch projects, and sign agreements",
						ar: "منصة HOUSE خاصة باسم الشريك لاستضافة النقاشات وإطلاق المشاريع وتوقيع الاتفاقيات",
					},
				],
				featured: true,
			},
			{
				id: "platinum",
				name: { en: "Platinum Partner", ar: "شريك بلاتيني" },
				tagline: {
					en: "High-level engagement and strong positioning.",
					ar: "تفاعل رفيع المستوى وتموضع قوي.",
				},
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
				name: { en: "Gold Partner", ar: "شريك ذهبي" },
				tagline: {
					en: "Focused engagement and sector presence.",
					ar: "تفاعل مركّز وحضور قطاعي.",
				},
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
				name: { en: "Silver Partner", ar: "شريك فضي" },
				tagline: {
					en: "Access and participation.",
					ar: "وصول ومشاركة.",
				},
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
		overline: { en: "What It Enables", ar: "ما الذي تتيحه" } as Localized,
		title: {
			en: "Outcomes you can plan around.",
			ar: "نتائج يمكنك التخطيط بناءً عليها.",
		} as Localized,
		items: [
			{
				en: "Direct engagement with government and regulators",
				ar: "تفاعل مباشر مع الحكومة والجهات التنظيمية",
			},
			{
				en: "Access to high-level business and investment discussions",
				ar: "الوصول إلى نقاشات الأعمال والاستثمار رفيعة المستوى",
			},
			{
				en: "Curated meetings with relevant stakeholders",
				ar: "لقاءات منظّمة مع الأطراف المعنية",
			},
			{
				en: "Strong institutional positioning and visibility",
				ar: "تموضع وحضور مؤسسي قوي",
			},
			{
				en: "Participation in sector-defining conversations",
				ar: "المشاركة في النقاشات التي تشكّل القطاعات",
			},
		] as Localized[],
	},
	house: {
		overline: { en: "HOUSE Platform", ar: "منصة HOUSE" } as Localized,
		title: {
			en: "A private stage for Strategic Partners.",
			ar: "منصة خاصة للشركاء الاستراتيجيين.",
		} as Localized,
		description: {
			en: "The HOUSE Platform is a private, fully branded stage under the Strategic Partner's name — designed as a mini-summit within IBS.",
			ar: "منصة HOUSE هي مساحة خاصة بالكامل باسم الشريك الاستراتيجي — مصممة كقمة مصغّرة داخل قمة الأعمال العراقية.",
		} as Localized,
		items: [
			{
				en: "Lead investment and economic discussions aligned with company priorities",
				ar: "قيادة نقاشات الاستثمار والاقتصاد بما يتماشى مع أولويات الشركة",
			},
			{
				en: "Present projects, launch initiatives, and sign agreements",
				ar: "عرض المشاريع وإطلاق المبادرات وتوقيع الاتفاقيات",
			},
			{
				en: "Engage directly with government stakeholders and key decision-makers",
				ar: "التفاعل المباشر مع الجهات الحكومية وصنّاع القرار",
			},
			{
				en: "Invite partners and targeted participants to a focused executive session",
				ar: "دعوة الشركاء والمشاركين المستهدفين لجلسة تنفيذية مركّزة",
			},
			{
				en: "Build partnerships and accelerate investment opportunities",
				ar: "بناء الشراكات وتسريع فرص الاستثمار",
			},
		] as Localized[],
		footer: {
			en: "A platform for leadership, visibility, and real execution.",
			ar: "منصة للقيادة والحضور والتنفيذ الفعلي.",
		} as Localized,
	},
	beyond: {
		overline: { en: "Beyond a Summit", ar: "أبعد من قمة" } as Localized,
		title: {
			en: "We measure success in outcomes.",
			ar: "نقيس النجاح بالنتائج.",
		} as Localized,
		description: {
			en: "IBS is not just about attendance — it is about outcomes.",
			ar: "قمة الأعمال العراقية ليست عن الحضور — بل عن النتائج.",
		} as Localized,
		items: [
			{
				en: "Executive roundtables focused on real opportunities",
				ar: "طاولات مستديرة تنفيذية تركّز على الفرص الحقيقية",
			},
			{ en: "Structured B2B meetings", ar: "اجتماعات أعمال منظّمة" },
			{ en: "Sector-driven discussions", ar: "نقاشات مدفوعة بالقطاعات" },
			{
				en: "Project launches and partnership announcements",
				ar: "إطلاق مشاريع وإعلان شراكات",
			},
		] as Localized[],
	},
	cta: {
		overline: { en: "Join IBS", ar: "انضم إلى القمة" } as Localized,
		title: {
			en: "Be part of a platform that connects business with decision-making.",
			ar: "كن جزءاً من منصة تربط الأعمال بصناعة القرار.",
		} as Localized,
		primary: { en: "Become a Partner", ar: "كن شريكاً" } as Localized,
		secondary: {
			en: "Request Participation",
			ar: "اطلب المشاركة",
		} as Localized,
	},
	tieredSponsors: {
		overline: { en: "Sponsors", ar: "الرعاة" } as Localized,
		title: {
			en: "Our sponsors and partners.",
			ar: "رعاتنا وشركاؤنا.",
		} as Localized,
		description: {
			en: "Organizations supporting IBS at every level.",
			ar: "مؤسسات تدعم قمة الأعمال العراقية على كل المستويات.",
		} as Localized,
		tiers: [
			{
				id: "strategic",
				name: { en: "Strategic Partner", ar: "الراعي الاستراتيجي" },
				logos: [
					{ src: "/logos/asiacell.webp", alt: { en: "Asia Cell", ar: "آسيا سيل" } },
					{ src: "/logos/first-iraqi-bank.webp", alt: { en: "First Iraqi bank", ar: "مصرف العراق الأول الإسلامي" } },
					{ src: "/logos/al-basrah-mas.webp", alt: { en: "Al Basrah Mas Company for general contracting LTD", ar: "شركة البصرة ماس للإنشاءات العامة المحدودة" } },
					{ src: "/logos/daewoo-engineering.webp", alt: { en: "Daewoo Engineering & Construction", ar: "شركة دايوو الهندسية والبناء" } },
					{ src: "/logos/international-development-bank.webp", alt: { en: "International devlopment bank", ar: "مصرف التنمية الدولي" } },
					{ src: "/logos/jwar-al-khaleej.webp", alt: { en: "Jwar Al Khaleej", ar: "جوهر الخليج" } },
					{ src: "/logos/technital-cmyk.webp", alt: { en: "TECHNITAL", ar: "تكنولوجيا" } },
					{ src: "/logos/first-iraqi-islamic-bank.webp", alt: { en: "First Iraqi Islamic Bank", ar: "مصرف العراق الأول الإسلامي" } },
					{ src: "/logos/general-company-ports-iraq.webp", alt: { en: "General Company For Ports Of Iraq", ar: "الشركة العامة لموانيء العراق" } },
					{ src: "/logos/supercell.webp", alt: { en: "SuperCell", ar: "سوبر سيل" } },
					{ src: "/logos/tiryaki-agro.webp", alt: { en: "Tiryaki", ar: "تيريكي" } },


				] as TieredSponsorLogo[],
			},
			{
				id: "platinum",
				name: { en: "Platinum Partner", ar: "الراعي البلاتيني" },
				logos: [
					{ src: "/logos/basrah-gas.webp", alt: { en: "Basrah Gas Company", ar: "شركة غاز البصرة" } },
					{ src: "/logos/earthlink.webp", alt: { en: "Earthlink Telecommunications", ar: "ايرث لينك تيليكوم" } },
					{ src: "/logos/euler-hermes.webp", alt: { en: "Euler Hermes", ar: "ايلر هيرمس" } },
					{ src: "/logos/genesys.webp", alt: { en: "Genesys", ar: "جينيزيس" } },
					{ src: "/logos/imathia-construction.webp", alt: { en: "Imathia construction", ar: "إماتيا للإنشاءات" } },
					{ src: "/logos/jib.webp", alt: { en: "JIB", ar: "جي آي بي" } },
					{ src: "/logos/nbtel.webp", alt: { en: "NBTEL", ar: "نبتيل" } },
					{ src: "/logos/nokia.webp", alt: { en: "Nokia", ar: "نوكيا" } },
					{ src: "/logos/toyota.webp", alt: { en: "Toyota", ar: "تويوتا" } },
					{ src: "/logos/fastlink.webp", alt: { en: "fastlink", ar: "فاست لينك" } },
					{ src: "/logos/trade-bank-iraq.webp", alt: { en: "Trade Bank Of Iraq", ar: "بنك التجارة العراقي" } },
					{ src: "/logos/agile.webp", alt: { en: "Agile", ar: "أجيل" } },
					{ src: "/logos/zhenhua-oil.webp", alt: { en: "ZhenHua Oil", ar: "زهنهوا النفط" } },
					{ src: "/logos/first-finance.webp", alt: { en: "First Finance", ar: "فرست فايننس" } },
					{ src: "/logos/fortinet.webp", alt: { en: "Fortinet", ar: "فورتينت" } },
					{ src: "/logos/dari.webp", alt: { en: "DARI", ar: "داري" } },
					{ src: "/logos/ankido-it.webp", alt: { en: "ANKIDO For Information Technology", ar: "أنكيدو لتقنية المعلومات" } },
					{ src: "/logos/btp-infrastrutture.webp", alt: { en: "BTP Infrastrutture", ar: "بي تي بي للبنية التحتية" } },
					{ src: "/logos/arab-payment-service.webp", alt: { en: "Arab payment service", ar: "العرب للدفع الإلكتروني" } },
					{ src: "/logos/baghdad-chamber-commerce.webp", alt: { en: "BAGHDAD CHAMBER OF COMMERCE", ar: "غرفة بغداد التجارية" } },
					{ src: "/logos/basrah-gas-company-2.webp", alt: { en: "Basrah Gas Company", ar: "شركة غاز البصرة" } },
					{ src: "/logos/shell.webp", alt: { en: "Shell", ar: "شيل" } },
					{ src: "/logos/national-investment-commission.webp", alt: { en: "NIC (National investment Commission)", ar: "هيئة الاستثمار الوطني" } },
					{ src: "/logos/health-insurance-commission.webp", alt: { en: "Health Insurance Commission", ar: "هيئة التأمين الصحي" } },
					{ src: "/logos/mitsubishi.webp", alt: { en: "Mitsubishi", ar: "ميتسوبيشي" } },
					{ src: "/logos/aramex.webp", alt: { en: "Aramex", ar: "ارامكس" } },
					{ src: "/logos/iraq-private-banks-league.webp", alt: { en: "Iraq Private Banks league", ar: "رابطة البنوك الخاصة العراقية" } },
					{ src: "/logos/baker-hughes.webp", alt: { en: "Baker Hughes", ar: "بيكر هيوز" } },
					{ src: "/logos/baker-hughes.webp", alt: { en: "Baker Hughes", ar: "بيكر هيوز" } },
					{ src: "/logos/baker-hughes.webp", alt: { en: "Baker Hughes", ar: "بيكر هيوز" } },
					{ src: "/logos/visa.webp", alt: { en: "Visa", ar: "فيزا" } },

				] as TieredSponsorLogo[],
			},
			{
				id: "gold",
				name: { en: "Gold Partner", ar: "الراعي الذهبي" },
				logos: [
					{ src: "/logos/bank-of-baghdad.webp", alt: { en: "Bank of Baghdad", ar: "بنك بغداد" } },
					{ src: "/logos/iraq-policy-making-forum.webp", alt: { en: "Iraq Forum of policy making consultation", ar: "منتدى العراق للتشاور بشأن صنع السياسات" } },
					{ src: "/logos/tsingshan.webp", alt: { en: "TSINGSHAN", ar: "تسينغ شان" } },
					{ src: "/logos/iraq-24.webp", alt: { en: "Iraq 24", ar: "العراق 24" } },
					{ src: "/logos/basra-gate-terminal.webp", alt: { en: "BASRA GATE TERMINAL", ar: "بوابة البصرة" } },
					{ src: "/logos/techo-center-engineering.webp", alt: { en: "Techo Center Engineering", ar: "مركز التكنولوجيا الهندسي" } },

				] as TieredSponsorLogo[],
			},
			{
				id: "government",
				name: { en: "Government Partner", ar: "الراعي الحكومي" },
				logos: [
					{ src: "/logos/basra-oil-company.webp", alt: { en: "Basra Oil Company", ar: "شركة البصرة للنفط" } },
					{ src: "/logos/development-road.webp", alt: { en: "Devlopment Road", ar: "طريق التنمية" } },
					{ src: "/logos/great-fao-port.webp", alt: { en: "Great Fao Port", ar: "ميناء الفاو الكبير" } },
					{ src: "/logos/industrial-cities-corporation.webp", alt: { en: "Industrial Cities Corporation", ar: "هيئة المدن الصناعية" } },
					{ src: "/logos/iraqi-securities-commission.webp", alt: { en: "Iraqi Securities commission", ar: "هيئة الأوراق المالية العراقية" } },
					{ src: "/logos/midland-oil-company.webp", alt: { en: "Midland Oil Company", ar: "شركة نفط الوسط " } },
					{ src: "/logos/picture40.webp", alt: { en: "", ar: "" } },
					{ src: "/logos/midland-oil-company.webp", alt: { en: "Midland Oil Company", ar: "شركة نفط الوسط " } },
					{ src: "/logos/ministry-of-transport.webp", alt: { en: "Misistry of Transportation", ar: "وزارة النقل" } },
					{ src: "/logos/iraq-development-fund.webp", alt: { en: "Iraq Development Fund", ar: "صندوق العراق للتنمية" } },


				] as TieredSponsorLogo[],
			},
		] as SponsorTierData[],
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
