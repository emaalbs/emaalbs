import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { IBSBand } from "@/components/sections/IBSBand";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Group } from "@/components/sections/Group";
import { WhyEmaal } from "@/components/sections/WhyEmaal";
import { Highlights } from "@/components/sections/Highlights";
import { StatsBar } from "@/components/sections/StatsBar";
import { CtaBand } from "@/components/sections/CtaBand";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<TrustStrip />
				<IBSBand />
				<About />
				<Services />
				<Group />
				<WhyEmaal />
				<Highlights />
				<StatsBar />
				<CtaBand />
			</main>
			<Footer />
		</>
	);
}
