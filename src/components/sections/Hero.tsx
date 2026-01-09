'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden bg-white pt-24">
      {/* Subtle Grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />

      <div className="max-w-[1600px] w-full mx-auto relative z-10 text-center">
        {/* Massive Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <h1 className="text-[15vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] font-black tracking-[-0.04em] text-black">
            Thinking
          </h1>
          <h1 className="text-[15vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-[-0.02em] text-neutral-400 font-serif italic font-light">
            To life.
          </h1>
        </motion.div>

        {/* Bottom Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-10"
        >
          <p className="text-base md:text-lg text-neutral-500 max-w-md leading-relaxed font-light">
            I build brands that refuse to be ignored. Bridging the gap between silence and noise with strategic precision.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full bg-black text-white font-medium text-sm hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              Explore Projects
            </button>
            <button
              onClick={() => window.open('https://wa.me/213799739969', '_blank')}
              className="px-8 py-4 rounded-full border border-neutral-200 bg-white text-black font-medium text-sm hover:bg-neutral-50 transition-all active:scale-95"
            >
              Get in Touch
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modern Vignette */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none z-20" />
    </section>
  );
}
