'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const steps = [
    {
        number: "01",
        title: "Exploration Profonde",
        subtitle: "Phase d'Audit",
        description: "J'élimine le superflu pour révéler la vérité brute de votre marque. Nous plongeons dans votre marché et vos valeurs pour identifier votre avantage concurrentiel unique.",
    },
    {
        number: "02",
        title: "Plan Stratégique",
        subtitle: "Phase d'Architecture",
        description: "Conception du cadre logique qui soutient votre vision. Nous établissons une feuille de route stratégique avant de designer, assurant que chaque choix résout un problème réel.",
    },
    {
        number: "03",
        title: "Exécution Créative",
        subtitle: "Phase de Réalisation",
        description: "Transformer une stratégie abstraite en désir concret. Je crée des systèmes visuels haut de gamme et des expériences digitales qui captent l'attention par leur précision.",
    },
    {
        number: "04",
        title: "Livraison du Système",
        subtitle: "Phase de Passation",
        description: "Fournir les outils pour un lancement parfait. Je livre des actifs prêts pour la production et des systèmes de design qui s'adaptent sans effort à votre entreprise.",
    }
];

export function Process() {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} id="process" className="py-24 md:py-48 bg-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="mb-24 md:mb-48 text-center text-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-8xl font-semibold tracking-tighter leading-none">
                            Notre <br className="md:hidden" />
                            <span className="text-neutral-300 italic font-serif font-light">Processus.</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Central Vertical Line */}
                    <div className="absolute left-[8px] md:left-1/2 top-0 bottom-0 w-[1px] md:w-[2px] bg-neutral-100 -translate-x-1/2" />

                    {/* Progress Line */}
                    <motion.div
                        className="absolute left-[8px] md:left-1/2 top-0 bottom-0 w-[1px] md:w-[2px] bg-neutral-900 -translate-x-1/2 origin-top"
                        style={{ scaleY }}
                    />

                    {/* Steps Overlay */}
                    <div className="space-y-24 md:space-y-64 relative">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div key={index} className="relative flex items-start md:items-center md:justify-center">
                                    {/* Circle Indicator */}
                                    <div className="absolute left-[8px] md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="w-8 h-8 md:w-14 md:h-14 rounded-[5px] bg-white border border-neutral-200 md:border-2 md:border-neutral-900 flex items-center justify-center shadow-xl md:translate-x-0"
                                        >
                                            <span className="text-[10px] md:text-sm font-black text-black">{step.number}</span>
                                        </motion.div>

                                        {/* Outer Pulse Circle - only visible when coming into view or always pulsing for life */}
                                        <motion.div
                                            className="absolute w-10 h-10 md:w-20 md:h-20 rounded-[5px] border border-neutral-200 md:translate-x-0"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        />
                                    </div>

                                    {/* Content Card */}
                                    <div className={`w-full flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: isMobile ? 20 : (isEven ? -50 : 50) }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            className={`max-w-md ml-12 md:ml-0 ${isEven ? 'md:mr-32 md:text-right' : 'md:ml-32 md:text-left'}`}
                                        >
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-2 md:mb-3 block">
                                                {step.subtitle}
                                            </span>
                                            <h3 className="text-xl md:text-4xl font-semibold text-neutral-950 mb-4 md:mb-6 leading-tight">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm md:text-lg text-neutral-500 leading-relaxed font-medium">
                                                {step.description}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Decorative Narrative background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-between px-12 pointer-events-none opacity-[0.02]">
                <span className="text-[25vw] font-black uppercase rotate-90 origin-center leading-none text-black">STRATÉGIE</span>
                <span className="text-[25vw] font-black uppercase -rotate-90 origin-center leading-none text-black">RÉALISATION</span>
            </div>
        </section>
    );
}
