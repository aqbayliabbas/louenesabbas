'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
    const pathname = usePathname();

    // Hide navbar on admin and questionnaire routes
    if (pathname?.startsWith('/admin') || pathname === '/questionnaire') {
        return null;
    }

    return <Navbar />;
}
