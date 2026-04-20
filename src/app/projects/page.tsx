'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Navbar } from '@/components/ui/Navbar';
import { PROJECTS } from '@/data/projects';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return null;
}
            {/* Hero Section */}
            <header className="pt-48 pb-24 px-6 md:px-[10%] w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[1400px] mx-auto"
                >
                    <div className="flex items-center gap-3 px-4 py-2 rounded-[5px] bg-neutral-900 text-white w-fit mb-12 shadow-lg shadow-neutral-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Portfolio 2024</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl lg:text-[120px] font-semibold tracking-[-0.05em] leading-[0.9] mb-12 text-neutral-950">
                        Projets <br />
                        <span className="text-neutral-300 italic font-serif font-light">Sélectionnés.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl font-medium leading-relaxed">
                        Une immersion dans des projets où la stratégie rencontre le savoir-faire digital pour créer des identités mémorables.
                    </p>
                </motion.div>
            </header>

            {/* Projects Grid */}
            <section className="px-6 md:px-[10%] w-full pb-32">
                <div className="max-w-[1400px] mx-auto mb-20 md:mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
                        {PROJECTS.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="group"
                            >
                                <Link href={`/projects/${project.id}`} className="block">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] bg-neutral-100 mb-8 shadow-2xl shadow-black/5 transition-all duration-700 group-hover:shadow-black/10">
                                        <Image
                                            src={project.cover}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        {/* Hover Content */}
                                        <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 flex justify-between items-end">
                                            <div className="text-white">
                                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">{project.date}</p>
                                                <p className="text-2xl font-bold tracking-tight">{project.title}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-[5px] bg-white flex items-center justify-center text-black shadow-xl">
                                                <ArrowRight size={22} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-black transition-colors">{project.title}</h3>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 py-1 px-2 border border-neutral-100 rounded-[3px] group-hover:border-neutral-200 transition-colors">
                                                {project.date.split(' ')[1]}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">{project.industry}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
