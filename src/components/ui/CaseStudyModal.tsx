'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

interface CaseStudyModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export function CaseStudyModal({ isOpen, onClose, pdfUrl }: CaseStudyModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neutral-900 text-white rounded-[5px]">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-neutral-900 leading-none mb-1">Case Study</h3>
                                    <p className="text-sm text-neutral-500 font-medium">Strategic Brand Transformation</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={pdfUrl}
                                    download
                                    className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-[5px] bg-neutral-100 text-neutral-900 text-sm font-bold hover:bg-neutral-200 transition-all active:scale-95"
                                >
                                    <Download size={18} />
                                    Download
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-neutral-100 rounded-[5px] transition-colors text-neutral-400 hover:text-neutral-900"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer Content */}
                        <div className="flex-1 bg-neutral-50 relative group">
                            <iframe
                                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-none"
                                title="Case Study PDF"
                                loading="lazy"
                            />

                            {/* Mobile Friendly Link */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 md:hidden">
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    className="pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-[5px] bg-white text-black text-sm font-bold shadow-xl"
                                >
                                    <ExternalLink size={18} />
                                    Open in New Tab
                                </a>
                            </div>
                        </div>

                        {/* Footer / Status */}
                        <div className="px-8 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-center md:hidden">
                            <a
                                href={pdfUrl}
                                download
                                className="flex items-center gap-2 px-6 py-3 rounded-[5px] bg-neutral-900 text-white text-sm font-bold shadow-lg"
                            >
                                <Download size={18} />
                                Download Case Study
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
