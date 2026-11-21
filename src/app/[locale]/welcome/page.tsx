import type { Metadata } from "next";
import { WelcomeGate } from "@/components/home/WelcomeGate";
export const metadata: Metadata = { title: "Summit welcome | EMAAL", robots: {index:false,follow:false} };
export default async function WelcomePreview({params}:{params:Promise<{locale:string}>}) {
 const {locale} = await params;
 return <WelcomeGate locale={locale === "ar" ? "ar" : "en"} preview />;
}
