'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Preloader() {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 10) + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const w = dimension.width;
    const h = dimension.height;

    // A single, deep, smooth rounded curve for a premium liquid feel
    const rounded = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 500} 0 ${h} L0 0`;
    const flat = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;

    const curve: any = {
        initial: {
            d: rounded,
        },
        exit: {
            d: flat,
            transition: {
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
            }
        }
    }

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100vh" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                    className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-10"
                >
                    <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                        {/* Upper Text */}
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] md:text-sm font-bold tracking-[0.5em] uppercase text-neutral-500 mb-4"
                        >
                            Starting your success journey
                        </motion.span>

                        {/* Counter */}
                        <div className="overflow-hidden mb-8">
                            <motion.h1
                                className="text-8xl md:text-[15vw] font-black text-white tracking-tighter leading-none"
                            >
                                {Math.min(progress, 100)}%
                            </motion.h1>
                        </div>

                        {/* Branding */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="h-px w-32 bg-white/20 mb-8"
                            />
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: progress === 100 ? 1 : 0 }}
                                className="text-xs md:text-sm font-black tracking-[0.8em] uppercase text-white"
                            >
                                Louenes Abbas
                            </motion.span>
                        </div>
                    </div>

                    {/* Decorative bottom SVG for liquid effect */}
                    <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-black">
                        <motion.path
                            variants={curve}
                            initial="initial"
                            exit="exit"
                        />
                    </svg>

                    {/* Background decorative elements */}
                    <div className="absolute bottom-10 left-10 overflow-hidden z-10">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-[10px] font-mono text-neutral-800 block"
                        >
                            STRATEGY / DESIGN / CODE
                        </motion.span>
                    </div>
                    <div className="absolute bottom-10 right-10 overflow-hidden z-10">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-[10px] font-mono text-neutral-800 block uppercase"
                        >
                            © 2024 SYSTEM BOOT
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
