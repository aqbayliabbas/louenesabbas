'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const StatItem = ({ number, label, detail, index }: { number: string, label: string, detail: string, index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-50px" });

    return (
        <div ref={ref} className="group relative py-12 md:py-20 border-b border-white/10 last:border-0">
            <div className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-6 md:gap-8 relative z-10">
                {/* Number */}
                <div className="md:col-span-4 overflow-hidden">
                    <motion.h3
                        initial={{ y: "100%" }}
                        animate={isInView ? { y: 0 } : { y: "100%" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="text-7xl md:text-8xl lg:text-[12vw] font-black tracking-tighter leading-none text-white transition-all duration-700 md:group-hover:italic md:group-hover:translate-x-4"
                    >
                        {number}
                    </motion.h3>
                </div>

                {/* Info */}
                <div className="md:col-span-5 space-y-3 md:space-y-4">
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase text-white/40"
                    >
                        {label}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg md:text-xl lg:text-2xl font-light text-white/60 leading-relaxed max-w-md"
                    >
                        {detail}
                    </motion.p>
                </div>

                {/* Decorative Icon or Arrow */}
                <div className="hidden md:flex md:col-span-3 justify-end">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-white/20 flex items-center justify-center md:group-hover:bg-white md:group-hover:border-white transition-all duration-500"
                    >
                        <ArrowUpRight className="w-6 h-6 lg:w-8 lg:h-8 text-white md:group-hover:text-black transition-colors" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], [100, -300]);

    return (
        <section ref={containerRef} className="relative bg-[#050505] text-white overflow-hidden">
            {/* Massive Scrolly Text Background */}
            <div className="absolute top-0 left-0 w-full h-full hidden sm:flex items-center justify-center pointer-events-none -z-0">
                <motion.span
                    style={{ x }}
                    className="text-[25vw] font-black text-white/[0.02] whitespace-nowrap leading-none select-none uppercase"
                >
                    Craft Performance Vision Strategy
                </motion.span>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 md:py-48 lg:py-64 relative z-10">
                {/* Header Spread */}
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 mb-24 md:mb-40">
                    <div className="lg:col-span-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/30 block">Biography / 01</span>
                            <h2 className="text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9] md:leading-[0.85]">
                                Thinking <br />
                                To <span className="text-neutral-700 italic font-serif font-light">Existence.</span>
                            </h2>
                        </motion.div>
                    </div>
                </div>

                {/* Creative Large Image & Text Section */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 md:gap-24 items-center mb-32 md:mb-64">
                    <div className="w-full lg:col-span-5 order-2 lg:order-1">
                        <motion.div
                            initial={{ clipPath: "inset(100% 0 0 0)" }}
                            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[4/5] overflow-hidden rounded-2xl group w-full max-w-lg mx-auto lg:mx-0"
                        >
                            <Image
                                src="/me.png"
                                alt="Louenes Abbas"
                                fill
                                className="object-cover grayscale brightness-50 md:group-hover:grayscale-0 md:group-hover:brightness-100 transition-all duration-1000"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                        </motion.div>
                    </div>
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div className="max-w-xl space-y-8 md:space-y-12">
                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-light leading-tight">
                                I operate at the intersection of <span className="font-bold underline decoration-white/20 underline-offset-4">strategy</span> and <span className="font-bold border-b border-white italic">aesthetic dominance.</span>
                            </h3>
                            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                                From early-stage visioning to global scale execution, I partner with founders who believe that design isn't a cost—it's an unfair advantage.
                            </p>
                            <div className="pt-4 md:pt-8">
                                <motion.button
                                    className="flex items-center gap-4 md:gap-6 text-lg md:text-xl font-bold transition-all border-b border-white pb-2 hover:gap-8 group"
                                >
                                    GET IN TOUCH
                                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Stats: Scrolly Typographic Reveal */}
                <div className="mt-20 md:mt-32">
                    <div className="flex items-center gap-4 mb-12 md:mb-20 text-white/30 uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-xs font-bold">
                        <div className="w-8 md:w-12 h-px bg-white/20" />
                        Proven Metrics
                    </div>
                    <div className="space-y-0">
                        <StatItem
                            number="6+"
                            label="Years of Domain Mastery"
                            detail="Bridging the gap between conceptual art and functional strategy across diverse industries."
                            index={0}
                        />
                        <StatItem
                            number="40+"
                            label="Global Partnerships"
                            detail="Consulting for brands at the forefront of their industries, from Silicon Valley to Dubai."
                            index={1}
                        />
                        <StatItem
                            number="100%"
                            label="Bespoke Execution"
                            detail="No templates. No compromises. Every project is a unique architectural solution."
                            index={3}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
