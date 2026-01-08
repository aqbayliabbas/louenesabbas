import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out' });
    (await cookies()).delete('admin_session');
    return response;
}
