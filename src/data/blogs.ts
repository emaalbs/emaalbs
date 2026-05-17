export type Blog = {
	id: number;

	slug: string;

	title: {
		en: string;
		ar: string;
	};

	description: {
		en: string;
		ar: string;
	};

	content: {
		en: {
			intro: string;

			section1Title: string;
			section1Text: string;
			section1Image: string;

			section2Title: string;
			section2Text: string;
			section2Image: string;

			quote: string;

			conclusion: string;

			highlights: string[];

			gallery: string[];
		};

		ar: {
			intro: string;

			section1Title: string;
			section1Text: string;
			section1Image: string;

			section2Title: string;
			section2Text: string;
			section2Image: string;

			quote: string;

			conclusion: string;

			highlights: string[];

			gallery: string[];
		};
	};

	image: string;

	date: string;
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
			en: {
				intro:
					"Iraq is rapidly becoming one of the most promising emerging markets in the region, attracting investors across infrastructure, technology, energy, and development sectors.",

				section1Title: "Growth & Expansion Opportunities",

				section1Text:
					"Businesses entering the Iraqi market are finding significant opportunities in construction, logistics, digital transformation, and regional partnerships.",

				section1Image: "/images/highlight-1.jpg",

				section2Title: "Investment & Development",

				section2Text:
					"Public and private sector collaboration is accelerating development initiatives and creating a stronger environment for international partnerships.",

				section2Image: "/images/group-tech.jpg",

				quote:
					"Success starts with making the right decision at the right time.",

				conclusion:
					"Companies that position themselves early in emerging sectors will gain a major competitive advantage in the coming years.",

				highlights: [
					"Rapid infrastructure growth",
					"Strong regional partnerships",
					"High demand for technology",
					"Expanding investment ecosystem",
				],

				gallery: [
					"/images/highlight-1.jpg",
					"/images/group-ibs.jpg",
					"/images/group-iraq24.jpg",
				],
			},

			ar: {
				intro:
					"أصبحت العراق واحدة من أكثر الأسواق الناشئة الواعدة في المنطقة، حيث تجذب المستثمرين في قطاعات البنية التحتية والتكنولوجيا والطاقة والتطوير.",

				section1Title: "فرص النمو والتوسع",

				section1Text:
					"تشهد الشركات التي تدخل السوق العراقي فرصًا كبيرة في مجالات الإنشاءات والخدمات اللوجستية والتحول الرقمي والشراكات الإقليمية.",

				section1Image: "/images/highlight-1.jpg",

				section2Title: "الاستثمار والتطوير",

				section2Text:
					"يساهم التعاون بين القطاعين العام والخاص في تسريع مشاريع التطوير وخلق بيئة أقوى للشراكات الدولية.",

				section2Image: "/images/group-tech.jpg",

				quote:
					"النجاح يبدأ من اتخاذ القرار الصحيح في الوقت المناسب.",

				conclusion:
					"الشركات التي تتمركز مبكرًا في القطاعات الناشئة ستحقق ميزة تنافسية قوية خلال السنوات القادمة.",

				highlights: [
					"نمو سريع للبنية التحتية",
					"شراكات إقليمية قوية",
					"طلب مرتفع على التكنولوجيا",
					"توسع بيئة الاستثمار",
				],

				gallery: [
					"/images/highlight-1.jpg",
					"/images/group-ibs.jpg",
					"/images/group-iraq24.jpg",
				],
			},
		},

		image: "/images/hero-summit.jpg",

		date: "10 Jan 2026",
	},
];