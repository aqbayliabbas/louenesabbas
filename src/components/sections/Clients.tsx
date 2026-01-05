'use client';

// Simple placeholder logos using text or SVGs would be better, but we'll simulate a clean high-end logo strip
// In a real app, these would be SVGs of Google, Spotify, etc.

const logos = [
    "Acme Corp", "Lumina", "Ozone", "Vertex", "Solstice", "Aether", "Nimbus", "Quantum"
];

export function Clients() {
    return (
        <section className="py-12 border-y border-border/40 bg-muted/10">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {logos.map((logo, i) => (
                        <div key={i} className="text-xl md:text-2xl font-bold tracking-tighter mix-blend-multiply dark:mix-blend-screen select-none font-serif italic">
                            {logo}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
