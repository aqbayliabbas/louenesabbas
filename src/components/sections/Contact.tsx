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
        <section id="contact" className="py-24 px-6 bg-white">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onMouseMove={handleMouseMove}
                    data-nav-dark
                    className="group relative bg-[#0a0a0a] rounded-[5px] p-12 md:p-24 overflow-hidden text-center text-white shadow-2xl"
                >
                    {/* Spotlight Effect */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-[5px] opacity-0 transition duration-300 group-hover:opacity-100"
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
                            Assez parlé de moi. <br />
                            <span className="text-white/50">Parlons de vous.</span>
                        </h2>
                        <p className="text-xl text-white/60 leading-relaxed font-light">
                            Vous avez une vision que vous voulez concrétiser ? Je suis toujours prêt à discuter de nouveaux défis. J&apos;offre le café (virtuel ou réel).
                        </p>

                        <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => window.open('https://wa.me/213799739969', '_blank')}
                                className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[5px] font-bold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <span>Contactez-moi</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                            <Link
                                href="/questionnaire"
                                className="group relative inline-flex items-center gap-3 bg-transparent border border-white/20 text-white px-10 py-5 rounded-[5px] font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <span>Remplir le questionnaire</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="mt-24 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-neutral-400 uppercase tracking-widest font-medium border-t border-neutral-100 pt-12">
                    <div>
                        © 2026 Louenes Abbas
                    </div>
                    <div className="flex gap-8">
                        <a href="https://www.linkedin.com/in/louenes-abbas-69311a272/" className="hover:text-black transition-colors">LinkedIn</a>
                        <a href="https://www.instagram.com/louenes.abbas/" className="hover:text-black transition-colors">Instagram</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
