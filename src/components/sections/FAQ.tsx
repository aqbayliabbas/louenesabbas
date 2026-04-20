'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const faqs = [
    {
        question: "Quel est votre délai habituel pour un projet de branding ?",
        answer: "La plupart des projets d'identité complète prennent entre 4 et 8 semaines. Cela permet une recherche approfondie, le développement de la stratégie et des cycles de design itératifs."
    },
    {
        question: "Offrez-vous des services de développement web ?",
        answer: "Oui. Je me spécialise dans la conception et la création de sites web haute performance avec Next.js et Framer. Je crois que le design et le code doivent cohabiter pour un résultat optimal."
    },
    {
        question: "Comment fixez-vous vos tarifs ?",
        answer: "Je travaille par projet. Après notre appel de découverte, je vous proposerai un devis personnalisé adapté à vos besoins spécifiques. Je ne crois pas aux tarifs standardisés."
    },
    {
        question: "Que dois-je préparer avant de commencer ?",
        answer: "Simplement une idée claire de vos objectifs commerciaux et de votre public cible. Je peux vous aider à clarifier le reste durant notre phase stratégique."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section data-nav-dark className="py-32 px-6 bg-[#050505] text-white">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Des<br />Questions ?</h2>
                    <p className="text-white/60 text-lg">
                        Tout ce que vous devez savoir sur ma façon de travailler avec mes clients.
                    </p>
                </div>

                <div className="md:col-span-8 space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-white/10 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full py-6 flex justify-between items-center text-left hover:text-white/80 transition-colors"
                            >
                                <span className="text-xl md:text-2xl font-medium pr-8">{faq.question}</span>
                                <motion.span
                                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Plus className="w-6 h-6 text-white/50" />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-lg text-white/50 leading-relaxed pb-8 max-w-2xl">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
