import type { IbsEdition } from "./types";

// Mock data — single source of truth for editions until D1 is wired.
// 2025 entry sourced from `Ibs Content/example_ibs_2025.md`.

export const editions: IbsEdition[] = [
	{
		slug: "2025",
		year: 2025,
		editionLabel: { en: "1st Edition", ar: "النسخة الأولى" },
		title: {
			en: "Iraq Business Summit 2025",
			ar: "قمة الأعمال العراقية 2025",
		},
		tagline: {
			en: "The platform connecting government and market leaders.",
			ar: "المنصة التي تجمع الحكومة وقادة السوق.",
		},
		summary: {
			en: "IBS 2025 marked the launch of a new type of economic platform in Iraq — bringing together government, investors, market leaders, and financial institutions to enable real business engagement. Built on the belief that Iraq is an opportunity, the Summit positioned itself as a space where policy, investment, and private sector growth intersect.",
			ar: "شكّلت قمة الأعمال العراقية 2025 انطلاقة لنوع جديد من المنصات الاقتصادية في العراق — جمعت الحكومة والمستثمرين وقادة السوق والمؤسسات المالية لتمكين تفاعل أعمال حقيقي. انطلاقاً من الإيمان بأن العراق فرصة، قدّمت القمة نفسها مساحةً تتقاطع فيها السياسة والاستثمار ونمو القطاع الخاص.",
		},
		status: "past",
		dates: { en: "April 2025", ar: "نيسان 2025" },
		location: { en: "Baghdad, Iraq", ar: "بغداد، العراق" },
		heroImage: "/images/hero-summit.jpg",
		recapVideo: "/images/انكليزي.mp4",
		stats: [
			{ value: "800", label: { en: "Participants", ar: "مشارك" } },
			{ value: "75", label: { en: "Speakers", ar: "متحدث" } },
			{ value: "50", label: { en: "Companies", ar: "شركة" } },
			{ value: "6", label: { en: "Key Sectors", ar: "قطاعات رئيسية" } },
		],
		themes: [
			{
				title: {
					en: "Banking & Financial Services",
					ar: "الخدمات المصرفية والمالية",
				},
				description: {
					en: "Expanding access to finance and supporting SMEs.",
					ar: "توسيع الوصول إلى التمويل ودعم المشاريع الصغيرة والمتوسطة.",
				},
			},
			{
				title: {
					en: "Telecommunications & Digital Infrastructure",
					ar: "الاتصالات والبنية الرقمية",
				},
				description: {
					en: "Positioning telecom as a foundation for Iraq's digital transformation.",
					ar: "ترسيخ الاتصالات أساساً للتحول الرقمي في العراق.",
				},
			},
			{
				title: { en: "Energy & Infrastructure", ar: "الطاقة والبنية التحتية" },
				description: {
					en: "Investment opportunities and operational development.",
					ar: "فرص الاستثمار وتطوير العمليات.",
				},
			},
			{
				title: { en: "Logistics & Trade", ar: "الخدمات اللوجستية والتجارة" },
				description: {
					en: "Enhancing Iraq's role in regional trade.",
					ar: "تعزيز دور العراق في التجارة الإقليمية.",
				},
			},
			{
				title: { en: "Technology & Innovation", ar: "التكنولوجيا والابتكار" },
				description: {
					en: "Digital transformation as a driver of growth.",
					ar: "التحول الرقمي محركاً للنمو.",
				},
			},
		],
		keynoteSpeakers: [
			{
				id: "makkiya",
				name: {
					en: "Dr. Haider Mohammed Makkiya",
					ar: "د. حيدر محمد مكية",
				},
				title: {
					en: "Chairman, National Investment Commission",
					ar: "رئيس هيئة الاستثمار الوطنية",
				},
				photo: "https://randomuser.me/api/portraits/men/32.jpg",
			},
			{
				id: "yasiri",
				name: { en: "Hayam Al-Yasiri", ar: "هيام الياسري" },
				title: {
					en: "Minister of Communications",
					ar: "وزيرة الاتصالات",
				},
				photo: "https://randomuser.me/api/portraits/women/44.jpg",
			},
			{
				id: "fartousi",
				name: {
					en: "Dr. Eng. Farhan Al-Fartousi",
					ar: "د. م. فرحان الفرطوسي",
				},
				title: {
					en: "Director General, Ports of Iraq",
					ar: "المدير العام، الشركة العامة لموانئ العراق",
				},
				photo: "https://randomuser.me/api/portraits/men/52.jpg",
			},
			{
				id: "najjar",
				name: { en: "Mr. Mohammed Al-Najjar", ar: "السيد محمد النجار" },
				title: {
					en: "Advisor to the Prime Minister for Investment Affairs",
					ar: "مستشار رئيس الوزراء لشؤون الاستثمار",
				},
				photo: "https://randomuser.me/api/portraits/men/68.jpg",
			},
		],
		sectorShares: [
			{ sector: { en: "Telecommunications", ar: "الاتصالات" }, percent: 40 },
			{ sector: { en: "Infrastructure", ar: "البنية التحتية" }, percent: 50 },
			{ sector: { en: "Banking", ar: "المصارف" }, percent: 25 },
			{ sector: { en: "Logistics", ar: "اللوجستيات" }, percent: 30 },
			{ sector: { en: "Energy", ar: "الطاقة" }, percent: 20 },
			{ sector: { en: "Technology", ar: "التكنولوجيا" }, percent: 35 },
		],
		initiatives: [
			{
				title: {
					en: "SME Support & Acceleration Initiative",
					ar: "مبادرة دعم وتسريع المشاريع الصغيرة والمتوسطة",
				},
				description: {
					en: "IBS 2025 introduced a dedicated initiative focused on supporting SMEs and accelerating their entry into the formal economy. In collaboration with the Companies Registrar, Notary Public, Chamber of Commerce, and supported by International Development Bank, Al Ahli Iraqi Bank, and Trade Bank of Iraq (TBI), the Summit enabled on-site company registration, immediate bank account opening, and direct coordination between government and financial institutions.",
					ar: "أطلقت قمة 2025 مبادرة مخصصة لدعم المشاريع الصغيرة والمتوسطة وتسريع دخولها الاقتصاد الرسمي، بالتعاون مع مسجل الشركات وكاتب العدل وغرفة التجارة، وبدعم من بنك التنمية الدولي والمصرف الأهلي العراقي ومصرف التجارة العراقي (TBI) — مكّنت القمة تسجيل الشركات وفتح الحسابات المصرفية فوراً، والتنسيق المباشر بين الحكومة والمؤسسات المالية.",
				},
				highlight: {
					en: "100 companies registered in a single day.",
					ar: "تسجيل 100 شركة في يوم واحد.",
				},
				partners: [
					"International Development Bank",
					"Al Ahli Iraqi Bank",
					"Trade Bank of Iraq",
				],
			},
		],
		sponsors: [
			{ id: "idb", name: "International Development Bank", tier: "strategic", logo: "/logos/ibs-general/idb.png" },
			{ id: "tbi", name: "Trade Bank of Iraq", tier: "strategic", logo: "/logos/ibs-general/bgt.png" },
			{ id: "ahli", name: "Al Ahli Iraqi Bank", tier: "platinum", logo: "/logos/ibs-general/icc.png" },
			{ id: "asiacell", name: "Asiacell", tier: "platinum", logo: "/logos/ibs-general/nokia.png" },
			{ id: "ports", name: "General Company for Iraqi Ports", tier: "gold", logo: "/logos/ibs-general/visa.png" },
		],
		gallery: [
			{
				id: "g1",
				src: "/images/highlight-1.jpg",
				alt: { en: "IBS 2025 main stage", ar: "المسرح الرئيسي لقمة 2025" },
			},
			{
				id: "g2",
				src: "/images/highlight-2.jpg",
				alt: { en: "Panel discussion", ar: "جلسة نقاش" },
			},
			{
				id: "g3",
				src: "/images/highlight-3.jpg",
				alt: { en: "Networking session", ar: "جلسة تواصل" },
			},
			{
				id: "g4",
				src: "/images/ibs-feature.jpg",
				alt: { en: "Keynote speech", ar: "كلمة رئيسية" },
			},
			{
				id: "g5",
				src: "/images/about-meeting.JPG",
				alt: { en: "Executive roundtable", ar: "طاولة مستديرة تنفيذية" },
			},
			{
				id: "g6",
				src: "/images/leaders.JPG",
				alt: { en: "Leadership delegation", ar: "وفد القيادة" },
			},
		],
		agenda: [
			{
				dateLabel: { en: "Day 1 — 15 April 2025", ar: "اليوم الأول — ١٥ نيسان ٢٠٢٥" },
				items: [
					{
						time: "08:30",
						title: { en: "Registration & Welcome Coffee", ar: "التسجيل وقهوة الترحيب" },
						note: { en: "Main entrance hall", ar: "قاعة الاستقبال الرئيسية" },
					},
					{
						time: "09:30",
						title: { en: "Opening Ceremony", ar: "حفل الافتتاح" },
						description: {
							en: "Official welcome by the Chairman of the National Investment Commission and keynote on Iraq's economic vision.",
							ar: "ترحيب رسمي من رئيس هيئة الاستثمار الوطنية وكلمة رئيسية حول الرؤية الاقتصادية للعراق.",
						},
						speakers: [
							{
								id: "makkiya",
								name: { en: "Dr. Haider Mohammed Makkiya", ar: "د. حيدر محمد مكية" },
								photo: "https://randomuser.me/api/portraits/men/32.jpg",
								org: { en: "National Investment Commission", ar: "هيئة الاستثمار الوطنية" },
							},
						],
					},
					{
						time: "10:15",
						title: { en: "Banking & Financial Services Panel", ar: "جلسة الخدمات المصرفية والمالية" },
						description: {
							en: "Expanding access to finance, SME support, and the role of private banks in economic growth.",
							ar: "توسيع الوصول إلى التمويل ودعم المشاريع الصغيرة ودور المصارف الخاصة في النمو الاقتصادي.",
						},
						speakers: [
							{
								id: "fadi",
								name: { en: "Fadi Al-Faqiyah", ar: "فادي الفقيه" },
								photo: "https://randomuser.me/api/portraits/men/76.jpg",
								org: { en: "Bank of International Development", ar: "بنك التنمية الدولي" },
							},
							{
								id: "saman",
								name: { en: "Saman Bojan", ar: "سامان بوجان" },
								photo: "https://randomuser.me/api/portraits/men/85.jpg",
								org: { en: "Asiacell", ar: "آسياسيل" },
							},
						],
					},
					{
						time: "11:45",
						title: { en: "Networking Break", ar: "استراحة تواصل" },
						note: { en: "Coffee & B2B lounge", ar: "ركن القهوة والأعمال" },
					},
					{
						time: "12:15",
						title: { en: "Telecom & Digital Infrastructure", ar: "الاتصالات والبنية الرقمية" },
						description: {
							en: "Positioning telecom as the foundation for Iraq's digital transformation.",
							ar: "ترسيخ الاتصالات أساساً للتحول الرقمي في العراق.",
						},
						speakers: [
							{
								id: "yasiri",
								name: { en: "Hayam Al-Yasiri", ar: "هيام الياسري" },
								photo: "https://randomuser.me/api/portraits/women/44.jpg",
								org: { en: "Minister of Communications", ar: "وزيرة الاتصالات" },
							},
						],
					},
					{
						time: "13:30",
						title: { en: "Lunch — Executive Roundtables", ar: "الغداء — الطاولات المستديرة التنفيذية" },
						note: { en: "By invitation only", ar: "بدعوة فقط" },
					},
				],
			},
			{
				dateLabel: { en: "Day 2 — 16 April 2025", ar: "اليوم الثاني — ١٦ نيسان ٢٠٢٥" },
				items: [
					{
						time: "09:00",
						title: { en: "Energy & Infrastructure Session", ar: "جلسة الطاقة والبنية التحتية" },
						description: {
							en: "Investment opportunities and operational development across Iraq's energy sector.",
							ar: "فرص الاستثمار وتطوير العمليات عبر قطاع الطاقة في العراق.",
						},
						speakers: [
							{
								id: "khalid",
								name: { en: "Khalid Batal", ar: "خالد بتال" },
								photo: "https://randomuser.me/api/portraits/men/41.jpg",
								org: { en: "Minister of Industry", ar: "وزير الصناعة" },
							},
						],
					},
					{
						time: "10:30",
						title: { en: "Logistics & Trade Corridors", ar: "اللوجستيات وممرات التجارة" },
						description: {
							en: "Enhancing Iraq's role in regional trade and the Development Road project.",
							ar: "تعزيز دور العراق في التجارة الإقليمية ومشروع طريق التنمية.",
						},
						speakers: [
							{
								id: "fartousi",
								name: { en: "Dr. Eng. Farhan Al-Fartousi", ar: "د. م. فرحان الفرطوسي" },
								photo: "https://randomuser.me/api/portraits/men/52.jpg",
								org: { en: "General Company for Iraqi Ports", ar: "الشركة العامة لموانئ العراق" },
							},
						],
					},
					{
						time: "11:45",
						title: { en: "SME Initiative Launch", ar: "إطلاق مبادرة المشاريع الصغيرة والمتوسطة" },
						description: {
							en: "On-site company registration, bank account opening, and direct government coordination.",
							ar: "تسجيل الشركات وفتح الحسابات المصرفية فوراً والتنسيق المباشر مع الحكومة.",
						},
						note: { en: "100 companies registered in a single day", ar: "تسجيل 100 شركة في يوم واحد" },
					},
					{
						time: "12:30",
						title: { en: "Closing Remarks & Future Outlook", ar: "الكلمات الختامية والآفاق المستقبلية" },
						description: {
							en: "Summary of outcomes and announcement of IBS 2026.",
							ar: "ملخص النتائج وإعلان قمة 2026.",
						},
					},
				],
			},
		],
		nextEditionSlug: "2026",
	},
	{
		slug: "ports-2025",
		year: 2025,
		editionLabel: { en: "Ports Summit", ar: "قمة الموانئ" },
		title: {
			en: "IBS Ports & Logistics Summit",
			ar: "قمة الموانئ والخدمات اللوجستية",
		},
		tagline: {
			en: "Iraq's gateway to regional trade.",
			ar: "بوابة العراق إلى التجارة الإقليمية.",
		},
		summary: {
			en: "A focused IBS edition centered on Iraq's ports, logistics, and transportation sectors — bringing together the public authorities, operators, and investors that shape regional trade.",
			ar: "نسخة متخصصة من قمة الأعمال العراقية تركّز على قطاعات الموانئ واللوجستيات والنقل — تجمع الجهات الحكومية والمشغّلين والمستثمرين الذين يصنعون مشهد التجارة الإقليمية.",
		},
		status: "past",
		dates: { en: "2025", ar: "2025" },
		location: { en: "Iraq", ar: "العراق" },
		heroImage: "/images/group-tech.jpg",
		stats: [
			{ value: "200+", label: { en: "Delegates", ar: "مندوب" } },
			{ value: "20+", label: { en: "Operators", ar: "مشغّل" } },
			{ value: "3", label: { en: "Sectors", ar: "قطاعات" } },
		],
		themes: [
			{
				title: { en: "Ports Modernization", ar: "تحديث الموانئ" },
				description: {
					en: "Investment and operational upgrades across Iraq's ports.",
					ar: "الاستثمار والتطوير التشغيلي عبر موانئ العراق.",
				},
			},
			{
				title: { en: "Trade Corridors", ar: "ممرات التجارة" },
				description: {
					en: "Regional connectivity and the Development Road project.",
					ar: "الترابط الإقليمي ومشروع طريق التنمية.",
				},
			},
			{
				title: { en: "Logistics Capacity", ar: "الطاقة اللوجستية" },
				description: {
					en: "Building Iraq's role as a regional logistics hub.",
					ar: "بناء دور العراق محوراً لوجستياً إقليمياً.",
				},
			},
		],
		keynoteSpeakers: [
			{
				id: "fartousi",
				name: {
					en: "Dr. Eng. Farhan Al-Fartousi",
					ar: "د. م. فرحان الفرطوسي",
				},
				title: {
					en: "Director General, Ports of Iraq",
					ar: "المدير العام، الشركة العامة لموانئ العراق",
				},
				photo: "https://randomuser.me/api/portraits/men/52.jpg",
			},
		],
		sectorShares: [
			{ sector: { en: "Ports & Shipping", ar: "الموانئ والشحن" }, percent: 45 },
			{ sector: { en: "Logistics", ar: "اللوجستيات" }, percent: 35 },
			{ sector: { en: "Transport", ar: "النقل" }, percent: 20 },
		],
		initiatives: [],
		sponsors: [],
		gallery: [
			{
				id: "p1",
				src: "/images/group-tech.jpg",
				alt: { en: "Ports summit stage", ar: "مسرح قمة الموانئ" },
			},
		],
	},
	{
		slug: "2026",
		year: 2026,
		editionLabel: { en: "2nd Edition", ar: "النسخة الثانية" },
		title: {
			en: "Iraq Business Summit 2026",
			ar: "قمة الأعمال العراقية 2026",
		},
		tagline: { en: "Don't just attend. Lead.", ar: "لا تكتفِ بالحضور. تصدّر." },
		summary: {
			en: "IBS 2026 will expand in scale, participation, and opportunities — building on the foundation of the first edition. A larger platform for partnerships, investment, and policy.",
			ar: "ستتوسع قمة 2026 في الحجم والمشاركة والفرص، انطلاقاً من أساس النسخة الأولى. منصة أكبر للشراكات والاستثمار وصناعة السياسات.",
		},
		status: "upcoming",
		dates: { en: "2026 — TBA", ar: "2026 — يُعلن لاحقاً" },
		location: { en: "Baghdad, Iraq", ar: "بغداد، العراق" },
		heroImage: "/images/hero-summit.jpg",
		stats: [],
		themes: [],
		keynoteSpeakers: [],
		sectorShares: [],
		initiatives: [],
		sponsors: [],
		gallery: [],
		registrationUrl: "/contact",
	},
];
