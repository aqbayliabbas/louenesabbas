'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import ProjectPopup, { Project } from '../ui/ProjectPopup';

const projects: Project[] = [
    {
        title: "Lumina",
        category: "Brand Strategy",
        color: "#0f172a",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        description: "Redefining the future of smart home illumination. We stripped back the technical jargon to focus on the emotional impact of light.",
        gallery: {
            main: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564",
            secondary: [
                "https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=2670",
                "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=2670",
                "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2670",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670"
            ]
        },
        brief: "The smart home market was saturated with tech-first brands. Lumina needed to pivot from a luxury gadget to an essential emotional companion for the home.",
        strategy: "We focused on 'Circadian Harmony'—creating a visual identity that mimics the transition of natural light throughout the day, using soft gradients and minimalist typography.",
        deliverables: ["Brand Identity", "Visual Language", "Mobile App UI", "Packaging Design", "Marketing Strategy"]
    },
    {
        title: "Apex",
        category: "Visual Identity",
        color: "#171717",
        img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
        description: "A bold, monolithic identity for a venture capital firm that invests in the impossible. Strength through absolute simplicity.",
        gallery: {
            main: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670",
            secondary: [
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2670",
                "https://images.unsplash.com/photo-1504384308090-c89e12bf9a51?q=80&w=2670",
                "https://images.unsplash.com/photo-1449156001935-d2863fb72690?q=80&w=2670"
            ]
        },
        brief: "Apex wanted to shed the traditional 'suit and tie' VC look and embrace a futuristic, architectural presence that felt both stable and infinitely scalable.",
        strategy: "Monolithic structures and brutalist typography. We designed an identity system based on geometric perfect forms that can adapt from micro-icons to building facades.",
        deliverables: ["Logo System", "Typography", "Office Wayfinding", "Investor Portal", "Brand Guidelines"]
    },
    {
        title: "Mono",
        category: "Web Design",
        color: "#262626",
        img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
        description: "An e-commerce experience driven by utility. We removed all friction, creating a seamless path from discovery to acquisition.",
        gallery: {
            main: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670",
            secondary: [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2670",
                "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2670",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670",
                "https://images.unsplash.com/photo-1526170315870-ef68a6f3dd39?q=80&w=2670"
            ]
        },
        brief: "Mono is a curated lifestyle store. The challenge was to create a digital home that felt as tangible and high-quality as the products they sell.",
        strategy: "Maximum whitespace and high-fidelity animations. We implemented a 'frictionless checkout' flow and a product-first navigation system that highlights craftsmanship.",
        deliverables: ["E-commerce UX/UI", "Platform Strategy", "Custom Animations", "Social Campaign", "Copywriting"]
    },
    {
        title: "Flow",
        category: "Mobile App",
        color: "#000000",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
        description: "Meditation for the modern mind. A fluid, organic interface that calms the user before they even begin the practice.",
        gallery: {
            main: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670",
            secondary: [
                "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2670",
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2670",
                "https://images.unsplash.com/photo-1510894347713-fc3ad6cb0322?q=80&w=2670",
                "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?q=80&w=2670"
            ]
        },
        brief: "Flow wanted to disrupt the cluttered meditation app space. They needed an experience that actually felt like meditation, not a management tool.",
        strategy: "Genreative audio-visual landscapes. We designed an interface based on liquid motion that reacts to the user's touch and breathing patterns.",
        deliverables: ["Product Design", "Interactive Prototypes", "Sound Identity", "Web Landing Page", "Iconography"]
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
                        <img
                            src={project.img}
                            alt={project.title}
                            className="w-full h-full object-cover"
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
                                range={[index * 0.25, 1]}
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
