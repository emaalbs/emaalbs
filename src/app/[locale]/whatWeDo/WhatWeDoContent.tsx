"use client";

import { useI18n } from "@/i18n/provider";
import { Header } from "@/components/site/Header";
import { WhatWeDoHero } from "@/components/what-we-do/WhatWeDoHero";
import { WhatWeDoIntro } from "@/components/what-we-do/WhatWeDoIntro";
import { WhatWeDoFocus } from "@/components/what-we-do/WhatWeDoFocus";
import { WhatWeDoDelivery } from "@/components/what-we-do/WhatWeDoDelivery";
import { WhatWeDoInternational } from "@/components/what-we-do/WhatWeDoInternational";
import { WhatWeDoCta } from "@/components/what-we-do/WhatWeDoCta";
import { Footer } from "@/components/site/Footer";

export function WhatWeDoContent() {
	const { dir } = useI18n();

	return (
		<main dir={dir} className="overflow-hidden bg-white">
			<Header />
			<WhatWeDoHero />
			<WhatWeDoIntro />
			<WhatWeDoFocus />
			<WhatWeDoDelivery />
			<WhatWeDoInternational />
			<WhatWeDoCta />
			<Footer />
		</main>
	);
}
