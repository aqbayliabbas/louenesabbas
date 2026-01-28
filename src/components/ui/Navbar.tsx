'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function Navbar({ forceDark = false }: { forceDark?: boolean }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 left-0 w-full z-50 px-6 flex justify-center">
            <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-5xl backdrop-blur-xl border rounded-full px-2 py-2 flex justify-between items-center shadow-2xl transition-colors duration-500
                    ${forceDark
                        ? 'bg-black/70 border-white/10 text-white'
                        : 'bg-white/70 border-white/20 text-black'
                    }`}
            >
                {/* Avatar / Logo */}
                <Link href="/" className="flex items-center gap-2 pl-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-100">
                        <Image
                            src="/me.png"
                            alt="Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-black pl-1">
                        Louenes Abbas
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/consultation"
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${forceDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
                    >
                        Free Consultation
                    </Link>

                    <Link
                        href="/questionnaire"
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${forceDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
                    >
                        Questionnaire
                    </Link>

                    {/* Tools Dropdown */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                    >
                        <button
                            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors outline-none ${forceDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
                        >
                            Tools
                            <ChevronDown size={12} className={`transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isToolsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 py-2 w-48 rounded-2xl shadow-xl border overflow-hidden ${forceDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-100'}`}
                                >
                                    <Link
                                        href="/tools/colorizo"
                                        className={`block px-6 py-3 text-[10px] font-bold transition-colors uppercase tracking-widest ${forceDark ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'}`}
                                    >
                                        Colorizo
                                    </Link>
                                    <Link
                                        href="/tools/typology"
                                        className={`block px-6 py-3 text-[10px] font-bold transition-colors uppercase tracking-widest ${forceDark ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'}`}
                                    >
                                        Typology
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/questionnaire"
                        className={`hidden md:block px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] ${forceDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
                    >
                        Work with me
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        className={`md:hidden p-2 ${forceDark ? 'text-white' : 'text-neutral-600'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="md:hidden absolute bottom-20 left-6 right-6 p-6 bg-white/90 backdrop-blur-2xl rounded-3xl border border-neutral-100 shadow-2xl z-40"
                    >
                        <div className="flex flex-col gap-6 items-center">
                            <Link href="/consultation" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">Free Consultation</Link>
                            <Link href="/questionnaire" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">Questionnaire</Link>
                            <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">Tools</Link>
                            <Link
                                href="/questionnaire"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full py-4 bg-black text-white text-center rounded-2xl font-black uppercase tracking-widest text-[10px]"
                            >
                                Work with me
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
