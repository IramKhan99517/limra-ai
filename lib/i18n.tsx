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
  "nav.roadmap": "Roadmap",
  "nav.grants": "Grants",
  "nav.insights": "Insights",
  "nav.contract": "Contract Analyzer",
  "nav.dashboard": "Dashboard",
  "nav.pricing": "Pricing",
  "nav.admin": "Admin",
  "nav.login": "Log in",
  "nav.signup": "Get Started",
  "nav.signout": "Sign Out",
  "nav.account": "View Profile",
  "nav.settings": "Settings",
  "nav.vault": "Document Vault",
  "nav.adminPanel": "Admin Panel",
  "nav.yourAccount": "Your account",
  "nav.lang": "Language / اللغة",
  "nav.menu": "Toggle menu",

  // Hero
  "hero.eyebrow": "Powering Vision 2030",
  "hero.title1": "Launch Your Saudi Business",
  "hero.titleAccent": "Faster with AI",
  "hero.sub":
    "From business name to bank account — LIMRA AI generates brand-ready names, checks Saudi naming rules, produces Arabic brand versions, matches your domains, finds grants, and builds your personalized setup roadmap.",
  "hero.cta1": "Start your setup",
  "hero.cta2": "Explore Name Studio",
  "hero.beta": "Now in private beta · Built for founders entering Saudi Arabia",

  // Benefits
  "benefits.eyebrow": "Everything you need to launch",
  "benefits.title": "One AI platform for the complete Saudi launch journey",
  "benefit.1": "AI Business Setup Roadmap",
  "benefit.2": "Saudi Business Name Studio",
  "benefit.3": "Arabic Brand Generation",
  "benefit.4": "Contract Analyzer",
  "benefit.5": "Domain Intelligence",
  "benefit.6": "Grants & Incentive Discovery",
  "benefit.7": "Business Planning Assistant",
  "benefit.8": "Localized Saudi Market Insights",
  "benefit.9": "Brand, Domain & Compliance Guidance",

  // Stats
  "stat.docs": "Document types mapped",
  "stat.authorities": "Saudi authorities covered",
  "stat.ai": "AI-guided",
  "stat.aiLabel": "Setup roadmap",

  // Vision 2030
  "vision.eyebrow": "Built for Vision 2030",
  "vision.title": "Supporting Saudi Arabia's transformation from day one",
  "vision.body":
    "LIMRA AI is built in alignment with Vision 2030 goals — empowering both local and foreign founders to build compliant, well-structured businesses across the Kingdom. From SMEs in Riyadh to startups in NEOM, we map your path through every Saudi authority.",
  "vision.cta1": "Explore sector insights →",
  "vision.cta2": "Find funding programs →",

  // Modules
  "modules.eyebrow": "Intelligence Modules",
  "modules.title": "Seven engines that turn Saudi red tape into a clear path",
  "modules.sub":
    "Name Studio, Domain Intelligence, Roadmap Builder, Contract Analyzer and Grants are premium — log in and subscribe to unlock the full stack.",
  "modules.live": "Live",
  "modules.roadmap": "Roadmap",
  "modules.explore": "Explore →",
  "mod.namestudio": "Name Studio",
  "mod.namestudio.desc": "Generate brand-ready Saudi business names, check naming rules, and get Arabic brand versions.",
  "mod.domains": "Domain Intelligence",
  "mod.domains.desc": "Domain availability, brand-domain matching, and Saudi market recommendations.",
  "mod.roadmap": "Roadmap Builder",
  "mod.roadmap.desc": "Personalized Saudi setup roadmaps with recommended business names built in.",
  "mod.grants": "Grants & Incentives",
  "mod.grants.desc": "Curated government grants, salary subsidies, and funding programs for SMEs.",
  "mod.contract": "Contract Analyzer",
  "mod.contract.desc": "Upload any business contract and get a plain-language summary, risk flags, and the questions to ask — in English or Arabic.",
  "mod.vault": "Document Vault",
  "mod.vault.desc": "Store every business document in one private, encrypted vault — with the correct government form and portal for each requirement.",
  "mod.insights": "Market Insights",
  "mod.insights.desc": "Data-driven sector analysis — growth rates, market sizes, opportunities, and regional hotspots.",

  // Name Studio teaser
  "teaser.names.eyebrow": "Name Studio · Premium",
  "teaser.names.title": "Brand Name Intelligence for Saudi Arabia",
  "teaser.names.sub":
    "Generate business names, check suitability against Saudi naming rules, explore alternatives, and get an Arabic transliteration and natural Arabic brand version for every option — optimized for Saudi regulations and market practice.",
  "teaser.names.f1": "Unlimited name generation",
  "teaser.names.f2": "Saudi naming-rule suitability checks",
  "teaser.names.f3": "Arabic transliteration & brand versions",
  "teaser.names.f4": "Premium brandable & SEO-friendly sets",
  "teaser.names.cta": "Unlock Name Studio",
  "teaser.names.preview": "Preview — sample Arabic conversion",
  "teaser.transliteration": "· transliteration",
  "teaser.brandVersion": "· brand version",

  // Domain teaser
  "teaser.domains.preview": "Preview — Saudi market domains",
  "teaser.domains.eyebrow": "Domain Intelligence · Premium",
  "teaser.domains.title": "Brand-domain matching for the Saudi market",
  "teaser.domains.sub":
    "Check live domain availability, match domains to your brand, discover alternatives, and get premium and Saudi-market recommendations built for KSA.",
  "teaser.domains.f1": "Domain availability across 20+ extensions",
  "teaser.domains.f2": "Brand-domain matching & alternatives",
  "teaser.domains.f3": "Premium domain suggestions",
  "teaser.domains.f4": ".sa & .com.sa Saudi market recommendations",
  "teaser.domains.cta": "Unlock Domain Intelligence",

  // Zones
  "zones.eyebrow": "Zone Intelligence",
  "zones.title": "Compare setup costs across Saudi economic zones",
  "zones.sub":
    "Illustrative sample figures for orientation — live, zone-verified cost and processing data is being integrated with each authority.",
  "zones.col.zone": "Zone",
  "zones.col.cost": "Year 1 Cost",
  "zones.col.bank": "Bank Approval",
  "zones.col.time": "Processing",

  // Calculator
  "calc.eyebrow": "Setup Calculator",
  "calc.title": "Estimate your Year-1 cost before you talk to anyone",

  // Marketplace
  "market.eyebrow": "Expert Marketplace",
  "market.title": "Specialists, on demand",
  "market.sub":
    "Sample partner profiles for illustration — our vetted marketplace and booking flow are launching soon.",
  "market.book": "Book",

  // Dashboard teaser
  "dashTeaser.eyebrow": "Command Dashboard",
  "dashTeaser.title": "Your entire Saudi operation, one glass surface",
  "dashTeaser.sub":
    "A live view of your business setup — licenses, documents, recommended names, and your step-by-step roadmap — backed by a real database that updates as you work.",
  "dashTeaser.cta": "Open live dashboard →",

  // Journey
  "journey.eyebrow": "Setup Journey",
  "journey.title": "From idea to operating entity in four guided stages",
  "journey.1.title": "Describe your business",
  "journey.1.desc": "Answer a short intake and LIMRA AI maps your activity to the exact licenses and documents you need in Saudi Arabia.",
  "journey.2.title": "Get your roadmap & names",
  "journey.2.desc": "See a personalized, step-by-step checklist with the correct government form and portal — plus recommended brand-ready business names.",
  "journey.3.title": "Prepare & store",
  "journey.3.desc": "Download each official form, complete it, and keep every signed document in one secure vault.",
  "journey.4.title": "Stay organized as you grow",
  "journey.4.desc": "Track your setup progress and keep licenses, renewals, and documents in one place — with more automation on the way.",

  // Pricing
  "pricing.eyebrow": "Pricing",
  "pricing.title": "Plans that scale from first license to full RHQ",
  "pricing.sub":
    "LIMRA is in private beta — pricing below is indicative, and beta access is free while we build.",
  "pricing.popular": "Most popular",
  "pricing.month": "month",
  "plan.founder": "Founder",
  "plan.founder.desc": "For solo founders exploring market entry.",
  "plan.founder.f1": "Licensing checklist",
  "plan.founder.f2": "Document Vault",
  "plan.founder.f3": "Personalized setup roadmap",
  "plan.founder.f4": "Name Studio previews",
  "plan.founder.cta": "Start free",
  "plan.growth": "Growth",
  "plan.growth.desc": "For teams actively launching and branding in KSA.",
  "plan.growth.f1": "Everything in Founder",
  "plan.growth.f2": "Unlimited Name Generation",
  "plan.growth.f3": "Arabic Brand Creation",
  "plan.growth.f4": "Contract Analyzer",
  "plan.growth.f5": "Premium Domain Intelligence",
  "plan.growth.f6": "Full Grants Database",
  "plan.growth.f7": "AI Business Roadmaps",
  "plan.growth.cta": "Subscribe now",
  "plan.enterprise": "Enterprise",
  "plan.enterprise.desc": "For multinationals and RHQ operations.",
  "plan.enterprise.f1": "Unlimited entities",
  "plan.enterprise.f2": "Dedicated advisor",
  "plan.enterprise.f3": "API & data feeds",
  "plan.enterprise.f4": "SLA & audit logs",
  "plan.enterprise.f5": "Custom integrations",
  "plan.enterprise.cta": "Talk to sales",

  // Final CTA
  "cta.title": "Launch your Saudi business faster with AI.",
  "cta.sub":
    "Names, Arabic brands, domains, contracts, grants, and your setup roadmap — one AI-powered platform built for the Kingdom.",
  "cta.button": "Start your setup",

  // Footer
  "footer.about": "About",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.rights": "© 2026 LIMRA AI Intelligence. All rights reserved. · Riyadh, KSA",

  // Unlock block
  "unlock.eyebrow": "Premium",
  "unlock.title": "What You'll Unlock",
  "unlock.cta": "Subscribe to Unlock Full Business Intelligence",
  "unlock.f1.title": "Unlimited Name Generation",
  "unlock.f1.desc": "Generate and shortlist unlimited Saudi business names for every idea.",
  "unlock.f2.title": "Arabic Brand Creation",
  "unlock.f2.desc": "Instant Arabic transliteration and natural Arabic brand versions for every name.",
  "unlock.f3.title": "Saudi-focused Recommendations",
  "unlock.f3.desc": "Names and guidance optimized for Saudi regulations and market practice.",
  "unlock.f4.title": "Contract Analyzer",
  "unlock.f4.desc": "Plain-language contract summaries with risk flags — in English and Arabic.",
  "unlock.f5.title": "Premium Domain Intelligence",
  "unlock.f5.desc": "Live domain availability, brand-domain matching, and Saudi market recommendations.",
  "unlock.f6.title": "Full Grants Database",
  "unlock.f6.desc": "Complete grant recommendations, eligibility analysis, and action plans.",
  "unlock.f7.title": "AI Business Roadmaps",
  "unlock.f7.desc": "Personalized setup roadmaps with branding opportunities built in.",
  "premiumGate.title": "This is a premium feature",
  "premiumGate.sub": "Log in to unlock Name Studio, Domain Intelligence, Contract Analyzer, Grants, and your AI Roadmap Builder.",
  "premiumGate.cta": "Log in to continue",
  "premiumGate.checking": "Checking your access…",

  // Login
  "login.eyebrow": "Welcome back",
  "login.title": "Log in to LIMRA AI",
  "login.google": "Continue with Google",
  "login.or": "or continue with email",
  "login.email": "Email",
  "login.password": "Password",
  "login.passwordPlaceholder": "Your password",
  "login.submit": "Log in",
  "login.loading": "Logging in...",
  "login.noAccount": "Don't have an account?",
  "login.signup": "Sign up",

  // Signup
  "signup.eyebrow": "Create account",
  "signup.title": "Start your LIMRA AI setup",
  "signup.google": "Register with Google",
  "signup.or": "or sign up with email",
  "signup.name": "Full name",
  "signup.namePlaceholder": "Layla Al-Otaibi",
  "signup.email": "Email",
  "signup.password": "Password",
  "signup.passwordPlaceholder": "At least 6 characters",
  "signup.submit": "Create account",
  "signup.loading": "Creating account...",
  "signup.haveAccount": "Already have an account?",
  "signup.login": "Log in",
  "signup.done.title": "Check your email to confirm your account.",
  "signup.done.body": "Once confirmed, you can",
  "signup.done.login": "log in",

  // Account
  "account.eyebrow": "Your Profile",
  "account.welcome": "Welcome",
  "account.email": "Email",
  "account.fullName": "Full name",
  "account.save": "Save changes",
  "account.saving": "Saving...",
  "account.saved": "Saved ✓",

  // Dashboard
  "dash.eyebrow": "Command Dashboard",
  "dash.title": "Your business, one view",
  "dash.errorTitle": "Couldn't load your dashboard.",
  "dash.errorBody": "Check that DATABASE_URL and Supabase keys are configured correctly.",
  "dash.noEntity.title": "You haven't started a business yet",
  "dash.noEntity.body":
    "Tell LIMRA AI what you want to do, and we'll build a personalized setup roadmap for you — documents, licenses, and next steps, tailored to your business.",
  "dash.noEntity.cta": "Start your business",
  "dash.status": "Status",
  "dash.activeLicenses": "Active licenses",
  "dash.pendingFilings": "Pending filings",
  "dash.nextAction": "Recommended next action",
  "dash.goVault": "Go to Document Vault →",
  "dash.renewals": "Renewals due within 30 days",
  "dash.due": "due",
  "dash.roadmap": "Your setup roadmap",
  "dash.roadmap.sub":
    "A step-by-step Saudi setup path built for your business. Fees and timelines are indicative and flagged for verification; final approval always comes from the relevant government authority.",
  "dash.completeFirst": "Complete first:",
  "dash.goVaultShort": "Go to Vault →",
  "dash.portal": "portal →",
  "dash.explain": "✦ Explain this step",
  "dash.thinking": "Thinking…",
  "dash.markDone": "Mark done",
  "dash.done": "Done ✓",
  "dash.indicative": "indicative · verify",
  "dash.indicativeTitle": "Indicative estimate from public sources — confirm with the authority. Not a quote.",
  "dash.yourRoadmap": "Your roadmap",

  // Vault
  "vault.eyebrow": "Document Vault",
  "vault.title": "Your business, one secure folder",
  "vault.sub":
    "Every document your business needs in Saudi Arabia, in one place. Download the correct government form, fill it out, and store the signed copy here — everything stays with you until your business is fully established.",
  "vault.showingFor": "Showing requirements for:",
  "vault.noBusiness": "No business on file yet — showing the full checklist.",
  "vault.setupBusiness": "Set up your business",
  "vault.seeSpecific": "to see requirements specific to you.",
  "vault.progress": "Setup progress",
  "vault.notStarted": "not started",
  "vault.downloadForm": "↓ Download blank form",
  "vault.formFrom": "Get the form from",
  "vault.view": "View",
  "vault.remove": "Remove",
  "vault.upload": "Upload",
  "vault.uploading": "Uploading...",
  "vault.downloadError": "Couldn't generate download link.",

  // Contract Analyzer
  "contract.eyebrow": "Contract Analyzer",
  "contract.title": "Understand any contract in plain language",
  "contract.sub":
    "Upload a lease, employment contract, supplier agreement, or partnership deal. LIMRA AI explains what it says in simple words, flags risky clauses, and tells you what to ask before you sign — in English or Arabic.",
  "contract.signIn.title": "Log in to analyze contracts",
  "contract.signIn.sub":
    "The Contract Analyzer is available to every signed-in business owner. Log in to upload your first document.",
  "contract.signIn.cta": "Log in to continue",
  "contract.dropzone": "Drop your contract here, or click to choose a file",
  "contract.formats": "PDF, Word (.docx), or plain text · up to 10 MB",
  "contract.choose": "Choose file",
  "contract.analyzing": "Analyzing your contract…",
  "contract.analyze": "Analyze contract",
  "contract.fileName": "File",
  "contract.remove": "Remove",
  "contract.error.empty": "We couldn't read any text from that file. If it's a scanned PDF, try uploading a text-based copy.",
  "contract.error.tooLarge": "That file is too large — please upload a file under 10 MB.",
  "contract.error.type": "Unsupported file type. Please upload a PDF, Word (.docx), or text file.",
  "contract.error.failed": "Analysis failed. Please try again.",
  "contract.result.summary": "Plain-language summary",
  "contract.result.summaryIntro": "What this contract is about",
  "contract.result.keyTerms": "Key terms at a glance",
  "contract.result.risks": "Risk flags",
  "contract.result.risksNone": "No obvious red flags found. Still read it fully before signing.",
  "contract.result.questions": "Questions to ask before signing",
  "contract.result.severity.high": "High",
  "contract.result.severity.medium": "Medium",
  "contract.result.severity.low": "Low",
  "contract.result.newAnalysis": "Analyze another document",
  "contract.result.history": "Recent analyses",
  "contract.result.viewAnalysis": "View",
  "contract.result.disclaimer":
    "This analysis is an AI-generated aid, not legal advice. Always confirm important contracts with a licensed Saudi lawyer.",
  "contract.result.heroRisk": "risk flags",
  "contract.risk.emptyLiability": "Unlimited liability",
  "contract.risk.emptyLiability.desc": "You could be personally responsible for all damages without a cap. Ask to limit your liability to a fixed amount.",
  "contract.risk.autoRenew": "Automatic renewal",
  "contract.risk.autoRenew.desc": "The contract renews itself unless you cancel by a deadline. Mark that date in your calendar now.",
  "contract.risk.termination": "Termination without cause",
  "contract.risk.termination.desc": "The other side can end the contract at any time, without giving a reason. Ask for notice period and compensation.",
  "contract.risk.penalty": "Penalties & late fees",
  "contract.risk.penalty.desc": "Penalty amounts for delays or breach are included. Check they are reasonable and mutual.",
  "contract.risk.exclusivity": "Exclusivity",
  "contract.risk.exclusivity.desc": "You may be blocked from working with competitors or other suppliers. Ask to narrow the scope or time period.",
  "contract.risk.nonCompete": "Non-compete",
  "contract.risk.nonCompete.desc": "You may be restricted from similar work after the contract ends. Confirm the duration and geographic scope are fair.",
  "contract.risk.ip": "IP assignment",
  "contract.risk.ip.desc": "Intellectual property you create may belong to the other party. Negotiate ownership of your pre-existing and independent work.",
  "contract.risk.payment": "Payment terms",
  "contract.risk.payment.desc": "Long or unclear payment terms found. Confirm due dates, currency, and late-payment protection.",
  "contract.risk.governingLaw": "Foreign governing law or arbitration",
  "contract.risk.governingLaw.desc": "Disputes may be settled under another country's law or far-away arbitration. Confirm this is acceptable for a Saudi business.",
  "contract.risk.unilateral": "One-sided amendment rights",
  "contract.risk.unilateral.desc": "One party can change the terms alone. Ask that changes require mutual written agreement.",
  "contract.risk.indefinite": "No end date",
  "contract.risk.indefinite.desc": "The contract has no fixed end or renewal limit. Agree on a maximum duration or exit clause.",
  "contract.risk.indemnity": "Broad indemnity",
  "contract.risk.indemnity.desc": "You may cover losses even when you are not at fault. Ask to limit indemnity to your own negligence.",

  // AppShell
  "shell.workspace": "Workspace",
  "shell.promo.title": "KSA Business Launch",
  "shell.promo.body": "Names, domains, contracts, grants, and your roadmap — one AI-powered platform.",
};

const ar: Dict = {
  // Nav
  "nav.namestudio": "استوديو الأسماء",
  "nav.domains": "النطاقات",
  "nav.roadmap": "خارطة الطريق",
  "nav.grants": "المنح",
  "nav.insights": "رؤى السوق",
  "nav.contract": "محلل العقود",
  "nav.dashboard": "لوحة التحكم",
  "nav.pricing": "الأسعار",
  "nav.admin": "الإدارة",
  "nav.login": "تسجيل الدخول",
  "nav.signup": "ابدأ الآن",
  "nav.signout": "تسجيل الخروج",
  "nav.account": "عرض الملف الشخصي",
  "nav.settings": "الإعدادات",
  "nav.vault": "خزنة المستندات",
  "nav.adminPanel": "لوحة الإدارة",
  "nav.yourAccount": "حسابك",
  "nav.lang": "اللغة / Language",
  "nav.menu": "إظهار القائمة",

  // Hero
  "hero.eyebrow": "ندعم رؤية 2030",
  "hero.title1": "أطلق مشروعك السعودي",
  "hero.titleAccent": "بسرعة أكبر مع الذكاء الاصطناعي",
  "hero.sub":
    "من اسم المشروع إلى الحساب البنكي — يولّد لك ليمرا أسماء علامات جاهزة، ويفحص قواعد التسمية السعودية، وينتج نسخًا عربية لعلامتك، ويطابق نطاقاتك، ويجد المنح، ويبني خارطة تأسيس مخصصة لك.",
  "hero.cta1": "ابدأ التأسيس",
  "hero.cta2": "استكشف استوديو الأسماء",
  "hero.beta": "نسخة تجريبية خاصة · مبنٍّ للمؤسسين الداخلين إلى السوق السعودي",

  // Benefits
  "benefits.eyebrow": "كل ما تحتاجه للانطلاق",
  "benefits.title": "منصة ذكاء اصطناعي واحدة لرحلة التأسيس السعودية كاملة",
  "benefit.1": "خارطة تأسيس بالذكاء الاصطناعي",
  "benefit.2": "استوديو الأسماء التجارية السعودية",
  "benefit.3": "توليد العلامات بالعربية",
  "benefit.4": "محلل العقود",
  "benefit.5": "ذكاء النطاقات",
  "benefit.6": "اكتشاف المنح والحوافز",
  "benefit.7": "مساعد تخطيط الأعمال",
  "benefit.8": "رؤى سوق سعودية محلية",
  "benefit.9": "إرشادات العلامة والنطاق والامتثال",

  // Stats
  "stat.docs": "أنواع المستندات المغطاة",
  "stat.authorities": "جهات سعودية مشمولة",
  "stat.ai": "بالذكاء الاصطناعي",
  "stat.aiLabel": "خارطة التأسيس",

  // Vision 2030
  "vision.eyebrow": "مبني لرؤية 2030",
  "vision.title": "ندعم تحول المملكة العربية السعودية من اليوم الأول",
  "vision.body":
    "بُنيت ليمرا بما ينسجم مع أهداف رؤية 2030 — لتمكين المؤسسين المحليين والأجانب من بناء أعمال منظمة ومتوافقة في كل أنحاء المملكة. من المنشآت الصغيرة والمتوسطة في الرياض إلى الشركات الناشئة في نيوم، نرسم طريقك عبر كل جهة سعودية.",
  "vision.cta1": "استكشف رؤى القطاعات →",
  "vision.cta2": "اعثر على برامج التمويل →",

  // Modules
  "modules.eyebrow": "وحدات الذكاء",
  "modules.title": "سبعة محركات تحوّل البيروقراطية السعودية إلى طريق واضح",
  "modules.sub":
    "استوديو الأسماء وذكاء النطاقات وباني خارطة الطريق ومحلل العقود والمنح — ميزات مميزة، سجّل الدخول واشترك لفتح الحزمة كاملة.",
  "modules.live": "متاح",
  "modules.roadmap": "قادم",
  "modules.explore": "استكشف →",
  "mod.namestudio": "استوديو الأسماء",
  "mod.namestudio.desc": "ولّد أسماء أعمال سعودية جاهزة للعلامة، وافحص قواعد التسمية، واحصل على نسخ عربية.",
  "mod.domains": "ذكاء النطاقات",
  "mod.domains.desc": "توفر النطاقات ومطابقة العلامة بالنطاق وتوصيات السوق السعودي.",
  "mod.roadmap": "باني خارطة الطريق",
  "mod.roadmap.desc": "خطط تأسيس سعودية مخصصة مع أسماء أعمال مقترحة مدمجة.",
  "mod.grants": "المنح والحوافز",
  "mod.grants.desc": "منح حكومية ودعم رواتب وبرامج تمويل للمنشآت الصغيرة والمتوسطة.",
  "mod.contract": "محلل العقود",
  "mod.contract.desc": "ارفع أي عقد تجاري واحصل على ملخص بلغة بسيطة وتنبيهات مخاطر وأسئلة قبل التوقيع — بالعربية أو الإنجليزية.",
  "mod.vault": "خزنة المستندات",
  "mod.vault.desc": "احفظ كل مستندات عملك في خزنة خاصة مشفّرة — مع النموذج الحكومي الصحيح والجهة المختصة لكل متطلب.",
  "mod.insights": "رؤى السوق",
  "mod.insights.desc": "تحليل قطاعي مبني على البيانات — معدلات النمو وأحجام السوق والفرص والمناطق الواعدة.",

  // Name Studio teaser
  "teaser.names.eyebrow": "استوديو الأسماء · ميزة مميزة",
  "teaser.names.title": "ذكاء العلامات التجارية للسوق السعودي",
  "teaser.names.sub":
    "ولّد أسماء الأعمال، وافحص ملاءمتها لقواعد التسمية السعودية، واستكشف البدائل، واحصل على النقل الصوتي العربي ونسخة عربية طبيعية لكل خيار — بما يناسب الأنظمة وممارسات السوق السعودي.",
  "teaser.names.f1": "توليد أسماء بلا حدود",
  "teaser.names.f2": "فحص ملاءمة وفق قواعد التسمية السعودية",
  "teaser.names.f3": "النقل الصوتي العربي ونسخ العلامة",
  "teaser.names.f4": "مجموعات متميزة صديقة للسيو",
  "teaser.names.cta": "افتح استوديو الأسماء",
  "teaser.names.preview": "معاينة — تحويل عربي للعلامة",
  "teaser.transliteration": "· نقل صوتي",
  "teaser.brandVersion": "· نسخة العلامة",

  // Domain teaser
  "teaser.domains.preview": "معاينة — نطاقات السوق السعودي",
  "teaser.domains.eyebrow": "ذكاء النطاقات · ميزة مميزة",
  "teaser.domains.title": "مطابقة النطاقات لعلامتك التجارية في السوق السعودي",
  "teaser.domains.sub":
    "افحص التوفر الفعلي للنطاقات، وطابقها مع علامتك، واكتشف البدائل، واحصل على توصيات متميزة مبنية للسوق السعودي.",
  "teaser.domains.f1": "توفر النطاقات في أكثر من 20 امتدادًا",
  "teaser.domains.f2": "مطابقة العلامة بالنطاق والبدائل",
  "teaser.domains.f3": "اقتراحات نطاقات متميزة",
  "teaser.domains.f4": "توصيات .sa و .com.sa للسوق السعودي",
  "teaser.domains.cta": "افتح ذكاء النطاقات",

  // Zones
  "zones.eyebrow": "ذكاء المناطق",
  "zones.title": "قارن تكاليف التأسيس في المناطق الاقتصادية السعودية",
  "zones.sub":
    "أرقام توضيحية للتوجيه فقط — تُدمج بيانات التكلفة والمعالجة الموثقة من كل جهة باستمرار.",
  "zones.col.zone": "المنطقة",
  "zones.col.cost": "تكلفة السنة الأولى",
  "zones.col.bank": "موافقة بنكية",
  "zones.col.time": "مدة المعالجة",

  // Calculator
  "calc.eyebrow": "حاسبة التأسيس",
  "calc.title": "قدّر تكلفة سنتك الأولى قبل أن تتحدث مع أي أحد",

  // Marketplace
  "market.eyebrow": "سوق الخبراء",
  "market.title": "مختصون عند الطلب",
  "market.sub": "ملفات شركاء توضيحية — سوقنا الموثّق وتدفق الحجز يُطلقان قريبًا.",
  "market.book": "احجز",

  // Dashboard teaser
  "dashTeaser.eyebrow": "لوحة القيادة",
  "dashTeaser.title": "عملياتك السعودية كلها في سطح واحد أنيق",
  "dashTeaser.sub":
    "عرض حيّ لتأسيسك — التراخيص والمستندات والأسماء المقترحة وخارطة طريقك خطوة بخطوة — مدعوم بقاعدة بيانات حقيقية تتحدث أثناء عملك.",
  "dashTeaser.cta": "افتح لوحة التحكم →",

  // Journey
  "journey.eyebrow": "رحلة التأسيس",
  "journey.title": "من الفكرة إلى الكيان العامل في أربع مراحل موجهة",
  "journey.1.title": "صف مشروعك",
  "journey.1.desc": "أجب عن استمارة قصيرة ويربط ليمرا نشاطك بالتراخيص والمستندات التي تحتاجها في السعودية بالضبط.",
  "journey.2.title": "احصل على خارطتك وأسمائك",
  "journey.2.desc": "شاهد قائمة مراحل مخصصة خطوة بخطوة مع النموذج الحكومي الصحيح والجهة المختصة — مع أسماء تجارية مقترحة.",
  "journey.3.title": "جهّز واحفظ",
  "journey.3.desc": "نزّل كل نموذج رسمي وأكمله واحفظ كل مستند موقّع في خزنة آمنة واحدة.",
  "journey.4.title": "ابقَ منظّمًا مع نموك",
  "journey.4.desc": "تتبّع تقدم تأسيسك واحفظ التراخيص والتجديدات والمستندات في مكان واحد — مع مزيد من الأتمتة قريبًا.",

  // Pricing
  "pricing.eyebrow": "الأسعار",
  "pricing.title": "خطط تتوسع من أول ترخيص إلى المقر الإقليمي الكامل",
  "pricing.sub": "ليمرا في نسخة تجريبية خاصة — الأسعار أدناه إرشادية، والوصول التجريبي مجاني أثناء البناء.",
  "pricing.popular": "الأكثر شيوعًا",
  "pricing.month": "شهريًا",
  "plan.founder": "المؤسس",
  "plan.founder.desc": "للمؤسسين الأفراد الذين يستكشفون دخول السوق.",
  "plan.founder.f1": "قائمة التراخيص",
  "plan.founder.f2": "خزنة المستندات",
  "plan.founder.f3": "خارطة تأسيس مخصصة",
  "plan.founder.f4": "معاينات استوديو الأسماء",
  "plan.founder.cta": "ابدأ مجانًا",
  "plan.growth": "النمو",
  "plan.growth.desc": "للفرق التي تطلق علامتها في السوق السعودي فعليًا.",
  "plan.growth.f1": "كل ما في خطة المؤسس",
  "plan.growth.f2": "توليد أسماء بلا حدود",
  "plan.growth.f3": "إنشاء علامات عربية",
  "plan.growth.f4": "محلل العقود",
  "plan.growth.f5": "ذكاء نطاقات متميز",
  "plan.growth.f6": "قاعدة المنح الكاملة",
  "plan.growth.f7": "خطط أعمال بالذكاء الاصطناعي",
  "plan.growth.cta": "اشترك الآن",
  "plan.enterprise": "المؤسسات",
  "plan.enterprise.desc": "للشركات متعددة الجنسيات والمقرات الإقليمية.",
  "plan.enterprise.f1": "كيانات بلا حدود",
  "plan.enterprise.f2": "مستشار مخصص",
  "plan.enterprise.f3": "واجهات برمجية وتغذية بيانات",
  "plan.enterprise.f4": "اتفاقية مستوى خدمة وسجلات تدقيق",
  "plan.enterprise.f5": "تكاملات مخصصة",
  "plan.enterprise.cta": "تحدث مع المبيعات",

  // Final CTA
  "cta.title": "أطلق مشروعك السعودي أسرع مع الذكاء الاصطناعي.",
  "cta.sub": "الأسماء والعلامات العربية والنطاقات والعقود والمنح وخارطة تأسيسك — منصة واحدة بالذكاء الاصطناعي مبنية للمملكة.",
  "cta.button": "ابدأ التأسيس",

  // Footer
  "footer.about": "من نحن",
  "footer.privacy": "سياسة الخصوصية",
  "footer.terms": "شروط الخدمة",
  "footer.rights": "© 2026 ليمرا للذكاء الاصطناعي. جميع الحقوق محفوظة. · الرياض، السعودية",

  // Unlock block
  "unlock.eyebrow": "ميزة مميزة",
  "unlock.title": "ما الذي ستفتحه",
  "unlock.cta": "اشترك لفتح كامل الذكاء التجاري",
  "unlock.f1.title": "توليد أسماء بلا حدود",
  "unlock.f1.desc": "ولّد وقصّر قائمة أسماء أعمال سعودية لكل فكرة بلا حدود.",
  "unlock.f2.title": "إنشاء علامات عربية",
  "unlock.f2.desc": "نقل صوتي عربي فوري ونسخ عربية طبيعية لكل اسم.",
  "unlock.f3.title": "توصيات سعودية",
  "unlock.f3.desc": "أسماء وإرشادات محسّنة للأنظمة السعودية وممارسات السوق.",
  "unlock.f4.title": "محلل العقود",
  "unlock.f4.desc": "ملخصات عقود بلغة بسيطة مع تنبيهات مخاطر — بالعربية والإنجليزية.",
  "unlock.f5.title": "ذكاء نطاقات متميز",
  "unlock.f5.desc": "توفر مباشر للنطاقات ومطابقة العلامة وتوصيات السوق السعودي.",
  "unlock.f6.title": "قاعدة المنح الكاملة",
  "unlock.f6.desc": "توصيات منح كاملة مع تحليل الأهلية وخطط العمل.",
  "unlock.f7.title": "خطط أعمال بالذكاء الاصطناعي",
  "unlock.f7.desc": "خطط تأسيس مخصصة مع فرص بناء العلامة مدمجة.",
  "premiumGate.title": "هذه ميزة مميزة",
  "premiumGate.sub": "سجّل الدخول لفتح استوديو الأسماء وذكاء النطاقات ومحلل العقود والمنح وباني خارطة الطريق.",
  "premiumGate.cta": "سجّل الدخول للمتابعة",
  "premiumGate.checking": "جارٍ التحقق من صلاحيتك…",

  // Login
  "login.eyebrow": "مرحبًا بعودتك",
  "login.title": "سجّل الدخول إلى ليمرا",
  "login.google": "المتابعة عبر Google",
  "login.or": "أو تابع عبر البريد الإلكتروني",
  "login.email": "البريد الإلكتروني",
  "login.password": "كلمة المرور",
  "login.passwordPlaceholder": "كلمة مرورك",
  "login.submit": "تسجيل الدخول",
  "login.loading": "جارٍ تسجيل الدخول...",
  "login.noAccount": "ليس لديك حساب؟",
  "login.signup": "أنشئ حسابًا",

  // Signup
  "signup.eyebrow": "إنشاء حساب",
  "signup.title": "ابدأ تأسيسك مع ليمرا",
  "signup.google": "التسجيل عبر Google",
  "signup.or": "أو سجّل عبر البريد الإلكتروني",
  "signup.name": "الاسم الكامل",
  "signup.namePlaceholder": "ليلى العتيبي",
  "signup.email": "البريد الإلكتروني",
  "signup.password": "كلمة المرور",
  "signup.passwordPlaceholder": "6 أحرف على الأقل",
  "signup.submit": "إنشاء الحساب",
  "signup.loading": "جارٍ إنشاء الحساب...",
  "signup.haveAccount": "لديك حساب بالفعل؟",
  "signup.login": "سجّل الدخول",
  "signup.done.title": "تحقق من بريدك الإلكتروني لتأكيد حسابك.",
  "signup.done.body": "بعد التأكيد يمكنك",
  "signup.done.login": "تسجيل الدخول",

  // Account
  "account.eyebrow": "ملفك الشخصي",
  "account.welcome": "مرحبًا",
  "account.email": "البريد الإلكتروني",
  "account.fullName": "الاسم الكامل",
  "account.save": "حفظ التغييرات",
  "account.saving": "جارٍ الحفظ...",
  "account.saved": "تم الحفظ ✓",

  // Dashboard
  "dash.eyebrow": "لوحة القيادة",
  "dash.title": "عملك في عرض واحد",
  "dash.errorTitle": "تعذّر تحميل لوحة التحكم.",
  "dash.errorBody": "تأكد من ضبط DATABASE_URL ومفاتيح Supabase بشكل صحيح.",
  "dash.noEntity.title": "لم تبدأ مشروعًا بعد",
  "dash.noEntity.body": "أخبر ليمرا بما تريد أن تفعل، وسنبني لك خارطة تأسيس مخصصة — مستندات وتراخيص وخطوات تالية تناسب عملك.",
  "dash.noEntity.cta": "ابدأ مشروعك",
  "dash.status": "الحالة",
  "dash.activeLicenses": "تراخيص نشطة",
  "dash.pendingFilings": "معاملات معلّقة",
  "dash.nextAction": "الخطوة التالية المقترحة",
  "dash.goVault": "اذهب إلى خزنة المستندات →",
  "dash.renewals": "تجديدات تستحق خلال 30 يومًا",
  "dash.due": "تستحق في",
  "dash.roadmap": "خارطة تأسيسك",
  "dash.roadmap.sub": "مسار تأسيس سعودي خطوة بخطوة مبني لعملك. الرسوم والمدد إرشادية وتحتاج تحققًا؛ والموافقة النهائية دائمًا من الجهة الحكومية المختصة.",
  "dash.completeFirst": "أكمل أولًا:",
  "dash.goVaultShort": "اذهب إلى الخزنة →",
  "dash.portal": "بوابة الجهة →",
  "dash.explain": "✦ اشرح هذه الخطوة",
  "dash.thinking": "جارٍ التفكير…",
  "dash.markDone": "تم الإنجاز",
  "dash.done": "منجزة ✓",
  "dash.indicative": "إرشادي · يحتاج تحقق",
  "dash.indicativeTitle": "تقدير إرشادي من مصادر عامة — أكّده مع الجهة المختصة. ليس عرض سعر.",
  "dash.yourRoadmap": "خارطة الطريق",

  // Vault
  "vault.eyebrow": "خزنة المستندات",
  "vault.title": "عملك في مجلد آمن واحد",
  "vault.sub": "كل مستند يحتاجه عملك في السعودية في مكان واحد. نزّل النموذج الحكومي الصحيح وأكمله واحفظ النسخة الموقعة هنا — كل شيء يبقى معك حتى يكتمل تأسيس عملك.",
  "vault.showingFor": "عرض المتطلبات الخاصة بـ:",
  "vault.noBusiness": "لا يوجد مشروع مسجل بعد — نعرض القائمة كاملة.",
  "vault.setupBusiness": "أنشئ مشروعك",
  "vault.seeSpecific": "لعرض المتطلبات الخاصة بك.",
  "vault.progress": "تقدم التأسيس",
  "vault.notStarted": "لم يبدأ",
  "vault.downloadForm": "↓ نزّل النموذج الفارغ",
  "vault.formFrom": "احصل على النموذج من",
  "vault.view": "عرض",
  "vault.remove": "إزالة",
  "vault.upload": "رفع",
  "vault.uploading": "جارٍ الرفع...",
  "vault.downloadError": "تعذّر إنشاء رابط التنزيل.",

  // Contract Analyzer
  "contract.eyebrow": "محلل العقود",
  "contract.title": "افهم أي عقد بلغة بسيطة",
  "contract.sub": "ارفع عقد إيجار أو عمل أو توريد أو شراكة. يشرح لك ليمرا ما يقوله العقد بكلمات بسيطة، وينبّه للبنود الخطرة، ويخبرك بما تسأل عنه قبل التوقيع — بالعربية أو الإنجليزية.",
  "contract.signIn.title": "سجّل الدخول لتحليل العقود",
  "contract.signIn.sub": "محلل العقود متاح لكل صاحب عمل مسجّل. سجّل الدخول لرفع أول مستند.",
  "contract.signIn.cta": "سجّل الدخول للمتابعة",
  "contract.dropzone": "أفلت عقدك هنا، أو اضغط لاختيار ملف",
  "contract.formats": "PDF أو Word (.docx) أو نص عادي · حتى 10 ميجابايت",
  "contract.choose": "اختر ملفًا",
  "contract.analyzing": "جارٍ تحليل عقدك…",
  "contract.analyze": "حلّل العقد",
  "contract.fileName": "الملف",
  "contract.remove": "إزالة",
  "contract.error.empty": "لم نتمكن من قراءة أي نص من هذا الملف. إن كان PDF ممسوحًا ضوئيًا، جرّب رفع نسخة نصية.",
  "contract.error.tooLarge": "الملف كبير جدًا — يرجى رفع ملف أقل من 10 ميجابايت.",
  "contract.error.type": "نوع ملف غير مدعوم. يرجى رفع ملف PDF أو Word (.docx) أو نصي.",
  "contract.error.failed": "فشل التحليل. حاول مرة أخرى.",
  "contract.result.summary": "الملخص بلغة بسيطة",
  "contract.result.summaryIntro": "عمّ يتحدث هذا العقد",
  "contract.result.keyTerms": "الشروط الأساسية بنظرة",
  "contract.result.risks": "تنبيهات المخاطر",
  "contract.result.risksNone": "لم نجد إشارات خطر واضحة. ومع ذلك اقرأ العقد كاملًا قبل التوقيع.",
  "contract.result.questions": "أسئلة تطرحها قبل التوقيع",
  "contract.result.severity.high": "مرتفعة",
  "contract.result.severity.medium": "متوسطة",
  "contract.result.severity.low": "منخفضة",
  "contract.result.newAnalysis": "حلّل مستندًا آخر",
  "contract.result.history": "تحليلات حديثة",
  "contract.result.viewAnalysis": "عرض",
  "contract.result.disclaimer": "هذا التحليل أداة مساعدة بالذكاء الاصطناعي وليست استشارة قانونية. أكّد دائمًا العقود المهمة مع محامٍ سعودي مرخّص.",
  "contract.result.heroRisk": "تنبيهات مخاطر",
  "contract.risk.emptyLiability": "مسؤولية غير محدودة",
  "contract.risk.emptyLiability.desc": "قد تكون مسؤولًا شخصيًا عن كل الأضرار دون سقف. اطلب تحديد مسؤوليتك بمبلغ ثابت.",
  "contract.risk.autoRenew": "تجديد تلقائي",
  "contract.risk.autoRenew.desc": "يتجدد العقد تلقائيًا ما لم تلغِ قبل موعد محدد. سجّل هذا التاريخ في تقويمك الآن.",
  "contract.risk.termination": "إنهاء دون سبب",
  "contract.risk.termination.desc": "يمكن للطرف الآخر إنهاء العقد في أي وقت دون إبداء السبب. اطلب فترة إشعار وتعويضًا.",
  "contract.risk.penalty": "غرامات ورسوم تأخير",
  "contract.risk.penalty.desc": "توجد مبالغ غرامات للتأخير أو الإخلال. تأكد أنها معقولة ومتبادلة.",
  "contract.risk.exclusivity": "الحصرية",
  "contract.risk.exclusivity.desc": "قد يُمنعك العقد من التعامل مع المنافسين أو موردين آخرين. اطلب تضييق النطاق أو المدة.",
  "contract.risk.nonCompete": "عدم المنافسة",
  "contract.risk.nonCompete.desc": "قد تُقيّد من ممارسة عمل مشابه بعد انتهاء العقد. تأكد أن المدة والنطاق الجغرافي عادلان.",
  "contract.risk.ip": "تنازل عن الملكية الفكرية",
  "contract.risk.ip.desc": "قد تصبح الملكية الفكرية التي تنشئها ملكًا للطرف الآخر. تفاوض على ملكية أعمالك السابقة والمستقلة.",
  "contract.risk.payment": "شروط الدفع",
  "contract.risk.payment.desc": "شروط دفع طويلة أو غير واضحة. أكّد تواريخ الاستحقاق والعملة وحماية التأخر في السداد.",
  "contract.risk.governingLaw": "قانون أجنبي أو تحكيم خارجي",
  "contract.risk.governingLaw.desc": "قد تُحل النزاعات وفق قانون دولة أخرى أو تحكيم بعيد. تأكد أن هذا مقبول لعمل سعودي.",
  "contract.risk.unilateral": "حق تعديل من طرف واحد",
  "contract.risk.unilateral.desc": "يمكن لطرف واحد تغيير الشروط بمفرده. اطلب أن تتطلب التعديلات موافقة كتابية متبادلة.",
  "contract.risk.indefinite": "بلا مدة محددة",
  "contract.risk.indefinite.desc": "لا يوجد للعقد نهاية ثابتة أو حد للتجديد. اتفق على مدى أقصى أو شرط خروج.",
  "contract.risk.indemnity": "تعويض واسع",
  "contract.risk.indemnity.desc": "قد تتحمل خسائر حتى عندما لا تقع لك غلّة. اطلب حصر التعويض بتقصيرك أنت.",

  // AppShell
  "shell.workspace": "مساحة العمل",
  "shell.promo.title": "إطلاق أعمالك في السعودية",
  "shell.promo.body": "الأسماء والنطاقات والعقود والمنح وخارطة طريقك — منصة واحدة بالذكاء الاصطناعي.",
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
