"use client";
import { useEffect, useRef, useState } from "react";
import { Download, ImageDown, ShieldCheck } from "lucide-react";
import { formatBookingPrice } from "@/lib/booking-config";
import type { BookingReceipt as Receipt } from "@/lib/receipt-types";

export function BookingReceipt({ receipt, locale }: {receipt:Receipt;locale:"ar"|"en"}) {
	const ar = locale === "ar";
	const exportRef = useRef<HTMLDivElement>(null);
	const [qr,setQr] = useState("");
	const [busy,setBusy] = useState("");
	const [error,setError] = useState("");
	useEffect(() => {
		let stopped=false;
		setQr("");
		const url = `${window.location.origin}/${locale}/receipt/${receipt.id}#${receipt.receiptToken}`;
		import("qrcode").then(q => q.toDataURL(url,{errorCorrectionLevel:"M",margin:4,width:320,color:{dark:"#011e2fff",light:"#ffffffff"}})).then(value => {if (!stopped) setQr(value);}).catch(() => {if(!stopped)setError(ar ? "تعذر تجهيز QR. حدّث الصفحة." : "Could not prepare QR. Refresh this page.");});
		return () => {stopped=true;};
	},[receipt.id,receipt.receiptToken,locale,ar]);
	async function download(format:"pdf"|"png") {
		if (!qr || !exportRef.current || busy) return;
		setBusy(format); setError("");
		try {
			await document.fonts.ready;
			await Promise.all(Array.from(exportRef.current.querySelectorAll("img")).map(img => img.decode()));
			const {toPng,getFontEmbedCSS} = await import("html-to-image");
			const fontEmbedCSS = await getFontEmbedCSS(exportRef.current,{preferredFontFormat:"woff2"});
			const png = await toPng(exportRef.current,{pixelRatio:2,backgroundColor:"#ffffff",fontEmbedCSS,cacheBust:false});
			let url=png;
			if (format === "pdf") {
				const {PDFDocument} = await import("pdf-lib");
				const pdf = await PDFDocument.create();
				pdf.setTitle(`IBS booking receipt ${receipt.id}`); pdf.setAuthor("EMAAL Business Space");
				const picture=await pdf.embedPng(png), page=pdf.addPage([595.28,841.89]);
				const scale=Math.min((page.getWidth()-32)/picture.width,(page.getHeight()-32)/picture.height);
				const width=picture.width*scale,height=picture.height*scale;
				page.drawImage(picture,{x:(page.getWidth()-width)/2,y:(page.getHeight()-height)/2,width,height});
				url=URL.createObjectURL(new Blob([new Uint8Array(await pdf.save())],{type:"application/pdf"}));
			}
			const link=document.createElement("a"); link.href=url; link.download=`IBS-${receipt.preview ? "PREVIEW-" : ""}${receipt.id}-${locale}.${format}`; document.body.appendChild(link);link.click();link.remove();
			if(format === "pdf")setTimeout(()=>URL.revokeObjectURL(url),30000);
		} catch {setError(ar ? "تعذر تنزيل الوصل. أعد المحاولة بعد اكتمال التحميل." : "Could not download the receipt. Wait for loading to finish, then retry.");}
		finally {setBusy("");}
	}
	const date=(value:number) => new Intl.DateTimeFormat(ar?"ar-IQ":"en-GB",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Baghdad"}).format(value);
	function body() {
		const fields=[
			[ar?"صاحب الحجز":"GUEST",receipt.guest],
			[ar?"فئة الحجز":"CATEGORY",receipt.tier[locale]],
			[ar?"المقعد":"SEAT",ar?"مقعد واحد • غير مرقّم":"1 seat • Unassigned seating"],
			[ar?"تاريخ الفعالية":"EVENT DATE",receipt.edition?.date?.[locale] || (ar?"غير مسجل":"Not recorded")],
			[ar?"المكان":"VENUE",receipt.edition?.location?.[locale] || (ar?"غير مسجل":"Not recorded")],
			[ar?"تاريخ الحجز • توقيت بغداد":"BOOKED • BAGHDAD TIME",date(receipt.bookedAt)],
		];
		return <article data-booking-receipt dir={ar?"rtl":"ltr"} style={{background:"#ffffff",color:"#0a1628",border:"1px solid #e6e8eb",borderRadius:20,overflow:"hidden",lineHeight:1.7,fontFamily:ar?"var(--font-arabic), sans-serif":"var(--font-jakarta), var(--font-arabic), sans-serif"}}>
			<header style={{background:"#011e2f",color:"white",padding:"30px 28px",borderTop:"5px solid #eec13b"}}>
				<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}><div><div style={{fontSize:27,fontWeight:800,letterSpacing:".06em"}}>EMAAL<span style={{color:"#eec13b"}}> / IBS</span></div><p style={{fontSize:11,letterSpacing:".12em",marginTop:5,color:"#c5d3dc"}}>BUSINESS SPACE · IRAQ BUSINESS SUMMIT</p></div><span style={{whiteSpace:"nowrap",flexShrink:0,display:"inline-flex",alignItems:"center",lineHeight:1.5,border:"1px solid #eec13b",borderRadius:30,padding:"8px 14px",color:"#eec13b",fontSize:13,fontWeight:700}}>{receipt.preview?(ar?"وصل تجريبي":"PREVIEW RECEIPT"):(ar?"تم الدفع والتأكيد":"PAID & CONFIRMED")}</span></div>
				<h2 style={{fontSize:25,fontWeight:700,lineHeight:1.6,marginTop:25}}>{ar?"وصل الدفع والحجز":"Payment & booking receipt"}</h2>
				<p style={{marginTop:8,fontSize:16,lineHeight:1.9,color:"#e5edf2",overflowWrap:"anywhere"}}>{receipt.edition?.title?.[locale] || receipt.title[locale]}</p>
			</header>
			{receipt.preview && <p style={{background:"#fff8e1",color:"#704f00",padding:"13px 24px",fontWeight:800,fontSize:14,textAlign:"center"}}>{ar?"تجريبي — لا يوجد دفع حقيقي — غير صالح للدخول":"PREVIEW — NO REAL PAYMENT — NOT VALID FOR ENTRY"}</p>}
			<div style={{padding:"26px 28px"}}>
				<div style={{display:"flex",flexWrap:"wrap",gap:"24px 20px"}}>{fields.map(([label,value]) => <div key={label} style={{flex:"1 1 230px",minWidth:0}}><p style={{fontSize:11,fontWeight:700,color:"#546e7a",letterSpacing:ar?0:".07em"}}>{label}</p><p style={{fontSize:16,fontWeight:600,lineHeight:1.9,marginTop:6,overflowWrap:"anywhere"}}>{value}</p></div>)}</div>
				<div style={{marginTop:26,padding:"18px 20px",borderRadius:12,background:"#f8f9fa",borderInlineStart:"4px solid #eec13b",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:12}}><div style={{flex:"1 1 220px"}}><p style={{fontSize:12,lineHeight:1.8,color:"#546e7a"}}>{ar?"المبلغ المدفوع":"AMOUNT PAID"}</p><p style={{fontSize:28,fontWeight:800,color:"#01334d",marginTop:4}}>{formatBookingPrice(receipt.amountMinor,receipt.currency,locale)}</p></div><div style={{flex:"1 1 220px"}}><p style={{fontSize:12,lineHeight:1.8,color:"#546e7a"}}>{ar?"تأكيد الدفع • توقيت بغداد":"PAYMENT CONFIRMED • BAGHDAD TIME"}</p><p style={{fontSize:13,lineHeight:1.8,marginTop:6}}>{date(receipt.paidAt)}</p><p style={{fontSize:12,marginTop:4}}>{receipt.preview?(ar?"محاكاة محلية":"Local simulation"):receipt.provider === "tabadul"?"Tabadul / تبادل":receipt.provider}</p></div></div>
				<div style={{marginTop:26,borderTop:"1px dashed #cad3d9",paddingTop:22,display:"flex",flexWrap:"wrap",alignItems:"center",gap:20}}>
					<div style={{width:160,height:160,flexShrink:0,background:"white"}}>{qr ? <img alt={ar?"رمز التحقق من الوصل":"Receipt verification QR"} src={qr} width={160} height={160} style={{display:"block"}} /> : <p style={{padding:20,fontSize:12}}>{ar?"جارٍ تجهيز QR…":"Preparing QR…"}</p>}</div>
					<div style={{flex:"1 1 220px",minWidth:0}}><p style={{fontSize:14,fontWeight:800,color:"#006666"}}>{ar?"امسح الرمز لعرض تفاصيل الحجز وحالته":"Scan to view booking details & current validity"}</p><p style={{fontSize:11,color:"#546e7a",marginTop:14}}>{ar?"رقم التذكرة / الحجز":"TICKET / BOOKING REFERENCE"}</p><p dir="ltr" style={{fontSize:12,fontFamily:"monospace",overflowWrap:"anywhere",marginTop:6}}>{receipt.id}</p><p style={{fontSize:11,color:"#546e7a",marginTop:12}}>{ar?"مرجع عملية الدفع":"PAYMENT REFERENCE"}</p><p dir="ltr" style={{fontSize:11,overflowWrap:"anywhere",marginTop:6}}>{receipt.transaction}</p></div>
				</div>
			</div>
			<footer style={{background:"#f8f9fa",borderTop:"1px solid #e6e8eb",padding:"16px 28px",fontSize:11,lineHeight:1.9,color:"#546e7a"}}><p>{ar?"احتفظ بالوصل. مشاركته أو مشاركة الرمز تتيح الاطلاع على اسمك وتفاصيل حجزك. لا يتضمن البريد أو الهاتف أو بيانات البطاقة.":"Keep this receipt safe. Sharing it or its QR allows access to your name and booking details. "}</p><p>{ar?"":"No email, phone or card data is included."}</p><p style={{marginTop:4}}>emaalbs.com · {ar?"إثبات دفع وحجز، وليس فاتورة ضريبية":"Payment & booking confirmation, not a tax invoice"}</p></footer>
		</article>;
	}
	return <section aria-label={ar?"وصل الحجز":"Booking receipt"} className="mx-auto mt-8 max-w-3xl">
		<div className="mb-5 flex flex-wrap items-center justify-between gap-4"><p className="flex items-center gap-2 text-sm font-bold text-[var(--color-teal)]"><ShieldCheck size={19}/>{ar?"وصل قابل للتنزيل مع QR":"Downloadable receipt with QR"}</p><div className="flex flex-wrap gap-2">{(["pdf","png"] as const).map(format => <button key={format} data-receipt-download={format} onClick={()=>download(format)} disabled={!qr || !!busy} className="flex min-h-12 items-center gap-2 rounded-xl bg-[var(--color-navy)] px-4 text-sm font-bold text-white hover:bg-[var(--color-teal)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">{format === "pdf"?<Download size={17}/>:<ImageDown size={17}/>} {busy===format?(ar?"جارٍ التنزيل…":"Preparing…"):format === "pdf"?(ar?"تحميل PDF":"Download PDF"):(ar?"تحميل صورة":"Download image")}</button>)}</div></div>
		{error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
		{body()}
		<div aria-hidden="true" style={{position:"fixed",left:-12000,top:0,width:760,pointerEvents:"none"}}><div ref={exportRef}>{body()}</div></div>
	</section>;
}
