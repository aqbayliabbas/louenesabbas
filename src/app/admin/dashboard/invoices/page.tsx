'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    FileText,
    Eye,
    Trash2,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Printer,
    X,
    ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DeleteModal from '@/components/ui/DeleteModal';

interface Invoice {
    id: string;
    invoice_number: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    client_address: string;
    service_type: string;
    service_description: string;
    total_amount: number;
    advance_amount: number;
    work_complete_amount: number;
    delivery_amount: number;
    advance_paid: boolean;
    advance_paid_date: string | null;
    work_complete_paid: boolean;
    work_complete_paid_date: string | null;
    delivery_paid: boolean;
    delivery_paid_date: string | null;
    amount_paid: number;
    payment_status: 'pending' | 'advance_paid' | 'work_complete_paid' | 'fully_paid';
    invoice_status: 'draft' | 'sent' | 'paid' | 'cancelled';
    issue_date: string;
    due_date: string | null;
    project_start_date: string | null;
    project_end_date: string | null;
    notes: string | null;
    created_at: string;
}

const SERVICE_TYPES = [
    { value: 'identite_visuelle', label: 'Identité Visuelle' },
    { value: 'branding_complet', label: 'Branding Complet' },
    { value: 'design_graphique', label: 'Design Graphique' },
    { value: 'strategie_marque', label: 'Stratégie de Marque' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'web_design', label: 'Web Design' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'autre', label: 'Autre' }
];

const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
    advance_paid: { label: 'Acompte payé', color: 'bg-blue-100 text-blue-700' },
    work_complete_paid: { label: '75% payé', color: 'bg-purple-100 text-purple-700' },
    fully_paid: { label: 'Payé', color: 'bg-emerald-100 text-emerald-700' }
};

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        client_address: '',
        service_type: '',
        service_description: '',
        total_amount: '',
        due_date: '',
        project_start_date: '',
        project_end_date: '',
        notes: ''
    });

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvoices(data || []);
        } catch (error) {
            console.error('Failed to fetch invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();

        // Real-time subscription
        const channel = supabase
            .channel('invoices-feed')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'invoices' },
                () => {
                    fetchInvoices();
                }
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
            const { error } = await supabase
                .from('invoices')
                .insert([{
                    client_name: formData.client_name,
                    client_email: formData.client_email || null,
                    client_phone: formData.client_phone || null,
                    client_address: formData.client_address || null,
                    service_type: formData.service_type,
                    service_description: formData.service_description || null,
                    total_amount: parseFloat(formData.total_amount),
                    due_date: formData.due_date || null,
                    project_start_date: formData.project_start_date || null,
                    project_end_date: formData.project_end_date || null,
                    notes: formData.notes || null
                }]);

            if (error) throw error;

            setShowForm(false);
            setFormData({
                client_name: '',
                client_email: '',
                client_phone: '',
                client_address: '',
                service_type: '',
                service_description: '',
                total_amount: '',
                due_date: '',
                project_start_date: '',
                project_end_date: '',
                notes: ''
            });
            fetchInvoices();
        } catch (error) {
            console.error('Failed to create invoice:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!invoiceToDelete) return;
        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from('invoices')
                .delete()
                .eq('id', invoiceToDelete);

            if (error) throw error;
            setInvoiceToDelete(null);
            fetchInvoices();
        } catch (error) {
            console.error('Failed to delete invoice:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePaymentUpdate = async (invoiceId: string, field: string, value: boolean) => {
        // Payments are irreversible - only allow marking as paid, not unchecking
        if (!value) return;

        try {
            const updateData: any = {
                [field]: true,
                [`${field}_date`]: new Date().toISOString()
            };

            const { error } = await supabase
                .from('invoices')
                .update(updateData)
                .eq('id', invoiceId);

            if (error) throw error;
            fetchInvoices();
        } catch (error) {
            console.error('Failed to update payment:', error);
        }
    };

    const stats = {
        total: invoices.length,
        totalRevenue: invoices.reduce((acc, inv) => acc + Number(inv.total_amount), 0),
        totalPaid: invoices.reduce((acc, inv) => acc + Number(inv.amount_paid), 0),
        pending: invoices.filter(inv => inv.payment_status === 'pending').length
    };

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-none text-black">Facturation</h1>
                    <p className="text-neutral-400 font-medium text-lg mt-4 max-w-xl leading-relaxed">
                        Gestion des factures et suivi des paiements en temps réel.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-all shadow-xl self-start"
                >
                    <Plus size={18} />
                    Nouvelle Facture
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="p-6 md:p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-2">Total Factures</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-black">{stats.total}</h3>
                </div>
                <div className="p-6 md:p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-2">Revenu Total</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-black">{stats.totalRevenue.toLocaleString()} <span className="text-lg text-neutral-400">DZD</span></h3>
                </div>
                <div className="p-6 md:p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-2">Montant Encaissé</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-emerald-600">{stats.totalPaid.toLocaleString()} <span className="text-lg text-neutral-400">DZD</span></h3>
                </div>
                <div className="p-6 md:p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-2">En Attente</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-amber-600">{stats.pending}</h3>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-50 text-neutral-300 text-[10px] font-black tracking-[0.3em] uppercase">
                                <th className="px-6 md:px-10 py-6 md:py-8">Facture</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 hidden md:table-cell">Client</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-center">Montant</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-center">Paiements</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 md:px-10 py-6 md:py-8"><div className="h-5 w-28 bg-neutral-100 rounded-lg" /></td>
                                        <td className="px-6 md:px-10 py-6 md:py-8 hidden md:table-cell"><div className="h-5 w-32 bg-neutral-100 rounded-lg" /></td>
                                        <td className="px-6 md:px-10 py-6 md:py-8"><div className="h-5 w-24 bg-neutral-100 rounded-lg mx-auto" /></td>
                                        <td className="px-6 md:px-10 py-6 md:py-8"><div className="h-4 w-32 bg-neutral-100 rounded-full mx-auto" /></td>
                                        <td className="px-6 md:px-10 py-6 md:py-8"><div className="h-10 w-20 bg-neutral-100 rounded-xl ml-auto" /></td>
                                    </tr>
                                ))
                            ) : invoices.length > 0 ? (
                                invoices.map((invoice, i) => (
                                    <motion.tr
                                        key={invoice.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group hover:bg-neutral-50/80 transition-all"
                                    >
                                        <td className="px-6 md:px-10 py-5 md:py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shrink-0">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-sm block truncate">{invoice.invoice_number}</span>
                                                    <span className="text-xs text-neutral-400 md:hidden block truncate">{invoice.client_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-5 md:py-6 hidden md:table-cell">
                                            <p className="font-bold text-black">{invoice.client_name}</p>
                                            <p className="text-xs text-neutral-400">{invoice.client_email}</p>
                                        </td>
                                        <td className="px-6 md:px-10 py-5 md:py-6 text-center">
                                            <div>
                                                <span className="font-black text-base md:text-lg">{Number(invoice.total_amount).toLocaleString()}</span>
                                                <span className="text-xs text-neutral-400 ml-1">DZD</span>
                                            </div>
                                            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                                                {Number(invoice.amount_paid).toLocaleString()} encaissé
                                            </p>
                                        </td>
                                        {/* Payment Progress Bar */}
                                        <td className="px-6 md:px-10 py-5 md:py-6">
                                            <div className="flex items-center justify-center gap-1">
                                                {/* 50% Acompte */}
                                                <button
                                                    onClick={() => !invoice.advance_paid && handlePaymentUpdate(invoice.id, 'advance_paid', true)}
                                                    disabled={invoice.advance_paid}
                                                    className={`relative h-8 flex-1 max-w-[60px] rounded-l-full transition-all ${invoice.advance_paid
                                                        ? 'bg-emerald-500 cursor-default'
                                                        : 'bg-neutral-100 hover:bg-emerald-200 cursor-pointer'
                                                        }`}
                                                    title={invoice.advance_paid ? "50% Acompte - Payé ✓" : "Cliquer pour marquer comme payé"}
                                                >
                                                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${invoice.advance_paid ? 'text-white' : 'text-neutral-400'
                                                        }`}>
                                                        50%
                                                    </span>
                                                </button>
                                                {/* 25% Fin Travaux */}
                                                <button
                                                    onClick={() => !invoice.work_complete_paid && handlePaymentUpdate(invoice.id, 'work_complete_paid', true)}
                                                    disabled={invoice.work_complete_paid}
                                                    className={`relative h-8 flex-1 max-w-[50px] transition-all ${invoice.work_complete_paid
                                                        ? 'bg-emerald-500 cursor-default'
                                                        : 'bg-neutral-100 hover:bg-emerald-200 cursor-pointer'
                                                        }`}
                                                    title={invoice.work_complete_paid ? "25% Fin Travaux - Payé ✓" : "Cliquer pour marquer comme payé"}
                                                >
                                                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${invoice.work_complete_paid ? 'text-white' : 'text-neutral-400'
                                                        }`}>
                                                        25%
                                                    </span>
                                                </button>
                                                {/* 25% Livraison */}
                                                <button
                                                    onClick={() => !invoice.delivery_paid && handlePaymentUpdate(invoice.id, 'delivery_paid', true)}
                                                    disabled={invoice.delivery_paid}
                                                    className={`relative h-8 flex-1 max-w-[50px] rounded-r-full transition-all ${invoice.delivery_paid
                                                        ? 'bg-emerald-500 cursor-default'
                                                        : 'bg-neutral-100 hover:bg-emerald-200 cursor-pointer'
                                                        }`}
                                                    title={invoice.delivery_paid ? "25% Livraison - Payé ✓" : "Cliquer pour marquer comme payé"}
                                                >
                                                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${invoice.delivery_paid ? 'text-white' : 'text-neutral-400'
                                                        }`}>
                                                        25%
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-5 md:py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedInvoice(invoice)}
                                                    className="p-3 bg-white border border-neutral-100 rounded-xl shadow-sm text-black hover:bg-black hover:text-white transition-all"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setInvoiceToDelete(invoice.id)}
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
                                    <td colSpan={5} className="px-10 py-32 text-center text-neutral-300 font-medium italic">
                                        Aucune facture créée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* New Invoice Form Modal */}
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
                                <h2 className="text-2xl font-black tracking-tight">Nouvelle Facture</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                {/* Client Info */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Informations Client</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nom du client *"
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
                                            type="tel"
                                            placeholder="Téléphone"
                                            value={formData.client_phone}
                                            onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                                            className="px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Adresse"
                                            value={formData.client_address}
                                            onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                                            className="px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Détails du Service</h3>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.service_type}
                                            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                            className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="">Sélectionner un service *</option>
                                            {SERVICE_TYPES.map((service) => (
                                                <option key={service.value} value={service.label}>{service.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={20} />
                                    </div>
                                    <textarea
                                        placeholder="Description du service"
                                        rows={3}
                                        value={formData.service_description}
                                        onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium resize-none"
                                    />
                                </div>

                                {/* Financial */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Montant</h3>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Montant total (DZD) *"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.total_amount}
                                            onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                            className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                        />
                                    </div>
                                    {formData.total_amount && (
                                        <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-xl">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">50% Acompte</p>
                                                <p className="font-bold text-lg">{(parseFloat(formData.total_amount) * 0.5).toLocaleString()} DZD</p>
                                            </div>
                                            <div className="text-center border-x border-neutral-200">
                                                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">25% Fin Travaux</p>
                                                <p className="font-bold text-lg">{(parseFloat(formData.total_amount) * 0.25).toLocaleString()} DZD</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">25% Livraison</p>
                                                <p className="font-bold text-lg">{(parseFloat(formData.total_amount) * 0.25).toLocaleString()} DZD</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Dates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Échéance</label>
                                            <input
                                                type="date"
                                                value={formData.due_date}
                                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                                className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Début projet</label>
                                            <input
                                                type="date"
                                                value={formData.project_start_date}
                                                onChange={(e) => setFormData({ ...formData, project_start_date: e.target.value })}
                                                className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Fin projet</label>
                                            <input
                                                type="date"
                                                value={formData.project_end_date}
                                                onChange={(e) => setFormData({ ...formData, project_end_date: e.target.value })}
                                                className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Notes</h3>
                                    <textarea
                                        placeholder="Notes additionnelles..."
                                        rows={2}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-100 focus:border-black focus:outline-none transition-all font-medium resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Création en cours...' : 'Créer la Facture'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invoice View Modal */}
            <AnimatePresence>
                {selectedInvoice && (
                    <InvoicePopup
                        invoice={selectedInvoice}
                        onClose={() => setSelectedInvoice(null)}
                        onPaymentUpdate={handlePaymentUpdate}
                    />
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={!!invoiceToDelete}
                isLoading={isDeleting}
                onClose={() => setInvoiceToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}

// Invoice Popup Component
function InvoicePopup({
    invoice,
    onClose,
    onPaymentUpdate
}: {
    invoice: Invoice;
    onClose: () => void;
    onPaymentUpdate: (id: string, field: string, value: boolean) => void;
}) {
    const handlePrint = () => {
        const printContent = document.getElementById('invoice-print-content');
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Facture ${invoice.invoice_number}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Inter', -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; padding-bottom: 30px; border-bottom: 2px solid #000; }
                    .logo { font-size: 10px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; }
                    .invoice-title { font-size: 48px; font-weight: 900; letter-spacing: -0.04em; }
                    .invoice-number { font-size: 14px; color: #666; margin-top: 10px; }
                    .section { margin-bottom: 40px; }
                    .section-title { font-size: 10px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 15px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                    .info-label { font-size: 12px; color: #666; margin-bottom: 5px; }
                    .info-value { font-size: 16px; font-weight: 600; }
                    .amount-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 30px; background: #f5f5f5; border-radius: 12px; margin: 30px 0; }
                    .amount-item { text-align: center; }
                    .amount-label { font-size: 10px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: #666; margin-bottom: 8px; }
                    .amount-value { font-size: 20px; font-weight: 900; }
                    .total { font-size: 36px; font-weight: 900; text-align: right; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; }
                    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
                    .paid { color: #059669; }
                    .pending { color: #d97706; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo">Louenes Abbas</div>
                        <p style="font-size: 12px; color: #666; margin-top: 10px;">Brand Strategist & Designer</p>
                    </div>
                    <div style="text-align: right;">
                        <div class="invoice-title">Facture</div>
                        <div class="invoice-number">${invoice.invoice_number}</div>
                    </div>
                </div>

                <div class="info-grid section">
                    <div>
                        <div class="section-title">Client</div>
                        <div class="info-value">${invoice.client_name}</div>
                        ${invoice.client_email ? `<div class="info-label" style="margin-top: 5px;">${invoice.client_email}</div>` : ''}
                        ${invoice.client_phone ? `<div class="info-label">${invoice.client_phone}</div>` : ''}
                        ${invoice.client_address ? `<div class="info-label">${invoice.client_address}</div>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <div class="section-title">Dates</div>
                        <div class="info-label">Date d'émission</div>
                        <div class="info-value">${new Date(invoice.issue_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        ${invoice.due_date ? `
                            <div class="info-label" style="margin-top: 10px;">Échéance</div>
                            <div class="info-value">${new Date(invoice.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        ` : ''}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Service</div>
                    <div class="info-value">${invoice.service_type}</div>
                    ${invoice.service_description ? `<div class="info-label" style="margin-top: 10px;">${invoice.service_description}</div>` : ''}
                </div>

                <div class="amount-grid">
                    <div class="amount-item">
                        <div class="amount-label">50% Acompte</div>
                        <div class="amount-value ${invoice.advance_paid ? 'paid' : 'pending'}">${Number(invoice.advance_amount).toLocaleString()} DZD</div>
                        <div style="font-size: 10px; margin-top: 5px;" class="${invoice.advance_paid ? 'paid' : 'pending'}">${invoice.advance_paid ? '✓ Payé' : '○ En attente'}</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-label">25% Fin Travaux</div>
                        <div class="amount-value ${invoice.work_complete_paid ? 'paid' : 'pending'}">${Number(invoice.work_complete_amount).toLocaleString()} DZD</div>
                        <div style="font-size: 10px; margin-top: 5px;" class="${invoice.work_complete_paid ? 'paid' : 'pending'}">${invoice.work_complete_paid ? '✓ Payé' : '○ En attente'}</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-label">25% Livraison</div>
                        <div class="amount-value ${invoice.delivery_paid ? 'paid' : 'pending'}">${Number(invoice.delivery_amount).toLocaleString()} DZD</div>
                        <div style="font-size: 10px; margin-top: 5px;" class="${invoice.delivery_paid ? 'paid' : 'pending'}">${invoice.delivery_paid ? '✓ Payé' : '○ En attente'}</div>
                    </div>
                </div>

                <div class="total">
                    Total: ${Number(invoice.total_amount).toLocaleString()} DZD
                </div>

                ${invoice.notes ? `
                    <div class="section" style="margin-top: 40px;">
                        <div class="section-title">Notes</div>
                        <div class="info-label">${invoice.notes}</div>
                    </div>
                ` : ''}

                <div class="footer">
                    <p>Merci pour votre confiance.</p>
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
                className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{invoice.invoice_number}</h2>
                        <p className="text-neutral-400 text-sm">{invoice.client_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-3 bg-neutral-100 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-all"
                        >
                            <Printer size={16} />
                            Imprimer
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div id="invoice-print-content" className="p-8 space-y-8">
                    {/* Client & Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">Client</h3>
                            <p className="font-bold text-lg">{invoice.client_name}</p>
                            {invoice.client_email && <p className="text-neutral-500">{invoice.client_email}</p>}
                            {invoice.client_phone && <p className="text-neutral-500">{invoice.client_phone}</p>}
                            {invoice.client_address && <p className="text-neutral-500">{invoice.client_address}</p>}
                        </div>
                        <div className="md:text-right">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">Dates</h3>
                            <p className="text-neutral-600">
                                <span className="text-neutral-400">Émise le:</span>{' '}
                                {new Date(invoice.issue_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            {invoice.due_date && (
                                <p className="text-neutral-600">
                                    <span className="text-neutral-400">Échéance:</span>{' '}
                                    {new Date(invoice.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Service */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">Service</h3>
                        <p className="font-bold text-lg">{invoice.service_type}</p>
                        {invoice.service_description && <p className="text-neutral-500 mt-2">{invoice.service_description}</p>}
                    </div>

                    {/* Payment Breakdown */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Échéancier de Paiement</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className={`p-6 rounded-2xl border-2 transition-all ${invoice.advance_paid ? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-50 border-neutral-100'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black uppercase tracking-wider text-neutral-400">50% Acompte</span>
                                    <button
                                        onClick={() => !invoice.advance_paid && onPaymentUpdate(invoice.id, 'advance_paid', true)}
                                        disabled={invoice.advance_paid}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${invoice.advance_paid
                                                ? 'bg-emerald-500 border-emerald-500 text-white cursor-default'
                                                : 'border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer'
                                            }`}
                                        title={invoice.advance_paid ? "Payé ✓" : "Marquer comme payé"}
                                    >
                                        {invoice.advance_paid && <CheckCircle size={14} />}
                                    </button>
                                </div>
                                <p className="font-black text-xl">{Number(invoice.advance_amount).toLocaleString()} DZD</p>
                                {invoice.advance_paid && invoice.advance_paid_date && (
                                    <p className="text-[10px] text-emerald-600 mt-1">
                                        Payé le {new Date(invoice.advance_paid_date).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                            <div className={`p-6 rounded-2xl border-2 transition-all ${invoice.work_complete_paid ? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-50 border-neutral-100'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black uppercase tracking-wider text-neutral-400">25% Fin Travaux</span>
                                    <button
                                        onClick={() => !invoice.work_complete_paid && onPaymentUpdate(invoice.id, 'work_complete_paid', true)}
                                        disabled={invoice.work_complete_paid}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${invoice.work_complete_paid
                                                ? 'bg-emerald-500 border-emerald-500 text-white cursor-default'
                                                : 'border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer'
                                            }`}
                                        title={invoice.work_complete_paid ? "Payé ✓" : "Marquer comme payé"}
                                    >
                                        {invoice.work_complete_paid && <CheckCircle size={14} />}
                                    </button>
                                </div>
                                <p className="font-black text-xl">{Number(invoice.work_complete_amount).toLocaleString()} DZD</p>
                                {invoice.work_complete_paid && invoice.work_complete_paid_date && (
                                    <p className="text-[10px] text-emerald-600 mt-1">
                                        Payé le {new Date(invoice.work_complete_paid_date).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                            <div className={`p-6 rounded-2xl border-2 transition-all ${invoice.delivery_paid ? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-50 border-neutral-100'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black uppercase tracking-wider text-neutral-400">25% Livraison</span>
                                    <button
                                        onClick={() => !invoice.delivery_paid && onPaymentUpdate(invoice.id, 'delivery_paid', true)}
                                        disabled={invoice.delivery_paid}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${invoice.delivery_paid
                                                ? 'bg-emerald-500 border-emerald-500 text-white cursor-default'
                                                : 'border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer'
                                            }`}
                                        title={invoice.delivery_paid ? "Payé ✓" : "Marquer comme payé"}
                                    >
                                        {invoice.delivery_paid && <CheckCircle size={14} />}
                                    </button>
                                </div>
                                <p className="font-black text-xl">{Number(invoice.delivery_amount).toLocaleString()} DZD</p>
                                {invoice.delivery_paid && invoice.delivery_paid_date && (
                                    <p className="text-[10px] text-emerald-600 mt-1">
                                        Payé le {new Date(invoice.delivery_paid_date).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-6 border-t-2 border-black">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Montant Payé</p>
                            <p className="text-2xl font-black text-emerald-600">{Number(invoice.amount_paid).toLocaleString()} DZD</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Total</p>
                            <p className="text-4xl font-black">{Number(invoice.total_amount).toLocaleString()} DZD</p>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="pt-6 border-t border-neutral-100">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">Notes</h3>
                            <p className="text-neutral-600">{invoice.notes}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
