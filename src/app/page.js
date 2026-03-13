'use client';

import Link from 'next/link';
import RoomViewer from '@/components/RoomViewer';

const CLASSIC_BATHROOM = {
  id: 'bathroom1',
  title: 'Classic Bathroom',
  roomUrl: '/rooms/bathroom1/room.jpg',
  wallMaskUrl: null,
  floorMaskUrl: '/rooms/bathroom1/floor-mask.jpeg',
  floorMaskInvert: true,
  floorQuad: [[0.2, 0.54], [0.8, 0.54], [1.15, 1.0], [-0.15, 1.0]],
  tileScale: 1.0,
};

export default function Home() {
  const activeRoom = CLASSIC_BATHROOM;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-16">

        <header className="mb-12">
          <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
            TilePro Gen
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Visualise floor tiles in your space
          </p>
        </header>

        <div className="max-w-3xl">
          {/* Preview */}
          <div>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                <p className="text-sm text-neutral-600">Classic Bathroom</p>
                <Link
                  href={`/visualization?room=${activeRoom.id}`}
                  className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  Open visualiser →
                </Link>
              </div>
              <div className="relative aspect-video bg-neutral-100">
                <RoomViewer
                  roomUrl={activeRoom.roomUrl}
                  wallTextureUrl={null}
                  floorTextureUrl="/textures/close-up-marble-textured-wall.jpg"
                  wallMaskUrl={activeRoom.wallMaskUrl}
                  floorMaskUrl={activeRoom.floorMaskUrl}
                  wallMaskInvert={activeRoom.floorMaskInvert}
                  floorMaskInvert={activeRoom.floorMaskInvert}
                  floorQuad={activeRoom.floorQuad}
                  tileScale={activeRoom.tileScale}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-20 pt-8 border-t border-neutral-200 text-center">
          <p className="text-xs text-neutral-400">© TilePro Gen</p>
        </footer>
      </div>
    </main>
  );
}
