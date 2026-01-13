'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Search,
    Video,
    Phone,
    CheckCircle,
    X,
    Trash2,
    Clock,
    MoreHorizontal,
    Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DeleteModal from '@/components/ui/DeleteModal';

interface Booking {
    id: string;
    client_name: string;
    contact_info: string;
    booking_date: string;
    booking_time: string;
    platform: 'google_meet' | 'whatsapp';
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
    created_at: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('booking_date', { ascending: true })
                .order('booking_time', { ascending: true });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        const channel = supabase
            .channel('bookings-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                () => fetchBookings()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchBookings();

            // Update selected booking if open
            if (selectedBooking && selectedBooking.id === id) {
                setSelectedBooking({ ...selectedBooking, status: newStatus } as Booking);
            }
        } catch (error: any) {
            console.error('Failed to update status:', error);
            alert(`Erreur: ${error.message || 'Impossible de mettre à jour'}`);
        }
    };

    const handleDelete = async () => {
        if (!bookingToDelete) return;
        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', bookingToDelete);

            if (error) throw error;
            setBookingToDelete(null);
            fetchBookings();
        } catch (error) {
            console.error('Failed to delete booking:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.contact_info?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-16 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-none text-black">Planning</h1>
                    <p className="text-neutral-400 font-medium text-lg mt-4 max-w-xl leading-relaxed">
                        Gérez vos rendez-vous de consultation et leur statuts.
                    </p>
                </div>
            </header>

            {/* Bookings List */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium"
                        />
                    </div>

                    <div className="flex bg-neutral-50 p-1.5 rounded-xl gap-1 overflow-x-auto">
                        {['all', 'pending', 'confirmed', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === tab
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-neutral-400 hover:text-black hover:bg-white/50'
                                    }`}
                            >
                                {tab === 'all' ? 'Tous' : tab === 'pending' ? 'En Attente' : tab === 'confirmed' ? 'Confirmé' : 'Annulé'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-50 text-neutral-300 text-[10px] font-black tracking-[0.3em] uppercase">
                                <th className="px-6 md:px-10 py-6 md:py-8">Date/Heure</th>
                                <th className="px-6 md:px-10 py-6 md:py-8">Client</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 hidden md:table-cell">Plateforme</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-center">Statut</th>
                                <th className="px-6 md:px-10 py-6 md:py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 md:px-10 py-8">
                                            <div className="h-6 bg-neutral-100 rounded-lg w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking, i) => (
                                    <motion.tr
                                        key={booking.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group hover:bg-neutral-50/80 transition-all cursor-pointer"
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        <td className="px-6 md:px-10 py-6">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-black text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                                                        {new Date(booking.booking_date).toLocaleString('default', { month: 'short' })}
                                                    </span>
                                                    <span className="text-lg font-black leading-none">
                                                        {new Date(booking.booking_date).getDate()}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 text-black font-bold">
                                                        <Clock size={14} className="text-neutral-400" />
                                                        {booking.booking_time}
                                                    </div>
                                                    <span className="text-xs text-neutral-400 mt-1 capitalize">
                                                        {new Date(booking.booking_date).toLocaleString('default', { weekday: 'long' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-6">
                                            <p className="font-bold text-black">{booking.client_name}</p>
                                            <p className="text-xs text-neutral-400 font-medium mt-1">{booking.contact_info}</p>
                                            {booking.notes && (
                                                <div className="mt-2 text-[10px] bg-neutral-100 p-2 rounded-lg text-neutral-500 max-w-[200px] truncate">
                                                    "{booking.notes}"
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 md:px-10 py-6 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${booking.platform === 'google_meet' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {booking.platform === 'google_meet' ? <Video size={16} /> : <Phone size={16} />}
                                                </div>
                                                <span className="text-sm font-medium capitalize">{booking.platform.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 md:px-10 py-6 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : booking.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {booking.status === 'confirmed' && <CheckCircle size={12} />}
                                                {booking.status === 'pending' ? 'En Attente' : booking.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                                            </span>
                                        </td>
                                        <td className="px-6 md:px-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status !== 'confirmed' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'confirmed'); }}
                                                        className="p-3 bg-white border border-neutral-100 rounded-xl shadow-sm text-emerald-600 hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95"
                                                        title="Confirmer"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                {booking.status !== 'cancelled' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'cancelled'); }}
                                                        className="p-3 bg-white border border-neutral-100 rounded-xl shadow-sm text-neutral-400 hover:bg-neutral-50 hover:text-black transition-all hover:scale-105 active:scale-95"
                                                        title="Annuler"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                                                    className="p-3 bg-white border border-neutral-100 rounded-xl shadow-sm text-black hover:bg-black hover:text-white transition-all transform hover:scale-105 active:scale-95"
                                                    title="Voir les détails"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setBookingToDelete(booking.id); }}
                                                    className="p-3 bg-white border border-neutral-100 rounded-xl shadow-sm text-red-500 hover:bg-red-50 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                                                    title="Supprimer"
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
                                        Aucun rendez-vous trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Detail Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedBooking(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{selectedBooking.client_name}</h2>
                                    <p className="text-neutral-400 text-sm font-medium mt-1">Détails du rendez-vous</p>
                                </div>
                                <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Time & Platform */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-black text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-bold uppercase tracking-wide opacity-80">
                                            {new Date(selectedBooking.booking_date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-black leading-none">
                                            {new Date(selectedBooking.booking_date).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 font-black text-xl mb-1">
                                            <Clock size={20} className="text-neutral-400" />
                                            {selectedBooking.booking_time}
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${selectedBooking.platform === 'google_meet' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                            {selectedBooking.platform === 'google_meet' ? <Video size={14} /> : <Phone size={14} />}
                                            {selectedBooking.platform.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-4">
                                    <div className="bg-neutral-50 p-6 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Contact</p>
                                        <p className="text-lg font-bold">{selectedBooking.contact_info}</p>
                                    </div>

                                    {selectedBooking.notes && (
                                        <div className="bg-neutral-50 p-6 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Note du client</p>
                                            <p className="text-sm font-medium leading-relaxed text-neutral-600">{selectedBooking.notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-50">
                                    {selectedBooking.status !== 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                                            className="py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                                        >
                                            <CheckCircle size={18} />
                                            Confirmer
                                        </button>
                                    )}
                                    {selectedBooking.status === 'confirmed' && (
                                        <div className="py-4 bg-emerald-50 text-emerald-700 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default border border-emerald-100">
                                            <CheckCircle size={18} />
                                            Confirmé
                                        </div>
                                    )}

                                    {selectedBooking.status !== 'cancelled' ? (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                                            className="py-4 bg-white border-2 border-neutral-100 text-neutral-500 rounded-xl font-bold hover:border-neutral-200 hover:text-black transition-all"
                                        >
                                            Annuler
                                        </button>
                                    ) : (
                                        <div className="py-4 bg-neutral-100 text-neutral-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
                                            <X size={18} />
                                            Annulé
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={!!bookingToDelete}
                isLoading={isDeleting}
                onClose={() => setBookingToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
