'use client';

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { X, Target, MoveRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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

function PopupContent({ project, isExpanded, setIsExpanded, onClose }: {
    project: Project,
    isExpanded: boolean,
    setIsExpanded: (v: boolean) => void,
    onClose: () => void
}) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: scrollContainerRef });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const headerY = useTransform(scrollYProgress, [0, 0.4], [0, 300]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (scrollTop > 20 && !isExpanded) {
            setIsExpanded(true);
        } else if (scrollTop <= 5 && isExpanded) {
            setIsExpanded(false);
        }
    };

    const scrollSlider = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = window.innerWidth * 0.8;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{
                y: isExpanded ? '0%' : '8vh',
                opacity: 1,
                height: isExpanded ? '100vh' : '92vh',
                borderRadius: isExpanded ? '0px' : '40px 40px 0px 0px'
            }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
                type: 'spring',
                damping: 35,
                stiffness: 250,
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#fafafa] shadow-[0_-20px_80px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
        >
            <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-black z-[120] origin-left"
                style={{ scaleX }}
            />

            {!isExpanded && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-neutral-200 rounded-full z-[110]" />
            )}

            <button
                onClick={onClose}
                className="absolute top-6 md:top-12 right-6 md:right-12 z-[110] p-4 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 bg-black text-white hover:bg-neutral-800 shadow-2xl group"
            >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto scroll-smooth hide-scrollbar relative bg-[#fafafa]"
            >
                {/* Hero Stage */}
                <div className="relative h-[85vh] md:h-screen w-full bg-neutral-100 overflow-hidden">
                    <motion.div
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={project.gallery.main}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </motion.div>

                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#fafafa] via-[#fafafa]/40 to-transparent z-10" />

                    <div className="absolute bottom-16 md:bottom-32 left-8 md:left-24 right-8 md:right-24 z-20 max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 md:mb-12 flex items-center gap-4"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-neutral-400">Case Study</span>
                            <div className="w-12 h-px bg-neutral-200" />
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{project.category}</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-7xl md:text-[14vw] font-bold tracking-[-0.07em] text-black leading-[0.75] mb-4"
                        >
                            {project.title}
                        </motion.h2>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-8 md:px-24">
                    {/* Project Narrative */}
                    <section className="py-32 md:py-48 border-t border-neutral-100">
                        <div className="grid lg:grid-cols-12 gap-16 md:gap-32">
                            <div className="lg:col-span-12 mb-12">
                                <span className="text-[10px] font-black text-neutral-300 tracking-[0.6em] uppercase mb-8 block font-serif italic">The Vision</span>
                                <h3 className="text-4xl md:text-7xl font-bold tracking-tight text-black leading-[1.05] max-w-5xl">
                                    {project.description}
                                </h3>
                            </div>

                            <div className="lg:col-span-7 space-y-24">
                                <div>
                                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                        <div className="w-6 h-[1px] bg-neutral-200" /> Strategic Direction
                                    </h4>
                                    <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light">
                                        {project.strategy}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                        <div className="w-6 h-[1px] bg-neutral-200" /> Creative Execution
                                    </h4>
                                    <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light">
                                        {project.brief}
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="sticky top-24 bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-neutral-50 space-y-16">
                                    <div className="grid grid-cols-2 gap-8">
                                        {[
                                            { l: 'Client', v: project.title },
                                            { l: 'Category', v: project.category },
                                            { l: 'Timeline', v: '12 Weeks' },
                                            { l: 'Role', v: 'Lead Strategy' }
                                        ].map((m, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2">{m.l}</span>
                                                <span className="text-sm font-bold text-black">{m.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-6">Key Deliverables</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.deliverables.map((d, i) => (
                                                <span key={i} className="px-5 py-2.5 bg-neutral-50 rounded-full text-xs font-semibold text-neutral-700 border border-neutral-100">{d}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Gallery Section */}
                    <section className="py-32 md:py-64 overflow-visible">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
                            <h3 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.8]">
                                Visual <br />
                                <span className="italic font-serif font-light text-neutral-300">Immersion.</span>
                            </h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => scrollSlider('left')}
                                    className="p-5 rounded-full border border-neutral-200 hover:bg-black hover:text-white transition-all duration-500"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => scrollSlider('right')}
                                    className="p-5 rounded-full border border-neutral-200 hover:bg-black hover:text-white transition-all duration-500"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={sliderRef}
                            className="flex overflow-x-auto gap-8 md:gap-16 pb-12 cursor-grab active:cursor-grabbing hide-scrollbar snap-x snap-mandatory"
                        >
                            {project.gallery.secondary.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex-none w-[90vw] md:w-[70vw] lg:w-[55vw] aspect-[4/5] md:aspect-[16/10] relative rounded-[3rem] md:rounded-[5rem] overflow-hidden bg-white snap-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] group"
                                >
                                    <Image
                                        src={img}
                                        alt={`Detail ${idx + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                                        sizes="(max-width: 768px) 90vw, 70vw"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-1000" />
                                    <div className="absolute top-12 left-12">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Details / 0{idx + 1}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Final Word */}
                    <section className="pb-32 md:pb-64">
                        <div className="relative bg-[#0a0a0a] text-white rounded-[4rem] md:rounded-[8rem] p-12 md:p-32 overflow-hidden">
                            <div className="max-w-4xl relative z-10">
                                <span className="text-[10px] font-black text-white/30 tracking-[0.6em] uppercase mb-16 block font-serif italic">Key Insight</span>
                                <p className="text-4xl md:text-7xl font-bold tracking-tight leading-[1] mb-20">
                                    "Architecture is not just building; it's the <span className="italic font-serif font-light text-white/40">art of living</span> captured in time."
                                </p>
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-[1px] bg-white/20" />
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold tracking-tight">Louenes Abbas</span>
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">Creative Director</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-1/2 -right-1/4 w-full aspect-square bg-radial-gradient from-white/10 to-transparent blur-3xl opacity-50" />
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
}

export default function ProjectPopup({ project, isOpen, onClose }: ProjectPopupProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsExpanded(false);
        } else {
            document.body.style.overflow = 'unset';
            setIsExpanded(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-2xl z-[100]"
                    />
                    <PopupContent
                        project={project}
                        isExpanded={isExpanded}
                        setIsExpanded={setIsExpanded}
                        onClose={onClose}
                    />
                </>
            )}
        </AnimatePresence>
    );
}
