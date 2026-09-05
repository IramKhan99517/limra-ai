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

  // Name Studio
  "studio.eyebrow": "Name Studio",
  "studio.title": "Check a trade name before you reserve it",
  "studio.sub": "Free, instant screening against UAE naming rules. We validate — not invent — so what you reserve is what gets approved.",
  "studio.inputLabel": "Proposed trade name",
  "studio.placeholder": "e.g. Falcon Heights Trading LLC",
  "studio.check": "Check Name",
  "studio.checking": "Checking…",
  "studio.rules": "UAE naming rules applied",
  "studio.rule1": "Length & characters",
  "studio.rule1.desc": "No symbols like •, +, or @; reasonable length for reservation systems.",
  "studio.rule2": "Religious & country names",
  "studio.rule2.desc": "No names of God, religions, or country names used alone.",
  "studio.rule3": "Offensive meaning",
  "studio.rule3.desc": "Words with offensive or inappropriate meanings are rejected.",
  "studio.rule4": "External names",
  "studio.rule4.desc": "Personal names need an owner match; foreign firms must add a legal-form suffix.",
  "studio.rule5": "Activity match",
  "studio.rule5.desc": "Names hinting at regulated activities (finance, medical, education) need prior approvals.",
  "studio.result.title": "Screening result",
  "studio.result.pass": "Looks reserveable",
  "studio.result.warn": "Reserveable with notes",
  "studio.result.fail": "Will likely be rejected",
  "studio.result.disclaimer": "Indicative screening only — final approval rests with the DED / free-zone authority.",
  "studio.suggest.title": "Rule-compliant alternatives",
  "studio.suggest.note": "Suggestions append an approved legal form and keep your core brand word intact.",

  // Domains
  "domains.eyebrow": "Domain Intelligence",
  "domains.title": "One name, every registrar price",
  "domains.sub": "Compare indicative prices for .ae, .com and 20+ extensions from recognized registrars — the best price is highlighted automatically.",
  "domains.inputLabel": "Domain to search",
  "domains.placeholder": "yourbrand",
  "domains.search": "Compare Prices",
  "domains.searching": "Searching…",
  "domains.best": "Best price",
  "domains.buy": "Register",
  "domains.extension": "Extension",
  "domains.price": "First year",
  "domains.renew": "Renewal",
  "domains.registrar": "Best registrar",
  "domains.note": "Prices shown are indicative retail prices in USD including common first-term promotions; always confirm at checkout. .ae domains are sold via aeNIC-accredited registrars.",

  // Bilingual note
  "bilingual.title": "Bilingual by design",
  "bilingual.desc": "Every screen works natively in Arabic (RTL) and English — the way Gulf regulators actually read documents.",
};

const ar: Dict = {
  "nav.namestudio": "استوديو الأسماء",
  "nav.domains": "النطاقات",
  "nav.lang": "اللغة",

  "studio.eyebrow": "استوديو الأسماء",
  "studio.title": "تحقق من الاسم التجاري قبل حجزه",
  "studio.sub": "فحص فوري ومجاني وفق قواعد التسمية الإماراتية. نحن نتحقق ولا نختلق، ليحصل ما تحجزه على الموافقة فعلاً.",
  "studio.inputLabel": "الاسم التجاري المقترح",
  "studio.placeholder": "مثال: شركة فوكس هايتس التجارية ذ.م.م",
  "studio.check": "افحص الاسم",
  "studio.checking": "جارٍ الفحص…",
  "studio.rules": "قواعد التسمية المطبقة في الإمارات",
  "studio.rule1": "الطول والأحرف",
  "studio.rule1.desc": "لا رموز مثل • أو + أو @؛ وطول مناسب لأنظمة الحجز.",
  "studio.rule2": "الأسماء الدينية وأسماء الدول",
  "studio.rule2.desc": "لا أسماء لله أو للأديان أو أسماء دول منفردة.",
  "studio.rule3": "المعنى المسيء",
  "studio.rule3.desc": "تُرفض الكلمات ذات المعاني المسيئة أو غير اللائقة.",
  "studio.rule4": "الأسماء الأجنبية",
  "studio.rule4.desc": "الأسماء الشخصية تتطلب مطابقة المالك؛ ويجب أن تضيف الشركات الأجنبية لاحقة الشكل القانوني.",
  "studio.rule5": "مطابقة النشاط",
  "studio.rule5.desc": "الأسماء التي توحي بأنشطة منظمة (مالية، طبية، تعليمية) تتطلب موافقات مسبقة.",
  "studio.result.title": "نتيجة الفحص",
  "studio.result.pass": "يبدو قابلاً للحجز",
  "studio.result.warn": "قابل للحجز مع ملاحظات",
  "studio.result.fail": "سيُرفض على الأرجح",
  "studio.result.disclaimer": "فحص استرشادي فقط — الموافقة النهائية تخص دائرة الاقتصاد والسياحة / سلطة المنطقة الحرة.",
  "studio.suggest.title": "بدائل مطابقة للقواعد",
  "studio.suggest.note": "تضيف الاقتراحات شكلاً قانونياً معتمداً وتحافظ على كلمة علامتك الأساسية.",

  "domains.eyebrow": "ذكاء النطاقات",
  "domains.title": "اسم واحد، أسعار كل المسجّلين",
  "domains.sub": "قارن الأسعار الإرشادية لنطاقات .ae و .com وأكثر من 20 امتداداً من مسجّلين معتمدين — يُميّز أفضل سعر تلقائياً.",
  "domains.inputLabel": "النطاق المطلوب البحث عنه",
  "domains.placeholder": "علامتك",
  "domains.search": "قارن الأسعار",
  "domains.searching": "جارٍ البحث…",
  "domains.best": "أفضل سعر",
  "domains.buy": "سجّل",
  "domains.extension": "الامتداد",
  "domains.price": "السنة الأولى",
  "domains.renew": "التجديد",
  "domains.registrar": "أفضل مسجّل",
  "domains.note": "الأسعار المعروضة إرشادية بالدولار وتشمل عروض الفترة الأولى؛ تأكد دائماً عند الدفع. تُباع نطاقات .ae عبر المسجّلين المعتمدين.",

  "bilingual.title": "ثنائي اللغة بالتصميم",
  "bilingual.desc": "كل شاشة تعمل بالعربية (من اليمين إلى اليسار) والإنجليزية — تماماً كما تقرأ الجهات الخليجية المستندات.",
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
