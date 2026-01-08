'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertCircle } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isLoading?: boolean;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmer la suppression",
    message = "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet élément ?",
    isLoading = false
}: DeleteModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-10">
                            {/* Icon & Close */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                                    <AlertCircle size={28} />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-neutral-50 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-neutral-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold tracking-tighter mb-4">{title}</h3>
                            <p className="text-neutral-500 font-light leading-relaxed mb-10">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-neutral-100 font-bold text-sm hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-900 transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    {isLoading ? 'Suppression...' : 'Supprimer'}
                                </button>
                            </div>
                        </div>

                        {/* Visual accent */}
                        <div className="h-1.5 w-full bg-red-500" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
