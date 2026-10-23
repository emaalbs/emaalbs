"use client";
import { useEffect, useState } from "react";
import { BookingReceipt } from "./BookingReceipt";
import type { BookingReceipt as Receipt } from "@/lib/receipt-types";
export function ReceiptViewer({id,locale}:{id:string;locale:"ar"|"en"}) {
	const [receipt,setReceipt]=useState<Receipt|null>(null),[error,setError]=useState(false),[revision,setRevision]=useState(0);
	useEffect(()=>{
		let stopped=false;
		async function read() {
			try {
				const key=`ibs-receipt:${id}`;
				const fragment=window.location.hash.slice(1);
				let token=fragment;
				try {if(/^[a-f0-9]{64}$/.test(fragment)){sessionStorage.setItem(key,fragment);history.replaceState(null,"",window.location.pathname);}else{token=sessionStorage.getItem(key)||"";}}catch{/* Keep fragment if browser storage is disabled. */}
				const r=await fetch(`/api/receipts/${id}`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store",referrerPolicy:"no-referrer"});
				if(!r.ok)throw new Error();
				const data=await r.json() as Receipt;
				if(!stopped){setReceipt(data);setError(false);}
			}catch{if(!stopped){setReceipt(null);setError(true);}}
		}
		void read(); const timer=setInterval(()=>void read(),60000);
		return ()=>{stopped=true;clearInterval(timer);};
	},[id,revision]);
	return <main dir={locale==="ar"?"rtl":"ltr"} className="min-h-screen bg-[var(--color-warm)] px-4 py-14"><div className="mx-auto max-w-3xl"><h1 className="text-2xl font-bold text-[var(--color-navy)]">{locale==="ar"?"التحقق من وصل IBS":"IBS receipt verification"}</h1>{receipt?<BookingReceipt receipt={receipt} locale={locale}/>:<p role="status" className="mt-8 rounded-xl border border-[var(--color-line)] bg-white p-6 leading-8">{error?(locale==="ar"?"تعذر التحقق من هذا الوصل. قد يكون الرابط غير صالح أو تغيّرت حالة الدفع. تواصل مع المنظم، ولا تعتمد على صورة الوصل وحدها لتأكيد الدخول.":"This receipt could not be verified. The link may be invalid or the payment status may have changed. Contact the organizer; a saved image alone does not confirm admission."):(locale==="ar"?"جارٍ التحقق…":"Verifying…")}</p>}<button onClick={()=>setRevision(n=>n+1)} className="mt-6 min-h-11 rounded-lg border border-[var(--color-line)] px-5 text-sm font-bold">{locale==="ar"?"إعادة التحقق":"Check again"}</button></div></main>;
}
