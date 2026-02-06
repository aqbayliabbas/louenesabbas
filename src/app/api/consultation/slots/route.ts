import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('booking_time')
            .eq('booking_date', date)
            .eq('status', 'confirmed'); // Only confirmed bookings block the slot 

        if (error) throw error;

        const takenSlots = data.map(b => b.booking_time);
        return NextResponse.json({ takenSlots });
    } catch (error) {
        console.error('Error fetching slots:', error);
        return NextResponse.json({ takenSlots: [] }, { status: 500 });
    }
}
