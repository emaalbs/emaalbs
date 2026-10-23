import { ReceiptViewer } from "@/components/ibs/ReceiptViewer";
export const metadata = { title:"IBS | Receipt verification",robots:{index:false,follow:false},referrer:"no-referrer" };
export default async function Page({params}:{params:Promise<{locale:string;id:string}>}) {
	const {locale,id}=await params;
	return <ReceiptViewer id={id} locale={locale === "ar"?"ar":"en"}/>;
}
