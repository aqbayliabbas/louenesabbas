'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
    const [isDarkSection, setIsDarkSection] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Find all sections with data-nav-dark
            const darkSections = document.querySelectorAll('[data-nav-dark]');
            const scrollY = window.scrollY;
            const navHeight = 40; // Approx height where the logo sits

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
    }, []);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 w-full z-50 py-6 px-6"
        >
            <div className="max-w-[1400px] mx-auto flex justify-center items-center">
                <Link
                    href="/"
                    className={`text-xs font-bold tracking-[0.3em] uppercase transition-all duration-500 ${isDarkSection ? 'text-white' : 'text-black'
                        } hover:opacity-50`}
                >
                    Louenes Abbas
                </Link>
            </div>
        </motion.nav>
    );
}
