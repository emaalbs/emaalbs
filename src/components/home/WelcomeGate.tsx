"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { WelcomeLanding } from "./WelcomeLanding";
import { parseWelcomePage, type WelcomePageSettings } from "@/data/welcome-page";
import styles from "./WelcomeLanding.module.css";
const storageKey = "emaal:welcome:entered";
export function WelcomeGate({ locale, children, preview = false }: { locale: "ar" | "en"; children?: ReactNode; preview?: boolean }) {
 const [settings, setSettings] = useState<WelcomePageSettings | null>(null);
 const [mode, setMode] = useState<"loading" | "welcome" | "site" | "error">("loading");
 const site = useRef<HTMLDivElement>(null);
 const entered = useRef(false);
 useEffect(() => {
  const controller = new AbortController(); let active = true;
  const query = new URLSearchParams(window.location.search);
  let dismissed = query.get("enterSite") === "1";
  try { if(dismissed) sessionStorage.setItem(storageKey,"1"); dismissed ||= sessionStorage.getItem(storageKey) === "1"; } catch { /* Storage may be disabled. */ }
  if (!preview && dismissed) { setMode("site"); return; }
  const timeout = window.setTimeout(() => { controller.abort(); if(active) setMode(preview ? "error" : "site"); }, 6000);
  fetch("/api/welcome-page", {signal:controller.signal, cache:"no-store"})
   .then(async r => { if(!r.ok) throw new Error("Unavailable"); return parseWelcomePage(await r.json()); })
   .then(data => { if(active) {setSettings(data); setMode(preview || data.enabled ? "welcome" : "site");} })
   .catch(() => {if(active) setMode(preview ? "error" : "site");})
   .finally(() => window.clearTimeout(timeout));
  return () => {active=false; window.clearTimeout(timeout); controller.abort();};
 }, [preview]);
 useEffect(() => { if(mode === "site" && entered.current) {site.current?.focus(); window.scrollTo({top:0,behavior:"instant"});} }, [mode]);
 function enter() {
  entered.current = true;
  try {sessionStorage.setItem(storageKey,"1");} catch { /* The current page can still open. */ }
  if(preview) window.location.assign(`/${locale}?enterSite=1`);
  else setMode("site");
 }
 if(mode === "site") return <div ref={site} tabIndex={-1} style={{outline:"none"}}>{children}</div>;
 if(mode === "welcome" && settings) return <WelcomeLanding settings={settings} locale={locale} onEnter={enter} preview={preview} />;
 return <main className={styles.loading} dir={locale === "ar" ? "rtl" : "ltr"}>
  <Logo tone="dark" height={48} />
  <p role="status">{mode === "error" ? (locale === "ar" ? "تعذر تحميل المعاينة" : "Preview unavailable") : (locale === "ar" ? "أهلًا بك في أعمال" : "Welcome to EMAAL")}</p>
  <a href={`/${locale}?enterSite=1`}>{locale === "ar" ? "الدخول إلى الموقع" : "Continue to the website"}</a>
 </main>;
}
