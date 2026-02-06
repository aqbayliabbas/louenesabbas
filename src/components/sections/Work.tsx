'use client';

import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const projects = [
    { title: "Client: Vanèlla", img: "/vanella.png", category: "Packaging Design" },
    { title: "Client: Valgrand", img: "/valgrand.png", category: "Identity Strategy" },
    { title: "Client: Bliss", img: "/diolata.png", category: "Digital Experience" },
    { title: "Client: Vitalys Pro", img: "/vitalyspro.png", category: "Brand Ecosystem" },
    { title: "Client: Aurora Labs", img: "/boxes.png", category: "Digital Innovation" },
    { title: "Client: Diolata", img: "/cirum.png", category: "Visual Arts" },
    { title: "Client: Vanèlla", img: "/sac GM.png", category: "Product Design" },
    { title: "Client: Valgrand", img: "/valgrand 01.png", category: "Strategic Direction" },
];

const MarqueeRow = ({ items, direction = 1, speed = 30 }: { items: any[], direction?: 1 | -1, speed?: number }) => {
    // Duplicate items enough times to ensure seamless looping on any screen
    const duplicatedItems = [...items, ...items, ...items, ...items, ...items, ...items];

    return (
        <div className="flex overflow-hidden py-4 select-none group">
            <motion.div
                animate={{
                    x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
                className="flex gap-4 md:gap-10 whitespace-nowrap min-w-full"
            >
                {duplicatedItems.map((item, idx) => (
                    <div
                        key={`${item.title}-${idx}`}
                        className="group/card relative w-[280px] md:w-[650px] shrink-0 aspect-[16/10] bg-neutral-100 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5"
                    >
                        <Image
                            src={item.img}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover/card:scale-110"
                            sizes="(max-w-768px) 280px, 650px"
                            priority={idx < 8}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end translate-y-4 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-500 ease-out">
                            <span className="text-white/70 text-[10px] md:text-sm font-medium tracking-widest uppercase mb-2">
                                {item.category}
                            </span>
                            <h3 className="text-white text-xl md:text-4xl font-bold">
                                {item.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export function Work() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) return null;

    // Split projects into two groups for the two rows
    const topRowProjects = projects.slice(0, Math.ceil(projects.length / 2));
    const bottomRowProjects = projects.slice(Math.ceil(projects.length / 2));

    // Responsive speeds: lower duration = faster movement
    // Mobile needs much lower duration because the total width is smaller, 
    // and we want it to feel "faster" visually.
    const topSpeed = isMobile ? 12 : 25;
    const bottomSpeed = isMobile ? 15 : 30;

    return (
        <section id="work" className="relative bg-[#FAFAFA] py-24 md:py-48 overflow-hidden flex flex-col justify-center">
            {/* Background Narrative Label */}
            <div className="absolute top-12 left-6 md:top-24 md:left-24 z-10">
                <span className="text-neutral-200 text-[15vw] md:text-[10vw] font-bold leading-none select-none pointer-events-none opacity-40">
                    WORKS
                </span>
            </div>

            {/* Horizontal Marquee Container */}
            <div className="relative w-full flex flex-col gap-6 md:gap-12 z-20">
                <MarqueeRow items={topRowProjects} direction={1} speed={topSpeed} />
                <MarqueeRow items={bottomRowProjects} direction={-1} speed={bottomSpeed} />
            </div>

            {/* Aesthetic Side Fades */}
            <div className="absolute inset-y-0 left-0 w-20 md:w-80 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent z-30 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-80 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent z-30 pointer-events-none" />

            {/* Bottom Label for Mobile/UX */}
            <div className="mt-12 text-center">
                <span className="text-neutral-400 text-[10px] md:text-sm font-medium uppercase tracking-[0.2em]">
                    ( Slide to explore )
                </span>
            </div>
        </section>
    );
}
