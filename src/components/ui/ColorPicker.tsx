import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helpers ---

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

// --- Component ---

export function ColorPickerPopover({ color, onChange }: { color: string, onChange: (c: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hsv, setHsv] = useState(hexToHsv(color));
    const containerRef = useRef<HTMLDivElement>(null);
    const satValRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);

    // Sync external color change
    useEffect(() => {
        setHsv(hexToHsv(color));
    }, [color]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateColor = (newHsv: { h: number, s: number, v: number }) => {
        setHsv(newHsv);
        onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    };

    const handleSatValMove = (e: React.MouseEvent | MouseEvent) => {
        if (!satValRef.current) return;
        const rect = satValRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

        updateColor({ ...hsv, s: x * 100, v: (1 - y) * 100 });
    };

    const handleHueMove = (e: React.MouseEvent | MouseEvent) => {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

        updateColor({ ...hsv, h: x * 360 });
    };

    const handleMouseDown = (e: React.MouseEvent, type: 'satval' | 'hue') => {
        e.preventDefault();
        const moveHandler = (moveEvent: MouseEvent) => {
            if (type === 'satval') handleSatValMove(moveEvent);
            else handleHueMove(moveEvent);
        };
        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
        // Initial click
        if (type === 'satval') handleSatValMove(e);
        else handleHueMove(e);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full border border-neutral-200 shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: color }}
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-4 z-50 origin-bottom"
                    >
                        {/* Saturation/Value Area */}
                        <div
                            ref={satValRef}
                            className="w-full h-40 rounded-xl mb-4 relative cursor-crosshair overflow-hidden shadow-inner"
                            style={{
                                backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                backgroundImage: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'satval')}
                        >
                            <div
                                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md box-border -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    left: `${hsv.s}%`,
                                    top: `${100 - hsv.v}%`,
                                    backgroundColor: color
                                }}
                            />
                        </div>

                        {/* Hue Slider */}
                        <div
                            ref={hueRef}
                            className="w-full h-4 rounded-full relative cursor-pointer shadow-inner mb-4"
                            style={{
                                background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'hue')}
                        >
                            <div
                                className="absolute w-5 h-5 bg-white border border-neutral-200 rounded-full shadow -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none"
                                style={{ left: `${(hsv.h / 360) * 100}%` }}
                            />
                        </div>

                        {/* Hex Input & Grid */}
                        <div className="flex gap-2">
                            <div className="flex-1 bg-neutral-100 rounded-lg flex items-center px-2">
                                <span className="text-neutral-400 text-xs font-mono">#</span>
                                <input
                                    type="text"
                                    value={color.replace('#', '').toUpperCase()}
                                    onChange={(e) => {
                                        const val = '#' + e.target.value;
                                        if (/^#[0-9A-F]{6}$/i.test(val)) {
                                            onChange(val);
                                        }
                                    }}
                                    className="w-full bg-transparent border-none text-xs font-mono p-1 outline-none text-neutral-700"
                                />
                            </div>

                            {/* Presets */}
                            <div className="flex gap-1">
                                {['#000000', '#FFFFFF', '#FF0080', '#7928CA', '#0070F3'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => onChange(c)}
                                        className="w-6 h-6 rounded-md border border-black/5 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
