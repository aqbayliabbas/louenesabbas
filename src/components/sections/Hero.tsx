'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  const [showAlert, setShowAlert] = useState(false);

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <section id="hero" className="min-h-[100svh] bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white pt-24 md:pt-28 px-6 md:px-[10%]">

      {/* Project Lock Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] px-8 py-4 bg-black/95 backdrop-blur-2xl border border-white/20 rounded-[5px] text-white shadow-2xl flex items-center gap-4"
          >
            <div className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              Nous organisons les nouveaux projets
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 py-8 md:py-20 items-stretch relative">
        {/* Left Column: Text Content */}
        <div className="flex flex-col justify-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 px-4 py-2 rounded-[5px] bg-neutral-900 text-white w-fit mb-8 md:mb-10 shadow-lg shadow-neutral-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Disponible pour projets</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-[88px] font-semibold leading-[1.1] md:leading-[1.02] tracking-[-0.05em] text-neutral-950 mb-8 md:mb-10">
              L&apos;excellence digitale complète, de l&apos;onboarding à l&apos;offboarding.
            </h1>
          </motion.div>

          {/* Description adapted from reference image vibe but updated for a brand strategist */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-xl text-neutral-600 mb-10 md:mb-12 max-w-lg leading-relaxed font-medium"
          >
            Je prends en charge vos projets de A à Z : de l&apos;immersion initiale à l&apos;accompagnement final. Ensemble, nous transformons votre vision en une identité de marque puissante et une présence digitale haute performance qui convertit réellement.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 md:gap-5"
          >
            <button
              className="group inline-flex items-center gap-6 md:gap-10 bg-neutral-900 text-white pl-8 md:pl-10 pr-2 py-2 rounded-[5px] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-black hover:scale-[1.02] active:scale-95 shadow-xl shadow-neutral-200"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Travailler avec moi
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-[5px] bg-white flex items-center justify-center text-black group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </div>
            </button>

            <button
              onClick={handleProjectClick}
              className="group inline-flex items-center gap-4 md:gap-5 bg-white text-neutral-900 px-6 md:px-8 py-4 md:py-5 rounded-[5px] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border border-neutral-200 transition-all hover:bg-neutral-50 hover:border-neutral-300 hover:scale-[1.02] active:scale-95"
            >
              Voir les Projets
            </button>
          </motion.div>
        </div>

        {/* Right Column: Visual Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full w-full rounded-[5px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] bg-neutral-100 group min-h-[400px] md:min-h-[500px]"
        >
          <Image
            src="/IMG_5943.png"
            alt="Stratégie digitale stratégique et transformation de marque"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            priority
          />
          {/* Subtle gradient overlay for better contrast on the testimonial */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Testimonial Card Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-4 right-4 left-4 md:left-auto md:bottom-10 md:right-10 bg-white/20 backdrop-blur-2xl border border-white/20 p-4 md:p-8 rounded-[5px] text-white shadow-2xl md:max-w-[340px]"
          >
            <div className="flex gap-1 mb-2 md:mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="white" className="text-white md:w-3 md:h-3" />
              ))}
            </div>
            <p className="text-[13px] md:text-base font-semibold leading-relaxed tracking-tight text-white/95 mb-3 md:mb-6">
              &quot;Louenes a changé la donne pour ma marque. Sa capacité à allier stratégie et design exquis est vraiment inégalée.&quot;
            </p>
            <div className="flex flex-col">
              <span className="text-[11px] md:text-sm font-bold text-white tracking-wide">Athmane Bencheikh</span>
              <span className="text-[9px] uppercase tracking-widest text-white/60 font-medium">Fondateur, Vitalys Pro</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
