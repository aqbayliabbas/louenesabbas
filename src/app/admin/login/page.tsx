'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // For now, we call a skeleton API route we'll create next
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
            } else {
                const data = await res.json();
                setError(data.message || 'Identifiants invalides');
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-12">
                    <Link href="/" className="text-xl font-bold tracking-tighter mb-8 inline-block">
                        LOUENES ABBAS
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tighter">Accès Admin</h1>
                    <p className="text-neutral-400 mt-2 font-light">Entrez vos identifiants pour gérer les projets.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-neutral-400 ml-1">Utilisateur</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-black focus:bg-white transition-all"
                                placeholder="Nom d'utilisateur"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest uppercase text-neutral-400 ml-1">Mot de passe</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-black focus:bg-white transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-red-500 text-sm font-medium ml-1"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}
