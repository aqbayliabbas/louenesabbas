'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
    const pathname = usePathname();

    // The user wants the navbar visible ONLY in the landing page
    if (pathname === '/') {
        return <Navbar />;
    }

    // For login and dashboard, the links should definitely not be there.
    // We already hide it on all non-landing pages, but for clarity:
    // Any pages under /admin/ (dashboard and login) should not show the main site navbar
    // as they have their own navigation/structure.

    return null;
}
