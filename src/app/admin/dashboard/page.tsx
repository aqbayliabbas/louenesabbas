'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Invoice {
    id: string;
    invoice_number: string;
    client_name: string;
    total_amount: number;
    amount_paid: number;
    payment_status: string;
    created_at: string;
}

interface Response {
    id: string;
    company_name: string;
    created_at: string;
}

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalResponses: 0,
        totalRevenue: 0,
        totalPaid: 0,
        pendingInvoices: 0,
        newToday: 0,
    });
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
    const [recentResponses, setRecentResponses] = useState<Response[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch responses
            const { data: responses, error: respError } = await supabase
                .from('responses')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch invoices
            const { data: invoices, error: invError } = await supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });

            if (respError) console.error('Responses error:', respError);
            if (invError) console.error('Invoices error:', invError);

            const responsesData = responses || [];
            const invoicesData = invoices || [];

            // Calculate stats
            const today = new Date().toISOString().split('T')[0];
            const newToday = responsesData.filter(r => r.created_at.split('T')[0] === today).length;

            const totalRevenue = invoicesData.reduce((acc, inv) => acc + Number(inv.total_amount), 0);
            const totalPaid = invoicesData.reduce((acc, inv) => acc + Number(inv.amount_paid), 0);
            const pendingInvoices = invoicesData.filter(inv => inv.payment_status !== 'fully_paid').length;

            setStats({
                totalResponses: responsesData.length,
                totalRevenue,
                totalPaid,
                pendingInvoices,
                newToday,
            });

            setRecentResponses(responsesData.slice(0, 3));
            setRecentInvoices(invoicesData.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Subscribe to real-time updates
        const responsesChannel = supabase
            .channel('dashboard-responses')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'responses' },
                () => fetchData()
            )
            .subscribe();

        const invoicesChannel = supabase
            .channel('dashboard-invoices')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'invoices' },
                () => fetchData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(responsesChannel);
            supabase.removeChannel(invoicesChannel);
        };
    }, []);

    const kpis = [
        {
            label: 'Revenu Total',
            value: `${stats.totalRevenue.toLocaleString()} DZD`,
            icon: DollarSign,
            trend: stats.totalRevenue > 0 ? 'Actif' : 'N/A',
            trendUp: stats.totalRevenue > 0,
            color: 'bg-black'
        },
        {
            label: 'Montant Encaissé',
            value: `${stats.totalPaid.toLocaleString()} DZD`,
            icon: CheckCircle,
            trend: stats.totalPaid > 0 ? `${Math.round((stats.totalPaid / Math.max(stats.totalRevenue, 1)) * 100)}%` : '0%',
            trendUp: stats.totalPaid > 0,
            color: 'bg-emerald-500'
        },
        {
            label: 'Total Prospects',
            value: stats.totalResponses,
            icon: Users,
            trend: stats.newToday > 0 ? `+${stats.newToday} aujourd'hui` : 'Calme',
            trendUp: stats.newToday > 0,
            color: 'bg-blue-500'
        },
        {
            label: 'Factures en Attente',
            value: stats.pendingInvoices,
            icon: FileText,
            trend: stats.pendingInvoices > 0 ? 'À suivre' : 'Tout payé',
            trendUp: stats.pendingInvoices === 0,
            color: 'bg-amber-500'
        }
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <header>
                <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-none text-black">Tableau de Bord</h1>
                <p className="text-neutral-400 font-medium text-lg mt-4 max-w-xl leading-relaxed">
                    Performance globale et insights stratégiques en temps réel.
                </p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 shadow-sm animate-pulse">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-100 rounded-2xl" />
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
                            className="group p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 md:p-4 rounded-2xl ${kpi.color} text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                                    <kpi.icon size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-black ${kpi.trendUp ? 'text-emerald-500' : 'text-neutral-400'}`}>
                                    {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    <span className="hidden sm:inline">{kpi.trend}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-2">{kpi.label}</p>
                                <h3 className="text-xl md:text-3xl font-black tracking-tight text-black">{kpi.value}</h3>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-10 border-b border-neutral-50 flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">Factures Récentes</h2>
                    <Link
                        href="/admin/dashboard/invoices"
                        className="text-xs font-bold text-neutral-400 hover:text-black transition-colors flex items-center gap-1"
                    >
                        Voir tout <ArrowUpRight size={14} />
                    </Link>
                </div>
                <div className="divide-y divide-neutral-50">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-6 md:p-10 animate-pulse flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-neutral-100 rounded-xl" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-neutral-100 rounded" />
                                        <div className="h-3 w-24 bg-neutral-50 rounded" />
                                    </div>
                                </div>
                                <div className="h-5 w-24 bg-neutral-100 rounded" />
                            </div>
                        ))
                    ) : recentInvoices.length > 0 ? (
                        recentInvoices.map((invoice) => (
                            <motion.div
                                key={invoice.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 md:p-10 flex items-center justify-between hover:bg-neutral-50/50 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-black">{invoice.client_name}</p>
                                        <p className="text-xs text-neutral-400">{invoice.invoice_number}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg">{Number(invoice.total_amount).toLocaleString()} DZD</p>
                                    <p className={`text-xs font-bold ${invoice.payment_status === 'fully_paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {invoice.payment_status === 'fully_paid' ? 'Payé' : 'En cours'}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-10 md:p-20 text-center text-neutral-300 font-medium italic">
                            Aucune facture créée.
                            <Link href="/admin/dashboard/invoices" className="block mt-4 text-black font-bold hover:underline">
                                Créer une facture →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

