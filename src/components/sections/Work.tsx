'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import ProjectPopup, { Project } from '../ui/ProjectPopup';

const projects: Project[] = [
    {
        title: "Aurora Labs",
        category: "Brand Identity",
        color: "#0f172a",
        img: "/2.png",
        description: "Architecting the invisible foundations of industry leaders. A high-performance white-label lab where scientific precision meets elite brand development.",
        gallery: {
            main: "/2.png",
            secondary: [
                "/work/aurora/2.png",
                "/work/aurora/3.png",
                "/work/aurora/4.png"
            ]
        },
        brief: "Aurora Labs sought an identity that balanced clinical laboratory excellence with the versatility of a white-label partner. They needed to attract high-end clients who require discretion and uncompromising quality.",
        strategy: "We created a 'Clinical Minimalist' system—an identity that emphasizes transparency, precision, and scalability. The visual language uses a deep interstellar palette and high-contrast typography to signal authority and innovation.",
        deliverables: ["Brand Identity", "Visual Language", "social media posts", "Packaging Design", "Marketing Strategy", "Logo System"]
    },
    {
        title: "Diolata",
        category: "Luxury Beverage",
        color: "#2d1b4d",
        img: "/3.png",
        description: "A botanical revolution in a cup. We crafted a high-fashion beverage identity for the first French-born Ubé ritual—luxury purple powder that transforms daily hydration into an art form.",
        gallery: {
            main: "/3.png",
            secondary: [
                "/work/diolata/2.png",
                "/work/diolata/3.png",
                "/work/diolata/4.png"
            ]
        },
        brief: "Diolata aimed to introduce Ubé to the French elite as a superior, antioxidant-rich alternative to Matcha. The brand required a visual identity that signalled both extreme luxury and a radical, biodegradable approach to packaging and sourcing.",
        strategy: "We curated a 'Botanical Noir' aesthetic—pairing the intense violet hues of the product with sustainable, earthy textures. The brand voice is sophisticated and eco-conscious, ensuring every touchpoint from the biodegradable canister to the digital storefront reflects uncompromising quality.",
        deliverables: ["Brand Identity", "Sustainable Packaging", "Art Direction", "Web Experience", "Print Editorial"]
    },
    {
        title: "Bliss",
        category: "Real Estate Strategy",
        color: "#1c1c1c",
        img: "/4.png",
        description: "Redefining the Toronto skyline. A bespoke real estate collective that treats property as high art, moving beyond transactions to curate architectural legacies.",
        gallery: {
            main: "/4.png",
            secondary: [
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2670",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670",
                "https://images.unsplash.com/photo-1600585154340-be6199f7f009?q=80&w=2670"
            ]
        },
        brief: "The Toronto real estate market was drowning in corporate noise and generic listings. Bliss needed to stand out as a boutique alternative for the city's most discerning architectural enthusiasts.",
        strategy: "We implemented an 'Architectural Curatorship' model. Instead of standard sales tactics, we built a brand around editorial storytelling, using cinematic photography and a minimalist visual language that honors the structure over the sale.",
        deliverables: ["Brand Identity", "Editorial Design", "Market Strategy", "Digital Platform", "Client Experience Design"]
    },
    {
        title: "Vanèlla",
        category: "Cosmetic Strategy",
        color: "#1a1a1a",
        img: "/1.png",
        description: "The soul of the Maghreb, bottled for the modern world. A luxury skincare brand rooted in Algerian botanical heritage and ancient Saharan beauty secrets.",
        gallery: {
            main: "/1.png",
            secondary: [
                "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2670",
                "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=2670",
                "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=2670",
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2670"
            ]
        },
        brief: "Vanèlla sought to elevate traditional Algerian beauty rituals into a global luxury standard. They needed a brand that felt deeply ancestral yet perfectly at home in a Parisian boutique.",
        strategy: "We developed a 'Heritage Modernism' framework—combining minimalist typography with intricate, subtly embossed patterns inspired by Berber craftsmanship. The visual narrative focuses on the raw purity of the ingredients sourced from the Atlas Mountains.",
        deliverables: ["Brand Identity", "Packaging Design", "Art Direction", "Product Photography", "Visual Strategy"]
    }
];

const Card = ({
    i,
    project,
    progress,
    range,
    targetScale,
    onOpen
}: {
    i: number;
    project: Project;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
    onOpen: (project: Project) => void;
}) => {

    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    // Entrance scale
    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

    // Stacking exit scale
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                onClick={() => onOpen(project)}
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className="relative flex flex-col w-[1000px] h-[70vh] rounded-3xl overflow-hidden shadow-2xl origin-top cursor-pointer group"
            >
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
                    <motion.div style={{ scale: imageScale }} className="w-full h-full">
                        <Image
                            src={project.img}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1000px) 100vw, 1000px"
                            priority={i === 0}
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                        <h3 className="text-5xl font-bold tracking-tighter transition-transform duration-500 group-hover:translate-x-2">{project.title}</h3>
                        <span className="border border-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-md">
                            {project.category}
                        </span>
                    </div>

                    <div>
                        <p className="text-white/80 max-w-md text-lg leading-relaxed mb-8 transition-opacity duration-500 group-hover:text-white">
                            {project.description}
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-all flex items-center gap-2 group/btn"
                            >
                                View Case Study
                                <div className="w-0 group-hover/btn:w-5 overflow-hidden transition-all duration-300 flex items-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export function Work() {
    const container = useRef(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    const handleOpenProject = (project: Project) => {
        setSelectedProject(project);
        setIsPopupOpen(true);
    };

    return (
        <section ref={container} className="relative bg-background">
            <div className="max-w-[1200px] mx-auto pb-[20vh]"> {/* Extra padding at bottom for scroll space */}
                <div className="py-24 px-6 text-center md:text-left">
                    <h2 className="text-6xl md:text-8xl font-semibold -tracking-[0.03em] mb-4">Selected Work.</h2>
                    <p className="text-xl text-muted-foreground max-w-xl">
                        A selection of projects that define my approach to brand building.
                    </p>
                </div>

                <div className="px-6">
                    {projects.map((project, index) => {
                        // Calculate range for each card to scale down
                        const targetScale = 1 - ((projects.length - index) * 0.05);
                        return (
                            <Card
                                key={index}
                                i={index}
                                project={project}
                                progress={scrollYProgress}
                                range={[index * 0.25, 1] as [number, number]}
                                targetScale={targetScale}
                                onOpen={handleOpenProject}
                            />
                        )
                    })}
                </div>
            </div>

            <ProjectPopup
                project={selectedProject}
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
        </section>
    );
}

