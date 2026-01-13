'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Phone,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    ArrowRight,
    Loader2,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/ui/Navbar';

type Platform = 'google_meet' | 'whatsapp';

export default function ConsultationPage() {
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [contactInfo, setContactInfo] = useState('');
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Dynamic calendar
    const today = new Date();
    const currentMonth = today.toLocaleString('en-US', { month: 'long' }); // English for aesthetic or French? using English as per code style mostly
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
        return d;
    }).filter(d => d >= today);

    const timeSlots = [
        '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!platform || !selectedDate || !selectedTime) return;
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('bookings').insert([
                {
                    platform,
                    contact_info: contactInfo,
                    booking_date: selectedDate.toISOString().split('T')[0],
                    booking_time: selectedTime,
                    client_name: name,
                    notes,
                    status: 'pending'
                }
            ]);

            if (error) throw error;
            setIsSuccess(true);
        } catch (error) {
            console.error('Error booking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black" data-nav-dark>
            <Navbar forceDark />

            <div className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                {/* Left: Brand / Context */}
                <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="h-px w-12 bg-white/20"></span>
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400">
                                Discovery Call
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[0.9] text-white mb-8">
                            Let's <br />
                            <span className="text-neutral-500">Connect.</span>
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed font-light max-w-md">
                            Book a 15-minute strategy session. No fluff, just clarity on how we can elevate your brand identity.
                        </p>
                    </motion.div>

                    <div className="hidden lg:block space-y-6 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-4 text-neutral-500">
                            <CheckCircle2 size={20} className="text-white" />
                            <span className="tracking-wide">Clarify your vision</span>
                        </div>
                        <div className="flex items-center gap-4 text-neutral-500">
                            <CheckCircle2 size={20} className="text-white" />
                            <span className="tracking-wide">Discuss timeline & budget</span>
                        </div>
                        <div className="flex items-center gap-4 text-neutral-500">
                            <CheckCircle2 size={20} className="text-white" />
                            <span className="tracking-wide">Immediate value feedback</span>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive Booking Module */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-neutral-900 rounded-[2rem] border border-white/5 p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Background Gradient */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-32 flex flex-col items-center justify-center h-full"
                                >
                                    <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 className="text-4xl font-black mb-6 tracking-tight">Request Sent.</h2>
                                    <p className="text-neutral-400 text-lg mb-12 max-w-sm">
                                        I'll confirm the <strong>{platform === 'google_meet' ? 'Meet link' : 'WhatsApp call'}</strong> for {selectedDate?.getDate()} {currentMonth} shortly.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="px-10 py-5 bg-white text-black rounded-full font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all text-sm"
                                    >
                                        Back to Home
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="relative z-10 space-y-16">

                                    {/* Step 1: Platform */}
                                    <section>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">01. Platform</h3>
                                            <div className="h-px flex-1 bg-white/10 ml-6" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <PlatformCard
                                                icon={<Video size={24} />}
                                                label="Google Meet"
                                                sub="Video Call"
                                                isActive={platform === 'google_meet'}
                                                onClick={() => setPlatform('google_meet')}
                                            />
                                            <PlatformCard
                                                icon={<Phone size={24} />}
                                                label="WhatsApp"
                                                sub="Audio Call"
                                                isActive={platform === 'whatsapp'}
                                                onClick={() => setPlatform('whatsapp')}
                                            />
                                        </div>
                                    </section>

                                    {/* Step 2: Date & Time (Requires Step 1) */}
                                    <section className={`transition-all duration-500 ${platform ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-10 pointer-events-none blur-sm'}`}>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">02. Value Time</h3>
                                            <div className="h-px flex-1 bg-white/10 ml-6" />
                                        </div>

                                        <div className="bg-black/40 rounded-3xl p-6 md:p-8 border border-white/5">
                                            {/* Calendar Header */}
                                            <div className="flex items-center justify-between mb-8">
                                                <span className="text-2xl font-black">{currentMonth}</span>
                                                <div className="flex gap-2">
                                                    <button type="button" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft size={16} /></button>
                                                    <button type="button" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronRight size={16} /></button>
                                                </div>
                                            </div>

                                            {/* Days Grid */}
                                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                                                {days.slice(0, 14).map((date, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`snap-center shrink-0 w-20 h-28 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-300 ${selectedDate?.getDate() === date.getDate()
                                                            ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105'
                                                            : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                                                            {date.toLocaleString('en-US', { weekday: 'short' })}
                                                        </span>
                                                        <span className="text-3xl font-black">{date.getDate()}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Time Slots */}
                                            <AnimatePresence>
                                                {selectedDate && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="mt-8 pt-8 border-t border-white/5"
                                                    >
                                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                                            {timeSlots.map((time) => (
                                                                <button
                                                                    key={time}
                                                                    type="button"
                                                                    onClick={() => setSelectedTime(time)}
                                                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${selectedTime === time
                                                                        ? 'bg-white text-black'
                                                                        : 'bg-transparent border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                                                                        }`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </section>

                                    {/* Step 3: Identity & Confirm (Requires Step 2) */}
                                    <section className={`transition-all duration-500 ${selectedDate && selectedTime ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-10 pointer-events-none blur-sm'}`}>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">03. The Details</h3>
                                            <div className="h-px flex-1 bg-white/10 ml-6" />
                                        </div>

                                        <div className="bg-black/40 rounded-3xl p-8 border border-white/5 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-4">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full h-14 bg-white/5 rounded-2xl px-6 outline-none focus:bg-white/10 transition-all font-medium placeholder:text-neutral-700 border border-white/5 focus:border-white/20"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-4">
                                                        {platform === 'whatsapp' ? 'Phone Number' : 'Email Address'}
                                                    </label>
                                                    <input
                                                        type={platform === 'google_meet' ? 'email' : 'tel'}
                                                        required
                                                        value={contactInfo}
                                                        onChange={(e) => setContactInfo(e.target.value)}
                                                        className="w-full h-14 bg-white/5 rounded-2xl px-6 outline-none focus:bg-white/10 transition-all font-medium placeholder:text-neutral-700 border border-white/5 focus:border-white/20"
                                                        placeholder={platform === 'whatsapp' ? '+213 ...' : 'john@example.com'}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 ml-4">Anything specific?</label>
                                                <textarea
                                                    rows={2}
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none focus:bg-white/10 transition-all font-medium placeholder:text-neutral-700 border border-white/5 focus:border-white/20 resize-none"
                                                    placeholder="Briefly describe your project..."
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full mt-8 h-20 bg-white text-black hover:bg-neutral-200 rounded-[2rem] font-black text-lg tracking-widest uppercase transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : (
                                                <>
                                                    Confirm Booking
                                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </section>

                                </form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

function PlatformCard({ icon, label, sub, isActive, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 group overflow-hidden ${isActive
                ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:border-white/10'
                }`}
        >
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className={`text-inherit opacity-80`}>{icon}</div>
                <div>
                    <h3 className="font-bold text-lg leading-none mb-1 text-inherit">{label}</h3>
                    <p className={`text-xs font-medium tracking-wide ${isActive ? 'text-neutral-500' : 'text-neutral-600'}`}>{sub}</p>
                </div>
            </div>
        </button>
    )
}
