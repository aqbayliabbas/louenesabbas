'use client';

import { motion } from 'framer-motion';

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
        <section className="py-32 bg-background overflow-hidden">
            <div className="mb-16 px-6 max-w-[1200px] mx-auto">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Client Words.</h2>
            </div>

            <div className="relative flex w-full overflow-hidden mask-linear-gradient">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                {/* Marquee Container */}
                <motion.div
                    className="flex gap-8 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Duplicated list for seamless loop */}
                    {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="w-[400px] md:w-[500px] p-8 md:p-12 rounded-3xl bg-muted/30 border border-border/50 shrink-0 whitespace-normal flex flex-col justify-between">
                            <div>
                                <span className="text-4xl text-accent font-serif italic">"</span>
                                <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed -mt-4 mb-8">
                                    {t.quote}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover grayscale" />
                                <div>
                                    <h4 className="font-bold text-sm">{t.author}</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
