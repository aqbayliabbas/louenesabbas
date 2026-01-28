'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';


export function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], [100, -300]);

    return (
        <section id="about" data-nav-dark ref={containerRef} className="relative bg-[#050505] text-white overflow-hidden">
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
                                The Art of <br />
                                <span className="text-neutral-700 italic font-serif font-light">Execution.</span>
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
                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-light leading-tight text-white/90">
                                You don&apos;t just get a new look. <br />
                                <span className="font-bold border-b-2 border-white/20">You get an unfair business advantage.</span>
                            </h3>
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light">
                                You will get a high-converter brand that actually makes sense for your bottom line. Beyond aesthetics, you get strategic clarity and a visual identity tailored to pull in exactly the right audience.
                            </p>
                            <div className="pt-4 md:pt-8">
                                <motion.button
                                    onClick={() => window.open('https://wa.me/213799739969', '_blank')}
                                    className="flex items-center gap-4 md:gap-6 text-lg md:text-xl font-bold transition-all border-b border-white pb-2 hover:gap-8 group"
                                >
                                    START A PROJECT
                                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Stats: Modern Typographic Grid */}
                <div className="mt-32 md:mt-64 border-t border-white/10 pt-20 md:pt-32">
                    <div className="flex items-center gap-4 mb-20 text-white/30 uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold">
                        <div className="w-12 h-px bg-white/20" />
                        By the numbers
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <h3 className="text-8xl md:text-[8vw] font-black tracking-tighter text-white leading-none">6yr+</h3>
                            <div className="space-y-4">
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-white/40">In the trenches</p>
                                <p className="text-lg font-light text-white/50 leading-relaxed">
                                    A journey from self-taught enthusiast to a precision specialist in brand design and development.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="space-y-8"
                        >
                            <h3 className="text-8xl md:text-[8vw] font-black tracking-tighter text-white leading-none">40+</h3>
                            <div className="space-y-4">
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-white/40">Happy Founders</p>
                                <p className="text-lg font-light text-white/50 leading-relaxed">
                                    Collaborating with businesses worldwide to solve complex visual and technical problems.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <h3 className="text-8xl md:text-[8vw] font-black tracking-tighter text-white leading-none">100%</h3>
                            <div className="space-y-4">
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-white/40">Dedication</p>
                                <p className="text-lg font-light text-white/50 leading-relaxed">
                                    I don&apos;t juggle 50 clients. I work on a few projects at a time to ensure total, absolute focus.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
