import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { parseContactEmailSettings } from "@/lib/contact-email-config";
import { readContactEmailSettings, saveContactEmailSettings, contactEmailServiceAvailable, CONTACT_EMAIL_SENDER, sendContactEmails } from "@/lib/contact-email";

async function authorize(request: Request) {
	await requireAuth(request);
	const origin = request.headers.get("origin");
	if (request.method !== "GET" && origin && origin !== new URL(request.url).origin) throw new Error("Forbidden");
}
function failure(error: unknown) {
	const message = error instanceof Error ? error.message : "Unavailable";
	const status = ["Unauthorized","Invalid session"].includes(message) ? 401 : message === "Forbidden" ? 403 : 500;
	return NextResponse.json({error:status===500 ? "تعذّر إكمال الطلب / Unable to complete request" : message},{status});
}
export async function GET(request: Request) {
	try {
		await authorize(request);
		return NextResponse.json({settings:await readContactEmailSettings(),serviceAvailable:await contactEmailServiceAvailable(),sender:CONTACT_EMAIL_SENDER},{headers:{"Cache-Control":"no-store, private"}});
	} catch(error) { return failure(error); }
}
export async function PUT(request: Request) {
	try {
		await authorize(request);
		let settings;
		try { settings=parseContactEmailSettings(await request.json()); }
		catch(error) {return NextResponse.json({error:error instanceof Error ? error.message : "Invalid settings"},{status:400});}
		await saveContactEmailSettings(settings);
		return NextResponse.json({settings});
	} catch(error) {return failure(error);}
}
export async function POST(request: Request) {
	try {
		await authorize(request);
		const settings=await readContactEmailSettings();
		if (!settings.enabled) return NextResponse.json({error:"فعّل الإشعارات واحفظ الإيميلات أولًا / Enable and save notifications first"},{status:400});
		if (!await contactEmailServiceAvailable()) return NextResponse.json({error:"خدمة البريد غير مربوطة في هذه البيئة / Email service is not connected in this environment"},{status:503});
		const { DB }=await getEnv();const now=Date.now();
		const claim=await DB.prepare("UPDATE contact_email_settings SET last_test_at=? WHERE id=1 AND last_test_at<?").bind(now,now-60000).run();
		if (!claim.meta.changes) return NextResponse.json({error:"انتظر دقيقة قبل إعادة الاختبار / Wait one minute before testing again"},{status:429});
		const deliveries=await sendContactEmails({id:0,name:"EMAAL — اختبار الإشعارات",email:CONTACT_EMAIL_SENDER,phone:null,company:"EMAAL Business Space",subject:"Notification test",message:"هذه رسالة اختبار. إعدادات البريد تعمل إذا استلمت هذه النسخة.\nThis is a test of your contact notification settings.",created_at:now},true);
		return NextResponse.json({deliveries},{headers:{"Cache-Control":"no-store, private"}});
	} catch(error) {return failure(error);}
}
