'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RoomViewer from '@/components/RoomViewer';

const DEMO_ROOMS = [
  { id: 'living_room', title: 'Modern Bathroom', roomUrl: '/rooms/living_room/room.jpg', floorMaskUrl: '/rooms/living_room/floor-mask.jpeg', floorMaskInvert: true, floorQuad: [[0.2, 0.54], [0.8, 0.54], [1.15, 1.0], [-0.15, 1.0]], tileScale: 1.0 },
  { id: 'living_room', title: 'Contemporary Kitchen', roomUrl: '/rooms/living_room/room.jpg', floorMaskUrl: '/rooms/living_room/floor-mask.jpeg', floorMaskInvert: true, floorQuad: [[0.2, 0.54], [0.8, 0.54], [1.15, 1.0], [-0.15, 1.0]], tileScale: 1.0 },
  { id: 'living_room', title: 'Minimalist Bathroom', roomUrl: '/rooms/living_room/room.jpg', floorMaskUrl: '/rooms/living_room/floor-mask.jpeg', floorMaskInvert: true, floorQuad: [[0.2, 0.54], [0.8, 0.54], [1.15, 1.0], [-0.15, 1.0]], tileScale: 1.0 },
];

const CURRENT_TILE_LABEL = 'Metro Gloss White';

export default function Home() {
  const [dragOver, setDragOver] = useState(false);
  const [previewRoom] = useState(DEMO_ROOMS[0]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  const onDragLeave = useCallback(() => setDragOver(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file?.type?.startsWith('image/')) {
      // Could set uploaded image as room preview / pass to visualization
    }
  }, []);

  return (
    <main className="min-h-screen bg-white text-neutral-800">
      <div className="mx-auto max-w-6xl px-6 py-6">

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Left: Upload Your Room — light gray border card */}
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-bold text-neutral-800">Upload Your Room</h2>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`mt-4 flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50/80 px-6 py-10 transition-colors ${
                dragOver ? 'border-neutral-400 bg-neutral-100' : ''
              }`}
            >
              <span className="text-4xl font-light text-neutral-500" aria-hidden>↑</span>
              <p className="mt-3 text-center text-sm text-neutral-600">
                Drag and drop your photo here
              </p>
              <p className="mt-0.5 text-center text-sm text-neutral-600">or</p>
            </div>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-700 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Choose File
            </button>
            <p className="mt-4 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-600">Tip:</span> For best results, use a well-lit photo showing the wall area clearly.
            </p>
          </section>

          {/* Right: Preview — "Currently showing" and icons on same row */}
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-bold text-neutral-800">Preview</h2>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-neutral-600">Currently showing: {CURRENT_TILE_LABEL}</p>
              <div className="flex items-center gap-1">
                <button type="button" className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100" aria-label="Undo">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button type="button" className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100" aria-label="Full screen">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
                <button type="button" className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100" aria-label="Download">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
                <button type="button" className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100" aria-label="Share">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6 3m-6-3l6-3m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            </div>
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <RoomViewer
                roomUrl={previewRoom.roomUrl}
                wallTextureUrl={null}
                floorTextureUrl={null}
                wallMaskUrl={null}
                floorMaskUrl={previewRoom.floorMaskUrl}
                wallMaskInvert={false}
                floorMaskInvert={previewRoom.floorMaskInvert}
                floorQuad={previewRoom.floorQuad}
                tileScale={previewRoom.tileScale}
              />
            </div>
            <Link
              href={`/visualization?room=${previewRoom.id}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-700 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Start Visualization
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </section>
        </div>

        {/* Try Our Demo Rooms — title centered, top row with images, bottom row empty placeholders */}
        <section className="mt-12">
          <h2 className="text-center text-xl font-bold text-neutral-800">Try Our Demo Rooms</h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Don&apos;t have a photo? Explore our demo rooms to see how different tiles look.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Top row: 3 cards with images */}
            {DEMO_ROOMS.map((room, i) => (
              <Link
                key={`filled-${i}`}
                href={`/visualization?room=${room.id}`}
                className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-neutral-100">
                  <Image
                    src={room.roomUrl}
                    alt={room.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <p className="p-4 text-center text-sm font-medium text-neutral-800">{room.title}</p>
              </Link>
            ))}
            {/* Bottom row: 3 empty placeholder cards with same labels */}
            {DEMO_ROOMS.map((room, i) => (
              <div
                key={`placeholder-${i}`}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
              >
                <div className="aspect-[4/3] bg-neutral-50" />
                <p className="p-4 text-center text-sm font-medium text-neutral-800">{room.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
