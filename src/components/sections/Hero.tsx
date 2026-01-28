'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-white">
      <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center relative z-10">

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mb-10 w-full"
        >
          <h1 className="text-3xl md:text-4xl lg:text-[40px] leading-[1.3] font-black tracking-[-0.02em] text-black mb-10 flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 w-full mx-auto">
            {["You", "will", "get", "a"].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-neutral-400 font-serif italic font-light tracking-tight"
            >
              strategic brand
            </motion.span>
            {["that", "turns"].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-neutral-400 font-serif italic font-light tracking-tight"
            >
              your raw vision
            </motion.span>
            {["into", "a"].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-neutral-400 font-serif italic font-light tracking-tight"
            >
              lasting digital legacy.
            </motion.span>
          </h1>

        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-12"
        >
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-black"
          >
            <span className="pb-1 border-b-[1px] border-black/10 group-hover:border-black transition-all">Check my work</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => window.open('https://wa.me/213799739969', '_blank')}
            className="px-12 py-4 bg-black text-white rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95"
          >
            Let&apos;s talk shop
          </button>
        </motion.div>
      </div>
    </section>
  );
}
