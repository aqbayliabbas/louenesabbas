'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-6 overflow-hidden">
            <div className="relative max-w-[1400px] w-full text-center">
                {/* Large Background 404 text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-50 font-black text-[20vw] md:text-[30vw] select-none pointer-events-none z-0 tracking-tighter opacity-70">
                    404
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-neutral-900 text-white w-fit mx-auto mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Erreur de navigation</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-tight">
                            Page Introuvable
                        </h1>
                        
                        <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                            Il semble que cette page ait pris un autre chemin. Nous pourrions être en train de réorganiser nos nouveaux projets.
                        </p>

                        <div className="pt-10">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-[5px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/20"
                            >
                                <ArrowLeft size={14} />
                                Retour à l'accueil
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
