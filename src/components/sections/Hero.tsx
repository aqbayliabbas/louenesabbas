'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden bg-white">
      {/* High-Contrast Moving Grain (More Obvious) */}
      <motion.div
        animate={{
          x: [0, -20, 10, -5, 20, 0],
          y: [0, 10, -20, 15, -10, 0]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-[-15%] opacity-[0.08] pointer-events-none z-10 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px'
        }}
      />



      <div className="max-w-[1400px] w-full z-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[14vw] leading-[0.75] font-black tracking-tighter text-black select-none drop-shadow-sm">
            Thinking <br />
            <span className="font-serif italic font-light text-neutral-500/80">To life.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-20 flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20"
        >
          <p className="text-2xl text-black/60 max-w-sm text-center md:text-left leading-relaxed font-light">
            I build brands that refuse to be ignored. Bridging the gap between silence and noise with strategic precision.
          </p>
          <div className="h-px w-20 bg-black/10 hidden md:block" />
          <div className="flex gap-8">
            <button className="px-12 py-6 rounded-full bg-black text-white font-bold hover:scale-105 transition-all shadow-2xl active:scale-95 text-lg">
              Explore Projects
            </button>
            <button className="px-12 py-6 rounded-full border border-black/20 bg-white/40 backdrop-blur-2xl text-black font-bold hover:bg-black/5 transition-all active:scale-95 text-lg">
              Get in Touch
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modern Vignette */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none z-30" />
    </section>
  );
}
