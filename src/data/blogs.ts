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
			section2Title: string;
			section2Text: string;
			quote: string;
			conclusion: string;
		};

		ar: {
			intro: string;
			section1Title: string;
			section1Text: string;
			section2Title: string;
			section2Text: string;
			quote: string;
			conclusion: string;
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
					"Businesses entering the Iraqi market are finding significant opportunities in construction, logistics, digital transformation, and regional partnerships. The country’s economic transformation is opening doors for long-term strategic investments.",

				section2Title: "Investment & Development",

				section2Text:
					"Public and private sector collaboration is accelerating development initiatives and creating a stronger environment for international partnerships and economic growth.",

				quote:
					"Success starts with making the right decision at the right time.",

				conclusion:
					"Companies that position themselves early in emerging sectors will gain a major competitive advantage in the coming years.",
			},

			ar: {
				intro:
					"أصبحت العراق واحدة من أكثر الأسواق الناشئة الواعدة في المنطقة، حيث تجذب المستثمرين في قطاعات البنية التحتية والتكنولوجيا والطاقة والتطوير.",

				section1Title: "فرص النمو والتوسع",

				section1Text:
					"تشهد الشركات التي تدخل السوق العراقي فرصًا كبيرة في مجالات الإنشاءات والخدمات اللوجستية والتحول الرقمي والشراكات الإقليمية، مما يفتح المجال أمام استثمارات استراتيجية طويلة المدى.",

				section2Title: "الاستثمار والتطوير",

				section2Text:
					"يساهم التعاون بين القطاعين العام والخاص في تسريع مشاريع التطوير وخلق بيئة أقوى للشراكات الدولية والنمو الاقتصادي.",

				quote:
					"النجاح يبدأ من اتخاذ القرار الصحيح في الوقت المناسب.",

				conclusion:
					"الشركات التي تتمركز مبكرًا في القطاعات الناشئة ستحقق ميزة تنافسية قوية خلال السنوات القادمة.",
			},
		},

		image: "/images/hero-summit.jpg",

		date: "10 Jan 2026",
	},

	{
		id: 2,

		slug: "business-expansion",

		title: {
			en: "Business Expansion Strategies",
			ar: "استراتيجيات توسع الأعمال",
		},

		description: {
			en: "How companies scale successfully in emerging markets.",
			ar: "كيف تتوسع الشركات بنجاح في الأسواق الناشئة.",
		},

		content: {
			en: {
				intro:
					"Expanding into emerging markets requires a strong strategy, local partnerships, and a deep understanding of economic trends.",

				section1Title: "Strategic Market Positioning",

				section1Text:
					"Successful businesses focus on identifying underserved sectors and building strong operational foundations before scaling rapidly.",

				section2Title: "Building Sustainable Partnerships",

				section2Text:
					"Partnerships with local stakeholders and institutions help companies establish trust and accelerate market penetration.",

				quote:
					"Growth is never accidental. It is the result of strategy and execution.",

				conclusion:
					"Companies that adapt quickly to market conditions are more likely to sustain long-term expansion and profitability.",
			},

			ar: {
				intro:
					"يتطلب التوسع في الأسواق الناشئة استراتيجية قوية وشراكات محلية وفهمًا عميقًا للاتجاهات الاقتصادية.",

				section1Title: "التمركز الاستراتيجي في السوق",

				section1Text:
					"تركز الشركات الناجحة على تحديد القطاعات غير المستغلة وبناء أسس تشغيلية قوية قبل التوسع السريع.",

				section2Title: "بناء شراكات مستدامة",

				section2Text:
					"تساعد الشراكات مع الجهات المحلية والمؤسسات المختلفة الشركات على بناء الثقة وتسريع التوسع في السوق.",

				quote:
					"النمو لا يحدث بالصدفة، بل هو نتيجة للاستراتيجية والتنفيذ.",

				conclusion:
					"الشركات القادرة على التكيف السريع مع ظروف السوق تحقق فرصًا أكبر للاستمرار والربحية طويلة المدى.",
			},
		},

		image: "/images/hero-summit.jpg",

		date: "15 Jan 2026",
	},
];