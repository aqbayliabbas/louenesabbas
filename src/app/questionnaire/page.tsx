'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Send, Sparkles, Monitor, Share2, Package, Globe, Smartphone, Newspaper, LucideIcon } from 'lucide-react';
import Link from 'next/link';

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

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
}

const personalityTraits = [
    { left: 'Traditionnel', right: 'Moderne', id: 'personality_trad_mod' },
    { left: 'Modeste', right: 'Audacieux', id: 'personality_mod_aud' },
    { left: 'Sérieux', right: 'Amusant', id: 'personality_ser_fun' },
    { left: 'Accessible', right: 'Exclusif', id: 'personality_acc_excl' },
    { left: 'Minimaliste', right: 'Complexe', id: 'personality_min_comp' },
];

const positioningTraits = [
    { left: 'Prestigieux / Luxe', right: 'Abordable / Grand Public', id: 'pos_luxury' },
    { left: 'Niche / Spécialisé', right: 'Large / Généraliste', id: 'pos_niche' },
    { left: 'Émotionnel / Humain', right: 'Fonctionnel / Rationnel', id: 'pos_emotion' },
];

const valueOptions = [
    'Innovation', 'Durabilité', 'Confiance', 'Excellence', 'Créativité',
    'Transparence', 'Audace', 'Empathie', 'Simplicité', 'Qualité',
    'Héritage', 'Rapidité', 'Élégance', 'Intégrité'
];

const deliverableOptions = [
    'Logo & Variations', 'Charte Graphique', 'Cartes de Visite', 'Réseaux Sociaux',
    'Direction Artistique', 'Site Web Strategy', 'Packaging design', 'Papeterie',
    'Signature Email', 'Typographies Custom', 'Iconographie'
];

const touchpointOptions: TouchpointOption[] = [
    { id: 'web', label: 'Site Web', icon: Globe },
    { id: 'social', label: 'Réseaux Sociaux', icon: Share2 },
    { id: 'app', label: 'Application Mobile', icon: Smartphone },
    { id: 'packaging', label: 'Packaging', icon: Package },
    { id: 'print', label: 'Supports Imprimés', icon: Newspaper },
    { id: 'retail', label: 'Espace de vente', icon: Monitor },
];

const questions: Question[] = [
    {
        id: 'company',
        question: 'Quel est le nom de votre entreprise, et que proposez-vous ?',
        description: 'Veuillez fournir une brève description de votre activité principale.',
        placeholder: 'Ex: MaSuperMarque - Agence de design éthique...',
        type: 'text',
    },
    {
        id: 'mission',
        question: 'Quelle est la mission et la vision de votre marque ?',
        description: 'Quel est l’objectif de votre marque, et où la voyez-vous dans 5 à 10 ans ?',
        placeholder: 'Ma mission est de...',
        type: 'textarea',
    },
    {
        id: 'audience',
        question: 'Qui est votre public cible ?',
        description: 'Soyez aussi précis que possible (âge, intérêts, comportements).',
        placeholder: 'Ex: Entrepreneurs de 25-40 ans cherchant...',
        type: 'textarea',
    },
    {
        id: 'values',
        question: 'Quelles sont les valeurs qui définissent votre marque ?',
        description: 'Sélectionnez les valeurs qui vous correspondent le mieux.',
        type: 'multiselect_pills',
        options: valueOptions,
    },
    {
        id: 'personality_sliders',
        question: 'Définissons la personnalité de votre marque.',
        description: 'Positionnez le curseur là où votre marque se situe sur chaque spectre.',
        type: 'personality_sliders',
        traits: personalityTraits,
    },
    {
        id: 'positioning',
        question: 'Où vous situez-vous sur le marché ?',
        description: 'Définissez votre positionnement stratégique par rapport à vos concurrents.',
        type: 'personality_sliders',
        traits: positioningTraits,
    },
    {
        id: 'competitors',
        question: 'Qui sont vos concurrents, et comment vous en distinguez-vous ?',
        description: 'Qu’est-ce qui vous rend unique sur votre marché ?',
        placeholder: 'Nos concurrents sont... nous nous distinguons par...',
        type: 'textarea',
    },
    {
        id: 'emotion',
        question: 'Quelle émotion voulez-vous susciter ?',
        description: 'Confiance, enthousiasme, confort, inspiration, assurance...',
        placeholder: 'Je veux qu’ils se sentent...',
        type: 'text',
    },
    {
        id: 'deliverables',
        question: 'Quels sont les livrables attendus pour ce projet ?',
        description: 'Sélectionnez les éléments dont vous avez besoin.',
        type: 'multiselect_pills',
        options: deliverableOptions,
    },
    {
        id: 'touchpoints',
        question: 'Où votre marque sera-t-elle visible ?',
        description: 'Sélectionnez les principaux points de contact.',
        type: 'touchpoints_grid',
        options: touchpointOptions,
    },
    {
        id: 'references',
        question: 'Des références visuelles qui vous inspirent ?',
        description: 'Marques, styles artistiques ou préférences esthétiques.',
        placeholder: 'J’aime l’esthétique Apple, les couleurs terreuses...',
        type: 'textarea',
    },
    {
        id: 'timeline',
        question: 'Quel est votre calendrier idéal ?',
        description: 'Quand avez-vous besoin que les livrables soient finalisés ?',
        placeholder: 'D’ici fin mars 2024...',
        type: 'text',
    },
    {
        id: 'budget',
        question: 'Quelle est votre fourchette budgétaire ?',
        description: 'Cela nous aide à aligner les attentes et les livrables.',
        placeholder: 'Entre 50000 DZA et 120000 DZA...',
        type: 'text',
    },
];

export default function QuestionnairePage() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({
        personality_sliders: personalityTraits.reduce((acc, trait) => ({ ...acc, [trait.id]: 50 }), {}),
        positioning: positioningTraits.reduce((acc, trait) => ({ ...acc, [trait.id]: 50 }), {}),
        values: [],
        touchpoints: [],
        deliverables: [],
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

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

    const currentQuestion = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    useEffect(() => {
        if (!isSubmitted) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSubmitted]);

    const canProceed = () => {
        const value = formData[currentQuestion.id];
        if (currentQuestion.type === 'text' || currentQuestion.type === 'textarea') {
            return value && value.trim().length > 0;
        }
        if (currentQuestion.type === 'multiselect_pills' || currentQuestion.type === 'touchpoints_grid') {
            return value && value.length > 0;
        }
        return true; // personality_sliders always has values
    };

    const handleNext = () => {
        if (!canProceed()) return;

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
        console.log('Final Form Data:', formData);
        try {
            const res = await fetch('/api/responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            // Even if it fails, we show the success UI for now to avoid blocking the user
            setIsSubmitted(true);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !isSubmitted && currentQuestion.type !== 'textarea') {
                if (canProceed()) handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, isSubmitted, currentQuestion]);

    if (isSubmitted) {
        return (
            <main
                onMouseMove={handleMouseMove}
                className="min-h-screen bg-white selection:bg-black selection:text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden relative"
            >
                {/* Re-use dynamic background */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                    style={{ background: mouseBackground }}
                />

                {/* Grain Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-multiply"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundSize: '180px 180px'
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl w-full relative z-20"
                >
                    <div className="mb-12 inline-flex items-center gap-4 text-neutral-300 justify-center">
                        <div className="h-px w-12 bg-neutral-200" />
                        <span className="text-xs font-bold tracking-[0.4em] uppercase">Transmission Réussie</span>
                        <div className="h-px w-12 bg-neutral-200" />
                    </div>

                    <h1 className="text-[clamp(2.5rem,8vw,6.5rem)] font-bold tracking-tighter leading-[0.9] mb-12">
                        Votre vision est <br /> entre de bonnes mains.
                    </h1>

                    <p className="text-xl md:text-2xl text-neutral-500 mb-20 font-light max-w-2xl mx-auto leading-relaxed">
                        Merci pour votre confiance. Je vais maintenant analyser chaque détail de votre stratégie pour concevoir une identité qui vous ressemble vraiment.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-left">
                        {[
                            { title: 'Analyse', desc: 'Décryptage de vos valeurs et de votre positionnement.', delay: 0.2 },
                            { title: 'Conception', desc: 'Exploration créative et recherche de directions artistiques.', delay: 0.3 },
                            { title: 'Contact', desc: 'Je reviendrai vers vous d’ici 48h pour en discuter.', delay: 0.4 },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: item.delay, duration: 0.8 }}
                                className="p-10 rounded-[2.5rem] bg-neutral-50 border border-neutral-100 group hover:bg-black hover:text-white transition-all duration-500 h-full flex flex-col"
                            >
                                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-6 block group-hover:text-neutral-500 transition-colors">Étape 0{i + 1}</span>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-sm text-neutral-400 font-light leading-relaxed group-hover:text-neutral-300 transition-colors">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link href="/" className="group relative px-14 py-6 rounded-full bg-black text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 overflow-hidden">
                            <span className="relative z-10">Retour à l'accueil</span>
                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-white selection:bg-black selection:text-white flex flex-col overflow-hidden relative"
        >
            {/* Dynamic Background */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                style={{ background: mouseBackground }}
            />

            {/* Grain Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '180px 180px'
                }}
            />

            {/* Header / Progress bar */}
            <div className="fixed top-0 left-0 w-full z-50">
                <div className="h-1.5 bg-neutral-100 w-full overflow-hidden">
                    <motion.div
                        className="h-full bg-black"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                    />
                </div>
                <div className="flex justify-between items-center px-10 py-8 relative z-20">
                    <Link href="/" className="text-sm font-bold tracking-tighter hover:opacity-50 transition-opacity">LOUENES ABBAS</Link>
                    <span className="text-xs font-mono text-neutral-400 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-neutral-100 shadow-sm">
                        {step + 1} / {questions.length}
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-32 relative z-20">
                <div className="max-w-5xl w-full relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full"
                        >
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase">ÉTAPE {step + 1}</span>
                                    <div className="h-px w-8 bg-neutral-200" />
                                    <Sparkles size={14} className="text-neutral-300" />
                                </div>
                                <hgroup>
                                    <h2 className="text-[clamp(1.5rem,5vw,3.2rem)] font-bold tracking-tighter leading-[1.1] mb-6">
                                        {currentQuestion.question}
                                    </h2>
                                    <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
                                        {currentQuestion.description}
                                    </p>
                                </hgroup>
                            </div>

                            {/* Dynamic Inputs */}
                            <div className="mt-8">
                                {currentQuestion.type === 'text' && (
                                    <input
                                        autoFocus
                                        type="text"
                                        value={formData[currentQuestion.id] || ''}
                                        onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                        placeholder={currentQuestion.placeholder}
                                        className="w-full bg-transparent border-b-2 border-neutral-100 py-6 text-2xl md:text-4xl font-light focus:outline-none focus:border-black transition-all duration-500 placeholder:text-neutral-100"
                                    />
                                )}

                                {currentQuestion.type === 'textarea' && (
                                    <textarea
                                        autoFocus
                                        value={formData[currentQuestion.id] || ''}
                                        onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                                        placeholder={currentQuestion.placeholder}
                                        className="w-full bg-transparent border-b-2 border-neutral-100 py-6 text-2xl md:text-3xl font-light focus:outline-none focus:border-black transition-all duration-500 resize-none h-[250px] placeholder:text-neutral-100"
                                    />
                                )}

                                {currentQuestion.type === 'multiselect_pills' && (
                                    <div className="flex flex-wrap gap-3">
                                        {(currentQuestion.options as string[])?.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => toggleMultiselect(currentQuestion.id, option)}
                                                className={clsx(
                                                    'px-6 py-3 rounded-full border-2 transition-all duration-300 text-lg font-medium',
                                                    formData[currentQuestion.id]?.includes(option)
                                                        ? 'bg-black border-black text-white shadow-xl scale-105'
                                                        : 'bg-white border-neutral-100 text-neutral-500 hover:border-neutral-300'
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.type === 'personality_sliders' && (
                                    <div className="space-y-12 max-w-3xl">
                                        {(currentQuestion.traits || personalityTraits).map((trait) => (
                                            <div key={trait.id} className="relative py-2">
                                                <div className="flex justify-between items-center mb-6 px-1">
                                                    <span className={clsx("text-sm font-bold tracking-widest uppercase transition-colors", (formData[currentQuestion.id][trait.id] < 40) ? "text-black" : "text-neutral-300")}>{trait.left}</span>
                                                    <span className={clsx("text-sm font-bold tracking-widest uppercase transition-colors", (formData[currentQuestion.id][trait.id] > 60) ? "text-black" : "text-neutral-300")}>{trait.right}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={formData[currentQuestion.id][trait.id]}
                                                    onChange={(e) => {
                                                        const newVal = parseInt(e.target.value);
                                                        handleInputChange(currentQuestion.id, {
                                                            ...formData[currentQuestion.id],
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

                                {currentQuestion.type === 'touchpoints_grid' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {(currentQuestion.options as TouchpointOption[])?.map((option) => {
                                            const Icon = option.icon;
                                            const isActive = formData[currentQuestion.id]?.includes(option.id);
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => toggleMultiselect(currentQuestion.id, option.id)}
                                                    className={clsx(
                                                        'p-8 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-4 text-center group relative overflow-hidden backdrop-blur-sm',
                                                        isActive
                                                            ? 'bg-black border-black text-white shadow-2xl scale-105'
                                                            : 'bg-white/50 border-neutral-100 text-neutral-400 hover:border-neutral-300'
                                                    )}
                                                >
                                                    <Icon size={32} className={clsx("transition-transform duration-500 relative z-10", isActive ? "scale-110" : "group-hover:scale-110")} />
                                                    <span className="font-bold tracking-tight text-lg relative z-10">{option.label}</span>
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
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 w-full p-10 flex justify-between items-center backdrop-blur-md bg-white/50 z-50">
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className={clsx(
                        'flex items-center gap-3 text-sm font-bold transition-all px-8 py-4 rounded-full hover:bg-neutral-50',
                        step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    )}
                >
                    <ArrowLeft size={18} /> Précédent
                </button>

                <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={clsx(
                        "group flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
                        !canProceed() ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                    )}
                >
                    {step === questions.length - 1 ? (
                        <>Soumettre le projet <Send size={20} /></>
                    ) : (
                        <>Continuer <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
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
