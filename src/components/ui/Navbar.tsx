'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export function Navbar({ forceDark: initialForceDark = false, hideLinks = false }: { forceDark?: boolean, hideLinks?: boolean }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [showProjectsTooltip, setShowProjectsTooltip] = useState(false);
    const [forceDark, setForceDark] = useState(initialForceDark);
    
    useEffect(() => {
        const checkTheme = () => {
            const darkElement = document.querySelector('[data-nav-dark]');
            setForceDark(initialForceDark || !!darkElement);
        };

        checkTheme();
        const interval = setInterval(checkTheme, 500);
        return () => clearInterval(interval);
    }, [initialForceDark]);

    return (
        <div className="fixed top-8 left-0 w-full z-[100] px-6 flex justify-center">

            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-[1400px] backdrop-blur-xl border rounded-[5px] px-4 py-2 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-colors duration-500 pointer-events-auto
                    ${forceDark
                        ? 'bg-black/80 border-white/10 text-white'
                        : 'bg-white/80 border-neutral-200/50 text-black'
                    }`}
            >
                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 pl-2"
                >
                    <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${forceDark ? 'text-white' : 'text-neutral-900'}`}>
                        Louenes Abbas
                    </span>
                </Link>

                {!hideLinks && (
                    <>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-4 md:gap-8">
                            <Link
                                href="/consultation"
                                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${forceDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
                            >
                                Consultation Gratuite
                            </Link>

                            <div 
                                className="relative group"
                                onMouseEnter={() => setShowProjectsTooltip(true)}
                                onMouseLeave={() => setShowProjectsTooltip(false)}
                            >
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-widest cursor-not-allowed transition-colors ${forceDark ? 'text-neutral-600' : 'text-neutral-400'}`}
                                >
                                    Projets
                                </span>
                                <AnimatePresence>
                                    {showProjectsTooltip && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, x: '-50%' }}
                                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                                            exit={{ opacity: 0, y: -4, x: '-50%' }}
                                            className={`absolute top-full left-1/2 mt-4 px-4 py-2.5 rounded-[5px] border shadow-2xl backdrop-blur-xl whitespace-nowrap pointer-events-none z-[110]
                                                ${forceDark 
                                                    ? 'bg-neutral-900/95 border-white/10 text-white' 
                                                    : 'bg-white/95 border-neutral-200 text-neutral-800'}`}
                                        >
                                            <p className="text-[9px] font-bold uppercase tracking-widest">
                                                nous somme entrain d'ajouter les nouveau projets
                                            </p>
                                            {/* Subtle arrow - flipped to top */}
                                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-l border-t -mb-1
                                                ${forceDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-200'}`} 
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

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
                                    Outils
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isToolsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 py-2 w-48 rounded-[5px] shadow-xl border overflow-hidden ${forceDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-100'}`}
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
                                className={`hidden md:block px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[5px] transition-all hover:scale-[1.02] active:scale-[0.98] ${forceDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
                            >
                                Travailler avec moi
                            </Link>

                            {/* Mobile Toggle */}
                            <button
                                className={`md:hidden p-2 ${forceDark ? 'text-white' : 'text-neutral-600'}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </>
                )}

            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`md:hidden absolute top-20 left-0 right-0 p-8 rounded-[5px] border shadow-2xl z-40 backdrop-blur-2xl
                            ${forceDark
                                ? 'bg-neutral-900/95 border-white/10 text-white'
                                : 'bg-white/95 border-neutral-100 text-black'
                            }`}
                    >
                        <div className="flex flex-col gap-8 items-center">
                            <Link href="/consultation" onClick={() => setIsMobileMenuOpen(false)} className={`text-xs font-bold uppercase tracking-widest ${forceDark ? 'text-white/70' : 'text-neutral-800'}`}>Consultation Gratuite</Link>
                            <div className="flex flex-col items-center gap-1.5 opacity-40">
                                <span className={`text-xs font-bold uppercase tracking-widest ${forceDark ? 'text-white' : 'text-neutral-800'}`}>Projets</span>
                                <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-neutral-500">Mise à jour en cours</span>
                            </div>
                            <Link href="/questionnaire" onClick={() => setIsMobileMenuOpen(false)} className={`text-xs font-bold uppercase tracking-widest ${forceDark ? 'text-white/70' : 'text-neutral-800'}`}>Questionnaire</Link>
                            <Link
                                href="/questionnaire"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`w-full py-4 text-center rounded-[5px] font-black uppercase tracking-widest text-xs transition-transform active:scale-95 shadow-xl
                                    ${forceDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                            >
                                Travailler avec moi
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
