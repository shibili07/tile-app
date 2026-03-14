'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import RoomViewer from '@/components/RoomViewer';

const ROOMS = [
  {
    id: 'bathroom1',
    name: 'Classic Bathroom',
    roomUrl: '/rooms/bathroom1/room.jpg',
    wallMaskUrl: null,
    floorMaskUrl: '/rooms/bathroom1/floor-mask.jpeg',
    floorMaskInvert: true,
    floorQuad: [[0.12, 0.54], [0.88, 0.54], [1.32, 1.02], [-0.32, 1.02]],
    tileScale: 1.0,
    wallPos: null,
    floorPos: { bottom: '25%', left: '50%' },
  },
];

export default function Visualization() {
  const searchParams = useSearchParams();
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
  const [tiles, setTiles] = useState([]);
  const [selectedFloorTile, setSelectedFloorTile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId) {
      const room = ROOMS.find((r) => r.id === roomId);
      if (room) setActiveRoom(room);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/tiles')
      .then((res) => res.json())
      .then((data) => {
        setTiles(data);
        const first = data.find((t) => t.category === 'Floors');
        setSelectedFloorTile(first);
        setLoading(false);
      });
  }, []);

  const floorTiles = tiles.filter((t) => t.category === 'Floors');

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-50 text-neutral-600 text-sm font-medium">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-72 flex flex-col flex-shrink-0 bg-white border-r border-neutral-200">
        <div className="flex-shrink-0 p-6 border-b border-neutral-100">
          <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
            TilePro Gen
          </h1>
          {ROOMS.length > 1 && (
            <div className="mt-5">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Room</p>
              <div className="flex flex-wrap gap-2">
                {ROOMS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      activeRoom.id === room.id
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Floor texture</p>
          <div className="space-y-2">
            {floorTiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedFloorTile(p)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  selectedFloorTile?.id === p.id
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                }`}
              >
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                  <Image src={p.textureUrl} alt={p.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-neutral-900 truncate">{p.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {p.material} · {p.finish} · £{p.price}/m²
                  </p>
                </div>
                {selectedFloorTile?.id === p.id && (
                  <span className="text-neutral-400 flex-shrink-0" aria-hidden>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main viewport - full screen */}
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-100 relative">
        {/* Exit - aligned to main area */}
        <Link
          href="/"
          className="absolute top-5 right-5 z-10 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Exit
        </Link>

        <div className="flex-1 min-h-0 flex items-center justify-center p-6">
          <div className="w-full h-full max-w-7xl max-h-[calc(100vh-12rem)] rounded-lg overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <RoomViewer
              roomUrl={activeRoom.roomUrl}
              wallTextureUrl={null}
              floorTextureUrl={selectedFloorTile?.textureUrl}
              wallMaskUrl={activeRoom.wallMaskUrl}
              floorMaskUrl={activeRoom.floorMaskUrl}
              wallMaskInvert={activeRoom.wallMaskInvert}
              floorMaskInvert={activeRoom.floorMaskInvert}
              wallQuad={activeRoom.wallQuad ?? null}
              floorQuad={activeRoom.floorQuad ?? null}
              tileScale={activeRoom.tileScale ?? 1.0}
              normalMapUrl={selectedFloorTile?.normalMapUrl ?? null}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex-shrink-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {selectedFloorTile ? (
              <>
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                  <Image src={selectedFloorTile.textureUrl} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {selectedFloorTile.name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Est. £{(selectedFloorTile.price * 15).toFixed(2)} (15m²)
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-neutral-500">No selection</p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              Order sample
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors">
              Get quote
            </button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f5f5f5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 3px; }
        canvas { filter: contrast(1.02) saturate(1.02); }
      `}</style>
    </div>
  );
}
