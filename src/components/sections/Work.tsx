'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

interface Project {
    title: string;
    category: string;
    color: string;
    img: string;
    logo: string;
    description: string;
    deliverables: string[];
}

const projects: Project[] = [
    {
        title: "Aurora Labs",
        category: "Brand Identity",
        color: "#0f172a",
        img: "/2.png",
        logo: "/logos/projects/aurora.png",
        description: "Architecting the invisible foundations of industry leaders. A high-performance white-label lab where scientific precision meets elite brand development.",
        deliverables: ["Brand Identity", "Visual Language", "Packaging Design", "Marketing Strategy"]
    },
    {
        title: "Diolata",
        category: "Luxury Beverage",
        color: "#2d1b4d",
        img: "/3.png",
        logo: "/logos/projects/diolata.png",
        description: "A botanical revolution in a cup. We crafted a high-fashion beverage identity for the first French-born Ubé ritual.",
        deliverables: ["Brand Identity", "Sustainable Packaging", "Art Direction", "Web Experience"]
    },
    {
        title: "Bliss",
        category: "Real Estate",
        color: "#1c1c1c",
        img: "/4.png",
        logo: "/logos/projects/bliss.png",
        description: "Redefining the Toronto skyline. A bespoke real estate collective that treats property as high art, moving beyond transactions.",
        deliverables: ["Brand Identity", "Editorial Design", "Market Strategy", "Digital Platform"]
    },
    {
        title: "Vanèlla",
        category: "Cosmetic Strategy",
        color: "#1a1a1a",
        img: "/1.png",
        logo: "/logos/projects/vanella.png",
        description: "The soul of the Maghreb, bottled for the modern world. A luxury skincare brand rooted in Algerian botanical heritage.",
        deliverables: ["Brand Identity", "Packaging Design", "Art Direction", "Visual Strategy"]
    },
    {
        title: "Cleansi",
        category: "Tech & Services",
        color: "#111",
        img: "/2.png",
        logo: "/logos/projects/cleansi.png",
        description: "Innovative cleaning solutions for the modern home. A brand built on clarity, efficiency, and environmental consciousness.",
        deliverables: ["Digital Design", "Web Development", "UI/UX Strategy"]
    },
    {
        title: "Goya360",
        category: "Production House",
        color: "#111",
        img: "/3.png",
        logo: "/logos/projects/goya360.png",
        description: "Immersive visual storytelling through 360-degree experiences. Pushing the boundaries of digital production and creative technology.",
        deliverables: ["Art Direction", "Motion Graphics", "Production Strategy"]
    },
    {
        title: "Slamdunk",
        category: "Sports Marketing",
        color: "#111",
        img: "/4.png",
        logo: "/logos/projects/slamdunk.png",
        description: "Empowering athletes to build their digital legacy. A data-driven approach to personal branding and community engagement.",
        deliverables: ["Social Strategy", "Brand Identity", "Content Creation"]
    },
    {
        title: "Valgrand",
        category: "Hospitality Management",
        color: "#111",
        img: "/1.png",
        logo: "/logos/projects/valgrand.png",
        description: "Redefining luxury hospitality through ancestral hospitality meets modern service. A boutique experience for the discerning traveler.",
        deliverables: ["Guest Experience", "Visual Strategy", "Marketing Architecture"]
    }
];

export function Work() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeProject = projects[activeIndex];

    return (
        <section id="work" className="relative bg-[#fafafa] text-neutral-900 py-32 md:py-48 px-6 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <div className="w-12 h-px bg-neutral-200" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400">Selected Archive</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter"
                    >
                        A legacy of <br /><span className="text-neutral-300 italic font-serif">Solutions.</span>
                    </motion.h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Left Side: Interactive List - Forced Scrollable */}
                    <div className="space-y-4 h-auto lg:h-[650px] overflow-y-auto lg:pr-6 scrollbar-thin pb-20">
                        {projects.map((project, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <motion.div
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    layout
                                    className={`relative transition-all duration-700 ease-[0.16,1,0.3,1] overflow-hidden rounded-[2.5rem] border cursor-pointer ${isActive
                                        ? "bg-white border-neutral-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] p-10"
                                        : "bg-transparent border-transparent p-6 md:p-8 hover:bg-black/[0.01]"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-bg"
                                            className="absolute inset-0 bg-white"
                                            style={{ zIndex: -1 }}
                                        />
                                    )}

                                    <div className="flex items-center gap-6 md:gap-8">
                                        <motion.div
                                            layout
                                            className={`relative w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-700 overflow-hidden ${isActive ? "bg-black scale-110 shadow-xl" : "bg-black/5 opacity-40 grayscale"
                                                }`}
                                        >
                                            <Image
                                                src={project.logo}
                                                alt={`${project.title} logo`}
                                                fill
                                                className="object-cover"
                                            />
                                        </motion.div>
                                        <div className="flex-1">
                                            <motion.h3
                                                layout
                                                className={`text-xl md:text-2xl lg:text-3xl font-bold tracking-tight transition-colors duration-700 ${isActive ? "text-black" : "text-neutral-300"
                                                    }`}
                                            >
                                                {project.title}
                                            </motion.h3>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    height: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                                                    opacity: { duration: 0.4, delay: 0.2 }
                                                }}
                                            >
                                                <p className="mt-8 text-neutral-500 text-base md:text-lg lg:text-xl leading-relaxed max-w-lg">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-10">
                                                    {project.deliverables.map((d, i) => (
                                                        <span key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-neutral-100 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-neutral-200">
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right Side: Just Image - Hidden on Mobile */}
                    <div className="hidden lg:block lg:sticky lg:top-32 h-[750px] overflow-hidden rounded-[4rem]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="relative w-full h-full shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)]"
                            >
                                <Image
                                    src={activeProject.img}
                                    alt={activeProject.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-neutral-900/5" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
