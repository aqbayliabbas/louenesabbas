'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { motion } from 'framer-motion';
import { Search, Type, Plus, Check } from 'lucide-react';

// --- Data: Curated Font Pairings ---
interface FontPair {
    id: string;
    heading: string;
    body: string;
    category: 'Modern' | 'Classic' | 'Tech' | 'Editorial' | 'Playful';
    description: string;
}

const FONT_PAIRINGS: FontPair[] = [
    { id: '1', heading: 'Playfair Display', body: 'Lato', category: 'Classic', description: 'L\'élégance intemporelle rencontre la clarté moderne.' },
    { id: '2', heading: 'Oswald', body: 'Open Sans', category: 'Modern', description: 'Des titres forts et condensés avec un corps de texte neutre.' },
    { id: '3', heading: 'Montserrat', body: 'Merriweather', category: 'Classic', description: 'Énergie urbaine géométrique équilibrée par des empattements lisibles.' },
    { id: '4', heading: 'Raleway', body: 'Roboto', category: 'Tech', description: 'Graisses fines sophistiquées associées à une précision mécanique.' },
    { id: '5', heading: 'Abril Fatface', body: 'Poppins', category: 'Editorial', description: 'Courbes à haut contraste avec stabilité géométrique.' },
    { id: '6', heading: 'Cinzel', body: 'Fauna One', category: 'Classic', description: 'Proportions romaines classiques pour le luxe haut de gamme.' },
    { id: '7', heading: 'Syne', body: 'Inter', category: 'Modern', description: 'Excentricité d\'art et d\'essai ancrée dans le fonctionnalisme.' },
    { id: '8', heading: 'Space Grotesk', body: 'Space Mono', category: 'Tech', description: 'Esthétique technologique brutaliste.' },
    { id: '9', heading: 'DM Serif Display', body: 'DM Sans', category: 'Editorial', description: 'Puissance éditoriale contemporaine.' },
    { id: '10', heading: 'Unbounded', body: 'Work Sans', category: 'Modern', description: 'En-têtes expansifs et distinctifs avec des détails pratiques.' },
    { id: '11', heading: 'Cormorant Garamond', body: 'Proza Libre', category: 'Classic', description: 'Élégance fluide et organique pour les marques raffinées.' },
    { id: '12', heading: 'Bebas Neue', body: 'Montserrat', category: 'Modern', description: 'La police de titre condensée ultime avec un partenaire géométrique.' },
    { id: '13', heading: 'Righteous', body: 'Ubuntu', category: 'Tech', description: 'Courbes d\'inspiration science-fiction avec une chaleur humaniste.' },
    { id: '14', heading: 'Lora', body: 'Source Sans 3', category: 'Editorial', description: 'Racines calligraphiques rencontrant la fiabilité numérique.' },
    { id: '15', heading: 'Yeseva One', body: 'Josefin Sans', category: 'Classic', description: 'Grâce féminine avec une netteté géométrique.' },
    { id: '16', heading: 'Archivo Black', body: 'Archivo', category: 'Modern', description: 'Impact lourd avec un ADN grotesque cohérent.' },
    { id: '17', heading: 'Fraunces', body: 'Mulish', category: 'Playful', description: 'Empattements doux à l\'ancienne avec un minimalisme amical.' },
    { id: '18', heading: 'Permanent Marker', body: 'Caveat', category: 'Playful', description: 'Dessiné à la main, authentique et totalement informel.' },
    { id: '19', heading: 'Prata', body: 'Lato', category: 'Classic', description: 'Vibes didones de haute couture offrant un contraste tranchant.' },
    { id: '20', heading: 'Anton', body: 'Roboto Condensed', category: 'Modern', description: 'Affiches audacieuses qui captent l\'attention.' },
];

export default function TypologyPage() {
    const [filter, setFilter] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDownloading, setIsDownloading] = useState(false);

    // --- Dynamic Font Loading ---
    useEffect(() => {
        const fontsToLoad = new Set<string>();
        FONT_PAIRINGS.forEach(pair => {
            fontsToLoad.add(pair.heading);
            fontsToLoad.add(pair.body);
        });

        const fontQuery = Array.from(fontsToLoad)
            .map(font => `family=${font.replace(/ /g, '+')}:wght@400;700`)
            .join('&');

        if (!fontQuery) return;

        const linkId = 'typology-google-fonts';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            setTimeout(() => setLoadedFonts(new Set(Array.from(fontsToLoad))), 500);
        } else {
            setLoadedFonts(new Set(Array.from(fontsToLoad)));
        }
    }, []);

    // --- Selection Logic ---
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    // --- Download Logic ---
    const handleDownloadFonts = async () => {
        if (selectedIds.size === 0 || isDownloading) return;
        setIsDownloading(true);

        const selectedPairs = FONT_PAIRINGS.filter(p => selectedIds.has(p.id));
        const uniqueFamilies = new Set<string>();

        selectedPairs.forEach(p => {
            uniqueFamilies.add(p.heading);
            uniqueFamilies.add(p.body);
        });

        try {
            const response = await fetch('/api/fonts/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fonts: Array.from(uniqueFamilies) }),
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `typology-collection-${new Date().toLocaleDateString().replace(/\//g, '-')}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert('Failed to bundle fonts. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const filteredPairings = FONT_PAIRINGS.filter(pair => {
        const matchesCategory = filter === 'All' || pair.category === filter;
        const matchesSearch = pair.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pair.body.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ['Tout', 'Moderne', 'Classique', 'Éditorial', 'Technologique', 'Ludique'];

    return (
        <main className="min-h-screen bg-[#FDFBF7] selection:bg-black selection:text-white pb-32 font-sans relative">
            <Navbar />

            {/* Floating Action Bar for Download */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: selectedIds.size > 0 ? 0 : 100, opacity: selectedIds.size > 0 ? 1 : 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#1a1a1a] text-white pl-8 pr-4 py-3 rounded-[5px] shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-md"
            >
                <div className="text-sm font-medium whitespace-nowrap">
                    <span className="font-bold text-[#d4af37] text-lg mr-2">{selectedIds.size}</span>
                    <span className="text-neutral-400 uppercase tracking-widest text-[10px]">Collection Sélectionnée</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDownloadFonts}
                        disabled={isDownloading}
                        className={`px-6 py-3 rounded-[5px] text-[10px] font-bold uppercase tracking-widest transition-all ${isDownloading
                            ? 'bg-neutral-600 text-neutral-400 cursor-wait'
                            : 'bg-white text-black hover:bg-[#d4af37] hover:text-white'
                            }`}
                    >
                        {isDownloading ? 'Compilation...' : 'Télécharger ZIP'}
                    </button>
                </div>
            </motion.div>

            <div className="pt-32 px-6 md:px-12 max-w-[1600px] mx-auto">
                <header className="mb-16 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-black">
                            Typology<span className="text-[#d4af37]">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl font-light mb-12">
                            Systèmes typographiques sélectionnés. Découvrez le mariage parfait pour votre marque.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between border-b border-black/10 pb-8">
                            {/* Categories */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-4 py-2 rounded-[5px] text-xs font-bold uppercase tracking-widest transition-all ${filter === cat
                                            ? 'bg-black text-white'
                                            : 'bg-white border border-neutral-200 text-neutral-500 hover:border-black hover:text-black'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher des polices..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-neutral-200 rounded-[5px] px-12 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPairings.map((pair, idx) => (
                        <FontCard
                            key={pair.id}
                            pair={pair}
                            index={idx}
                            loaded={loadedFonts.size > 0}
                            isSelected={selectedIds.has(pair.id)}
                            onToggle={() => toggleSelection(pair.id)}
                        />
                    ))}
                </div>

                {filteredPairings.length === 0 && (
                    <div className="py-20 text-center text-neutral-400">
                        <Type size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-bold uppercase tracking-widest">Aucun mariage trouvé</p>
                    </div>
                )}
            </div>
        </main>
    );
}

function FontCard({ pair, index, loaded, isSelected, onToggle }: { pair: FontPair; index: number; loaded: boolean; isSelected: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onClick={onToggle}
            className={`group relative bg-white rounded-[5px] p-8 transition-all duration-300 border flex flex-col justify-between h-[400px] cursor-pointer ${isSelected
                ? 'ring-2 ring-black border-transparent shadow-2xl translate-y-[-8px] z-10'
                : 'border-black/5 hover:shadow-xl hover:-translate-y-1 hover:border-black/20'
                }`}
        >
            <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Visual Preview */}
                <div className="space-y-6 mb-8 pointer-events-none">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-2 block">Titre</span>
                        <h3
                            className="text-4xl leading-tight text-black"
                            style={{ fontFamily: `"${pair.heading}", sans-serif` }}
                        >
                            Portez ce vieux vin blond au juge qui fume
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1">{pair.heading}</p>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-2 block">Corps de texte</span>
                        <p
                            className="text-lg leading-relaxed text-neutral-600 line-clamp-3"
                            style={{ fontFamily: `"${pair.body}", sans-serif` }}
                        >
                            Chaque marque raconte une histoire. La typographie que vous choisissez définit la voix, le ton et le rythme de ce récit.
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">{pair.body}</p>
                    </div>
                </div>
            </div>

            {/* Footer / Meta */}
            <div className="border-t border-neutral-100 pt-6 flex justify-between items-end mt-auto pointer-events-none">
                <div>
                    <span className="inline-block px-3 py-1 bg-neutral-100 rounded-[5px] text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                        {pair.category}
                    </span>
                    <p className="text-xs text-neutral-400 max-w-[200px] leading-relaxed line-clamp-2">
                        {pair.description}
                    </p>
                </div>

                <div
                    className={`w-10 h-10 rounded-[5px] flex items-center justify-center transition-all duration-300 ${isSelected
                        ? 'bg-black text-white rotate-0'
                        : 'bg-neutral-100 text-neutral-400 group-hover:bg-black group-hover:text-white'
                        }`}
                >
                    {isSelected ? <Check size={18} /> : <Plus size={18} />}
                </div>
            </div>

            {/* Selection Overlay Tint */}
            {isSelected && <div className="absolute inset-0 bg-black/[0.02] pointer-events-none rounded-[5px]" />}
        </motion.div>
    );
}
