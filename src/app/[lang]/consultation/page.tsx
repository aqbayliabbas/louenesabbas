'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
    ChevronLeft,
    AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/ui/Navbar';

type Platform = 'google_meet' | 'whatsapp';

export default function ConsultationPage() {
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [takenSlots, setTakenSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const [contactInfo, setContactInfo] = useState('');
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch availability when date changes
    useEffect(() => {
        if (!selectedDate) return;

        const fetchAvailability = async () => {
            setIsLoadingSlots(true);
            try {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const res = await fetch(`/api/consultation/slots?date=${dateStr}`);
                const data = await res.json();
                setTakenSlots(data.takenSlots || []);
            } catch (err) {
                console.error('Failed to fetch availability:', err);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailability();
        setSelectedTime(null); // Reset time when date changes
    }, [selectedDate]);

    // Calendar logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Fill empty slots for previous month
        const startDay = firstDay.getDay(); // 0 is Sunday
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const prevMonth = () => {
        const d = new Date(currentMonth);
        d.setMonth(d.getMonth() - 1);
        if (d >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
            setCurrentMonth(d);
        }
    };

    const nextMonth = () => {
        const d = new Date(currentMonth);
        d.setMonth(d.getMonth() + 1);
        setCurrentMonth(d);
    };

    const getTimeSlots = (date: Date | null) => {
        if (!date) return [];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const hours = isWeekend ? 5 : 3;

        const slots = [];
        for (let i = 0; i < hours * 2; i++) {
            const h = 10 + Math.floor(i / 2);
            const m = (i % 2) * 30;
            slots.push(`${h}:${m === 0 ? '00' : m}`);
        }
        return slots;
    };

    const timeSlots = getTimeSlots(selectedDate);

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

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black" data-nav-dark>

            <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                {/* Left: Brand / Context */}
                <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-12">
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
                        <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.9] text-white mb-8">
                            The First <br />
                            <span className="text-neutral-500 italic font-serif font-light">Step.</span>
                        </h1>
                        <p className="text-lg text-neutral-400 leading-relaxed font-light max-w-sm">
                            15 minutes of pure strategy. No sales pitch, just clarity on your vision and how we can bring it to life with precision.
                        </p>
                    </motion.div>

                    <div className="hidden lg:block space-y-6 pt-12 border-t border-white/10">
                        {['Clarify your brand trajectory', 'Discuss timeline & investment', 'Immediate expert feedback'].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-neutral-500">
                                <CheckCircle2 size={18} className="text-white shrink-0" />
                                <span className="text-sm tracking-wide">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Booking Module */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-32 px-12 flex flex-col items-center justify-center h-full min-h-[600px]"
                                >
                                    <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.15)]">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Booking Requested.</h2>
                                    <p className="text-neutral-400 text-lg mb-12 max-w-sm font-medium">
                                        I'll review your details and send a confirmation to your {platform === 'google_meet' ? 'email' : 'WhatsApp'} shortly.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="px-10 py-5 bg-white text-black rounded-full font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-all text-xs"
                                    >
                                        Back to Home
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="divide-y divide-white/5">

                                    {/* Platform Selection */}
                                    <div className="p-8 md:p-12 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">1</span>
                                            <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Choose preferred platform</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <PlatformCard
                                                icon={<Video size={20} />}
                                                label="Google Meet"
                                                isActive={platform === 'google_meet'}
                                                onClick={() => setPlatform('google_meet')}
                                            />
                                            <PlatformCard
                                                icon={<Phone size={20} />}
                                                label="WhatsApp Call"
                                                isActive={platform === 'whatsapp'}
                                                onClick={() => setPlatform('whatsapp')}
                                            />
                                        </div>
                                    </div>

                                    {/* Calendar & Slots */}
                                    <div className={`p-8 md:p-12 space-y-8 transition-opacity duration-500 ${!platform && 'opacity-20 pointer-events-none'}`}>
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">2</span>
                                            <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Select a date & time</h3>
                                        </div>

                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                            {/* Custom Calendar UI */}
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-lg font-bold">{monthName}</span>
                                                    <div className="flex gap-1">
                                                        <button type="button" onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={18} /></button>
                                                        <button type="button" onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={18} /></button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-7 gap-1">
                                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                                        <div key={d} className="h-10 flex items-center justify-center text-[10px] font-bold text-neutral-600">{d}</div>
                                                    ))}
                                                    {days.map((date, i) => {
                                                        if (!date) return <div key={`empty-${i}`} className="h-12 md:h-14" />;
                                                        const active = selectedDate?.toDateString() === date.toDateString();
                                                        const disabled = isPast(date);

                                                        return (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                disabled={disabled}
                                                                onClick={() => setSelectedDate(date)}
                                                                className={`h-12 md:h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all relative group
                                                                    ${active ? 'bg-white text-black shadow-xl shadow-white/10' : 'hover:bg-white/5'}
                                                                    ${disabled ? 'opacity-10 cursor-not-allowed' : ''}
                                                                `}
                                                            >
                                                                {date.getDate()}
                                                                {isToday(date) && !active && <div className="absolute bottom-2 w-1 h-1 rounded-full bg-white" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Time Picker */}
                                            <div className="relative min-h-[300px]">
                                                <AnimatePresence mode="wait">
                                                    {!selectedDate ? (
                                                        <motion.div
                                                            key="no-date"
                                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                            className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-3xl"
                                                        >
                                                            <CalendarIcon size={32} className="text-neutral-700 mb-4" />
                                                            <p className="text-sm text-neutral-500 font-medium">Select a date to <br /> see available slots</p>
                                                        </motion.div>
                                                    ) : isLoadingSlots ? (
                                                        <motion.div
                                                            key="loading"
                                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                            className="h-full flex items-center justify-center"
                                                        >
                                                            <Loader2 className="animate-spin text-neutral-500" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="slots"
                                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                            className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-fit"
                                                        >
                                                            {timeSlots.map((time) => {
                                                                const taken = takenSlots.includes(time);
                                                                return (
                                                                    <button
                                                                        key={time}
                                                                        type="button"
                                                                        disabled={taken}
                                                                        onClick={() => setSelectedTime(time)}
                                                                        className={`py-4 rounded-2xl text-[13px] font-bold transition-all border
                                                                            ${selectedTime === time
                                                                                ? 'bg-white text-black border-white'
                                                                                : taken
                                                                                    ? 'bg-neutral-900 border-white/5 text-neutral-700 opacity-50 cursor-not-allowed line-through'
                                                                                    : 'bg-transparent border-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {time}
                                                                    </button>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Detail Form */}
                                    <div className={`p-8 md:p-12 space-y-8 transition-all duration-500 ${(!selectedDate || !selectedTime) && 'opacity-20 pointer-events-none'}`}>
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">3</span>
                                            <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Confirm your identity</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                                    className="h-16 bg-white/5 rounded-2xl px-6 outline-none focus:bg-white/[0.08] transition-all font-medium border border-white/5 focus:border-white/20"
                                                    placeholder="Full Name"
                                                />
                                                <input
                                                    type={platform === 'google_meet' ? 'email' : 'tel'} required value={contactInfo} onChange={(e) => setContactInfo(e.target.value)}
                                                    className="h-16 bg-white/5 rounded-2xl px-6 outline-none focus:bg-white/[0.08] transition-all font-medium border border-white/5 focus:border-white/20"
                                                    placeholder={platform === 'whatsapp' ? 'Phone Number (+213...)' : 'Email Address'}
                                                />
                                            </div>
                                            <textarea
                                                rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                                                className="w-full bg-white/5 rounded-3xl px-6 py-5 outline-none focus:bg-white/[0.08] transition-all font-medium border border-white/5 focus:border-white/20 resize-none"
                                                placeholder="What's the main challenge you're facing with your brand?"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full mt-4 h-20 bg-white text-black hover:bg-neutral-200 rounded-[2rem] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : (
                                                <>
                                                    Request Consultation
                                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

function PlatformCard({ icon, label, isActive, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300 text-left
                ${isActive
                    ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]'
                    : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:border-white/10'
                }`}
        >
            <div className={`p-3 rounded-xl ${isActive ? 'bg-black/5' : 'bg-white/5'}`}>{icon}</div>
            <span className="font-bold tracking-tight">{label}</span>
        </button>
    )
}
