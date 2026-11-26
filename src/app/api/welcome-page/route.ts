import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { parseWelcomePage } from "@/data/welcome-page";
import { getWelcomePage, updateWelcomePage } from "@/lib/db/welcome-page";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store, max-age=0" };
export async function GET() {
 try { return NextResponse.json(await getWelcomePage(), { headers }); }
 catch { return NextResponse.json({error: "Welcome page unavailable"}, {status:503, headers}); }
}
export async function PUT(request: Request) {
 try { await requireAuth(request); const origin = request.headers.get("origin"); if(origin && origin !== new URL(request.url).origin) throw new Error("Forbidden"); }
 catch (e) { const message = e instanceof Error ? e.message : "Unauthorized"; const status = message === "Forbidden" ? 403 : ["Unauthorized","Invalid session"].includes(message) ? 401 : 503; return NextResponse.json({error: status === 503 ? "Admin access unavailable" : message}, {status, headers}); }
 let config;
 try {
  const input = await request.json();
  // An editor loaded before the multi-file release would otherwise drop new files.
  if (input && typeof input === "object" && !Array.isArray(input) && !Object.hasOwn(input,"downloads")) return NextResponse.json({error:"Reload this page before saving / أعد تحميل الصفحة قبل الحفظ"}, {status:409, headers});
  config = parseWelcomePage(input);
 }
 catch (e) { return NextResponse.json({error:e instanceof Error ? e.message : "Invalid settings"}, {status:400, headers}); }
 try { return NextResponse.json(await updateWelcomePage(config), { headers }); }
 catch { return NextResponse.json({error:"Unable to save. Please retry. / تعذر الحفظ، أعد المحاولة."}, {status:500, headers}); }
}
