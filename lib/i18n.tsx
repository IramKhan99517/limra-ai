"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  // Nav
  "nav.namestudio": "Name Studio",
  "nav.domains": "Domains",
  "nav.lang": "Language",

  // Name Studio — KSA
  "studio.eyebrow": "Name Studio",
  "studio.title": "Brand Name Intelligence for Saudi Arabia",
  "studio.sub": "Generate business names, check suitability against Saudi naming rules, get alternatives, and receive Arabic transliterations and brand versions for every option.",
  "studio.inputLabel": "Proposed business name",
  "studio.placeholder": "e.g. Falcon Heights Trading Company",
  "studio.check": "Check Name",
  "studio.checking": "Checking…",
  "studio.rules": "KSA naming rules applied",
  "studio.rule1": "Religious & sacred terms",
  "studio.rule1.desc": "Names of God, religions, or sacred terms are rejected by the Ministry of Commerce.",
  "studio.rule2": "Country & city names",
  "studio.rule2.desc": "Country and city names (Saudi, Riyadh, Jeddah…) cannot stand alone.",
  "studio.rule3": "Offensive meaning",
  "studio.rule3.desc": "Words with offensive or inappropriate meanings are rejected.",
  "studio.rule4": "Regulated activities",
  "studio.rule4.desc": "Banking, health, education, and similar names need prior authority approval.",
  "studio.rule5": "Foreign names & legal form",
  "studio.rule5.desc": "Foreign brand words are transliterated in Arabic; names should include a legal form.",
  "studio.result.title": "Screening result",
  "studio.result.pass": "Looks suitable for reservation",
  "studio.result.warn": "Suitable with notes",
  "studio.result.fail": "Will likely be rejected",
  "studio.result.disclaimer": "Indicative screening only — final name approval rests with the Saudi Ministry of Commerce / Saudi Business Center.",
  "studio.suggest.title": "Rule-compliant alternatives",
  "studio.suggest.note": "Suggestions keep your core brand word and add a KSA-appropriate descriptor.",

  // Domains — KSA
  "domains.eyebrow": "Domain Intelligence",
  "domains.title": "Brand-domain matching for the Saudi market",
  "domains.sub": "Check availability, match domains to your brand, discover alternatives, and get premium and Saudi-market domain recommendations (.sa, .com.sa and more).",
  "domains.inputLabel": "Domain to search",
  "domains.placeholder": "yourbrand",
  "domains.search": "Check Domains",
  "domains.searching": "Checking…",
  "domains.best": "Best price",
  "domains.buy": "Register",
  "domains.extension": "Extension",
  "domains.price": "First year",
  "domains.renew": "Renewal",
  "domains.registrar": "Best registrar",
  "domains.note": "Prices shown are indicative retail prices in USD including common first-term promotions; always confirm at checkout. .sa and .com.sa domains are sold via SaudiNIC-accredited registrars.",

  // Arabic conversion
  "bilingual.title": "Arabic brand conversion",
  "bilingual.desc": "Every generated name includes an Arabic transliteration and a natural Arabic brand version — with full Arabic UI, RTL layout, and a one-click language switcher.",
};

const ar: Dict = {
  "nav.namestudio": "استوديو الأسماء",
  "nav.domains": "النطاقات",
  "nav.lang": "اللغة",

  "studio.eyebrow": "استوديو الأسماء",
  "studio.title": "ذكاء العلامات التجارية للسوق السعودي",
  "studio.sub": "ولّد أسماء الأعمال، وافحص ملاءمتها لقواعد التسمية السعودية، واحصل على بدائل مع النقل الصوتي والنسخة العربية لكل اسم.",
  "studio.inputLabel": "الاسم التجاري المقترح",
  "studio.placeholder": "مثال: شركة فالكون هايتس التجارية",
  "studio.check": "افحص الاسم",
  "studio.checking": "جارٍ الفحص…",
  "studio.rules": "قواعد التسمية المطبقة في السعودية",
  "studio.rule1": "المصطلحات الدينية والمقدسة",
  "studio.rule1.desc": "أسماء الله أو الأديان أو المصطلحات المقدسة تُرفض من وزارة التجارة.",
  "studio.rule2": "أسماء الدول والمدن",
  "studio.rule2.desc": "أسماء الدول والمدن (السعودية، الرياض، جدة…) لا يجوز استخدامها منفردة.",
  "studio.rule3": "المعنى المسيء",
  "studio.rule3.desc": "تُرفض الكلمات ذات المعاني المسيئة أو غير اللائقة.",
  "studio.rule4": "الأنشطة المنظّمة",
  "studio.rule4.desc": "أسماء الأنشطة المصرفية والصحية والتعليمية تتطلب موافقات مسبقة من الجهات المختصة.",
  "studio.rule5": "الأسماء الأجنبية والشكل القانوني",
  "studio.rule5.desc": "تُنقل الكلمات الأجنبية صوتياً في النسخة العربية؛ ويُفضّل أن يتضمن الاسم شكلًا قانونياً.",
  "studio.result.title": "نتيجة الفحص",
  "studio.result.pass": "يبدو مناسبًا للحجز",
  "studio.result.warn": "مناسب مع ملاحظات",
  "studio.result.fail": "سيُرفض على الأرجح",
  "studio.result.disclaimer": "فحص استرشادي فقط — الموافقة النهائية تخص وزارة التجارة / المركز السعودي للأعمال.",
  "studio.suggest.title": "بدائل مطابقة للقواعد",
  "studio.suggest.note": "تحافظ الاقتراحات على كلمة علامتك الأساسية وتضيف وصفًا مناسبًا للسوق السعودي.",

  "domains.eyebrow": "ذكاء النطاقات",
  "domains.title": "مطابقة النطاقات لعلامتك التجارية في السوق السعودي",
  "domains.sub": "افحص التوفر، وطابق النطاقات مع علامتك، واكتشف البدائل وتوصيات النطاقات المتميزة والسعودية (.sa و .com.sa والمزيد).",
  "domains.inputLabel": "النطاق المطلوب البحث عنه",
  "domains.placeholder": "علامتك",
  "domains.search": "افحص النطاقات",
  "domains.searching": "جارٍ الفحص…",
  "domains.best": "أفضل سعر",
  "domains.buy": "سجّل",
  "domains.extension": "الامتداد",
  "domains.price": "السنة الأولى",
  "domains.renew": "التجديد",
  "domains.registrar": "أفضل مسجّل",
  "domains.note": "الأسعار المعروضة إرشادية بالدولار وتشمل عروض الفترة الأولى؛ تأكد دائمًا عند الدفع. تُباع نطاقات .sa و .com.sa عبر المسجّلين المعتمدين من هيئة الاتصالات السعودية.",

  "bilingual.title": "تحويل العلامة إلى العربية",
  "bilingual.desc": "كل اسم يتم توليده يتضمن النقل الصوتي العربي ونسخة عربية طبيعية للعلامة — مع واجهة عربية كاملة واتجاه من اليمين لليسار ومبدّل لغة بنقرة واحدة.",
};

const dicts: Record<Lang, Dict> = { en, ar };

type I18nCtx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("limra-lang") as Lang | null;
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    window.localStorage.setItem("limra-lang", lang);
  }, [lang]);

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang: setLangState,
      toggle: () => setLangState((p) => (p === "en" ? "ar" : "en")),
      t: (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key,
    }),
    [lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}