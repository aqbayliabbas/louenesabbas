import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Insert into Supabase table 'responses'
        const { error } = await supabase
            .from('responses')
            .insert([
                {
                    company_name: data.company,
                    mission: data.mission,
                    audience: data.audience,
                    values: data.values,
                    personality: data.personality_sliders,
                    positioning: data.positioning,
                    competitors: data.competitors,
                    emotion: data.emotion,
                    deliverables: data.deliverables,
                    touchpoints: data.touchpoints,
                    design_references: data.references,
                    timeline: data.timeline,
                    budget: data.budget,
                    raw_data: data
                }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ message: 'Error saving to database' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        return NextResponse.json({ message: 'Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ responses: data || [] });
    } catch (error) {
        return NextResponse.json({ responses: [] }, { status: 500 });
    }
}
