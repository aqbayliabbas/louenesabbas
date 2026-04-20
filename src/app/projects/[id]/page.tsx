'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Navbar } from '@/components/ui/Navbar';
import { PROJECTS } from '@/data/projects';
import { ArrowLeft, Calendar, Tag, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const project = PROJECTS.find(p => p.id === params.id);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold mb-6">Projet introuvable</h1>
                <Link href="/projects" className="px-8 py-3 bg-black text-white rounded-[5px] font-bold">
                    Retour aux projets
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

            {/* Sticky Return Button */}
            <div className="fixed top-24 md:top-32 left-4 md:left-[10%] z-50">
                <Link
                    href="/projects"
                    className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-[5px] text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Retour
                </Link>
            </div>

            {/* Header Content */}
            <header className="pt-52 pb-24 px-6 md:px-[10%] w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[1800px] mx-auto"
                >
                    <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-12">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-[5px] bg-neutral-900 text-white w-fit shadow-lg shadow-neutral-200">
                            <span className="text-[10px] font-bold uppercase tracking-widest">{project.industry}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            <Calendar size={12} />
                            {project.date}
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-[10vw] font-bold tracking-tighter leading-[0.85] mb-24 text-neutral-950">
                        {project.title}
                    </h1>

                    <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 md:gap-32 items-start border-t border-neutral-100 pt-20">
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-3">
                                    <Briefcase size={14} /> Le Défi
                                </h3>
                                <p className="text-2xl md:text-4xl text-neutral-900 font-medium leading-tight tracking-tight">
                                    {project.brief}
                                </p>
                            </div>
                            
                            <div className="pt-10 border-t border-neutral-50">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Service</span>
                                        <span className="text-sm font-bold">{project.industry}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Année</span>
                                        <span className="text-sm font-bold">{project.date.split(' ')[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                            className="relative aspect-[16/11] rounded-[5px] overflow-hidden shadow-2xl shadow-neutral-200 bg-neutral-50"
                        >
                            <Image
                                src={project.cover}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </header>

            {/* Bento Grid Gallery */}
            <section className="px-6 md:px-[10%] w-full pb-48">
                <div className="max-w-[1800px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        {project.gallery.slice(0, 8).map((img, idx) => {
                            const isFullWidth = (idx === 0 || idx === 3 || idx === 6 || idx === 7);

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className={`relative overflow-hidden rounded-[5px] bg-neutral-50 shadow-2xl shadow-neutral-100 ${isFullWidth ? 'aspect-[16/10] md:col-span-2' : 'aspect-[4/5] md:col-span-1'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Detail ${idx}`}
                                        fill
                                        className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
                                    />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Next Project / Bottom Navigation */}
                    <div className="mt-48 pt-24 border-t border-neutral-100 flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-12">Continuer l&apos;exploration</span>
                        <Link
                            href="/projects"
                            className="group flex flex-col items-center gap-8 text-center"
                        >
                            <div className="text-4xl md:text-8xl font-bold tracking-tighter text-neutral-900 group-hover:text-black transition-all">
                                Tous les Projets
                            </div>
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500">
                                <ArrowLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
