"use client";
import { ArrowUpRight, ArrowRight, CalendarDays, Download, Globe2 } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { welcomeUrl, type WelcomePageSettings } from "@/data/welcome-page";
import styles from "./WelcomeLanding.module.css";
export function WelcomeLanding({settings:s, locale, onEnter, preview=false}: {settings:WelcomePageSettings; locale:"en"|"ar"; onEnter:()=>void; preview?:boolean}) {
 const ar = locale === "ar", other = ar ? "en" : "ar";
 const agenda = welcomeUrl(s.agendaUrl,locale), registration = welcomeUrl(s.registrationUrl,locale), details = welcomeUrl(s.detailsUrl,locale);
 return <main className={styles.page} dir={ar?"rtl":"ltr"} data-welcome-page>
  <div className={styles.shell}>
   <header className={styles.header}>
    <button className={styles.brand} onClick={onEnter} aria-label={s.enterLabel[locale]}><Logo tone="dark" height={44} /></button>
    <a className={styles.language} href={`/${other}${preview?"/welcome":""}`} lang={other}><Globe2 size={17}/>{ar?"English":"العربية"}</a>
   </header>
   <div className={styles.grid}>
    <section className={styles.content} aria-labelledby="welcome-title">
     <p className={styles.kicker}><span/>{s.kicker[locale]}</p>
     <h1 id="welcome-title" className={styles.title}>{s.title[locale]}</h1>
     <p className={styles.description}>{s.description[locale]}</p>
     {s.dateLine[locale] && <div className={styles.date}><CalendarDays size={21}/><p>{s.dateLine[locale].split(/(\d+(?:[–-]\d+)+)/g).map((part,index)=>/\d+[–-]\d+/.test(part)?<bdi dir="ltr" key={index}>{part}</bdi>:part)}</p></div>}
     <div className={styles.actions}>
      {agenda ? <a className={styles.agenda} href={agenda} download target="_blank" rel="noopener noreferrer"><Download size={19}/>{s.agendaLabel[locale]}</a> : <div className={styles.pending}><button className={styles.agenda} disabled><Download size={19}/>{s.agendaLabel[locale]}</button><small>{ar?"سيُتاح ملف الأجندة قريبًا":"Agenda file coming soon"}</small></div>}
      {registration ? <a className={styles.register} href={registration} target="_blank" rel="noopener noreferrer">{s.registrationLabel[locale]}<ArrowUpRight size={20}/></a> : <div className={styles.pending}><button className={styles.register} disabled>{s.registrationLabel[locale]}<ArrowUpRight size={20}/></button><small>{ar?"سيُتاح رابط التسجيل قريبًا":"Registration link coming soon"}</small></div>}
     </div>
     <div className={styles.enterRow}><button className={styles.enter} onClick={onEnter} data-enter-site>{s.enterLabel[locale]}<ArrowRight size={20}/></button></div>
    </section>
    <aside className={styles.visual} aria-label={ar?"قمة الأعمال العراقية":"Iraq Business Summit"}>
     <div className={styles.imageWrap}>{s.imageUrl && <img src={s.imageUrl} alt="" fetchPriority="high" className={styles.image}/>}<div className={styles.shade}/>
      <div className={styles.visualCaption}><span className={styles.visualRule}/><p>{s.locationLine[locale]}</p></div>
     </div>
     <div className={styles.corner} aria-hidden="true"><ArrowUpRight size={40} strokeWidth={1}/></div>
    </aside>
   </div>
   <footer className={styles.footer}>
    <span>EMAAL <span className={styles.footerLight}>Business Space</span></span>
    {details && <a className={styles.details} href={details}>{ar?"اكتشف تفاصيل القمة":"Explore the summit"}<ArrowUpRight size={17}/></a>}
   </footer>
  </div>
 </main>;
}
