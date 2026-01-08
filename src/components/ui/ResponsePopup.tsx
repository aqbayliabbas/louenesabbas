'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Printer,
    Calendar,
    DollarSign,
    Clock,
    Target,
    Zap,
    Users,
    Trash2,
    Briefcase,
    Heart,
    Package,
    Compass,
    Sparkles,
    Quote,
    Layers,
    Search
} from 'lucide-react';

interface ResponsePopupProps {
    response: {
        id: string;
        created_at: string;
        company_name: string;
        mission?: string;
        audience?: string;
        values?: string[];
        personality?: Record<string, number>;
        positioning?: Record<string, number>;
        competitors?: string;
        emotion?: string;
        deliverables?: string[];
        touchpoints?: string[];
        design_references?: string;
        timeline?: string;
        budget?: string;
        email?: string;
    } | null;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export default function ResponsePopup({ response, onClose, onDelete }: ResponsePopupProps) {
    if (!response) return null;

    const handlePrint = () => window.print();

    const sections = [
        {
            id: 'genesis',
            title: 'I. Genèse & Vision',
            icon: Target,
            content: [
                { label: 'Mission de Marque', value: response.mission, icon: Zap },
                { label: 'Cible Prioritaire', value: response.audience, icon: Users },
                { label: 'Valeurs Clés', value: response.values, type: 'pills' }
            ]
        },
        {
            id: 'dna',
            title: 'II. ADN & Personnalité',
            icon: Sparkles,
            content: [
                {
                    label: 'Matrice de Personnalité', value: response.personality, type: 'sliders',
                    labels: {
                        personality_mod_aud: ['Modéré', 'Audacieux'],
                        personality_ser_fun: ['Sérieux', 'Ludique'],
                        personality_acc_excl: ['Accessible', 'Exclusif'],
                        personality_min_comp: ['Minimaliste', 'Complexe'],
                        personality_trad_mod: ['Traditionnel', 'Moderne']
                    }
                },
                { label: 'Émotion Recherchée', value: response.emotion, icon: Heart }
            ]
        },
        {
            id: 'market',
            title: 'III. Positionnement & Marché',
            icon: Compass,
            content: [
                {
                    label: 'Axe de Positionnement', value: response.positioning, type: 'sliders',
                    labels: {
                        pos_luxury: ['Prestigieux', 'Abordable'],
                        pos_niche: ['Spécialisé', 'Généraliste'],
                        pos_emotion: ['Émotionnel', 'Rationnel']
                    }
                },
                { label: 'Paysage Concurrentiel', value: response.competitors, icon: Briefcase }
            ]
        },
        {
            id: 'execution',
            title: 'IV. Exécution & Livrables',
            icon: Package,
            content: [
                { label: 'Livrables Attendus', value: response.deliverables, type: 'pills' },
                { label: 'Points de Contact', value: response.touchpoints, type: 'tags' },
                { label: 'Inspirations & Style', value: response.design_references, icon: Quote }
            ]
        },
        {
            id: 'logistics',
            title: 'V. Paramètres du Projet',
            icon: Layers,
            content: [
                { label: 'Enveloppe Budgétaire', value: response.budget, icon: DollarSign },
                { label: 'Calendrier Idéal', value: response.timeline, icon: Clock },
                { label: 'Date de Transmission', value: new Date(response.created_at).toLocaleDateString(), icon: Calendar }
            ]
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                {/* Immersive Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-0 print:hidden"
                />

                {/* Detailed Intelligence Report */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl h-[90vh] bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] z-10 overflow-hidden flex flex-col print:h-auto print:rounded-none print:shadow-none"
                >
                    {/* Sticky Header: Dossier Identity */}
                    <div className="flex items-center justify-between p-8 md:px-12 bg-white border-b border-neutral-100 z-50 print:hidden">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-black italic">L</div>
                                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-neutral-400">Intelligence Report No. {response.id.slice(0, 8)}</span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight mt-1">{response.company_name}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrint}
                                className="group flex items-center gap-2 px-6 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl text-xs font-bold transition-all border border-neutral-100"
                            >
                                <Printer size={16} className="group-hover:rotate-12 transition-transform" />
                                <span>Exporter PDF</span>
                            </button>
                            {onDelete && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Action irréversible. Confirmer la suppression ?')) {
                                            onDelete(response.id);
                                        }
                                    }}
                                    className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl transition-all border border-red-100/50"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-3 bg-neutral-900 hover:bg-black text-white rounded-2xl transition-all shadow-xl"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Audit Feed */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-20 custom-scrollbar print:overflow-visible print:px-0">
                        {/* Print Only Header */}
                        <div className="hidden print:block border-b-4 border-black pb-10 mb-16">
                            <h1 className="text-6xl font-black tracking-tighter uppercase">{response.company_name}</h1>
                            <p className="text-xl font-medium text-neutral-500 mt-2">Dossier Stratégique • Rapport d'Audit Complet</p>
                        </div>

                        {sections.map((section, sIdx) => (
                            <motion.section
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: sIdx * 0.1 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="p-3 bg-black text-white rounded-xl shadow-lg">
                                            <section.icon size={20} />
                                        </div>
                                        <h3 className="text-xl font-black tracking-tighter uppercase">{section.title}</h3>
                                    </div>
                                    <div className="h-px flex-1 bg-neutral-100" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pl-4 border-l-2 border-neutral-50">
                                    {section.content.map((item: any, i) => (
                                        <div key={item.label} className={`space-y-6 ${item.type === 'sliders' ? 'md:col-span-2' : ''}`}>
                                            <div className="flex items-center gap-3 text-neutral-400">
                                                {item.icon && <item.icon size={14} />}
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                            </div>

                                            {item.type === 'sliders' ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                                                    {Object.entries(item.value || {}).map(([key, value]: [string, any]) => {
                                                        const pair = item.labels[key] || [key, ''];
                                                        return (
                                                            <div key={key} className="space-y-4 p-6 bg-neutral-50 rounded-[1.5rem] border border-neutral-100 group hover:border-black/10 transition-colors">
                                                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest leading-none">
                                                                    <span className={value < 50 ? 'text-black' : 'text-neutral-300'}>{pair[0]}</span>
                                                                    <span className={value >= 50 ? 'text-black' : 'text-neutral-300'}>{pair[1]}</span>
                                                                </div>
                                                                <div className="relative h-[2px] bg-neutral-200 rounded-full w-full">
                                                                    <div
                                                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border-2 border-white shadow-md transition-all duration-700"
                                                                        style={{ left: `${value}%` }}
                                                                    />
                                                                </div>
                                                                <div className="text-center">
                                                                    <span className="text-[10px] font-bold text-neutral-400 italic">{value}%</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : item.type === 'pills' ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.value?.map((v: string) => (
                                                        <span key={v} className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold hover:bg-black hover:text-white transition-all cursor-default">
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : item.type === 'tags' ? (
                                                <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                                                    {item.value?.map((v: string) => (
                                                        <span key={v} className="px-4 py-2 border-2 border-black rounded-full">
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xl font-light leading-relaxed text-neutral-800 break-words">
                                                    {item.value || "Information non consignée."}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        ))}

                        {/* Visual Grand Finale / Footer */}
                        <div className="pt-40 pb-20 text-center relative pointer-events-none select-none print:pt-10">
                            <div className="h-px w-full bg-neutral-50 mb-32" />
                            <p className="text-[5rem] md:text-[8rem] lg:text-[12rem] font-bold text-neutral-50 tracking-[-0.05em] leading-none mb-4">
                                ABBAS
                            </p>
                            <p className="text-[9px] font-black tracking-[1.5em] text-neutral-400 uppercase">STRATEGY & AUDIT SYSTEM</p>

                            <div className="hidden print:block mt-16 text-[8px] font-mono text-neutral-300 text-left">
                                <p>DOC_AUTH: {response.id}</p>
                                <p>SYS_STAMP: {new Date().toISOString()}</p>
                                <p>COPYRIGHT © ABBAS STUDIO. TOUS DROITS RÉSERVÉS.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
                @media print {
                    @page { margin: 1.5cm; }
                    body { background: white !important; }
                    .print-hidden { display: none !important; }
                }
            `}</style>
        </AnimatePresence>
    );
}
