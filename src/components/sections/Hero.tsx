'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden bg-gradient-to-br from-white to-neutral-300">
      {/* Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Animated Background Blobs (Monochrome) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] bg-neutral-400/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -60, 0],
            x: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -left-[20%] w-[60vw] h-[60vw] bg-neutral-300/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-[1400px] w-full z-10 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[13vw] leading-[0.8] font-bold tracking-tighter text-black select-none">
            Thinking <br />
            <span className="font-serif italic font-light text-black/80">To life.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12"
        >
          <p className="text-xl text-black/50 max-w-sm text-center md:text-left leading-relaxed">
            I build brands that refuse to be ignored. Bridging the gap between silence and noise with strategic precision.
          </p>
          <div className="h-px w-12 bg-black/20 hidden md:block" />
          <div className="flex gap-4">
            <button className="px-8 py-4 rounded-full bg-black text-white font-medium hover:scale-105 transition-transform active:scale-95">
              View Work
            </button>
            <button className="px-8 py-4 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm font-medium hover:bg-black/5 transition-colors active:scale-95">
              Contact Me
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
