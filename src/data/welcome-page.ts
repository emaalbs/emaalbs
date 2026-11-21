export type WelcomeText = { en: string; ar: string };
export type WelcomePageSettings = {
 enabled: boolean;
 kicker: WelcomeText;
 title: WelcomeText;
 description: WelcomeText;
 dateLine: WelcomeText;
 locationLine: WelcomeText;
 imageUrl: string;
 agendaUrl: WelcomeText;
 agendaLabel: WelcomeText;
 agendaDescription: WelcomeText;
 agenda2Url: WelcomeText;
 agenda2Label: WelcomeText;
 agenda2Description: WelcomeText;
 registrationUrl: WelcomeText;
 registrationLabel: WelcomeText;
 detailsUrl: WelcomeText;
 enterLabel: WelcomeText;
};
const summit = "/ibs/iraq-business-summit-iii-ibs-iii-2026-the-exceptional-edition-baghdad-davos";
export const DEFAULT_WELCOME_PAGE: WelcomePageSettings = {
 enabled: false,
 kicker: { en: "IRAQ BUSINESS SUMMIT III · THE EXCEPTIONAL EDITION", ar: "قمة الأعمال العراقية الثالثة · النسخة الاستثنائية" },
 title: { en: "From Baghdad.\nTo Davos.", ar: "من بغداد\nإلى دافوس" },
 description: { en: "A meeting of decision-makers, business leaders and investors. Explore Iraq’s investment opportunities and build international partnerships, from Baghdad to Davos.", ar: "لقاء يجمع صُنّاع القرار وقادة الأعمال والمستثمرين لاستكشاف الفرص الاستثمارية في العراق وبناء شراكات دولية، من بغداد إلى دافوس." },
 dateLine: { en: "Baghdad · 5–6 December 2026\nDavos · January 2027", ar: "بغداد · 5–6 ديسمبر 2026\nدافوس · يناير 2027" },
 locationLine: { en: "From digital transformation and governance to an investment-driven economy", ar: "من التحول الرقمي والحوكمة إلى اقتصاد يقوده الاستثمار" },
 imageUrl: "/api/media/ibs/hero/1793266665053-rnu932u8fp.webp",
 agendaUrl: { en: "", ar: "" },
 agendaLabel: { en: "Download agenda", ar: "تحميل الأجندة" },
 agendaDescription: { en: "", ar: "" },
 agenda2Url: { en: "", ar: "" },
 agenda2Label: { en: "Day two agenda", ar: "أجندة اليوم الثاني" },
 agenda2Description: { en: "", ar: "" },
 registrationUrl: { en: "", ar: "" },
 registrationLabel: { en: "Register your interest", ar: "سجّل اهتمامك" },
 detailsUrl: { en: "/en" + summit, ar: "/ar" + summit },
 enterLabel: { en: "Enter EMAAL website", ar: "الدخول إلى موقع أعمال" },
};
export const welcomeTextFields = ["kicker", "title", "description", "dateLine", "locationLine", "agendaLabel", "agendaDescription", "agenda2Label", "agenda2Description", "registrationLabel", "enterLabel"] as const;
export const welcomeUrlFields = ["agendaUrl", "agenda2Url", "registrationUrl", "detailsUrl"] as const;
export function safeWelcomeUrl(value: string): boolean {
 if (!value) return true;
 if (/[\\\u0000-\u0020\u007f]/.test(value)) return false;
 if (value.startsWith("/") && !value.startsWith("//")) return true;
 try { const u = new URL(value); return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password; } catch { return false; }
}
export function parseWelcomePage(value: unknown): WelcomePageSettings {
 if (!value || typeof value !== "object") throw new Error("Invalid settings / إعدادات غير صالحة");
 const input = value as Record<string, unknown>;
 if (typeof input.enabled !== "boolean") throw new Error("Invalid visibility setting");
 const result = { enabled: input.enabled } as WelcomePageSettings;
 for (const field of [...welcomeTextFields, ...welcomeUrlFields]) {
  // Older saved configurations have only one agenda; read them without a migration.
  const optional = ["agendaDescription", "agenda2Url", "agenda2Label", "agenda2Description"].includes(field);
  const pair = (input[field] === undefined && optional ? DEFAULT_WELCOME_PAGE[field] : input[field]) as Record<string, unknown> | undefined;
  if (!pair || typeof pair.en !== "string" || typeof pair.ar !== "string") throw new Error("Both language fields are required: " + field);
  const max = field === "description" ? 2000 : 1000;
  if (pair.en.length > max || pair.ar.length > max) throw new Error("Text is too long: " + field);
  result[field] = { en: pair.en.trim(), ar: pair.ar.trim() };
 }
 for (const field of welcomeUrlFields) for (const locale of ["en", "ar"] as const) if (!safeWelcomeUrl(result[field][locale])) throw new Error("Use a valid https:// or /path link: " + field);
 if (typeof input.imageUrl !== "string" || input.imageUrl.length > 2000 || !safeWelcomeUrl(input.imageUrl.trim())) throw new Error("Invalid image URL");
 result.imageUrl = input.imageUrl.trim();
 if (result.agenda2Url.en || result.agenda2Url.ar) for (const locale of ["en", "ar"] as const) if (!result.agenda2Label[locale]) throw new Error("Required in both languages: agenda2Label");
 for (const field of ["title", "enterLabel", "agendaLabel", "registrationLabel"] as const) for (const locale of ["en", "ar"] as const) if (!result[field][locale]) throw new Error("Required in both languages: " + field);
 return result;
}
export function welcomeUrl(pair: WelcomeText, locale: "en" | "ar") { return pair[locale] || pair[locale === "en" ? "ar" : "en"]; }
