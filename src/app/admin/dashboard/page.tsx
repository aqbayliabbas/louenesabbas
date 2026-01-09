'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalResponses: 0,
        averageBudget: 0,
        newToday: 0,
        completionRate: 85, // Placeholder
    });
    const [recentResponses, setRecentResponses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch all responses for stats
            const { data: responses, error } = await supabase
                .from('responses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (responses) {
                calculateStats(responses);
                setRecentResponses(responses.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (responses: any[]) => {
        const total = responses.length;
        const today = new Date().toISOString().split('T')[0];
        const newToday = responses.filter(r => r.created_at.split('T')[0] === today).length;

        // Try to parse budgets
        let totalBudget = 0;
        let countWithBudget = 0;
        responses.forEach(r => {
            if (r.budget) {
                const match = r.budget.match(/\d+/g);
                if (match) {
                    const avg = match.reduce((a: number, b: string) => a + parseInt(b), 0) / match.length;
                    totalBudget += avg;
                    countWithBudget++;
                }
            }
        });

        setStats({
            totalResponses: total,
            averageBudget: countWithBudget > 0 ? Math.round(totalBudget / countWithBudget) : 0,
            newToday: newToday,
            completionRate: 85,
        });
    };

    useEffect(() => {
        fetchData();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('dashboard-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'responses'
                },
                (payload) => {
                    console.log('Real-time update received:', payload);
                    if (payload.eventType === 'INSERT') {
                        // Refresh data or update state directly
                        fetchData();
                    } else if (payload.eventType === 'DELETE') {
                        fetchData();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const kpis = [
        {
            label: 'Total Prospects',
            value: stats.totalResponses,
            icon: Users,
            trend: '+12%',
            trendUp: true,
            color: 'bg-blue-500'
        },
        {
            label: 'Budget Moyen',
            value: `${stats.averageBudget.toLocaleString()} DZA`,
            icon: DollarSign,
            trend: '+5.4%',
            trendUp: true,
            color: 'bg-emerald-500'
        },
        {
            label: 'Nouveaux (Aujourd\'hui)',
            value: stats.newToday,
            icon: Zap,
            trend: stats.newToday > 0 ? 'Live' : 'Calm',
            trendUp: stats.newToday > 0,
            color: 'bg-amber-500'
        },
        {
            label: 'Taux de Remplissage',
            value: `${stats.completionRate}%`,
            icon: TrendingUp,
            trend: '+2.1%',
            trendUp: true,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <header>
                <h1 className="text-6xl font-black tracking-[-0.04em] leading-none text-black">Tableau de Bord</h1>
                <p className="text-neutral-400 font-medium text-lg mt-4 max-w-xl leading-relaxed">
                    Performance globale et insights stratégiques en temps réel.
                </p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm animate-pulse">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-neutral-100 rounded-2xl" />
                                <div className="h-4 w-12 bg-neutral-50 rounded-lg" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 w-20 bg-neutral-50 rounded-lg" />
                                <div className="h-8 w-32 bg-neutral-100 rounded-lg" />
                            </div>
                        </div>
                    ))
                ) : (
                    kpis.map((kpi, i) => (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${kpi.color} text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                                    <kpi.icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-black ${kpi.trendUp ? 'text-emerald-500' : 'text-neutral-400'}`}>
                                    {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {kpi.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-2">{kpi.label}</p>
                                <h3 className="text-3xl font-black tracking-tight text-black">{kpi.value}</h3>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

        </div>
    );
}
