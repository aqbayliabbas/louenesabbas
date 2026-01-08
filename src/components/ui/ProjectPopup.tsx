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
            initial={{ y: '100%' }}
            animate={{
                y: isExpanded ? '0%' : '8vh',
                height: isExpanded ? '100vh' : '92vh',
                borderRadius: isExpanded ? '0px' : '40px 40px 0px 0px'
            }}
            exit={{ y: '100%' }}
            transition={{
                type: 'spring',
                damping: 35,
                stiffness: 250,
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white shadow-[0_-20px_80px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
        >
            <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-black z-[120] origin-left"
                style={{ scaleX }}
            />

            {!isExpanded && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-neutral-200 rounded-full z-[110] opacity-50" />
            )}

            <button
                onClick={onClose}
                className="absolute top-8 right-8 z-[110] p-4 rounded-full transition-all duration-500 hover:scale-110 active:scale-90 bg-black text-white hover:bg-neutral-800 shadow-2xl group"
            >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto scroll-smooth hide-scrollbar relative bg-white"
            >
                {/* Hero Stage */}
                <div className="relative h-[90vh] w-full bg-neutral-100 overflow-hidden">
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
                    </motion.div>

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-white via-white/40 to-transparent z-10" />

                    <div className="absolute bottom-24 left-12 right-12 z-20 max-w-7xl mx-auto md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-neutral-400">
                                Case Study — 2024
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-8xl md:text-[13vw] font-bold tracking-[-0.07em] text-black leading-[0.8]"
                        >
                            {project.title}
                        </motion.h2>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-40 md:px-12">
                    {/* Section 01: Narrative */}
                    <section className="mb-48">
                        <div className="grid lg:grid-cols-12 gap-24">
                            <div className="lg:col-span-8">
                                <span className="text-xs font-black text-neutral-400 tracking-[0.4em] uppercase mb-12 block">01 / The Mission</span>
                                <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-16 leading-[1.1]">
                                    {project.description}
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-12 border-t border-neutral-100 pt-16">
                                    <div>
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Strategy</h4>
                                        <p className="text-lg text-neutral-600 leading-relaxed font-light">{project.strategy}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Execution</h4>
                                        <p className="text-lg text-neutral-600 leading-relaxed font-light">{project.brief}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-4 lg:pl-12">
                                <div className="sticky top-12 space-y-12">
                                    <div>
                                        <div className="space-y-6">
                                            {[
                                                { l: 'Category', v: project.category },
                                                { l: 'Timeline', v: '12 Weeks' },
                                                { l: 'Role', v: 'Lead Designer' }
                                            ].map((m, i) => (
                                                <div key={i} className="flex flex-col border-b border-neutral-100 pb-4">
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{m.l}</span>
                                                    <span className="text-sm font-bold">{m.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-8">Deliverables</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.deliverables.map((d, i) => (
                                                <span key={i} className="px-4 py-2 bg-neutral-50 rounded-full text-xs font-medium text-neutral-600 border border-neutral-100">{d}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 02: Horizontal Slider Gallery */}
                    <section className="mb-64 -mx-6 md:-mx-12 lg:-mx-40">
                        <div className="px-6 md:px-12 lg:px-40 flex items-center justify-between mb-16">
                            <h3 className="text-6xl md:text-8xl font-bold tracking-tighter">Gallery.</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => scrollSlider('left')}
                                    className="p-4 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => scrollSlider('right')}
                                    className="p-4 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={sliderRef}
                            className="flex overflow-x-auto gap-8 px-6 md:px-12 lg:px-40 hide-scrollbar scroll-smooth snap-x snap-mandatory"
                        >
                            {project.gallery.secondary.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex-none w-[85vw] md:w-[60vw] lg:w-[45vw] aspect-[4/5] md:aspect-[16/10] relative rounded-[40px] overflow-hidden bg-neutral-100 snap-center shadow-2xl group"
                                >
                                    <Image
                                        src={img}
                                        alt={`Slide ${idx + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        sizes="(max-width: 768px) 85vw, 60vw"
                                    />
                                    <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                                    <div className="absolute bottom-10 left-10 text-white z-20">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Detail / 0{idx + 1}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Section 03: The Outcome */}
                    <section className="pb-40">
                        <div className="relative bg-black text-white rounded-[80px] p-16 md:p-32 overflow-hidden">
                            <div className="max-w-4xl relative z-10">
                                <h4 className="text-[10px] font-black text-neutral-500 tracking-[0.6em] uppercase mb-16 block">03 / Outcome</h4>
                                <p className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-20">
                                    "Transforming digital touchpoints into <span className="italic font-serif font-light text-neutral-400">memorable narratives</span> that speak to the soul."
                                </p>
                                <div className="flex items-center gap-12">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold">Creative Lead Review</span>
                                        <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest mt-1">Founding Director</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-radial-gradient from-neutral-800/20 to-transparent" />
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
