'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    ScrollText,
    Eye,
    Trash2,
    Calendar,
    CheckCircle,
    Printer,
    X,
    PenTool,
    FileText,
    GripVertical
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DeleteModal from '@/components/ui/DeleteModal';

interface ContractClause {
    id?: string;
    contract_id?: string;
    title: string;
    content: string;
    order_index: number;
}

interface Contract {
    id: string;
    contract_number: string;
    client_name: string;
    client_email: string;
    client_address: string;
    project_name: string;
    service_scope: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';
    created_at: string;
    clauses?: ContractClause[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    draft: { label: 'Brouillon', color: 'bg-neutral-100 text-neutral-600' },
    sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-700' },
    signed: { label: 'Signé', color: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Terminé', color: 'bg-neutral-900 text-white' },
    cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700' }
};

export default function ContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [contractToDelete, setContractToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_address: '',
        project_name: '',
        service_scope: '',
        start_date: '',
        end_date: '',
        total_amount: '',
    });

    // Clauses state
    const [clauses, setClauses] = useState<ContractClause[]>([]);

    const fetchContracts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('contracts')
                .select(`
                    *,
                    clauses:contract_clauses(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Sort clauses by order_index
            const contractsWithSortedClauses = (data || []).map(contract => ({
                ...contract,
                clauses: contract.clauses?.sort((a: ContractClause, b: ContractClause) => a.order_index - b.order_index) || []
            }));

            setContracts(contractsWithSortedClauses);
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();

        const channel = supabase
            .channel('contracts-feed')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'contracts' },
                () => fetchContracts()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Insert contract first
            const { data: contractData, error: contractError } = await supabase
                .from('contracts')
                .insert([{
                    client_name: formData.client_name,
                    client_email: formData.client_email || null,
                    client_address: formData.client_address || null,
                    project_name: formData.project_name,
                    service_scope: formData.service_scope,
                    start_date: formData.start_date || null,
                    end_date: formData.end_date || null,
                    total_amount: parseFloat(formData.total_amount),
                    status: 'draft'
                }])
                .select()
                .single();

            if (contractError) throw contractError;

            // Insert clauses if any
            if (clauses.length > 0 && contractData) {
                const clausesToInsert = clauses.map((clause, index) => ({
                    contract_id: contractData.id,
                    title: clause.title,
                    content: clause.content,
                    order_index: index
                }));

                const { error: clausesError } = await supabase
                    .from('contract_clauses')
                    .insert(clausesToInsert);

                if (clausesError) throw clausesError;
            }

            setShowForm(false);
            setFormData({
                client_name: '',
                client_email: '',
                client_address: '',
                project_name: '',
                service_scope: '',
                start_date: '',
                end_date: '',
                total_amount: '',
            });
            setClauses([]);
            fetchContracts();
        } catch (error) {
            console.error('Failed to create contract:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const addClause = () => {
        setClauses([...clauses, { title: '', content: '', order_index: clauses.length }]);
    };

    const updateClause = (index: number, field: 'title' | 'content', value: string) => {
        const newClauses = [...clauses];
        newClauses[index] = { ...newClauses[index], [field]: value };
        setClauses(newClauses);
    };

    const removeClause = (index: number) => {
        setClauses(clauses.filter((_, i) => i !== index));
    };

    const handleDelete = async () => {
        if (!contractToDelete) return;
        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from('contracts')
                .delete()
                .eq('id', contractToDelete);

            if (error) throw error;
            setContractToDelete(null);
            fetchContracts();
        } catch (error) {
            console.error('Failed to delete contract:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusUpdate = async (contractId: string, status: string) => {
        try {
            const { error } = await supabase
                .from('contracts')
                .update({
                    status,
                    signed_date: status === 'signed' ? new Date().toISOString() : null
                })
                .eq('id', contractId);

            if (error) throw error;
            fetchContracts();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-none text-black">Contrats</h1>
                    <p className="text-neutral-400 font-medium text-lg mt-4 max-w-xl leading-relaxed">
                        Création et gestion des contrats clients sécurisés.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-all shadow-xl self-start"
                >
                    <Plus size={18} />
                    Nouveau Contrat
                </button>
            </header>

            {/* Contracts Table */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-50 text-neutral-300 text-[10px] font-black tracking-[0.3em] uppercase">
                                <th className="px-6 md:px-10 py-6 md:py-8">Réf</th>
                                <th className="px-6 md:px-10 py-6 md:py-8">Client</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 hidden md:table-cell">Projet</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-center">Montant Global</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-center">Statut</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 md:px-10 py-8">
                                            <div className="h-6 bg-neutral-100 rounded-lg w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : contracts.length > 0 ? (
                                contracts.map((contract, i) => (
                                    <motion.tr
                                        key={contract.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group hover:bg-neutral-50/80 transition-all"
                                    >
                                        <td className="px-6 md:px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                                                    <ScrollText size={16} />
                                                </div>
                                                <span className="font-bold text-sm">{contract.contract_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-6">
                                            <p className="font-bold text-black">{contract.client_name}</p>
                                            <p className="text-xs text-neutral-400">{contract.client_email}</p>
                                        </td>
                                        <td className="px-6 md:px-10 py-6 hidden md:table-cell">
                                            <span className="text-sm font-medium">{contract.project_name}</span>
                                        </td>
                                        <td className="px-6 md:px-10 py-6 text-center">
                                            <span className="font-black text-lg">{Number(contract.total_amount).toLocaleString()}</span>
                                            <span className="text-xs text-neutral-400 ml-1">DZD</span>
                                        </td>
                                        <td className="px-6 md:px-10 py-6 text-center">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${STATUS_LABELS[contract.status]?.color}`}>
                                                {STATUS_LABELS[contract.status]?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 md:px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedContract(contract)}
                                                    className="p-3 bg-white border border-neutral-100 rounded-xl shadow-sm text-black hover:bg-black hover:text-white transition-all"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setContractToDelete(contract.id)}
                                                    className="p-3 bg-white border border-neutral-100 rounded-xl shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-10 py-32 text-center text-neutral-300 font-medium italic">
                                        Aucun contrat créé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Contract Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="text-2xl font-black tracking-tight">Nouveau Contrat</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                {/* Client Info */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Client</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nom du client / Entreprise *"
                                            required
                                            value={formData.client_name}
                                            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                            className="px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={formData.client_email}
                                            onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                                            className="px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Adresse Complète"
                                            value={formData.client_address}
                                            onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                                            className="px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium md:col-span-2"
                                        />
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Projet</h3>
                                    <input
                                        type="text"
                                        placeholder="Nom du Projet *"
                                        required
                                        value={formData.project_name}
                                        onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                    />
                                    <textarea
                                        placeholder="Portée du service (Détails de la mission) *"
                                        required
                                        rows={4}
                                        value={formData.service_scope}
                                        onChange={(e) => setFormData({ ...formData, service_scope: e.target.value })}
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium resize-none"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Date de début</label>
                                            <input
                                                type="date"
                                                value={formData.start_date}
                                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Date de fin (est.)</label>
                                            <input
                                                type="date"
                                                value={formData.end_date}
                                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Financial */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Financier</h3>
                                    <input
                                        type="number"
                                        placeholder="Montant Global (DZD) *"
                                        required
                                        min="0"
                                        value={formData.total_amount}
                                        onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                    />
                                </div>

                                {/* Custom Clauses */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Clauses Personnalisées</h3>
                                        <button
                                            type="button"
                                            onClick={addClause}
                                            className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-bold transition-all"
                                        >
                                            <Plus size={14} />
                                            Ajouter Clause
                                        </button>
                                    </div>

                                    {clauses.length === 0 ? (
                                        <p className="text-xs text-neutral-400 bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-center">
                                            Aucune clause personnalisée. Les clauses standards (Propriété intellectuelle, confidentialité, etc.) seront automatiquement incluses.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {clauses.map((clause, index) => (
                                                <div key={index} className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-neutral-400">
                                                            <GripVertical size={14} />
                                                            <span className="text-xs font-bold">Clause {index + 1}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeClause(index)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Titre de la clause *"
                                                        value={clause.title}
                                                        onChange={(e) => updateClause(index, 'title', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white rounded-lg border border-neutral-200 focus:border-black focus:outline-none transition-all font-bold text-sm"
                                                    />
                                                    <textarea
                                                        placeholder="Contenu de la clause *"
                                                        rows={3}
                                                        value={clause.content}
                                                        onChange={(e) => updateClause(index, 'content', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white rounded-lg border border-neutral-200 focus:border-black focus:outline-none transition-all text-sm resize-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-xs text-neutral-500 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                        Note: Le contrat inclura automatiquement les clauses standards (Propriété intellectuelle, confidentialité, etc.) ainsi que l'échéancier de paiement 50/25/25.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-neutral-800 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? 'Génération...' : 'Générer le Contrat'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contract View/Print Modal */}
            <AnimatePresence>
                {selectedContract && (
                    <ContractViewer
                        contract={selectedContract}
                        onClose={() => setSelectedContract(null)}
                        onStatusUpdate={handleStatusUpdate}
                    />
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={!!contractToDelete}
                isLoading={isDeleting}
                onClose={() => setContractToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}

function ContractViewer({ contract, onClose, onStatusUpdate }: { contract: Contract, onClose: () => void, onStatusUpdate: (id: string, status: string) => void }) {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Contrat ${contract.contract_number}</title>
                <style>
                    body { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #000; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 60px; padding-bottom: 20px; border-bottom: 2px solid #000; }
                    .brand { font-size: 11px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; }
                    h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 40px; text-align: center; }
                    h2 { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                    p, li { font-size: 12px; margin-bottom: 10px; text-align: justify; }
                    ul { padding-left: 20px; }
                    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
                    .party-title { font-size: 10px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #666; margin-bottom: 10px; }
                    .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 80px; page-break-inside: avoid; }
                    .signature-box { height: 100px; border: 1px solid #ddd; margin-top: 10px; background: #fff; }
                    @media print { body { padding: 20px; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="brand">Louenes Abbas</div>
                        <div style="font-size: 10px; color: #666; margin-top: 5px;">Brand Strategist & Designer</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 900;">CONTRAT DE PRESTATION</div>
                        <div style="font-size: 12px;">Réf: ${contract.contract_number}</div>
                    </div>
                </div>

                <div class="parties">
                    <div>
                        <div class="party-title">Le Prestataire</div>
                        <p><strong>Louenes Abbas</strong><br>Brand Strategist & Designer</p>
                    </div>
                    <div>
                        <div class="party-title">Le Client</div>
                        <p><strong>${contract.client_name}</strong><br>${contract.client_address || ''}<br>${contract.client_email || ''}</p>
                    </div>
                </div>

                <h1>Accord de Service & Conditions</h1>

                <h2>1. Objet du Contrat</h2>
                <p>Ce contrat définit les termes selon lesquels le Prestataire s'engage à réaliser la mission suivante pour le Client : <strong>${contract.project_name}</strong>.</p>
                <p><strong>Portée du service :</strong><br>${contract.service_scope.replace(/\n/g, '<br>')}</p>

                <h2>2. Modalités Financières</h2>
                <p>Le montant total de la prestation est fixé à : <strong>${Number(contract.total_amount).toLocaleString()} DZD</strong>.</p>
                <p>Le paiement s'effectuera selon l'échéancier suivant :</p>
                <ul>
                    <li><strong>50% à la commande (Acompte) :</strong> ${(Number(contract.total_amount) * 0.5).toLocaleString()} DZD</li>
                    <li><strong>25% à la validation finale :</strong> ${(Number(contract.total_amount) * 0.25).toLocaleString()} DZD</li>
                    <li><strong>25% à la livraison des fichiers :</strong> ${(Number(contract.total_amount) * 0.25).toLocaleString()} DZD</li>
                </ul>

                <h2>3. Propriété Intellectuelle</h2>
                <p>Le Prestataire conserve la propriété exclusive de toutes les créations jusqu'au paiement intégral de la facture. Dès réception du paiement complet, le Prestataire cède au Client l'ensemble des droits d'exploitation (reproduction, représentation, adaptation) sur les créations validées, pour la durée légale des droits d'auteur et pour le monde entier.</p>
                <p>Le Prestataire conserve la propriété morale de ses créations.</p>

                <h2>4. Engagements et Confidentialité</h2>
                <p>Le Prestataire s'engage à exécuter la mission avec soin et professionnalisme. Les deux parties s'engagent à conserver confidentielles toutes les informations et documents échangés dans le cadre de ce projet, pendant et après la durée du contrat.</p>

                <h2>5. Droit de Publicité et Portfolio</h2>
                <p>Sauf mention contraire explicite du Client, le Prestataire se réserve le droit d’inclure les réalisations issues de ce projet dans son portfolio professionnel (site web, réseaux sociaux, présentations), à titre de référence.</p>

                <h2>6. Délais</h2>
                <p>Le projet débutera le <strong>${contract.start_date ? new Date(contract.start_date).toLocaleDateString('fr-FR') : '____'}</strong> et est estimé pour se terminer le <strong>${contract.end_date ? new Date(contract.end_date).toLocaleDateString('fr-FR') : '____'}</strong>, sous réserve de la réactivité du Client dans les validations.</p>

                <h2>7. Résiliation</h2>
                <p>En cas d'annulation du projet par le Client après signature, l'acompte de 50% reste acquis au Prestataire à titre d'indemnité. Tout travail supplémentaire déjà réalisé sera facturé au prorata.</p>

                ${contract.clauses && contract.clauses.length > 0 ? contract.clauses.map((clause, index) => `
                <h2>${8 + index}. ${clause.title}</h2>
                <p>${clause.content.replace(/\n/g, '<br>')}</p>
                `).join('') : ''}

                <div class="signature-section">
                    <div>
                        <div class="party-title">Pour le Client</div>
                        <p style="font-size: 10px;">Lu et approuvé, Bon pour accord</p>
                        <div class="signature-box"></div>
                    </div>
                    <div>
                        <div class="party-title">Pour le Prestataire</div>
                        <p style="font-size: 10px;">Louenes Abbas</p>
                        <div class="signature-box" style="background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-family: cursive; font-size: 20px;">L.Abbas</div>
                    </div>
                </div>
                
                <div style="margin-top: 40px; font-size: 10px; color: #999; text-align: center;">
                    Fait le ${new Date().toLocaleDateString('fr-FR')} | Ce document est valide juridiquement.
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{contract.project_name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_LABELS[contract.status]?.color}`}>
                                {STATUS_LABELS[contract.status]?.label}
                            </span>
                            <span className="text-neutral-400 text-sm">| {contract.contract_number}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {contract.status === 'draft' && (
                            <button
                                onClick={() => onStatusUpdate(contract.id, 'sent')}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-200 transition-all flex items-center gap-2"
                            >
                                <CheckCircle size={14} /> Marquer Envoyé
                            </button>
                        )}
                        {contract.status === 'sent' && (
                            <button
                                onClick={() => onStatusUpdate(contract.id, 'signed')}
                                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-200 transition-all flex items-center gap-2"
                            >
                                <PenTool size={14} /> Marquer Signé
                            </button>
                        )}
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all"
                        >
                            <Printer size={16} />
                            Imprimer / PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-12 space-y-10 max-w-3xl mx-auto font-serif">
                    {/* Preview Content - Simplified Version of Print */}
                    <div className="text-center border-b-2 border-black pb-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em]">Contrat de Prestation</h3>
                        <p className="text-4xl font-black mt-4 uppercase tracking-tighter">{contract.project_name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 bg-neutral-50 p-8 rounded-2xl">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">Prestataire</p>
                            <p className="font-bold">Louenes Abbas</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">Client</p>
                            <p className="font-bold">{contract.client_name}</p>
                            <p className="text-sm text-neutral-500">{contract.client_address}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h4 className="font-bold text-lg mb-2">1. Objet</h4>
                            <p className="text-neutral-600 leading-relaxed text-sm bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                {contract.service_scope}
                            </p>
                        </section>

                        <section>
                            <h4 className="font-bold text-lg mb-2">2. Conditions Financières</h4>
                            <p className="text-neutral-600 text-sm">Montant total: <span className="font-bold text-black">{Number(contract.total_amount).toLocaleString()} DZD</span></p>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-neutral-500">
                                <li>50% Acompte</li>
                                <li>25% Validation</li>
                                <li>25% Livraison</li>
                            </ul>
                        </section>

                        <section>
                            <h4 className="font-bold text-lg mb-2">3. Clauses Légales</h4>
                            <div className="text-xs text-neutral-400 italic">
                                Le document imprimé inclura automatiquement les articles complets sur la Propriété Intellectuelle, la Confidentialité, le Droit de Publicité et les Conditions de Résiliation.
                            </div>
                        </section>

                        {/* Custom Clauses */}
                        {contract.clauses && contract.clauses.length > 0 && (
                            <section>
                                <h4 className="font-bold text-lg mb-4">Clauses Personnalisées</h4>
                                <div className="space-y-4">
                                    {contract.clauses.map((clause, index) => (
                                        <div key={clause.id || index} className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText size={14} className="text-neutral-400" />
                                                <h5 className="font-bold text-sm">{clause.title}</h5>
                                            </div>
                                            <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                {clause.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

