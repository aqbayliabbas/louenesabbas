'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
    {
        quote: "The strategic depth Louenes brought to Vanèlla was transformative. He didn't just design a logo; he created a sensory experience for our premium customers.",
        author: "larbi mohamed",
        role: "Founder, Vanèlla",
    },
    {
        quote: "Working with Louenes changed how we view our own business. Valgrand now has the visual authority to match our global architectural ambitions.",
        author: "Ali",
        role: "CEO, Valgrand",
    },
    {
        quote: "Bliss needed a digital presence that felt effortless and high-end. Louenes delivered exactly that, with a level of detail that is rare to find.",
        author: "Sam Tremblay",
        role: "Founder, Bliss",
    },
    {
        quote: "The rebrand was the turning point for our growth. Our conversion rates doubled within months of implementing the new Vitalys Pro identity.",
        author: "Athmane Bencheikh",
        role: "Founder, Vitalys Pro",
    },
    {
        quote: "Aurora Labs is at the forefront of tech, and we needed a brand that reflected that. Louenes's vision was futuristic yet perfectly grounded.",
        author: "larbi mohamed",
        role: "Founder, Aurora Labs",
    },
    {
        quote: "Diolata's identity is now as bold and unique as our products. Every touchpoint feels intentional, premium and meticulously crafted.",
        author: "Ridha mohamed",
        role: "Founder, Diolata",
    }
];

export function Testimonials() {
    return (
        <section className="py-32 bg-[#0a0a0a] text-white overflow-hidden">
            <div className="mb-16 px-6 max-w-[1200px] mx-auto">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Client Words.</h2>
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
                        <div key={i} className="w-[300px] md:w-[500px] p-8 md:p-12 rounded-[2rem] md:rounded-3xl bg-white/5 border border-white/10 shrink-0 whitespace-normal flex flex-col justify-between">
                            <div>
                                <span className="text-3xl md:text-4xl text-neutral-500 font-serif italic">"</span>
                                <p className="text-base md:text-xl text-white/90 font-medium leading-relaxed -mt-2 md:-mt-4 mb-6 md:mb-8">
                                    {t.quote}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black border border-white/10" />
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
