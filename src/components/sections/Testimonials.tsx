'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
    {
        quote: "Louenes completely transformed our brand. The clarity and depth he brought to our identity was exactly what we needed to scale.",
        author: "Sarah Jenkins",
        role: "CEO, Vertex",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    },
    {
        quote: "A true visionary. He doesn't just design; he thinks strategically about how the brand will live in the real world.",
        author: "Michael Chen",
        role: "Founder, Ozone",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
    },
    {
        quote: "The best investment we made this year. The rebrand paid for itself within two months of launching.",
        author: "Elena Rodriguez",
        role: "Marketing Director, Solstice",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
    },
    {
        quote: "Minimalist, bold, and effective. Louenes has an eye for detail that is unmatched in the industry.",
        author: "David Park",
        role: "Creative Lead, Aether",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
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
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Duplicated list for seamless loop */}
                    {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="w-[300px] md:w-[500px] p-8 md:p-12 rounded-[2rem] md:rounded-3xl bg-white/5 border border-white/10 shrink-0 whitespace-normal flex flex-col justify-between">
                            <div>
                                <span className="text-3xl md:text-4xl text-neutral-500 font-serif italic">"</span>
                                <p className="text-base md:text-xl text-white/90 font-medium leading-relaxed -mt-2 md:-mt-4 mb-6 md:mb-8">
                                    {t.quote}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 md:w-12 md:h-12">
                                    <Image
                                        src={t.image}
                                        alt={t.author}
                                        fill
                                        className="rounded-full object-cover grayscale"
                                        sizes="(max-w-768px) 40px, 48px"
                                    />
                                </div>
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
