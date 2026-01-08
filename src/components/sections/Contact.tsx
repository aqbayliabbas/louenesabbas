'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Contact() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onMouseMove={handleMouseMove}
                    className="group relative bg-[#0a0a0a] rounded-[3rem] p-12 md:p-24 overflow-hidden text-center text-white shadow-2xl"
                >
                    {/* Spotlight Effect */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-[3rem] opacity-0 transition duration-300 group-hover:opacity-100"
                        style={{
                            background: useMotionTemplate`
                radial-gradient(
                  800px circle at ${mouseX}px ${mouseY}px,
                  rgba(255,255,255,0.06),
                  transparent 80%
                )
              `,
                        }}
                    />

                    {/* Floating Glow (Ambient) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter">
                            Let's start a <br />
                            <span className="text-white/50">Project together.</span>
                        </h2>
                        <p className="text-xl text-white/60 leading-relaxed">
                            Interested in working together? We should queue up a time to chat. I’ll buy the coffee.
                        </p>

                        <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                            <button className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95">
                                <span>hello@louenes.com</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                            <Link
                                href="/questionnaire"
                                className="group relative inline-flex items-center gap-3 bg-transparent border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <span>Start Questionnaire</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="mt-24 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground uppercase tracking-widest font-medium border-t border-border pt-12">
                    <div>
                        © 2024 Louenes Abbas
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                        <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
