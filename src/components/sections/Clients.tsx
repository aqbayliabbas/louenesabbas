'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const logos = [
    "/logos/logo1.svg",
    "/logos/logo2.svg",
    "/logos/logo3.svg",
    "/logos/logo4.svg",
    "/logos/logo5.svg",
];

export function Clients() {
    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden">
            {/* Full-width text label */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: '-50%' }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="flex whitespace-nowrap"
                >
                    {Array(10).fill(null).map((_, i) => (
                        <span key={i} className="text-[20vw] font-black tracking-tighter text-neutral-50 leading-none mx-8">
                            COLLAB •
                        </span>
                    ))}
                </motion.div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                {/* Simple centered grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-neutral-400 block mb-4">
                        Current & Past Partnerships
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-neutral-950">
                        Trusted by ambitious founders.
                    </h2>
                </motion.div>

                {/* Logo Grid */}
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                    {logos.map((logo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="relative h-10 w-28 md:h-12 md:w-36 grayscale opacity-20 transition-all duration-500"
                        >
                            <div className="bg-neutral-100 h-full w-full rounded" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
