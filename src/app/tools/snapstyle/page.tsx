'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Sparkles, Layout, Monitor, Instagram, Twitter, Linkedin, Trash2, Sliders } from 'lucide-react';

// --- Types ---

interface SnapSettings {
    background: {
        type: 'solid' | 'gradient' | 'image';
        color1: string;
        color2: string; // Used for gradient
        angle: number;  // Used for gradient
        grain: number;  // 0 to 1
    };
    style: {
        radius: number; // px
        shadow: number; // px (blur)
        padding: number; // px
        shadowOpacity: number; // 0 to 1
    };
    size: {
        preset: 'FHD' | 'Sq' | 'Port' | 'Tw' | 'Custom';
        width: number;
        height: number;
    };
    position: {
        x: number;
        y: number;
        scale: number;
    };
}

const PRESETS = {
    'FHD': { label: 'Full HD (16:9)', w: 1920, h: 1080 },
    'Sq': { label: 'Square (1:1)', w: 1080, h: 1080 },
    'Port': { label: 'Portrait (4:5)', w: 1080, h: 1350 },
    'Tw': { label: 'Twitter Header', w: 1500, h: 500 },
};

// --- Components ---

const Slider = ({
    label,
    value,
    min,
    max,
    onChange,
    unit = ''
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    unit?: string;
}) => {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">{label}</label>
                <span className="text-xs font-mono text-neutral-600">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-neutral-100 rounded-full appearance-none cursor-pointer accent-black hover:accent-neutral-800 transition-all"
            />
        </div>
    );
};

// Reusing the CustomColorPicker component
import { ColorPickerPopover } from '@/components/ui/ColorPicker';

export default function SnapStylePage() {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('screenshot');
    const [settings, setSettings] = useState<SnapSettings>({
        background: { type: 'gradient', color1: '#FF0080', color2: '#7928CA', angle: 135, grain: 0.0 },
        style: { radius: 16, shadow: 40, padding: 64, shadowOpacity: 0.3 },
        size: { preset: 'FHD', width: 1920, height: 1080 },
        position: { x: 0, y: 0, scale: 1 }
    });
    const [isExporting, setIsExporting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generate noise texture
    const noiseUrl = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name.split('.')[0]);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setFileName(file.name.split('.')[0]);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImage(ev.target?.result as string);
                setSettings(s => ({ ...s, position: { x: 0, y: 0, scale: 1 } })); // Reset position
            };
            reader.readAsDataURL(file);
        }
    };

    // Drag Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!image) return;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX - settings.position.x, y: e.clientY - settings.position.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        setSettings(s => ({ ...s, position: { ...s.position, x: newX, y: newY } }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Global listener to stop dragging if mouse leaves container
    useEffect(() => {
        const upHandler = () => setIsDragging(false);
        window.addEventListener('mouseup', upHandler);
        return () => window.removeEventListener('mouseup', upHandler);
    }, []);

    // Export Logic
    const handleExport = async () => {
        if (!canvasRef.current) return;
        setIsExporting(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions
        canvas.width = settings.size.width;
        canvas.height = settings.size.height;

        // Draw Background
        if (settings.background.type === 'solid') {
            ctx.fillStyle = settings.background.color1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (settings.background.type === 'gradient') {
            const rad = (settings.background.angle * Math.PI) / 180;
            const length = Math.abs(canvas.width * Math.cos(rad)) + Math.abs(canvas.height * Math.sin(rad));
            const x0 = (canvas.width - length * Math.cos(rad)) / 2;
            const y0 = (canvas.height - length * Math.sin(rad)) / 2;
            const x1 = (canvas.width + length * Math.cos(rad)) / 2;
            const y1 = (canvas.height + length * Math.sin(rad)) / 2;

            const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
            gradient.addColorStop(0, settings.background.color1);
            gradient.addColorStop(1, settings.background.color2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw Grain
        if (settings.background.grain > 0) {
            const grainImg = new Image();
            grainImg.src = noiseUrl;
            await new Promise((resolve) => { grainImg.onload = resolve; });

            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = settings.background.grain * 0.5; // Scale down a bit
            const pattern = ctx.createPattern(grainImg, 'repeat');
            if (pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.restore();
        }

        if (image) {
            // Draw Image
            const img = new Image();
            img.src = image;
            await new Promise((resolve) => { img.onload = resolve; });

            // Calculate Image Rect (Fit Contain logic inside padding)
            const maxWidth = canvas.width - (settings.style.padding * 2);
            const maxHeight = canvas.height - (settings.style.padding * 2);

            let drawW = maxWidth;
            let drawH = (img.height / img.width) * drawW;

            if (drawH > maxHeight) {
                drawH = maxHeight;
                drawW = (img.width / img.height) * drawH;
            }

            let drawX = (canvas.width - drawW) / 2;
            let drawY = (canvas.height - drawH) / 2;

            // Apply manual offset (scaled to canvas size relative to preview size assumption)
            // Note: In a real app we'd map screen pixels to canvas pixels strictly.
            // For now, we assume standard 1920 preview equivalence or relative % based.
            // Simple approach: Treat offset as raw pixels for the canvas for now, 
            // OR ideally, map screen movement to canvas movement. 
            // A simple scale factor is roughly (canvasWidth / previewContainerWidth).
            // Let's assume the preview is roughly 500-800px wide. 
            // Better yet, let's treat the offset as percentage of the canvas.
            // BUT, since we store raw pixels in 'position.x', we need to decide what those pixels mean.
            // Let's assume the 'position.x' is relative to a "standard base" and we scale it up.
            // OR simpler: Just apply it directly if we assume the user is "moving" the canvas view.

            // To make it intuitive: 
            // visual_offset_pixels * (canvas_width / preview_element_width)
            // Since we don't track preview width easily here, let's apply a general multiplier for high-res export
            // e.g. if Canvas is 1920, and screen is ~600, multiplier is ~3.

            const scaleFactor = settings.size.width / 600; // Approx preview width
            drawX += settings.position.x * scaleFactor;
            drawY += settings.position.y * scaleFactor;

            // Apply scale
            const centerX = drawX + drawW / 2;
            const centerY = drawY + drawH / 2;

            drawW *= settings.position.scale;
            drawH *= settings.position.scale;

            drawX = centerX - drawW / 2;
            drawY = centerY - drawH / 2;


            // Draw Shadows using Temp Canvas (Hollow Shadow)
            // This prevents the "Black Box" issue behind transparent images
            const shadowCanvas = document.createElement('canvas');
            shadowCanvas.width = canvas.width;
            shadowCanvas.height = canvas.height;
            const sCtx = shadowCanvas.getContext('2d');

            if (sCtx) {
                sCtx.save();
                sCtx.shadowColor = `rgba(0, 0, 0, ${settings.style.shadowOpacity})`;
                sCtx.shadowBlur = settings.style.shadow * 2;
                sCtx.shadowOffsetY = settings.style.shadow * 0.5;
                sCtx.fillStyle = 'black'; // The caster color (will be cut out)

                // Draw the caster
                sCtx.beginPath();
                const casterCtx = sCtx as any;
                if (casterCtx.roundRect) {
                    casterCtx.roundRect(drawX, drawY, drawW, drawH, settings.style.radius);
                } else {
                    casterCtx.rect(drawX, drawY, drawW, drawH);
                }
                sCtx.fill();
                sCtx.restore();

                // Cut out the caster to leave only shadow
                sCtx.globalCompositeOperation = 'destination-out';
                sCtx.fillStyle = 'black';
                sCtx.beginPath();
                const cutoutCtx = sCtx as any;
                if (cutoutCtx.roundRect) {
                    cutoutCtx.roundRect(drawX, drawY, drawW, drawH, settings.style.radius);
                } else {
                    cutoutCtx.rect(drawX, drawY, drawW, drawH);
                }
                sCtx.fill();

                // Draw the hollow shadow onto the main canvas
                ctx.drawImage(shadowCanvas, 0, 0);
            }

            // Draw Image with Rounded Corners
            ctx.save();
            ctx.beginPath();
            const clipCtx = ctx as any;
            if (clipCtx.roundRect) {
                clipCtx.roundRect(drawX, drawY, drawW, drawH, settings.style.radius);
            } else {
                clipCtx.rect(drawX, drawY, drawW, drawH);
            }
            ctx.closePath();
            // Note: We don't fill here, we just clip the image

            ctx.clip(); // Clip to the rounded rect
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            ctx.restore();
        }

        // Download
        const link = document.createElement('a');
        link.download = `${fileName}-snapstyle.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        setIsExporting(false);
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7] selection:bg-black selection:text-white pb-20 font-sans">
            <Navbar />

            {/* Hidden Canvas for Processing */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="pt-32 px-6 md:px-12 max-w-[1600px] mx-auto">
                <header className="mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-black">
                            SnapStyle<span className="text-[#FF0080]">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl font-light">
                            Elevate your screenshots. Backgrounds, shadows, and style in seconds.
                        </p>
                    </motion.div>
                </header>

                <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
                    {/* Controls Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6 lg:sticky lg:top-32"
                    >
                        {/* Importer */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Image</h3>
                                {image && (
                                    <button onClick={() => setImage(null)} className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors group ${image ? 'border-neutral-200 hover:border-neutral-300' : 'border-blue-500/20 bg-blue-50/50 hover:bg-blue-50'}`}
                            >
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />

                                {image ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm border border-neutral-100 relative bg-neutral-100">
                                            <img src={image} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                        <span className="text-xs font-mono text-neutral-500 truncate max-w-[200px]">{fileName}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-neutral-400 group-hover:text-blue-500 transition-colors">
                                        <Upload size={24} />
                                        <span className="text-sm font-medium">Click or Drop Image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background Controls */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Background</h3>

                            <div className="flex gap-2 mb-6 p-1 bg-neutral-100 rounded-lg">
                                {['solid', 'gradient'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setSettings(s => ({ ...s, background: { ...s.background, type: t as any } }))}
                                        className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${settings.background.type === t ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-black'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <ColorPickerPopover color={settings.background.color1} onChange={(c) => setSettings(s => ({ ...s, background: { ...s.background, color1: c } }))} />
                                    {settings.background.type === 'gradient' && (
                                        <>
                                            <span className="text-neutral-300">&rarr;</span>
                                            <ColorPickerPopover color={settings.background.color2} onChange={(c) => setSettings(s => ({ ...s, background: { ...s.background, color2: c } }))} />
                                        </>
                                    )}
                                </div>

                                {settings.background.type === 'gradient' && (
                                    <Slider label="Angle" value={settings.background.angle} min={0} max={360} onChange={(v) => setSettings(s => ({ ...s, background: { ...s.background, angle: v } }))} unit="°" />
                                )}

                                <Slider label="Noise / Grain" value={Math.round(settings.background.grain * 100)} min={0} max={50} onChange={(v) => setSettings(s => ({ ...s, background: { ...s.background, grain: v / 100 } }))} unit="%" />
                            </div>
                        </div>

                        {/* Style Controls */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Style</h3>
                            <div className="space-y-6">
                                <Slider label="Padding" value={settings.style.padding} min={0} max={200} onChange={(v) => setSettings(s => ({ ...s, style: { ...s.style, padding: v } }))} unit="px" />
                                <Slider label="Roundness" value={settings.style.radius} min={0} max={50} onChange={(v) => setSettings(s => ({ ...s, style: { ...s.style, radius: v } }))} unit="px" />
                                <Slider label="Shadow Blur" value={settings.style.shadow} min={0} max={100} onChange={(v) => setSettings(s => ({ ...s, style: { ...s.style, shadow: v } }))} unit="px" />
                                <Slider label="Shadow Opacity" value={Math.round(settings.style.shadowOpacity * 100)} min={0} max={100} onChange={(v) => setSettings(s => ({ ...s, style: { ...s.style, shadowOpacity: v / 100 } }))} unit="%" />
                            </div>
                        </div>

                        {/* Size & Export */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Canvas</h3>

                            <div className="grid grid-cols-2 gap-2 mb-6">
                                {(Object.entries(PRESETS) as [string, any][]).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSettings(s => ({ ...s, size: { ...s.size, preset: key as any, width: val.w, height: val.h } }))}
                                        className={`py-2 px-3 border rounded-xl text-xs font-medium transition-colors text-left ${settings.size.preset === key ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                                    >
                                        <div className="font-bold">{val.label}</div>
                                        <div className="text-[10px] text-neutral-400 mt-1">{val.w} x {val.h}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="mb-6">
                                <Slider label="Scale" value={Math.round(settings.position.scale * 100)} min={10} max={200} onChange={(v) => setSettings(s => ({ ...s, position: { ...s.position, scale: v / 100 } }))} unit="%" />
                            </div>

                            <button
                                onClick={handleExport}
                                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all ${'bg-black text-white hover:bg-neutral-800 shadow-xl hover:shadow-2xl hover:-translate-y-1'}`}
                            >
                                {isExporting ? (
                                    <Sparkles className="animate-spin" />
                                ) : (
                                    <Download size={20} />
                                )}
                                {isExporting ? 'Processing...' : 'Export PNG'}
                            </button>
                        </div>
                    </motion.div>

                    {/* Preview Area */}
                    <div className="sticky top-32 min-h-[600px] flex items-center justify-center rounded-3xl border border-neutral-200/50 bg-[#e5e5e5] bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden p-8 shadow-inner">
                        <motion.div
                            layout
                            className="relative shadow-2xl transition-all duration-300 ease-out origin-center cursor-move"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            style={{
                                width: '100%',
                                maxWidth: '100%',
                                aspectRatio: `${settings.size.width} / ${settings.size.height}`,
                                // Background
                                background: settings.background.type === 'solid'
                                    ? settings.background.color1
                                    : `linear-gradient(${settings.background.angle}deg, ${settings.background.color1}, ${settings.background.color2})`
                            }}
                        >
                            {/* Grain Overlay for Preview */}
                            <div
                                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                                style={{
                                    backgroundImage: `url("${noiseUrl}")`,
                                    opacity: settings.background.grain
                                }}
                            />

                            {/* Content Container (Padding) */}
                            <div
                                className="absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-300"
                                style={{ padding: `${(settings.style.padding / settings.size.width) * 100}%` }}
                            >
                                {/* The Image Itself - Check if image exists, otherwise show placeholder slot */}
                                {image ? (
                                    <img
                                        src={image}
                                        className="w-full h-full object-contain transition-transform duration-0 select-none pointer-events-none"
                                        style={{
                                            borderRadius: `${settings.style.radius}px`,
                                            boxShadow: `0 ${settings.style.shadow * 0.5}px ${settings.style.shadow}px rgba(0,0,0,${settings.style.shadowOpacity})`,
                                            transform: `translate(${settings.position.x}px, ${settings.position.y}px) scale(${settings.position.scale})`
                                        }}
                                        alt="Preview"
                                        draggable={false}
                                    />
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-full border-2 border-dashed border-black/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors gap-3 group"
                                        style={{
                                            borderRadius: `${settings.style.radius}px`,
                                        }}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-black transition-colors">
                                            <Upload size={20} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors">Add Image</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
