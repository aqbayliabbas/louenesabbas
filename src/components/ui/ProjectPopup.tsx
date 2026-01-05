'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Layout, Zap, Target, Palette } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface Project {
    title: string;
    category: string;
    color: string;
    img: string; // Preview image
    description: string;
    gallery: {
        main: string;
        secondary: string[];
    };
    brief: string;
    strategy: string;
    deliverables: string[];
}

interface ProjectPopupProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectPopup({ project, isOpen, onClose }: ProjectPopupProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsExpanded(false); // Reset expansion state when opening
        } else {
            document.body.style.overflow = 'unset';
            setIsExpanded(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        // If user scrolls down more than 20px, expand to full screen
        if (scrollTop > 20 && !isExpanded) {
            setIsExpanded(true);
        } else if (scrollTop <= 5 && isExpanded) {
            setIsExpanded(false);
        }
    };

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    />

                    {/* Popup Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{
                            y: isExpanded ? '0%' : '8vh',
                            height: isExpanded ? '100vh' : '92vh',
                            borderRadius: isExpanded ? '0px' : '32px 32px 0px 0px'
                        }}
                        exit={{ y: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                            borderRadius: { duration: 0.2 }
                        }}
                        className="fixed bottom-0 left-0 right-0 z-[101] bg-white shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Decorative Handle - only visible when not expanded */}
                        {!isExpanded && (
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full z-[110]" />
                        )}

                        {/* Close button - Using mix-blend-mode for dynamic contrast against any background */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-[110] p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 bg-white mix-blend-difference group"
                        >
                            <X className="w-5 h-5 text-black group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* Scrollable Content */}
                        <div
                            onScroll={handleScroll}
                            className="h-full overflow-y-auto scroll-smooth hide-scrollbar relative"
                        >
                            {/* Sticky Header Visual (Optional) */}
                            <div className="relative h-[60vh] w-full">
                                <img
                                    src={project.gallery.main}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
                                <div className="absolute bottom-12 left-12 right-12">
                                    <motion.span
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm font-bold tracking-[0.2em] uppercase text-black/60 mb-2 block"
                                    >
                                        {project.category}
                                    </motion.span>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-6xl md:text-8xl font-bold tracking-tighter text-black"
                                    >
                                        {project.title}
                                    </motion.h2>
                                </div>
                            </div>

                            <div className="max-w-7xl mx-auto px-6 py-20 md:px-12">
                                {/* Introduction */}
                                <div className="grid lg:grid-cols-12 gap-12 mb-32">
                                    <div className="lg:col-span-8">
                                        <h3 className="text-3xl font-medium mb-8 text-black/40">The Story</h3>
                                        <p className="text-2xl md:text-3xl font-light text-black leading-[1.4]">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="lg:col-span-4 flex flex-col justify-end">
                                        <div className="h-[2px] w-12 bg-black mb-6" />
                                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
                                            Project Reveal 2024
                                        </p>
                                    </div>
                                </div>

                                {/* Secondary Gallery Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                                    {project.gallery.secondary.slice(0, 2).map((img, idx) => (
                                        <div key={idx} className="aspect-[4/3] rounded-3xl overflow-hidden group bg-muted">
                                            <img
                                                src={img}
                                                alt={`${project.title} details ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                    {project.gallery.secondary.slice(2, 4).map((img, idx) => (
                                        <div key={idx + 2} className="aspect-[4/5] rounded-3xl overflow-hidden group bg-muted">
                                            <img
                                                src={img}
                                                alt={`${project.title} details ${idx + 3}`}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Deep Dive Sections */}
                                <div className="grid md:grid-cols-3 gap-16 mb-32">
                                    <div className="space-y-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white mb-8 transition-transform group-hover:rotate-12">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-2xl font-bold">The Brief</h4>
                                        <p className="text-foreground/70 leading-relaxed text-lg">
                                            {project.brief}
                                        </p>
                                    </div>
                                    <div className="space-y-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white mb-8 transition-transform group-hover:rotate-12 shadow-xl shadow-black/10">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-2xl font-bold">Strategy</h4>
                                        <p className="text-foreground/70 leading-relaxed text-lg">
                                            {project.strategy}
                                        </p>
                                    </div>
                                    <div className="space-y-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white mb-8 transition-transform group-hover:rotate-12">
                                            <Palette className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-2xl font-bold">Concept</h4>
                                        <p className="text-foreground/70 leading-relaxed text-lg">
                                            Merging architectural precision with organic fluidness to create a visual language that speaks beyond trends.
                                        </p>
                                    </div>
                                </div>

                                {/* Deliverables & Footer Image */}
                                <div className="bg-black text-white p-12 md:p-20 rounded-[40px] overflow-hidden relative">
                                    <div className="relative z-10 grid lg:grid-cols-2 gap-16">
                                        <div>
                                            <h3 className="text-4xl font-bold mb-12">Deliverables</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                                {project.deliverables.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 text-lg text-white/70 group py-2">
                                                        <div className="w-2 h-2 rounded-full bg-white transition-all group-hover:w-4" />
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="p-8 border border-white/10 rounded-3xl backdrop-blur-md">
                                                <p className="text-xl font-light italic leading-relaxed text-white/80">
                                                    "The transformation wasn't just visual; it was fundamental. The brand now breathes the same air as the leaders in its industry."
                                                </p>
                                                <div className="mt-6 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/20" />
                                                    <div>
                                                        <p className="font-bold">Creative Director</p>
                                                        <p className="text-sm text-white/40">Collaborative Review</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Abstract background blobs for premium feel */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
                                </div>
                            </div>

                            {/* Footer Space */}
                            <div className="h-20" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
