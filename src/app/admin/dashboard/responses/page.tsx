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
    ArrowUpRight
} from 'lucide-react';
import ResponsePopup from '@/components/ui/ResponsePopup';
import DeleteModal from '@/components/ui/DeleteModal';

export default function ResponsesPage() {
    const [responses, setResponses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<any>(null);
    const [responseToDelete, setResponseToDelete] = useState<string | null>(null);

    const fetchResponses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/responses');
            const data = await res.json();
            setResponses(data.responses || []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();
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
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Database.v1</span>
                        <div className="h-px w-12 bg-neutral-200" />
                    </div>
                    <h1 className="text-6xl font-black tracking-[-0.04em] leading-none">Renseignements Stratégiques</h1>
                    <p className="text-neutral-400 font-medium text-lg max-w-xl leading-relaxed">
                        Analyse et gestion des flux d'intelligence collectés via le système d'audit.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchResponses}
                        className="p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
                    >
                        <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                    </button>
                    <button className="flex items-center gap-4 px-8 py-5 bg-black text-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all active:scale-[0.98] font-bold text-sm">
                        Exporter l'Intelligence
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </header>

            {/* Intelligence Ledger (Table) */}
            <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-2xl overflow-hidden text-black">
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
                            {isLoading && responses.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-32 text-center text-neutral-400 italic">
                                    </td>
                                </tr>
                            ) : displayedResponses.length > 0 ? (
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
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
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
                                                <button className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm text-neutral-400 hover:bg-neutral-50 transition-all">
                                                    <MoreHorizontal size={18} />
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
