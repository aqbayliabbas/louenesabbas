'use client';

import { motion } from 'framer-motion';
import {
    Users,
    MessageSquare,
    TrendingUp,
    Clock,
    ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
    const stats = [
        { label: 'Réponses totales', value: '0', icon: MessageSquare, change: '0%' },
        { label: 'Visiteurs uniques', value: '0', icon: Users, change: '0%' },
        { label: 'Taux de Conversion', value: '0%', icon: TrendingUp, change: '0%' },
        { label: 'Étape moyenne', value: '0 / 15', icon: Clock, change: '0%' },
    ];

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-4xl font-bold tracking-tighter">Tableau de bord</h1>
                <p className="text-neutral-500 font-light mt-2">Bienvenue dans votre espace de gestion, Louenes.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm group hover:shadow-xl transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-neutral-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                                    <Icon size={24} />
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold tracking-tighter">{stat.value}</h3>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold tracking-tighter">Réponses récentes</h3>
                        <button className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Voir tout <ArrowUpRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        <p className="text-neutral-400 text-center py-12 font-light italic">
                            Aucune réponse pour le moment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
