import type { Worksheet } from "exceljs";
import { currencyScale } from "./booking-config";

export type PaymentExportRow = {
	id: string; edition_slug: string; edition_title: string; tier_name: string;
	customer_name: string; email: string; phone: string; amount_minor: number; currency: string;
	payment_state: string; provider: string; created_at: number; confirmed_at: number | null;
	transaction_id: string | null; provider_session: string | null;
};
export type PaymentReport = {
	payments: PaymentExportRow[]; total: number; asOf: number;
	filters: { mode: string; status: string; currency: string; q: string; edition: string; from: string; to: string };
	summary: { currency: string; attempts: number; confirmed_minor: number; confirmed_count: number; pending_count: number; review_count: number }[];
};
const labels: Record<string, string> = { all: "الكل", paid: "دفع مؤكد", pending: "بانتظار الدفع", expired: "انتهت المهلة", failed: "مرفوض", cancelled: "ملغى", review: "يحتاج مراجعة", refund_reported: "إشعار استرجاع — يحتاج مراجعة" };
const navy = "FF063647", teal = "FF006B6B", warm = "FFF3F6F7", gold = "FFF2C438";
// Excel dates have no timezone. Store Baghdad wall time and label it explicitly.
const baghdadDate = (ms: number) => new Date(ms + 3 * 60 * 60 * 1000);
const text = (value: string | null | undefined) => (value || "").slice(0, 32767);
function tierName(value: string) {
	try { const t = JSON.parse(value); return text(typeof t.ar === "string" && t.ar ? t.ar : typeof t.en === "string" ? t.en : ""); }
	catch { return ""; }
}
function header(sheet: Worksheet, row: number) {
	sheet.getRow(row).height = 34;
	sheet.getRow(row).eachCell(cell => {
		cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
		cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
		cell.alignment = { vertical: "middle", horizontal: "right", wrapText: true };
	});
}

export async function createPaymentWorkbook(report: PaymentReport) {
	if (!report.payments.length || report.payments.length !== report.total || report.total > 10000) throw new Error("invalid_report");
	// Lazy-loaded in the browser only when the administrator requests a download.
	const ExcelJS = (await import("exceljs")).default;
	const book = new ExcelJS.Workbook();
	book.creator = "EMAAL Business Space";
	book.created = new Date(report.asOf);
	book.calcProperties.fullCalcOnLoad = true;
	const summary = book.addWorksheet("الملخص", { views: [{ rightToLeft: true, showGridLines: false }] });
	const sheet = book.addWorksheet("العمليات", { views: [{ state: "frozen", ySplit: 1, rightToLeft: true }] });
	sheet.columns = [
		["رقم الحجز", 39], ["الاسم", 28], ["البريد الإلكتروني", 32], ["رقم الهاتف", 23],
		["القمة", 42], ["معرّف القمة", 42], ["فئة الحجز", 22], ["المبلغ المطلوب", 20],
		["المبلغ المؤكد قبل العمولة", 24], ["العملة", 12], ["حالة العملية", 32], ["بوابة الدفع", 20],
		["إنشاء الحجز — بغداد", 25], ["تأكيد الدفع بالموقع — بغداد", 28], ["رقم المعاملة", 39], ["مرجع البوابة", 39],
	].map(([title, width]) => ({ header: String(title), width: Number(width) }));
	for (const p of report.payments) {
		const paid = p.payment_state === "paid" && p.confirmed_at !== null;
		// User-supplied strings are string cells, never formula objects or hyperlinks.
		const row = sheet.addRow([
			text(p.id), text(p.customer_name), text(p.email), text(p.phone), text(p.edition_title), text(p.edition_slug), tierName(p.tier_name),
			p.amount_minor / currencyScale(p.currency), paid ? p.amount_minor / currencyScale(p.currency) : 0,
			text(p.currency), labels[p.payment_state] || text(p.payment_state), text(p.provider),
			baghdadDate(p.created_at), p.confirmed_at === null ? null : baghdadDate(p.confirmed_at), text(p.transaction_id), text(p.provider_session),
		]);
		row.height = 32;
		row.eachCell({ includeEmpty: true }, cell => {
			cell.font = { name: "Arial", size: 11, color: { argb: navy } };
			cell.alignment = { vertical: "middle", horizontal: "right" };
			if (row.number % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: warm } };
		});
		for (const col of [1, 3, 4, 6, 15, 16]) { row.getCell(col).numFmt = "@"; row.getCell(col).alignment = { vertical: "middle", horizontal: "left", readingOrder: "ltr" }; }
		for (const col of [8, 9]) row.getCell(col).numFmt = p.currency === "IQD" ? '#,##0.000' : '#,##0.00';
		for (const col of [13, 14]) row.getCell(col).numFmt = "yyyy-mm-dd hh:mm:ss";
		if (paid) row.getCell(11).font = { name: "Arial", size: 11, bold: true, color: { argb: teal } };
	}
	header(sheet, 1);
	sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: sheet.rowCount, column: 16 } };
	sheet.pageSetup = { orientation: "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: "1:1" };
	summary.columns = [24, 24, 24, 32, 24, 30].map(width => ({ width }));
	const mode = report.filters.mode === "real" ? "مدفوعات فعلية" : "محاكاة فقط — ليست أموالًا حقيقية";
	const lines = [
		"EMAAL | تقرير المدفوعات", mode,
		`تاريخ استخراج التقرير: ${baghdadDate(report.asOf).toISOString().replace("T", " ").slice(0, 19)} — بغداد (UTC+03:00)`,
		`فترة إنشاء الحجز: ${report.filters.from || "من البداية"} إلى ${report.filters.to || "حتى الآن"}`,
		`الحالة: ${labels[report.filters.status]} | العملة: ${report.filters.currency === "all" ? "جميع العملات، منفصلة" : report.filters.currency}`,
		`البحث: ${report.filters.q || "بدون"} | القمة: ${report.filters.edition || "جميع القمم"}`,
		"المصدر: سجل مدفوعات الموقع. يشمل كل النتائج المطابقة للفلاتر، وليس الصفحة المعروضة فقط.",
		"المبالغ المؤكدة قبل عمولة شركة الدفع وليست صافي التسوية. المراجعات وإشعارات الاسترجاع مستبعدة من الإجمالي المؤكد.",
		"وقت التأكيد هو وقت وصول تأكيد الدفع إلى الموقع، وليس بالضرورة وقت التسوية لدى البنك. كل صف يمثل محاولة دفع، وليس شخصًا فريدًا.",
	];
	lines.forEach((line, i) => {
		summary.mergeCells(i + 1, 1, i + 1, 6);
		const cell = summary.getCell(i + 1, 1); cell.value = line;
		cell.font = { name: "Arial", size: i === 0 ? 20 : 11, bold: i < 2, color: { argb: navy } };
		cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
		summary.getRow(i + 1).height = i === 0 ? 42 : 32;
		if (i === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: gold } };
	});
	summary.getRow(11).values = ["العملة", "عدد المحاولات", "عمليات مؤكدة", "المبلغ المؤكد قبل العمولة", "بانتظار الدفع", "مراجعة / إشعار استرجاع"];
	header(summary, 11);
	const end = sheet.rowCount;
	for (const s of report.summary) {
		const row = summary.addRow([s.currency]); const n = row.number;
		const currencies = `'العمليات'!$J$2:$J$${end}`, states = `'العمليات'!$K$2:$K$${end}`, amounts = `'العمليات'!$I$2:$I$${end}`;
		row.getCell(2).value = { formula: `COUNTIF(${currencies},A${n})`, result: s.attempts };
		row.getCell(3).value = { formula: `COUNTIFS(${currencies},A${n},${states},"دفع مؤكد")`, result: s.confirmed_count };
		row.getCell(4).value = { formula: `SUMIF(${currencies},A${n},${amounts})`, result: s.confirmed_minor / currencyScale(s.currency) };
		row.getCell(5).value = { formula: `COUNTIFS(${currencies},A${n},${states},"بانتظار الدفع")`, result: s.pending_count };
		row.getCell(6).value = { formula: `COUNTIFS(${currencies},A${n},${states},"يحتاج مراجعة")+COUNTIFS(${currencies},A${n},${states},"إشعار استرجاع — يحتاج مراجعة")`, result: s.review_count };
		row.height = 32;
		row.eachCell(cell => { cell.font = { name: "Arial", size: 12, bold: true, color: { argb: navy } }; cell.alignment = { horizontal: "right", vertical: "middle" }; });
		row.getCell(4).numFmt = s.currency === "IQD" ? '#,##0.000' : '#,##0.00';
	}
	summary.pageSetup = { orientation: "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 1 };
	return { bytes: new Uint8Array(await book.xlsx.writeBuffer()), filename: `EMAAL-payments-${report.filters.mode}-${baghdadDate(report.asOf).toISOString().slice(0, 10)}.xlsx` };
}
