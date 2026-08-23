import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";

type Locale = "en" | "ar";

type TranslationRequest = {
	text?: string;
	sourceLocale?: Locale;
	targetLocale?: Locale;
};

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as TranslationRequest;
		const text = body.text?.trim() || "";
		const sourceLocale = body.sourceLocale;
		const targetLocale = body.targetLocale;

		if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });
		if (text.length > 10000) return NextResponse.json({ error: "Text is too long to translate at once" }, { status: 400 });
		if (!sourceLocale || !targetLocale || sourceLocale === targetLocale) {
			return NextResponse.json({ error: "Choose two different supported languages" }, { status: 400 });
		}

		const { AI } = await getEnv();
		if (!AI) throw new Error("AI binding is not available");

		const result = await AI.run("@cf/meta/m2m100-1.2b", {
			text,
			source_lang: sourceLocale,
			target_lang: targetLocale,
		});
		const translatedText = "translated_text" in result ? result.translated_text?.trim() : "";
		if (!translatedText) throw new Error("Translation service returned an empty result");

		return NextResponse.json({ translatedText, sourceLocale, targetLocale });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Translation failed";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
