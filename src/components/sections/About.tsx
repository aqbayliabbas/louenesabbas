'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export function About() {
    return (
        <section id="about" data-nav-dark className="relative bg-neutral-950 text-white py-24 md:py-48 overflow-hidden font-sans">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Section Label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-4 mb-16 md:mb-24"
                >
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
                    {/* Left Column: Image & Direct Message */}
                    <div className="lg:col-span-5 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[4/5] rounded-[5px] overflow-hidden bg-neutral-900 shadow-2xl group"
                        >
                            <Image
                                src="/me.png"
                                alt="Louenes Abbas"
                                fill
                                priority
                                className="object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[5px]" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-10 rounded-[5px] bg-white/[0.03] border border-white/10 backdrop-blur-sm"
                        >
                            <h4 className="text-xl font-medium mb-4 text-white">Storytelling Visuel & Stratégie</h4>
                            <p className="text-white/50 leading-relaxed font-light">
                                Je crois que chaque marque a une âme. Mon travail consiste à mettre cette âme en lumière à travers un design méticuleux et une stratégie basée sur les données.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column: Detailed Content */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight mb-12 text-white"
                        >
                            Transformer votre vision en <br />
                            <span className="text-neutral-500 italic font-serif">croissance</span> mesurable.
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="space-y-8 max-w-xl"
                        >
                            <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                                Vous ne recevez pas seulement un nouveau look. Vous obtenez un <span className="text-white font-medium italic underline underline-offset-8 decoration-white/20">avantage concurrentiel indéniable</span>.
                            </p>

                            <p className="text-lg text-white/50 leading-relaxed font-light">
                                Au-delà de l&apos;esthétique, vous gagnez en clarté stratégique et une identité visuelle conçue pour attirer précisément la bonne audience. Je crée des marques à fort taux de conversion qui servent réellement votre rentabilité.
                            </p>

                            <div className="pt-8">
                                <button
                                    onClick={() => window.open('https://wa.me/213799739969', '_blank')}
                                    className="group inline-flex items-center gap-8 bg-white text-black pl-8 pr-2 py-2 rounded-[5px] text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
                                >
                                    Démarrer un projet
                                    <div className="w-10 h-10 rounded-[5px] bg-black flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-500">
                                        <ArrowUpRight size={18} strokeWidth={2.5} />
                                    </div>
                                </button>
                            </div>
                        </motion.div>

                        {/* Stats Grid - More refined */}
                        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
                            {[
                                { label: 'Expérience', value: '6ans+', desc: 'Savoir-faire moderne' },
                                { label: 'Clients', value: '40+', desc: 'Fondateurs satisfaits' },
                                { label: 'Satisfaction', value: '100%', desc: 'Absolue' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 + (i * 0.1) }}
                                    className="space-y-2"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/30">{stat.label}</span>
                                    <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/40">{stat.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
