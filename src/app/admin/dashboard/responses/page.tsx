'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MoreHorizontal,
    Eye,
    Trash2,
    Calendar,
    RefreshCw,
    Activity,
    ArrowUpRight,
    Users,
    DollarSign,
    Zap,
    TrendingUp,
    ArrowDownRight
} from 'lucide-react';
import ResponsePopup from '@/components/ui/ResponsePopup';
import DeleteModal from '@/components/ui/DeleteModal';
import { supabase } from '@/lib/supabase';


export default function ResponsesPage() {
    const [responses, setResponses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<any>(null);
    const [responseToDelete, setResponseToDelete] = useState<string | null>(null);

    const [stats, setStats] = useState({
        total: 0,
        average: 0,
        today: 0
    });

    const calculateStats = (data: any[]) => {
        const total = data.length;
        const todayStr = new Date().toISOString().split('T')[0];
        const today = data.filter(r => r.created_at.split('T')[0] === todayStr).length;

        let totalBudget = 0;
        let countWithBudget = 0;
        data.forEach(r => {
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
            total,
            today,
            average: countWithBudget > 0 ? Math.round(totalBudget / countWithBudget) : 0
        });
    };

    const fetchResponses = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('responses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            const resData = data || [];
            setResponses(resData);
            calculateStats(resData);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();

        // Real-time subscription
        const channel = supabase
            .channel('responses-feed')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'responses' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setResponses(prev => {
                            const updated = [payload.new, ...prev];
                            calculateStats(updated);
                            return updated;
                        });
                    } else if (payload.eventType === 'DELETE') {
                        setResponses(prev => {
                            const updated = prev.filter(r => r.id !== payload.old.id);
                            calculateStats(updated);
                            return updated;
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        setResponses(prev => {
                            const updated = prev.map(r => r.id === payload.new.id ? payload.new : r);
                            calculateStats(updated);
                            return updated;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);


    const confirmDelete = async () => {
        if (!responseToDelete) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/responses/${responseToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                setResponses(prev => prev.filter(r => r.id !== responseToDelete));
                setResponseToDelete(null);
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const displayedResponses = responses;

    return (
        <div className="space-y-16 pb-20">
            {/* Editorial Header */}
            <header>
                <h1 className="text-6xl font-black tracking-[-0.04em] leading-none text-black">Renseignements Stratégiques</h1>
                <p className="text-neutral-400 font-medium text-lg mt-4 max-w-xl leading-relaxed">
                    Analyse et gestion des flux d'intelligence collectés via le système d'audit.
                </p>
            </header>

            {/* Intelligence Ledger (Table) */}
            <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden text-black">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-50 text-neutral-300 text-[10px] font-black tracking-[0.3em] uppercase">
                                <th className="px-10 py-8">Entité</th>
                                <th className="px-10 py-8">Chronologie</th>
                                <th className="px-10 py-8 text-center uppercase">Budget</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-neutral-100 rounded-2xl" />
                                                <div className="space-y-2">
                                                    <div className="h-5 w-32 bg-neutral-100 rounded-lg" />
                                                    <div className="h-4 w-48 bg-neutral-50 rounded-lg" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-neutral-100 rounded-lg" />
                                                <div className="h-3 w-16 bg-neutral-50 rounded-lg" />
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 flex justify-center">
                                            <div className="h-8 w-24 bg-neutral-100 rounded-xl" />
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-end gap-3">
                                                <div className="w-10 h-10 bg-neutral-50 rounded-xl" />
                                                <div className="w-10 h-10 bg-neutral-50 rounded-xl" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : responses.length > 0 ? (
                                displayedResponses.map((res, i) => (
                                    <motion.tr
                                        key={res.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group hover:bg-neutral-50/80 transition-all cursor-default"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-sm font-black italic shadow-xl group-hover:rotate-6 transition-transform shrink-0">
                                                    {res.company_name?.[0] || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xl font-bold tracking-tight text-black line-clamp-1">{res.company_name}</p>
                                                    <p className="text-sm text-neutral-400 font-medium truncate">{res.email || 'No identity recorded'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-sm font-bold">
                                                    <Calendar size={14} className="text-neutral-300" />
                                                    {new Date(res.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                                </div>
                                                <span className="text-[10px] text-neutral-300 font-black uppercase mt-1 tracking-widest">Enregistré</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col items-center">
                                                <span className="px-4 py-2 bg-neutral-100 rounded-xl text-xs font-black tracking-tight">{res.budget || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => setSelectedResponse(res)}
                                                    className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm text-black hover:bg-black hover:text-white transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setResponseToDelete(res.id)}
                                                    className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-10 py-32 text-center text-neutral-300 font-medium italic">
                                        Aucun signal détecté dans la base de données.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals & Popups */}
            {selectedResponse && (
                <ResponsePopup
                    response={selectedResponse}
                    onClose={() => setSelectedResponse(null)}
                    onDelete={(id) => {
                        setResponseToDelete(id);
                        setSelectedResponse(null);
                    }}
                />
            )}

            <DeleteModal
                isOpen={!!responseToDelete}
                isLoading={isDeleting}
                onClose={() => setResponseToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
