'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const steps = [
    {
        number: "01",
        title: "Deep Dive",
        description: "We don't just ask what you do. We interrogate why it matters. Uncovering the raw truth of your business.",
        color: "bg-blue-300",
        img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop"
    },
    {
        number: "02",
        title: "Blueprinting",
        description: "Architecture before decoration. We build the strategic framework that will support your brand's weight.",
        color: "bg-indigo-300",
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop"
    },
    {
        number: "03",
        title: "Visual Synthesis",
        description: "Translating abstract value into concrete desire. This is where strategy puts on a tuxedo.",
        color: "bg-purple-300",
        img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop"
    },
    {
        number: "04",
        title: "Realization",
        description: "The moment of truth. Pixel-perfect execution across every touchpoint. No compromises.",
        color: "bg-fuchsia-300",
        img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=2536&auto=format&fit=crop"
    }
];

export function Process() {
    const [activeStep, setActiveStep] = useState<number | null>(null);

    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto relative z-10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-16">The Process</h2>

                <div className="space-y-4" onMouseLeave={() => setActiveStep(null)}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setActiveStep(index)}
                            className="group border-t border-border py-8 md:py-12 flex flex-col md:flex-row md:items-start gap-6 md:gap-32 cursor-default transition-opacity duration-300"
                            style={{
                                opacity: activeStep !== null && activeStep !== index ? 0.3 : 1
                            }}
                        >
                            <span className="text-xl font-mono text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                {step.number}
                            </span>
                            <div className="flex-1">
                                <h3 className="text-3xl md:text-4xl font-semibold mb-4 group-hover:translate-x-2 transition-transform duration-300">
                                    {step.title}
                                </h3>
                            </div>
                            <div className="flex-1 max-w-md">
                                <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                    <div className="border-t border-border" />
                </div>
            </div>

            {/* Static Image Box replacing floating mouse logic for better performance */}
            <AnimatePresence>
                {activeStep !== null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-10"
                    >
                        <div className="w-[80vw] h-[80vh] relative">
                            <Image
                                src={steps[activeStep].img}
                                alt="Process Background"
                                fill
                                className="object-cover grayscale"
                                sizes="80vw"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
