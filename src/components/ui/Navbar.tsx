'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Navbar() {
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
                    className="text-xs font-bold tracking-[0.3em] uppercase text-black hover:opacity-50 transition-opacity"
                >
                    Louenes Abbas
                </Link>
            </div>
        </motion.nav>
    );
}
