'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
    {
        quote: "La profondeur stratégique que Louenes a apportée à Vanèlla a été transformative. Il n'a pas seulement dessiné un logo ; il a créé une expérience sensorielle pour nos clients.",
        author: "Mohamed Larbi",
        role: "Fondateur, Vanèlla",
    },
    {
        quote: "Travailler avec Louenes a changé la vision de notre propre entreprise. Valgrand a maintenant l'autorité visuelle nécessaire pour correspondre à nos ambitions mondiales.",
        author: "Ali",
        role: "CEO, Valgrand",
    },
    {
        quote: "Bliss avait besoin d'une présence digitale fluide et haut de gamme. Louenes a livré exactement cela, avec un niveau de détail qu'il est rare de trouver.",
        author: "Sam Tremblay",
        role: "Fondateur, Bliss",
    },
    {
        quote: "Le rebranding a été le tournant de notre croissance. Nos taux de conversion ont doublé dans les mois suivant l'implémentation de la nouvelle identité Vitalys Pro.",
        author: "Athmane Bencheikh",
        role: "Fondateur, Vitalys Pro",
    },
    {
        quote: "Aurora Labs est à la pointe de la tech, et nous avions besoin d'une marque qui reflète cela. La vision de Louenes était futuriste tout en étant parfaitement ancrée.",
        author: "Mohamed Larbi",
        role: "Fondateur, Aurora Labs",
    },
    {
        quote: "L'identité de Diolata est désormais aussi audacieuse que nos produits. Chaque point de contact semble intentionnel, premium et méticuleusement conçu.",
        author: "Ridha Mohamed",
        role: "Fondateur, Diolata",
    }
];

export function Testimonials() {
    return (
        <section className="py-32 bg-[#0a0a0a] text-white overflow-hidden">
            <div className="mb-16 px-6 max-w-[1400px] mx-auto">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Paroles de Clients.</h2>
            </div>

            <div className="relative flex w-full overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />

                {/* Marquee Container */}
                <motion.div
                    className="flex gap-4 md:gap-8 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Duplicated list for seamless loop */}
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="w-[300px] md:w-[500px] p-8 md:p-12 rounded-[5px] bg-white/5 border border-white/10 shrink-0 whitespace-normal flex flex-col justify-between">
                            <div>
                                <span className="text-3xl md:text-4xl text-neutral-500 font-serif italic">"</span>
                                <p className="text-base md:text-xl text-white/90 font-medium leading-relaxed -mt-2 md:-mt-4 mb-6 md:mb-8">
                                    {t.quote}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[5px] bg-black border border-white/10" />
                                <div>
                                    <h4 className="font-bold text-[10px] md:text-sm">{t.author}</h4>
                                    <p className="text-[8px] md:text-xs text-neutral-500 uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
