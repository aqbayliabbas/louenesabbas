import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Use count: 'exact' to check if anything was actually deleted
        // This helps detect RLS issues where Supabase returns 200 even if 0 rows were affected
        const { error, count } = await supabaseServer
            .from('responses')
            .delete({ count: 'exact' })
            .eq('id', id);

        if (error) {
            console.error('Supabase Delete Error:', error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        if (count === 0) {
            console.warn(`No row found with ID ${id} or permission denied (RLS).`);
            return NextResponse.json({
                message: 'Aucune ligne supprimée. Vérifiez vos permissions RLS ou la clé SERVICE_ROLE.'
            }, { status: 403 });
        }

        return NextResponse.json({ message: 'Deleted successfully', count });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting response' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { error } = await supabaseServer
            .from('responses')
            .update(body)
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating response' }, { status: 500 });
    }
}
