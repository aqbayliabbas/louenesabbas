'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RefreshCw } from 'lucide-react';

// --- Color Utility Functions ---

function hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ]
        : null;
}

function componentToHex(c: number) {
    const hex = Math.round(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// HSV / HSL Conversions

function rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    h /= 360;
    s /= 100;
    v /= 100;
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return [r * 255, g * 255, b * 255];
}

function hexToHsv(hex: string) {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 210, s: 100, v: 100 }; // default
    return rgbToHsv(rgb[0], rgb[1], rgb[2]);
}

function hsvToHex(h: number, s: number, v: number) {
    const [r, g, b] = hsvToRgb(h, s, v);
    return rgbToHex(r, g, b);
}

// Helper for Palette Generation (using HSL as it's easier for harmonies)
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hslToHex(h: number, s: number, l: number) {
    h = h % 360;
    if (h < 0) h += 360;
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));
    const [r, g, b] = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
}

function getContrastColor(hex: string) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    const [r, g, b] = rgb;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
}

interface Palette {
    name: string;
    colors: string[];
}

export default function ColorizoPage() {
    const [baseColor, setBaseColor] = useState<string>('#3b82f6');
    const [hsv, setHsv] = useState({ h: 217, s: 76, v: 96 }); // Initial Sync with #3b82f6
    const [palettes, setPalettes] = useState<Palette[]>([]);
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    // Refs for drag interaction
    const satValRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);
    const satRef = useRef<HTMLDivElement>(null);
    const valRef = useRef<HTMLDivElement>(null);
    const isDraggingSatVal = useRef(false);
    const isDraggingHue = useRef(false);
    const isDraggingSat = useRef(false);
    const isDraggingVal = useRef(false);

    // Golden Ratio Constant
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const GOLDEN_RATIO = 1.618;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // Sync HSV to BaseColor when initialized or changed externally (like randomizer)
    const updateHsvFromHex = useCallback((hex: string) => {
        const newHsv = hexToHsv(hex);
        setHsv(newHsv);
    }, []);

    useEffect(() => {
        generatePalettes(baseColor);
    }, [baseColor]);

    const generatePalettes = (hex: string) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return;
        const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

        const newPalettes: Palette[] = [
            {
                name: 'Complementary',
                colors: [hex, hslToHex(h + 180, s, l)]
            },
            {
                name: 'Triadic',
                colors: [hex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)]
            },
            {
                name: 'Analogous',
                colors: [hslToHex(h - 30, s, l), hex, hslToHex(h + 30, s, l)]
            },
            {
                name: 'Split Complementary',
                colors: [hex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)]
            },
            {
                name: 'Tetradic (Square)',
                colors: [hex, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)]
            },
            {
                name: 'Tetradic (Rectangular)',
                colors: [hex, hslToHex(h + 60, s, l), hslToHex(h + 180, s, l), hslToHex(h + 240, s, l)]
            },
            {
                name: 'Monochromatic',
                colors: [
                    hslToHex(h, s, Math.max(0, l - 30)),
                    hslToHex(h, s, Math.max(0, l - 15)),
                    hex,
                    hslToHex(h, s, Math.min(100, l + 15)),
                    hslToHex(h, s, Math.min(100, l + 30))
                ]
            },
            {
                name: 'Shades',
                colors: [
                    hslToHex(h, s, 90),
                    hslToHex(h, s, 70),
                    hslToHex(h, s, 50),
                    hslToHex(h, s, 30),
                    hslToHex(h, s, 10)
                ]
            },
            {
                name: 'Tones',
                colors: [
                    hslToHex(h, 20, l),
                    hslToHex(h, 40, l),
                    hslToHex(h, 60, l),
                    hslToHex(h, 80, l),
                    hslToHex(h, 100, l)
                ]
            }
        ];

        setPalettes(newPalettes);
    };

    const handleColorUpdate = (newHsv: { h: number, s: number, v: number }) => {
        setHsv(newHsv);
        const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
        setBaseColor(hex);
    };

    // --- Interaction Handlers ---

    const handleSatValMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!satValRef.current) return;
        const rect = satValRef.current.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        const s = x * 100;
        const v = (1 - y) * 100;

        handleColorUpdate({ ...hsv, s, v });
    }, [hsv]);

    const handleHueMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();

        let clientX;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = (e as MouseEvent).clientX;
        }

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const h = x * 360;

        handleColorUpdate({ ...hsv, h });
    }, [hsv]);

    const handleSatMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!satRef.current) return;
        const rect = satRef.current.getBoundingClientRect();

        let clientX;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = (e as MouseEvent).clientX;
        }

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const s = x * 100;

        handleColorUpdate({ ...hsv, s });
    }, [hsv]);

    const handleValMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!valRef.current) return;
        const rect = valRef.current.getBoundingClientRect();

        let clientX;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = (e as MouseEvent).clientX;
        }

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        // Value goes from 0 (black) to 100 (full brightness)
        const v = x * 100;

        handleColorUpdate({ ...hsv, v });
    }, [hsv]);


    // Global Event Listeners for Dragging
    useEffect(() => {
        const handleUp = () => {
            isDraggingSatVal.current = false;
            isDraggingHue.current = false;
            isDraggingSat.current = false;
            isDraggingVal.current = false;
            document.body.style.userSelect = '';
        };

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (isDraggingSatVal.current) {
                handleSatValMove(e);
            }
            if (isDraggingHue.current) {
                handleHueMove(e);
            }
            if (isDraggingSat.current) {
                handleSatMove(e);
            }
            if (isDraggingVal.current) {
                handleValMove(e);
            }
        };

        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);

        return () => {
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, [handleSatValMove, handleHueMove, handleSatMove, handleValMove]);


    const handleSatValDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDraggingSatVal.current = true;
        document.body.style.userSelect = 'none';
        handleSatValMove(e);
    };

    const handleHueDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDraggingHue.current = true;
        document.body.style.userSelect = 'none';
        handleHueMove(e);
    };

    const handleSatDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDraggingSat.current = true;
        document.body.style.userSelect = 'none';
        handleSatMove(e);
    };

    const handleValDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDraggingVal.current = true;
        document.body.style.userSelect = 'none';
        handleValMove(e);
    };

    const handleCopy = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 2000);
    };

    const randomize = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setBaseColor(randomColor);
        updateHsvFromHex(randomColor);
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7] selection:bg-black selection:text-white pb-20 font-sans">
            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-[1400px] mx-auto">
                <header className="mb-16 md:mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-black">
                            Colorizo<span className="text-[#d4af37]">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl font-light">
                            The Golden Ratio of Color. Generate harmonious palettes instantly.
                        </p>
                    </motion.div>
                </header>

                <div className="grid lg:grid-cols-[1fr_1.618fr] gap-12 lg:gap-24 items-start">
                    {/* Controls Section (Design & Picker) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:sticky lg:top-32"
                    >
                        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-neutral-100 backdrop-blur-sm select-none">
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
                                Base Color
                            </label>

                            <div className="flex flex-col gap-6">
                                {/* Custom Saturation/Value Picker */}
                                <div
                                    ref={satValRef}
                                    className="relative w-full aspect-[1.618/1] rounded-2xl overflow-hidden cursor-crosshair shadow-inner"
                                    onMouseDown={handleSatValDown}
                                    onTouchStart={handleSatValDown}
                                    style={{
                                        backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                        backgroundImage: `
                                            linear-gradient(to top, #000, transparent), 
                                            linear-gradient(to right, #fff, transparent)
                                        `
                                    }}
                                >
                                    <div
                                        className="absolute w-4 h-4 rounded-full border-2 border-white box-content shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                        style={{
                                            left: `${hsv.s}%`,
                                            top: `${100 - hsv.v}%`,
                                            backgroundColor: baseColor
                                        }}
                                    />
                                </div>

                                {/* Custom Hue Slider */}
                                <div
                                    ref={hueRef}
                                    className="relative w-full h-4 rounded-full cursor-pointer shadow-inner"
                                    onMouseDown={handleHueDown}
                                    onTouchStart={handleHueDown}
                                    style={{
                                        background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                                    }}
                                >
                                    <div
                                        className="absolute w-6 h-6 bg-white border border-neutral-200 rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none"
                                        style={{
                                            left: `${(hsv.h / 360) * 100}%`
                                        }}
                                    />
                                </div>

                                {/* Custom Saturation Slider */}
                                <div
                                    ref={satRef}
                                    className="relative w-full h-4 rounded-full cursor-pointer shadow-inner"
                                    onMouseDown={handleSatDown}
                                    onTouchStart={handleSatDown}
                                    style={{
                                        background: `linear-gradient(to right, ${hsvToHex(hsv.h, 0, hsv.v)}, ${hsvToHex(hsv.h, 100, hsv.v)})`
                                    }}
                                >
                                    <div
                                        className="absolute w-6 h-6 bg-white border border-neutral-200 rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none"
                                        style={{
                                            left: `${hsv.s}%`
                                        }}
                                    />
                                </div>

                                {/* Custom Lightness/Value Slider */}
                                <div
                                    ref={valRef}
                                    className="relative w-full h-4 rounded-full cursor-pointer shadow-inner"
                                    onMouseDown={handleValDown}
                                    onTouchStart={handleValDown}
                                    style={{
                                        background: `linear-gradient(to right, #000000, ${hsvToHex(hsv.h, hsv.s, 100)})`
                                    }}
                                >
                                    <div
                                        className="absolute w-6 h-6 bg-white border border-neutral-200 rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none"
                                        style={{
                                            left: `${hsv.v}%`
                                        }}
                                    />
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={baseColor.toUpperCase()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Allow typing hex
                                                if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                                                    setBaseColor(val);
                                                    updateHsvFromHex(val);
                                                } else {
                                                    // Just update visual if typing, wait for valid hex
                                                    setBaseColor(val);
                                                }
                                            }}
                                            className="w-full bg-neutral-50 border-none rounded-xl px-4 py-4 font-mono text-lg text-black focus:ring-2 focus:ring-black/5 outline-none text-center uppercase tracking-wider transition-shadow"
                                            placeholder="#000000"
                                            maxLength={7}
                                        />
                                        <div className="text-center mt-2 text-xs text-neutral-400">
                                            Hex Code
                                        </div>
                                    </div>

                                    <button
                                        onClick={randomize}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                                    >
                                        <RefreshCw size={14} />
                                        Randomize
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Output Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {palettes.map((palette, idx) => (
                            <motion.div
                                key={palette.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * idx }}
                                className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100"
                            >
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-black"></span>
                                    {palette.name}
                                </h2>

                                <div className="flex flex-col gap-6">
                                    {/* Preview Card */}
                                    <div
                                        className="w-full aspect-[1.618/1] rounded-2xl overflow-hidden shadow-inner flex"
                                    >
                                        {palette.colors.map((color, i) => (
                                            <div
                                                key={i}
                                                className="h-full flex-1 transition-all duration-300 hover:flex-[1.5] group relative cursor-pointer"
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleCopy(color)}
                                            >
                                                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${getContrastColor(color) === '#ffffff' ? 'text-white' : 'text-black'}`}>
                                                    {copiedHex === color ? <Check size={20} /> : <Copy size={20} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Color Codes List */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {palette.colors.map((color, i) => (
                                            <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-neutral-50 transition-colors" onClick={() => handleCopy(color)}>
                                                <div
                                                    className="w-6 h-6 rounded-full shadow-sm border border-black/10 transition-transform group-hover:scale-110"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <span className="font-mono text-xs text-neutral-600 group-hover:text-black transition-colors">
                                                    {color.toUpperCase()}
                                                </span>
                                                {copiedHex === color && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                                        className="text-[8px] font-bold text-green-600 uppercase tracking-wider"
                                                    >
                                                        Copied
                                                    </motion.span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
