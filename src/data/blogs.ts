export type BlogBlock =
	| { type: "heading"; text: string }
	| { type: "paragraph"; text: string }
	| { type: "image"; src: string; alt: string }
	| { type: "quote"; text: string }
	| { type: "highlights"; items: string[] }
	| { type: "gallery"; images: string[] };

export type Blog = {
	id: number;
	slug: string;
	title: { en: string; ar: string };
	description: { en: string; ar: string };
	content: { en: BlogBlock[]; ar: BlogBlock[] };
	image: string;
	date: string;
	featured: boolean;
};

export const blogs: Blog[] = [
	{
		id: 1,
		slug: "investment-opportunities",
		title: {
			en: "Investment Opportunities In Iraq",
			ar: "فرص الاستثمار في العراق",
		},
		description: {
			en: "Discover strategic investment opportunities across multiple sectors.",
			ar: "اكتشف فرص استثمارية استراتيجية عبر قطاعات متعددة.",
		},
		content: {
			en: [
				{
					type: "paragraph",
					text: "Iraq is rapidly becoming one of the most promising emerging markets in the region, attracting investors across infrastructure, technology, energy, and development sectors. With a young, growing population and massive reconstruction needs, the country offers unparalleled opportunities for those willing to engage early.",
				},
				{
					type: "paragraph",
					text: "In this article, we explore the key sectors driving growth, the challenges investors face, and the strategies that lead to success in this dynamic market.",
				},
				{ type: "heading", text: "Why Iraq?" },
				{
					type: "paragraph",
					text: "After decades of conflict, Iraq is entering a new phase of stability and reconstruction. The government has prioritized economic reform, infrastructure development, and private sector growth. International interest is rising, and early movers are already seeing strong returns.",
				},
				{
					type: "image",
					src: "/images/highlight-1.jpg",
					alt: "Iraq infrastructure development",
				},
				{
					type: "heading", text: "Growth & Expansion Opportunities" },
				{
					type: "paragraph",
					text: "Businesses entering the Iraqi market are finding significant opportunities in construction, logistics, digital transformation, and regional partnerships. The demand for modern housing, commercial complexes, and industrial facilities is enormous and growing every year.",
				},
				{
					type: "paragraph",
					text: "Beyond real estate, the technology sector is booming. Mobile penetration is high, e-commerce is growing, and there is a strong appetite for fintech solutions, software services, and digital infrastructure.",
				},
				{ type: "highlights", items: [
					"Rapid infrastructure growth",
					"Strong regional partnerships",
					"High demand for technology",
					"Expanding investment ecosystem",
				] },
				{ type: "heading", text: "Investment & Development" },
				{
					type: "paragraph",
					text: "Public and private sector collaboration is accelerating development initiatives and creating a stronger environment for international partnerships. Major projects in oil, gas, renewables, and transportation are actively seeking foreign investment and technical expertise.",
				},
				{
					type: "image",
					src: "/images/group-tech.jpg",
					alt: "Investment and development in Iraq",
				},
				{
					type: "paragraph",
					text: "The regulatory environment is also improving. New laws aim to protect investors, streamline business registration, and reduce bureaucratic hurdles. While challenges remain, the trajectory is clearly positive.",
				},
				{
					type: "quote",
					text: "Success starts with making the right decision at the right time.",
				},
				{ type: "heading", text: "Key Sectors to Watch" },
				{
					type: "paragraph",
					text: "Energy remains the backbone of the Iraqi economy, but diversification is underway. Agriculture, tourism, healthcare, and education are emerging as attractive sectors. Each offers unique entry points for investors with the right local knowledge and partners.",
				},
				{ type: "gallery", images: [
					"/images/highlight-1.jpg",
					"/images/group-ibs.jpg",
					"/images/group-iraq24.jpg",
				] },
				{ type: "heading", text: "Conclusion" },
				{
					type: "paragraph",
					text: "Companies that position themselves early in emerging sectors will gain a major competitive advantage in the coming years. Iraq is not without risk, but for informed, patient investors, the rewards can be substantial. The time to explore Iraqi investment opportunities is now.",
				},
			],
			ar: [
				{
					type: "paragraph",
					text: "أصبحت العراق واحدة من أكثر الأسواق الناشئة الواعدة في المنطقة، حيث تجذب المستثمرين في قطاعات البنية التحتية والتكنولوجيا والطاقة والتطوير. مع وجود سكان شباب متزايدين وحاجة ماسة لإعادة الإعمار، تقدم الدولة فرصًا لا مثيل لها لمن يتعامل معها مبكرًا.",
				},
				{
					type: "paragraph",
					text: "في هذا المقال، نستكشف القطاعات الرئيسية التي تقود النمو، والتحديات التي يواجهها المستثمرون، والاستراتيجيات التي تؤدي إلى النجاح في هذا السوق الديناميكي.",
				},
				{ type: "heading", text: "لماذا العراق؟" },
				{
					type: "paragraph",
					text: "بعد عقود من النزاع، تدخل العراق مرحلة جديدة من الاستقرار وإعادة الإعمار. أولت الحكومة الأولوية للإصلاح الاقتصادي وتطوير البنية التحتية ونمو القطاع الخاص. الاهتمام الدولي في تزايد، ويشهد المتقدمون مبكرًا عوائد قوية بالفعل.",
				},
				{
					type: "image",
					src: "/images/highlight-1.jpg",
					alt: "تطوير البنية التحتية في العراق",
				},
				{ type: "heading", text: "فرص النمو والتوسع" },
				{
					type: "paragraph",
					text: "تشهد الشركات التي تدخل السوق العراقي فرصًا كبيرة في مجالات الإنشاءات والخدمات اللوجستية والتحول الرقمي والشراكات الإقليمية. الطلب على المساكن الحديثة والمجمعات التجارية والمنشآت الصناعية هائل ويزداد سنويًا.",
				},
				{
					type: "paragraph",
					text: "بعيدًا عن العقارات، يشهد قطاع التكنولوجيا ازدهارًا. اختراق الهواتف المحمولة مرتفع، والتجارة الإلكترونية في نمو، وهناك شهية قوية لحلول التكنولوجيا المالية وخدمات البرمجيات والبنية التحتية الرقمية.",
				},
				{ type: "highlights", items: [
					"نمو سريع للبنية التحتية",
					"شراكات إقليمية قوية",
					"طلب مرتفع على التكنولوجيا",
					"توسع بيئة الاستثمار",
				] },
				{ type: "heading", text: "الاستثمار والتطوير" },
				{
					type: "paragraph",
					text: "يساهم التعاون بين القطاعين العام والخاص في تسريع مشاريع التطوير وخلق بيئة أقوى للشراكات الدولية. المشاريع الكبرى في النفط والغاز والطاقة المتجددة والنقل تسعى بنشاط للاستثمار الأجنبي والخبرة التقنية.",
				},
				{
					type: "image",
					src: "/images/group-tech.jpg",
					alt: "الاستثمار والتطوير في العراق",
				},
				{
					type: "paragraph",
					text: "يتحسن البيئة التنظيمية أيضًا. تهدف القوانين الجديدة إلى حماية المستثمرين وتبسيط تسجيل الأعمال وتقليل العقبات البيروقراطية. على الرغم من وجود تحديات، فإن المسار واضحًا إيجابيًا.",
				},
				{
					type: "quote",
					text: "النجاح يبدأ من اتخاذ القرار الصحيح في الوقت المناسب.",
				},
				{ type: "heading", text: "أهم القطاعات التي تستحق المتابعة" },
				{
					type: "paragraph",
					text: "يظل الطاقة العمود الفقري للاقتصاد العراقي، لكن التنويع جارٍ. الزراعة والسياحة والرعاية الصحية والتعليم هي قطاعات ناشئة جذابة. كل منها يقدم نقاط دخول فريدة للمستثمرين الذين يمتلكون المعرفة المحلية والشركاء المناسبين.",
				},
				{ type: "gallery", images: [
					"/images/highlight-1.jpg",
					"/images/group-ibs.jpg",
					"/images/group-iraq24.jpg",
				] },
				{ type: "heading", text: "الخلاصة" },
				{
					type: "paragraph",
					text: "الشركات التي تتمركز مبكرًا في القطاعات الناشئة ستحقق ميزة تنافسية قوية خلال السنوات القادمة. العراق ليس خاليًا من المخاطر، لكن للمستثمرين المطلعين والصبورين، يمكن أن تكون المكاسب كبيرة. حان الوقت لاستكشاف فرص الاستثمار في العراق.",
				},
			],
		},
		image: "/images/hero-summit.jpg",
		date: "10 Jan 2026",
		featured: true,
	},
	{
		id: 2,
		slug: "digital-transformation",
		title: {
			en: "Digital Transformation in the Middle East",
			ar: "التحول الرقمي في الشرق الأوسط",
		},
		description: {
			en: "How technology is reshaping industries and creating new opportunities across the region.",
			ar: "كيف تعيد التكنولوجيا تشكيل الصناعات وخلق فرص جديدة في جميع أنحاء المنطقة.",
		},
		content: {
			en: [{ type: "paragraph", text: "Coming soon." }],
			ar: [{ type: "paragraph", text: "قريبًا." }],
		},
		image: "/images/group-tech.jpg",
		date: "15 Feb 2026",
		featured: false,
	},
	{
		id: 3,
		slug: "strategic-partnerships",
		title: {
			en: "Building Strategic Partnerships",
			ar: "بناء الشراكات الاستراتيجية",
		},
		description: {
			en: "Key insights on forming alliances that drive long-term growth and market expansion.",
			ar: "رؤى رئيسية حول تكوين تحالفات تدفع النمو طويل المدى وتوسيع السوق.",
		},
		content: {
			en: [{ type: "paragraph", text: "Coming soon." }],
			ar: [{ type: "paragraph", text: "قريبًا." }],
		},
		image: "/images/group-ibs.jpg",
		date: "22 Mar 2026",
		featured: false,
	},
	{
		id: 4,
		slug: "future-of-energy",
		title: {
			en: "The Future of Energy in Iraq",
			ar: "مستقبل الطاقة في العراق",
		},
		description: {
			en: "Exploring renewable energy projects and sustainable development goals for the nation.",
			ar: "استكشاف مشاريع الطاقة المتجددة وأهداف التنمية المستدامة للأمة.",
		},
		content: {
			en: [{ type: "paragraph", text: "Coming soon." }],
			ar: [{ type: "paragraph", text: "قريبًا." }],
		},
		image: "/images/group-iraq24.jpg",
		date: "5 Apr 2026",
		featured: false,
	},
];