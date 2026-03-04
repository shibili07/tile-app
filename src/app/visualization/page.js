'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Visualization() {
    const [activeTab, setActiveTab] = useState('Walls');
    const [selectedWallTile, setSelectedWallTile] = useState({
        id: 1,
        name: 'Victoria Metro Flat Wall Tiles',
        price: '14.95',
        image: '/images/tile-1.png',
    });
    const [selectedFloorTile, setSelectedFloorTile] = useState({
        id: 4,
        name: 'Contra White Concrete Effect',
        price: '39.90',
        image: '/images/tile-1.png',
    });

    const wallTiles = [
        { id: 1, name: 'Victoria Metro Flat Wall', price: '14.95', image: '/images/tile-1.png' },
        { id: 2, name: 'Dark Slate Premium', price: '22.50', image: '/images/tile-2.png' },
        { id: 3, name: 'Sage Green Ceramic', price: '18.95', image: '/images/tile-3.png' },
    ];

    const floorTiles = [
        { id: 4, name: 'Contra White Concrete', price: '39.90', image: '/images/tile-1.png' },
        { id: 5, name: 'Grey Stone Textured', price: '45.00', image: '/images/tile-2.png' },
    ];

    const currentProducts = activeTab === 'Walls' ? wallTiles : floorTiles;
    const currentSelection = activeTab === 'Walls' ? selectedWallTile : selectedFloorTile;

    return (
        <div className="flex h-screen bg-[#f3f6f9] overflow-hidden font-sans">

            {/* --- SIDEBAR --- */}
            <aside className="w-[360px] flex flex-col bg-white border-r border-gray-200 shadow-2xl z-20">
                <div className="p-6 border-b border-gray-100 flex flex-col items-center">
                    <div className="relative w-44 h-12 mb-6 pointer-events-none">
                        <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
                    </div>

                    <div className="flex w-full bg-gray-100 rounded-xl p-1.5 border border-gray-200">
                        {['Walls', 'Floors'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab ? 'bg-white text-[#4d5e74] shadow-sm scale-[1.02]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {tab === 'Walls' ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" strokeWidth="2" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" /></svg>
                                    )}
                                    {tab}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    <div className="sticky top-0 bg-white z-10 pb-2">
                        <div className="relative">
                            <input type="text" placeholder="Search textures..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none" />
                            <svg className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {currentProducts.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => activeTab === 'Walls' ? setSelectedWallTile(p) : setSelectedFloorTile(p)}
                                className={`group p-3 rounded-2xl border-2 transition-all cursor-pointer ${currentSelection.id === p.id ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-transparent bg-white hover:border-gray-200 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-inner shrink-0">
                                        <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col justify-between py-1">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800 leading-snug">{p.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Victorian Plumbing</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black text-gray-900">£{p.price}</span>
                                            {currentSelection.id === p.id && (
                                                <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Selected</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* --- MAIN VISUALIZER --- */}
            <main className="flex-1 flex flex-col relative bg-gray-900 group/main">

                {/* Top Floating Nav */}
                <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center z-30">
                    <div className="flex gap-3">
                        <button className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-xl text-sm font-bold flex items-center gap-2 border border-white hover:bg-white transition-all transform hover:-translate-y-0.5 active:scale-95">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Upload Photo
                        </button>
                        <button className="bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-xl text-sm font-bold text-white flex items-center gap-2 border border-white/10 hover:bg-black/60 transition-all transform hover:-translate-y-0.5 active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>
                            Switch Room
                        </button>
                    </div>
                    <Link href="/" className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-xl text-sm font-bold flex items-center gap-2 border border-white hover:bg-white transition-all transform hover:-translate-y-0.5 active:scale-95 group/exit">
                        <svg className="w-4 h-4 group-hover/exit:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        Exit
                    </Link>
                </div>

                {/* --- LIVE PREVIEW CANVAS --- */}
                <div className="flex-1 relative overflow-hidden flex items-center justify-center">

                    {/* Base Room Container */}
                    <div className="relative w-full h-full flex items-center justify-center bg-[#1a1a1a]">

                        {/* The Room Base Layout */}
                        <div className="relative w-full h-full">

                            {/* WALL LAYER (Dynamic) */}
                            <div
                                className="absolute inset-0 z-0 transition-all duration-700 ease-in-out"
                                style={{
                                    backgroundImage: `url(${selectedWallTile.image})`,
                                    backgroundSize: '120px 80px', // Adjust size for tile effect
                                    backgroundRepeat: 'repeat',
                                    opacity: 0.85
                                }}
                            >
                                {/* Wall Perspective Shadowing */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/20" />
                            </div>

                            {/* FLOOR LAYER (Dynamic) */}
                            <div className="absolute bottom-0 left-0 right-0 h-[45%] z-1 overflow-hidden perspective-[1000px]">
                                <div
                                    className="w-full h-[200%] origin-bottom transition-all duration-700 ease-in-out"
                                    style={{
                                        backgroundImage: `url(${selectedFloorTile.image})`,
                                        backgroundSize: '240px 240px',
                                        backgroundRepeat: 'repeat',
                                        transform: 'rotateX(75deg) translateY(-25%) scale(1.5)',
                                        opacity: 0.9
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {/* FURNITURE & MASKING LAYER (Static Room Elements) */}
                            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                                <div className="relative w-full h-full max-w-[90%] max-h-[85%]">
                                    {/* Here we'd normally have a PNG with transparent walls/floors */}
                                    {/* Placeholder for furniture: Tub, Vanity, Mirror */}
                                    <Image
                                        src="/images/bathroom-demo.png"
                                        alt="Room Elements"
                                        fill
                                        className="object-contain contrast-[1.1] brightness-[1.05]"
                                    />

                                    {/* Visual Markers */}
                                    <div className="absolute top-[40%] right-[30%] pointer-events-auto">
                                        <button
                                            onClick={() => setActiveTab('Walls')}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all transform hover:scale-110 shadow-lg border-2 ${activeTab === 'Walls' ? 'bg-blue-500 text-white border-white animate-pulse' : 'bg-white/80 text-gray-800 border-gray-200'
                                                }`}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Walls
                                        </button>
                                    </div>
                                    <div className="absolute bottom-[20%] left-[45%] pointer-events-auto">
                                        <button
                                            onClick={() => setActiveTab('Floors')}
                                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all transform hover:scale-110 shadow-lg border-2 ${activeTab === 'Floors' ? 'bg-blue-500 text-white border-white animate-pulse' : 'bg-white/80 text-gray-800 border-gray-200'
                                                }`}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Floors
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Canvas Tools Floating Bar */}
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden divide-x divide-gray-100 z-30">
                        {['Reset', 'Rotate', 'Grout'].map((tool) => (
                            <button key={tool} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#4d5e74] hover:bg-gray-50 flex flex-col items-center gap-1 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 invisible group-hover:visible" />
                                {tool}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- DYNAMIC BOTTOM BAR --- */}
                <div className="absolute bottom-0 left-0 right-0 p-5 px-10 bg-white/95 backdrop-blur-2xl border-t border-gray-100 flex items-center justify-between z-40 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-6">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-blue-50 border border-white transform transition-transform hover:scale-105 duration-300">
                            <Image src={currentSelection.image} alt="Selected" fill className="object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Live Preview</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Victorian Plumbing</span>
                            </div>
                            <h5 className="text-lg text-[#4d5e74] font-black leading-none">{currentSelection.name}</h5>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="text-xl font-black text-gray-900 tracking-tight">£{currentSelection.price}</span>
                                <button className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1">
                                    Product Details
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3.5 bg-gray-100 text-[#4d5e74] rounded-2xl shadow-sm font-bold text-sm hover:bg-gray-200 transition-all border border-gray-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316" strokeWidth="2" /></svg>
                            Share View
                        </button>
                        <button className="flex items-center gap-2 px-10 py-3.5 bg-[#00b64d] text-white rounded-2xl shadow-[0_12px_24px_-8px_rgba(0,182,77,0.5)] font-black text-sm hover:bg-[#009c42] transform hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0">
                            Confirm & Order Sample
                        </button>
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e2e2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
        </div>
    );
}
