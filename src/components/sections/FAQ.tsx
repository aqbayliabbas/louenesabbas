'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const faqs = [
    {
        question: "What is your typical timeline for a branding project?",
        answer: "Most full identity projects take between 4-8 weeks. This allows for deep research, strategy development, and iterative design cycles to ensure the result is perfect."
    },
    {
        question: "Do you offer web development services?",
        answer: "Yes. I specialize in designing and building high-performance websites using technologies like Next.js and Framer. I believe design and code should live under one roof for the best result."
    },
    {
        question: "How do you price your services?",
        answer: "I work on a project-basis. After our initial discovery call, I'll provide a custom proposal tailored to your specific needs and goals. I don't believe in one-size-fits-all pricing."
    },
    {
        question: "What do I need to have ready before we start?",
        answer: "Just a clear idea of your business goals and who your target audience is. I can help clarify the rest during our strategy phase."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section data-nav-dark className="py-32 px-6 bg-foreground text-background">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Common<br />Questions.</h2>
                    <p className="text-white/60 text-lg">
                        Everything you need to know about how we might work together.
                    </p>
                </div>

                <div className="md:col-span-8 space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-white/10 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full py-6 flex justify-between items-center text-left hover:text-white/80 transition-colors"
                            >
                                <span className="text-xl md:text-2xl font-medium pr-8">{faq.question}</span>
                                <motion.span
                                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Plus className="w-6 h-6 text-white/50" />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-lg text-white/50 leading-relaxed pb-8 max-w-2xl">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
