'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    ScrollText,
    Settings,
    LogOut,
    User,
    Menu,
    X,
    Calendar
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: 'Aperçu', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Planning', path: '/admin/dashboard/bookings', icon: Calendar },
        { name: 'Réponses', path: '/admin/dashboard/responses', icon: MessageSquare },
        { name: 'Factures', path: '/admin/dashboard/invoices', icon: FileText },
        { name: 'Contrats', path: '/admin/dashboard/contracts', icon: ScrollText },
    ];

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex text-black">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-neutral-100 p-10 h-screen sticky top-0">
                <div className="mb-20 flex justify-center">
                    <Link
                        href="/"
                        className="text-xs font-bold tracking-[0.3em] uppercase text-black hover:opacity-50 transition-opacity"
                    >
                        Louenes Abbas
                    </Link>

                </div>

                <nav className="flex-1 space-y-2">

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${isActive
                                    ? 'bg-black text-white shadow-xl translate-x-1'
                                    : 'text-neutral-400 hover:text-black hover:bg-neutral-50'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-white' : 'group-hover:rotate-12 transition-transform'} />
                                <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                {isActive && (
                                    <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-white rounded-full ml-auto" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-6">
                    <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full border border-neutral-200 flex items-center justify-center">
                                <User size={20} className="text-neutral-400" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-black truncate">Administrateur</span>
                                <span className="text-[10px] text-neutral-400 font-bold truncate">Session Active</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white border border-neutral-200 text-xs font-bold hover:bg-black hover:text-white transition-all shadow-sm"
                        >
                            <LogOut size={14} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#fafafa]">
                {/* Header Mobile */}
                <header className="lg:hidden flex items-center justify-between p-6 bg-white border-b border-neutral-100">
                    <div className="flex justify-center flex-1">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-black">
                            Louenes Abbas
                        </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-neutral-50 rounded-xl">
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </header>

                <main className="flex-1 p-6 md:p-16 lg:p-24 max-w-[1600px] w-full mx-auto relative">
                    {/* Decorative background pulse */}
                    <div className="fixed top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-black/[0.02] blur-[120px] rounded-full pointer-events-none" />
                    <div className="fixed bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-black/[0.01] blur-[100px] rounded-full pointer-events-none" />

                    {children}
                </main>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="w-full max-w-[280px] h-full bg-white p-10 flex flex-col justify-between"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-12">
                                <div className="flex justify-between items-center">
                                    <div className="text-xs font-bold tracking-[0.3em] uppercase text-black">
                                        Louenes Abbas
                                    </div>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                                        <X size={24} />
                                    </button>
                                </div>

                                <nav className="space-y-4">
                                    {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${isActive ? 'bg-black text-white shadow-xl' : 'text-neutral-400'}`}
                                            >
                                                <Icon size={20} />
                                                <span className="font-bold text-lg tracking-tight">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-50 text-neutral-400 font-bold"
                            >
                                <LogOut size={20} />
                                Déconnexion
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
