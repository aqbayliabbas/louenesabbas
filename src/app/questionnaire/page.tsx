'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send, Sparkles, Monitor, Share2, Package, Globe, Smartphone, Newspaper, LucideIcon, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

type Lang = 'fr' | 'ar';
type QuestionType = 'text' | 'textarea' | 'multiselect_pills' | 'personality_sliders' | 'touchpoints_grid';

interface TouchpointOption {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface Question {
    id: string;
    question: string;
    description: string;
    placeholder?: string;
    type: QuestionType;
    options?: string[] | TouchpointOption[];
    traits?: { left: string; right: string; id: string }[];
    required?: boolean;
}

// ── French data ────────────────────────────────────────────────────────────────
const personalityTraitsFr = [
    { left: 'Traditionnel', right: 'Moderne', id: 'personality_trad_mod' },
    { left: 'Modeste', right: 'Audacieux', id: 'personality_mod_aud' },
    { left: 'Sérieux', right: 'Amusant', id: 'personality_ser_fun' },
    { left: 'Accessible', right: 'Exclusif', id: 'personality_acc_excl' },
    { left: 'Minimaliste', right: 'Complexe', id: 'personality_min_comp' },
];
const positioningTraitsFr = [
    { left: 'Prestigieux / Luxe', right: 'Abordable / Grand Public', id: 'pos_luxury' },
    { left: 'Niche / Spécialisé', right: 'Large / Généraliste', id: 'pos_niche' },
    { left: 'Émotionnel / Humain', right: 'Fonctionnel / Rationnel', id: 'pos_emotion' },
];
const valueOptionsFr = [
    'Innovation', 'Durabilité', 'Confiance', 'Excellence', 'Créativité',
    'Transparence', 'Audace', 'Empathie', 'Simplicité', 'Qualité',
    'Héritage', 'Rapidité', 'Élégance', 'Intégrité'
];
const deliverableOptionsFr = [
    'Logo & Variations', 'Charte Graphique', 'Cartes de Visite', 'Réseaux Sociaux',
    'Direction Artistique', 'Stratégie Site Web', 'Packaging design', 'Papeterie',
    'Signature Email', 'Typographies Custom', 'Iconographie'
];
const touchpointOptionsFr: TouchpointOption[] = [
    { id: 'web', label: 'Site Web', icon: Globe },
    { id: 'social', label: 'Réseaux Sociaux', icon: Share2 },
    { id: 'app', label: 'Application Mobile', icon: Smartphone },
    { id: 'packaging', label: 'Packaging', icon: Package },
    { id: 'print', label: 'Supports Imprimés', icon: Newspaper },
    { id: 'retail', label: 'Espace de vente', icon: Monitor },
];

// ── Arabic data ─────────────────────────────────────────────────────────────────
const personalityTraitsAr = [
    { left: 'تقليدي', right: 'عصري', id: 'personality_trad_mod' },
    { left: 'متواضع', right: 'جريء', id: 'personality_mod_aud' },
    { left: 'جاد', right: 'مرح', id: 'personality_ser_fun' },
    { left: 'في المتناول', right: 'حصري', id: 'personality_acc_excl' },
    { left: 'بسيط', right: 'معقد', id: 'personality_min_comp' },
];
const positioningTraitsAr = [
    { left: 'فاخر / راقٍ', right: 'بأسعار معقولة / للجميع', id: 'pos_luxury' },
    { left: 'متخصص / ضيق', right: 'واسع / عام', id: 'pos_niche' },
    { left: 'عاطفي / إنساني', right: 'وظيفي / عقلاني', id: 'pos_emotion' },
];
const valueOptionsAr = [
    'الابتكار', 'الاستدامة', 'الثقة', 'التميز', 'الإبداع',
    'الشفافية', 'الجرأة', 'التعاطف', 'البساطة', 'الجودة',
    'الموروث', 'السرعة', 'الأناقة', 'النزاهة'
];
const deliverableOptionsAr = [
    'الشعار والاختلافات', 'دليل الهوية البصرية', 'بطاقات الأعمال', 'منصات التواصل',
    'الإدارة الفنية', 'استراتيجية الموقع', 'تصميم التغليف', 'القرطاسية',
    'توقيع البريد', 'خطوط مخصصة', 'الأيقونات'
];
const touchpointOptionsAr: TouchpointOption[] = [
    { id: 'web', label: 'الموقع الإلكتروني', icon: Globe },
    { id: 'social', label: 'منصات التواصل', icon: Share2 },
    { id: 'app', label: 'تطبيق الهاتف', icon: Smartphone },
    { id: 'packaging', label: 'التغليف', icon: Package },
    { id: 'print', label: 'المواد المطبوعة', icon: Newspaper },
    { id: 'retail', label: 'نقطة البيع', icon: Monitor },
];

const questionsFr: Question[] = [
    { id: 'company', question: 'Quel est le nom de votre entreprise, et que proposez-vous ?', description: 'Veuillez fournir une brève description de votre activité principale.', placeholder: 'Ex: MaSuperMarque - Agence de design éthique...', type: 'text' },
    { id: 'mission', question: 'Quelle est la mission et la vision de votre marque ?', description: "Quel est l'objectif de votre marque, et où la voyez-vous dans 5 à 10 ans ?", placeholder: 'Ma mission est de...', type: 'textarea' },
    { id: 'audience', question: 'Qui est votre public cible ?', description: 'Soyez aussi précis que possible (âge, intérêts, comportements).', placeholder: 'Ex: Entrepreneurs de 25-40 ans cherchant...', type: 'textarea' },
    { id: 'values', question: 'Quelles sont les valeurs qui définissent votre marque ?', description: 'Sélectionnez les valeurs qui vous correspondent le mieux.', type: 'multiselect_pills', options: valueOptionsFr },
    { id: 'personality_sliders', question: 'Définissons la personnalité de votre marque.', description: 'Positionnez le curseur là où votre marque se situe sur chaque spectre.', type: 'personality_sliders', traits: personalityTraitsFr },
    { id: 'positioning', question: 'Où vous situez-vous sur le marché ?', description: 'Définissez votre positionnement stratégique par rapport à vos concurrents.', type: 'personality_sliders', traits: positioningTraitsFr },
    { id: 'competitors', question: 'Qui sont vos concurrents, et comment vous en distinguez-vous ?', description: "Qu'est-ce qui vous rend unique sur votre marché ?", placeholder: 'Nos concurrents sont... nous nous distinguons par...', type: 'textarea' },
    { id: 'emotion', question: 'Quelle émotion voulez-vous susciter ?', description: 'Confiance, enthousiasme, confort, inspiration, assurance...', placeholder: "Je veux qu'ils se sentent...", type: 'text' },
    { id: 'deliverables', question: 'Quels sont les livrables attendus pour ce projet ?', description: 'Sélectionnez les éléments dont vous avez besoin.', type: 'multiselect_pills', options: deliverableOptionsFr },
    { id: 'touchpoints', question: 'Où votre marque sera-t-elle visible ?', description: 'Sélectionnez les principaux points de contact.', type: 'touchpoints_grid', options: touchpointOptionsFr },
    { id: 'references', question: 'Des références visuelles qui vous inspirent ?', description: 'Marques, styles artistiques ou préférences esthétiques (Optionnel).', placeholder: "J'aime l'esthétique Apple, les couleurs terreuses...", type: 'textarea', required: false },
    { id: 'timeline', question: 'Quel est votre calendrier idéal ?', description: 'Quand avez-vous besoin que les livrables soient finalisés ? (Optionnel)', placeholder: "D'ici fin mars 2024...", type: 'text', required: false },
    { id: 'budget', question: 'Quelle est votre fourchette budgétaire ?', description: 'Cela nous aide à aligner les attentes et les livrables (Optionnel).', placeholder: 'Ex: 150 000 DZA...', type: 'text', required: false },
    { id: 'email', question: 'Quelle est votre adresse email ?', description: 'Je vous enverrai mon analyse et mes propositions à cette adresse.', placeholder: 'nom@exemple.com', type: 'text', required: true },
];

const questionsAr: Question[] = [
    { id: 'company', question: 'ما اسم شركتك وماذا تقدم؟', description: 'يرجى تقديم وصف موجز لنشاطك الرئيسي.', placeholder: 'مثال: علامتي التجارية – وكالة تصميم أخلاقية...', type: 'text' },
    { id: 'mission', question: 'ما هي رسالة علامتك التجارية ورؤيتها؟', description: 'ما هو هدف علامتك التجارية وأين تراها خلال 5 إلى 10 سنوات؟', placeholder: 'مهمتي هي...', type: 'textarea' },
    { id: 'audience', question: 'من هو جمهورك المستهدف؟', description: 'كن دقيقاً قدر الإمكان (العمر، الاهتمامات، السلوكيات).', placeholder: 'مثال: رواد أعمال تتراوح أعمارهم بين 25 و40 عاماً...', type: 'textarea' },
    { id: 'values', question: 'ما هي القيم التي تعرّف علامتك التجارية؟', description: 'اختر القيم التي تعبّر عنك أكثر.', type: 'multiselect_pills', options: valueOptionsAr },
    { id: 'personality_sliders', question: 'لنحدد شخصية علامتك التجارية.', description: 'ضع المؤشر حيث تقع علامتك على كل طيف.', type: 'personality_sliders', traits: personalityTraitsAr },
    { id: 'positioning', question: 'أين تتموضع في السوق؟', description: 'حدد موقعك الاستراتيجي بالنسبة لمنافسيك.', type: 'personality_sliders', traits: positioningTraitsAr },
    { id: 'competitors', question: 'من هم منافسوك وكيف تتميز عنهم؟', description: 'ما الذي يجعلك فريداً في سوقك؟', placeholder: 'منافسونا هم... ونتميز بـ...', type: 'textarea' },
    { id: 'emotion', question: 'ما الشعور الذي تريد إيقاظه لدى جمهورك؟', description: 'الثقة، الحماس، الراحة، الإلهام، الاطمئنان...', placeholder: 'أريد أن يشعروا بـ...', type: 'text' },
    { id: 'deliverables', question: 'ما هي المخرجات المتوقعة من هذا المشروع؟', description: 'اختر العناصر التي تحتاجها.', type: 'multiselect_pills', options: deliverableOptionsAr },
    { id: 'touchpoints', question: 'أين ستكون علامتك التجارية مرئية؟', description: 'اختر نقاط الاتصال الرئيسية.', type: 'touchpoints_grid', options: touchpointOptionsAr },
    { id: 'references', question: 'هل لديك مراجع بصرية تلهمك؟', description: 'علامات تجارية أو أساليب فنية أو تفضيلات جمالية (اختياري).', placeholder: 'أحب جماليات آبل، الألوان الترابية...', type: 'textarea', required: false },
    { id: 'timeline', question: 'ما هو جدولك الزمني المثالي؟', description: 'متى تحتاج إنجاز المخرجات؟ (اختياري)', placeholder: 'قبل نهاية مارس 2024...', type: 'text', required: false },
    { id: 'budget', question: 'ما هو نطاق ميزانيتك؟', description: 'يساعدنا هذا في مواءمة التوقعات والمخرجات (اختياري).', placeholder: 'مثال: 150,000 دج...', type: 'text', required: false },
    { id: 'email', question: 'ما هو عنوان بريدك الإلكتروني؟', description: 'سأرسل إليك تحليلي ومقترحاتي على هذا العنوان.', placeholder: 'name@example.com', type: 'text', required: true },
];

// ── UI strings ────────────────────────────────────────────────────────────────
const ui = {
    fr: {
        step: 'ÉTAPE', previous: 'Précédent', continue: 'Continuer',
        submit: 'Soumettre le projet', submitting: 'Envoi...',
        successBadge: 'Transmission Réussie',
        successTitle: 'Votre vision est entre de bonnes mains.',
        successBody: 'Merci pour votre confiance. Je vais maintenant analyser chaque détail de votre stratégie pour concevoir une identité qui vous ressemble vraiment.',
        steps: [
            { title: 'Analyse', desc: 'Décryptage de vos valeurs et de votre positionnement.' },
            { title: 'Conception', desc: 'Exploration créative et recherche de directions artistiques.' },
            { title: 'Contact', desc: "Je reviendrai vers vous d'ici 48h pour en discuter." },
        ],
        backHome: "Retour à l'accueil",
        etape: (n: number) => `Étape 0${n}`,
        errorAlert: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        connectionError: 'Une erreur de connexion est survenue. Veuillez vérifier votre connexion.',
    },
    ar: {
        step: 'الخطوة', previous: 'السابق', continue: 'متابعة',
        submit: 'إرسال المشروع', submitting: 'جارٍ الإرسال...',
        successBadge: 'تم الإرسال بنجاح',
        successTitle: 'رؤيتك في أيدٍ أمينة.',
        successBody: 'شكراً لثقتك. سأقوم الآن بتحليل كل تفاصيل استراتيجيتك لتصميم هوية تعبّر عنك حقاً.',
        steps: [
            { title: 'التحليل', desc: 'فك رموز قيمك وتموضعك في السوق.' },
            { title: 'التصميم', desc: 'استكشاف إبداعي وبحث عن توجهات فنية.' },
            { title: 'التواصل', desc: 'سأعود إليك خلال 48 ساعة للنقاش.' },
        ],
        backHome: 'العودة إلى الرئيسية',
        etape: (n: number) => `الخطوة 0${n}`,
        errorAlert: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.',
        connectionError: 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.',
    },
};

// ── Language selector screen ──────────────────────────────────────────────────
function LanguageSelector({ onSelect }: { onSelect: (lang: Lang) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
        >
            <p className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase mb-16">LOUENES ABBAS</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 leading-tight">Choisissez votre langue</h1>
            <p className="text-2xl md:text-3xl text-neutral-400 font-light mb-3" style={{ direction: 'rtl' }}>اختر لغتك</p>
            <p className="text-neutral-400 text-sm md:text-base font-light mb-14 max-w-xs">Select the language of the questionnaire</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => onSelect('fr')}
                    className="group flex flex-col items-center gap-3 px-14 py-9 rounded-[5px] border-2 border-neutral-100 hover:border-black transition-all duration-500 bg-white hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-sm hover:shadow-2xl min-w-[190px]">
                    <span className="text-4xl">🇫🇷</span>
                    <span className="font-bold text-xl tracking-tight">Français</span>
                </button>
                <button onClick={() => onSelect('ar')}
                    className="group flex flex-col items-center gap-3 px-14 py-9 rounded-[5px] border-2 border-neutral-100 hover:border-black transition-all duration-500 bg-white hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-sm hover:shadow-2xl min-w-[190px]">
                    <span className="text-4xl">🇩🇿</span>
                    <span className="font-bold text-xl tracking-tight" style={{ direction: 'rtl' }}>العربية</span>
                </button>
            </div>
        </motion.div>
    );
}


export default function QuestionnairePage() {
    const [lang, setLang] = useState<Lang | null>(null);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({
        company: '', mission: '', audience: '', competitors: '',
        emotion: '', references: '', timeline: '', budget: '', email: '',
        personality_sliders: personalityTraitsFr.reduce((acc, trait) => ({ ...acc, [trait.id]: 50 }), {}),
        positioning: positioningTraitsFr.reduce((acc, trait) => ({ ...acc, [trait.id]: 50 }), {}),
        values: [], touchpoints: [], deliverables: [],
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);

    const personalityTraits = lang === 'ar' ? personalityTraitsAr : personalityTraitsFr;
    const questions = lang === 'ar' ? questionsAr : questionsFr;
    const t = lang === 'ar' ? ui.ar : ui.fr;
    const isRtl = lang === 'ar';

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
        mouseX.set(clientX);
        mouseY.set(clientY);
    }

    const mouseBackground = useMotionTemplate`
        radial-gradient(
            600px circle at ${mouseX}px ${mouseY}px,
            rgba(0,0,0,1),
            transparent 80%
        )
    `;

    const currentQuestion = lang ? questions[step] : null;
    const progress = lang ? ((step + 1) / questions.length) * 100 : 0;

    const canProceed = () => {
        if (!currentQuestion) return false;
        if (currentQuestion.required === false) return true;
        const value = formData[currentQuestion.id];
        if (currentQuestion.type === 'text' || currentQuestion.type === 'textarea') {
            return typeof value === 'string' && value.trim().length > 0;
        }
        if (currentQuestion.type === 'multiselect_pills' || currentQuestion.type === 'touchpoints_grid') {
            return Array.isArray(value) && value.length > 0;
        }
        return true;
    };

    const handleNext = () => {
        if (!canProceed()) {
            setShowError(true);
            setTimeout(() => setShowError(false), 500);
            return;
        }

        setShowError(false);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleInputChange = (id: string, value: any) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (showError) setShowError(false);
    };

    const toggleMultiselect = (id: string, item: string) => {
        setFormData((prev) => {
            const current = prev[id] || [];
            const updated = current.includes(item)
                ? current.filter((i: string) => i !== item)
                : [...current, item];
            return { ...prev, [id]: updated };
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, lang }),
            });
            if (res.ok) {
                setIsSubmitted(true);
            } else {
                const errorData = await res.json();
                console.error('Submission failed:', errorData.message);
                alert(t.errorAlert);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert(t.connectionError);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!lang || !currentQuestion) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !isSubmitted && currentQuestion.type !== 'textarea') {
                if (canProceed()) handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, isSubmitted, currentQuestion, lang]);

    const noiseBg = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px'
    };

    // ── Language selector ─────────────────────────────────────────────────────
    if (!lang) {
        return (
            <main
                onMouseMove={handleMouseMove}
                className="min-h-screen bg-white selection:bg-black selection:text-white overflow-hidden relative"
            >
                <motion.div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" style={{ background: mouseBackground }} />
                <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-multiply" style={noiseBg} />
                <div className="relative z-20">
                    <AnimatePresence><LanguageSelector onSelect={setLang} /></AnimatePresence>
                </div>
            </main>
        );
    }

    if (isSubmitted) {
        return (
            <main
                dir={isRtl ? 'rtl' : 'ltr'}
                onMouseMove={handleMouseMove}
                className="min-h-screen bg-white selection:bg-black selection:text-white flex flex-col items-center justify-center p-4 md:p-6 text-center overflow-hidden relative"
            >
                <motion.div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                    style={{ background: mouseBackground }}
                />

                <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-multiply" style={noiseBg} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl w-full relative z-20 px-4"
                >
                    <div className="mb-8 md:mb-12 inline-flex items-center gap-3 md:gap-4 text-neutral-300 justify-center">
                        <div className="h-px w-8 md:w-12 bg-neutral-200" />
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase">{t.successBadge}</span>
                        <div className="h-px w-8 md:w-12 bg-neutral-200" />
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-[clamp(2.5rem,8vw,6.5rem)] font-bold tracking-tighter leading-[0.95] mb-8 md:mb-12">
                        {t.successTitle}
                    </h1>

                    <p className="text-base md:text-xl lg:text-2xl text-neutral-500 mb-12 md:mb-20 font-light max-w-2xl mx-auto leading-relaxed">
                        {t.successBody}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-24 text-left">
                        {t.steps.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                                className="p-6 md:p-10 rounded-[5px] bg-neutral-50 border border-neutral-100 group hover:bg-black hover:text-white transition-all duration-500 h-full flex flex-col"
                            >
                                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-4 md:mb-6 block group-hover:text-neutral-500 transition-colors">{t.etape(i + 1)}</span>
                                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-sm text-neutral-400 font-light leading-relaxed group-hover:text-neutral-300 transition-colors">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        <Link href="/" className="group relative px-8 md:px-14 py-4 md:py-6 rounded-[5px] bg-black text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 md:gap-4 overflow-hidden text-sm md:text-base">
                            <span className="relative z-10">{t.backHome}</span>
                            {isRtl ? <ArrowLeft size={18} className="relative z-10 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                            <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main
            dir={isRtl ? 'rtl' : 'ltr'}
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-white selection:bg-black selection:text-white flex flex-col overflow-hidden relative"
        >
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                style={{ background: mouseBackground }}
            />

            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-multiply" style={noiseBg} />

            <div className="fixed top-0 left-0 w-full z-50">
                <div className="h-1 md:h-1.5 bg-neutral-100 w-full overflow-hidden">
                    <motion.div
                        className="h-full bg-black"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                    />
                </div>
                <div className={clsx('flex items-center px-4 md:px-10 py-4 md:py-8 relative z-20', isRtl ? 'flex-row-reverse justify-between' : 'justify-between')}>
                    <div className={clsx('flex items-center gap-3', isRtl && 'flex-row-reverse')}>
                        <Link href="/" className="text-xs md:text-sm font-bold tracking-tighter hover:opacity-50 transition-opacity">LOUENES ABBAS</Link>
                        <button
                            onClick={() => { setLang(null); setStep(0); }}
                            className="text-[10px] md:text-xs font-mono text-neutral-400 bg-white/80 backdrop-blur-sm px-2 md:px-3 py-1 rounded-[5px] border border-neutral-100 shadow-sm hover:border-neutral-400 hover:text-neutral-700 transition-all"
                        >
                            {lang === 'fr' ? '🇫🇷 FR' : '🇩🇿 AR'}
                        </button>
                    </div>
                    <span className="text-[10px] md:text-xs font-mono text-neutral-400 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-1 md:py-1.5 rounded-[5px] border border-neutral-100 shadow-sm">
                        {step + 1} / {questions.length}
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 pt-24 md:pt-24 pb-28 md:pb-32 relative z-20 overflow-y-auto">
                <div className="max-w-4xl w-full relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: isRtl ? -30 : 30, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: isRtl ? 30 : -30, filter: 'blur(10px)' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full"
                        >
                            <div className="mb-8 md:mb-12">
                                <div className={clsx('flex items-center gap-2 md:gap-3 mb-3 md:mb-4', isRtl && 'flex-row-reverse')}>
                                    <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] text-neutral-400 uppercase">{t.step} {step + 1}</span>
                                    <div className="h-px w-6 md:w-8 bg-neutral-200" />
                                    <Sparkles size={14} className="text-neutral-300" />
                                </div>
                                <hgroup>
                                    <h2 className="text-2xl md:text-4xl lg:text-[clamp(1.5rem,5vw,3.2rem)] font-bold tracking-tighter leading-[1.1] mb-4 md:mb-6">
                                        {currentQuestion!.question}
                                    </h2>
                                    <p className="text-base md:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
                                        {currentQuestion!.description}
                                    </p>
                                </hgroup>
                            </div>

                            <div className="mt-6 md:mt-8">
                                {currentQuestion!.type === 'text' && (
                                    <motion.input
                                        animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        autoFocus
                                        type="text"
                                        value={formData[currentQuestion!.id] || ''}
                                        onChange={(e) => handleInputChange(currentQuestion!.id, e.target.value)}
                                        placeholder={currentQuestion!.placeholder}
                                        className={clsx(
                                            "w-full bg-transparent border-b-2 py-4 md:py-6 text-xl md:text-3xl lg:text-4xl font-light focus:outline-none transition-all duration-500 placeholder:text-neutral-200",
                                            showError ? "border-red-500 text-red-500" : "border-neutral-100 focus:border-black"
                                        )}
                                    />
                                )}

                                {currentQuestion!.type === 'textarea' && (
                                    <motion.textarea
                                        animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        autoFocus
                                        value={formData[currentQuestion!.id] || ''}
                                        onChange={(e) => handleInputChange(currentQuestion!.id, e.target.value)}
                                        placeholder={currentQuestion!.placeholder}
                                        className={clsx(
                                            "w-full bg-transparent border-b-2 py-4 md:py-6 text-lg md:text-2xl lg:text-3xl font-light focus:outline-none transition-all duration-500 resize-none h-[180px] md:h-[250px] placeholder:text-neutral-200",
                                            showError ? "border-red-500 text-red-500" : "border-neutral-100 focus:border-black"
                                        )}
                                    />
                                )}

                                {currentQuestion!.type === 'multiselect_pills' && (
                                    <motion.div
                                        animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        className={clsx(
                                            "flex flex-wrap gap-2 md:gap-3 p-4 rounded-[5px] transition-colors",
                                            isRtl && "flex-row-reverse",
                                            showError && "bg-red-50/50 border border-red-100"
                                        )}
                                    >
                                        {(currentQuestion!.options as string[])?.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    toggleMultiselect(currentQuestion!.id, option);
                                                    if (showError) setShowError(false);
                                                }}
                                                className={clsx(
                                                    'px-4 md:px-6 py-2.5 md:py-3 rounded-[5px] border-2 transition-all duration-300 text-sm md:text-lg font-medium',
                                                    formData[currentQuestion!.id]?.includes(option)
                                                        ? 'bg-black border-black text-white shadow-xl scale-105'
                                                        : showError
                                                            ? 'bg-white border-red-200 text-red-400'
                                                            : 'bg-white border-neutral-100 text-neutral-500 hover:border-neutral-300'
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {currentQuestion!.type === 'personality_sliders' && (
                                    <div className="space-y-8 md:space-y-12 max-w-3xl">
                                        {(currentQuestion!.traits || personalityTraits).map((trait) => (
                                            <div key={trait.id} className="relative py-2">
                                                <div className={clsx('flex justify-between items-center mb-4 md:mb-6 px-1', isRtl && 'flex-row-reverse')}>
                                                    <span className={clsx("text-[10px] md:text-sm font-bold tracking-wider md:tracking-widest uppercase transition-colors", (formData[currentQuestion!.id][trait.id] < 40) ? "text-black" : "text-neutral-300")}>{trait.left}</span>
                                                    <span className={clsx("text-[10px] md:text-sm font-bold tracking-wider md:tracking-widest uppercase transition-colors text-right", (formData[currentQuestion!.id][trait.id] > 60) ? "text-black" : "text-neutral-300")}>{trait.right}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={formData[currentQuestion!.id][trait.id]}
                                                    onChange={(e) => {
                                                        const newVal = parseInt(e.target.value);
                                                        handleInputChange(currentQuestion!.id, {
                                                            ...formData[currentQuestion!.id],
                                                            [trait.id]: newVal
                                                        });
                                                    }}
                                                    className="w-full h-1 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-black hover:accent-neutral-800"
                                                />
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-px bg-neutral-200 -z-10" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion!.type === 'touchpoints_grid' && (
                                    <motion.div
                                        animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        className={clsx(
                                            "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-4 rounded-[5px] transition-colors",
                                            showError && "bg-red-50/50 border border-red-100"
                                        )}
                                    >
                                        {(currentQuestion!.options as TouchpointOption[])?.map((option) => {
                                            const Icon = option.icon;
                                            const isActive = formData[currentQuestion!.id]?.includes(option.id);
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => {
                                                        toggleMultiselect(currentQuestion!.id, option.id);
                                                        if (showError) setShowError(false);
                                                    }}
                                                    className={clsx(
                                                        'p-4 md:p-8 rounded-[5px] border-2 transition-all duration-500 flex flex-col items-center gap-2 md:gap-4 text-center group relative overflow-hidden backdrop-blur-sm',
                                                        isActive
                                                            ? 'bg-black border-black text-white shadow-2xl scale-105'
                                                            : showError
                                                                ? 'bg-white/50 border-red-100 text-red-300'
                                                                : 'bg-white/50 border-neutral-100 text-neutral-400 hover:border-neutral-300'
                                                    )}
                                                >
                                                    <Icon size={32} className={clsx("transition-transform duration-500 relative z-10", isActive ? "scale-110" : "group-hover:scale-110")} />
                                                    <span className="font-bold tracking-tight text-sm md:text-lg relative z-10">{option.label}</span>
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="active-bg"
                                                            className="absolute inset-0 bg-black -z-0"
                                                            initial={false}
                                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className={clsx('fixed bottom-0 left-0 w-full p-4 md:p-10 flex items-center backdrop-blur-md bg-white/50 z-50', isRtl ? 'flex-row-reverse justify-between' : 'justify-between')}>
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className={clsx(
                        'flex items-center gap-2 md:gap-3 text-xs md:text-sm font-bold transition-all px-4 md:px-8 py-3 md:py-4 rounded-[5px] hover:bg-neutral-50',
                        isRtl && 'flex-row-reverse',
                        step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    )}
                >
                    {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                    <span>{t.previous}</span>
                </button>

                <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={clsx(
                        "group flex items-center gap-2 md:gap-4 bg-black text-white px-6 md:px-10 py-3.5 md:py-5 rounded-[5px] font-bold text-sm md:text-lg transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
                        isRtl && 'flex-row-reverse',
                        !canProceed() ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                    )}
                >
                    {step === questions.length - 1 ? (
                        <>
                            <span>{isSubmitting ? t.submitting : t.submit}</span>
                            {isSubmitting ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                        </>
                    ) : (
                        <>
                            <span>{t.continue}</span>
                            {isRtl
                                ? <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </>
                    )}
                </button>
            </div>

            <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: black;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
        </main>
    );
}
