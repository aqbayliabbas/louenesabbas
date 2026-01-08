import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Sign in with Supabase using email (username in the form)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 401 }
            );
        }

        if (data?.session) {
            const response = NextResponse.json({ message: 'Login successful' });

            // We still set a cookie for the middleware to easily check auth without a full DB call every time
            // though Supabase has its own session management.
            (await cookies()).set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            // You might also want to store the access token if needed for server-side Supabase calls
            (await cookies()).set('sb-access-token', data.session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { message: 'Erreur inconnue' },
            { status: 500 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
