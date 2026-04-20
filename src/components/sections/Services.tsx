'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Palette, Share2, Layers, Monitor, ArrowUpRight } from 'lucide-react';

const services = [
    {
        icon: <Share2 className="w-8 h-8" />,
        title: "Stratégie de Marque",
        description: "Obtenez une clarté absolue sur votre message. Je vous aide à trouver la vérité brute de votre marque et à la transformer en un récit qui capte l'attention.",
        tags: ["Positionnement", "Récit Central", "Stratégie de Contenu", "Marché"],
        colSpan: "md:col-span-2",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        icon: <Palette className="w-8 h-8" />,
        title: "Identité Visuelle",
        description: "Bénéficiez d'un langage visuel unique. Je crée des actifs distincts et mémorables qui garantissent la cohérence et l'évolution de votre marque.",
        tags: ["Systèmes de Logo", "Typographie", "Théorie des Couleurs"],
        colSpan: "md:col-span-1",
        gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        icon: <Monitor className="w-8 h-8" />,
        title: "Produits Digitaux",
        description: "Obtenez un site web qui travaille aussi dur que vous. Je conçois une présence digitale haute performance optimisée pour la conversion et la croissance.",
        tags: ["Web Design", "Développement", "Shopify/Webflow"],
        colSpan: "md:col-span-1",
        gradient: "from-orange-500/20 to-red-500/20"
    },
    {
        icon: <Layers className="w-8 h-8" />,
        title: "Direction de Contenu",
        description: "Bénéficiez d'un univers visuel cohérent qui raconte votre histoire parfaitement. Je sélectionne les actifs photo et motion qui renforcent votre marque.",
        tags: ["Direction Créative", "Motion Design", "Systèmes d'Actifs"],
        colSpan: "md:col-span-2",
        gradient: "from-emerald-500/20 to-teal-500/20"
    }
];

function ServiceCard({ service, index }: { service: typeof services[0], index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className={`group relative p-10 rounded-[5px] bg-neutral-900 border border-white/10 ${service.colSpan} flex flex-col justify-between min-h-[350px] overflow-hidden`}
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[5px] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
                }}
            />

            {/* Subtle colored glow based on service type */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-700 ease-in-out`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-white/5 rounded-[5px] text-white group-hover:bg-white/10 transition-colors backdrop-blur-md border border-white/5">
                        {service.icon}
                    </div>
                    <ArrowUpRight className="w-6 h-6 text-white/30 group-hover:text-white transition-colors duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>

                <h3 className="text-3xl font-medium mb-4">{service.title}</h3>
                <p className="text-white/60 leading-relaxed text-lg max-w-md">
                    {service.description}
                </p>
            </div>

            <div className="relative z-10 pt-12 flex flex-wrap gap-2">
                {service.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70 border border-white/10 rounded-[5px] bg-white/5">
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

export function Services() {
    return (
        <section data-nav-dark className="py-32 px-6 bg-[#0a0a0a] text-white">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-24 md:flex justify-between items-end">
                    <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter max-w-2xl leading-[0.95]">
                        Je fais bouger les lignes <br /> par le design.
                    </h2>
                    <p className="mt-6 md:mt-0 text-white/50 max-w-sm text-lg leading-relaxed">
                        Le design ne consiste pas seulement à être beau—il s&apos;agit d&apos;atteindre un objectif. Chaque pixel est une décision stratégique.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
