'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu } from 'lucide-react';

export function Navbar({ forceDark = false }: { forceDark?: boolean }) {
    const [isDarkSection, setIsDarkSection] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // If forceDark is true, we might not need to listen to scroll for color changes, 
        // but keeping it doesn't hurt, just the outcome will be overridden.
        if (forceDark) return;

        const handleScroll = () => {
            const darkSections = document.querySelectorAll('[data-nav-dark]');
            const navHeight = 40;
            let isDark = false;

            darkSections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                const bottom = top + rect.height;

                if (window.scrollY + navHeight >= top && window.scrollY + navHeight <= bottom) {
                    isDark = true;
                }
            });

            setIsDarkSection(isDark);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [forceDark]);

    const effectiveIsDark = forceDark || isDarkSection;
    const textColorClass = effectiveIsDark ? 'text-white' : 'text-black';

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 w-full z-50 py-6 px-6 md:px-12"
        >
            <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link
                    href="/"
                    className={`text-xs font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${textColorClass} hover:opacity-50`}
                >
                    Louenes Abbas
                </Link>

                {/* Desktop Nav */}
                <div className={`hidden md:flex items-center gap-8 ${textColorClass} transition-colors duration-500`}>
                    <Link
                        href="/consultation"
                        className="text-xs font-medium tracking-widest uppercase hover:opacity-50 transition-opacity"
                    >
                        Free Consultation
                    </Link>

                    <Link
                        href="/questionnaire"
                        className="text-xs font-medium tracking-widest uppercase hover:opacity-50 transition-opacity"
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
                            className="flex items-center gap-1 text-xs font-medium tracking-widest uppercase hover:opacity-50 transition-opacity outline-none"
                        >
                            Tools
                            <ChevronDown size={12} className={`transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isToolsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 py-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden"
                                >
                                    <Link
                                        href="/tools/colorizo"
                                        className="block px-6 py-3 text-[10px] font-bold text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors uppercase tracking-widest"
                                    >
                                        Colorizo
                                    </Link>
                                    <Link
                                        href="/tools/typology"
                                        className="block px-6 py-3 text-[10px] font-bold text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors uppercase tracking-widest"
                                    >
                                        Typology
                                    </Link>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* CTA */}
                <div className="hidden md:block">
                    <Link
                        href="/questionnaire"
                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 backdrop-blur-md border ${effectiveIsDark
                            ? 'bg-white text-black border-white hover:bg-white/90'
                            : 'bg-black text-white border-black hover:bg-neutral-800'
                            }`}
                    >
                        Work with me
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden ${textColorClass}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Menu Overlay (Simplified) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            <Link href="/consultation" className="text-sm font-bold uppercase tracking-widest text-black">Free Consultation</Link>
                            <Link href="/questionnaire" className="text-sm font-bold uppercase tracking-widest text-black">Questionnaire</Link>
                            <Link href="/tools" className="text-sm font-bold uppercase tracking-widest text-black">Tools</Link>
                            <Link href="/questionnaire" className="px-6 py-3 bg-black text-white text-center rounded-xl font-bold uppercase tracking-widest text-xs">Work with me</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
