'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';

const steps = [
    {
        number: "01",
        title: "Deep Discovery",
        subtitle: "The Audit Phase",
        description: "I strip away the noise to uncover the raw truth of your brand. We dive deep into your market, competitors, and core values to find your unique 'unfair' advantage.",
    },
    {
        number: "02",
        title: "Strategic Blueprint",
        subtitle: "The Architecture Phase",
        description: "Designing the logical framework that supports your vision. We build a strategic roadmap for growth before a single pixel is moved, ensuring design solves real problems.",
    },
    {
        number: "03",
        title: "Creative Execution",
        subtitle: "The Craft Phase",
        description: "Turning abstract strategy into concrete desire. I build high-end visual systems and digital experiences that command attention through meticulous craftsmanship.",
    },
    {
        number: "04",
        title: "System Delivery",
        subtitle: "The Handover Phase",
        description: "Providing the tools for a flawless launch. I deliver production-ready assets and design systems that scale effortlessly across every touchpoint of your business.",
    }
];

export function Process() {
    const containerRef = useRef(null);
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
                <div className="mb-32 md:mb-48 text-center text-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-8xl font-semibold tracking-tighter leading-none">
                            Our <br className="md:hidden" />
                            <span className="text-neutral-300 italic font-serif font-light">Process.</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Central Vertical Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-neutral-100 -translate-x-1/2" />

                    {/* Progress Line */}
                    <motion.div
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-neutral-900 -translate-x-1/2 origin-top"
                        style={{ scaleY }}
                    />

                    {/* Steps Overlay */}
                    <div className="space-y-32 md:space-y-64 relative">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div key={index} className="relative flex items-center md:justify-center">
                                    {/* Circle Indicator */}
                                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center shadow-xl -translate-x-1/2 md:translate-x-0"
                                        >
                                            <span className="text-[10px] md:text-sm font-black text-black">{step.number}</span>
                                        </motion.div>

                                        {/* Outer Pulse Circle */}
                                        <motion.div
                                            className="absolute w-12 h-12 md:w-20 md:h-20 rounded-full border border-neutral-200 -translate-x-1/2 md:translate-x-0"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        />
                                    </div>

                                    {/* Content Card */}
                                    <div className={`w-full flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            className={`max-w-md ml-16 md:ml-0 ${isEven ? 'md:mr-32 md:text-right' : 'md:ml-32 md:text-left'}`}
                                        >
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 block">
                                                {step.subtitle}
                                            </span>
                                            <h3 className="text-2xl md:text-4xl font-semibold text-neutral-950 mb-6 leading-tight">
                                                {step.title}
                                            </h3>
                                            <p className="text-base md:text-lg text-neutral-500 leading-relaxed font-medium">
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
                <span className="text-[25vw] font-black uppercase rotate-90 origin-center leading-none text-black">STRATEGY</span>
                <span className="text-[25vw] font-black uppercase -rotate-90 origin-center leading-none text-black">CRAFT</span>
            </div>
        </section>
    );
}
