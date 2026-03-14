'use client';

import Link from 'next/link';
import RoomViewer from '@/components/RoomViewer';

const CLASSIC_BATHROOM = {
  id: 'living_room',
  title: 'Classic Living Room',
  roomUrl: '/rooms/living_room/room.jpg',
  wallMaskUrl: null,
  floorMaskUrl: '/rooms/living_room/floor-mask.jpeg',
  floorMaskInvert: true,
  floorQuad: [[0.2, 0.54], [0.8, 0.54], [1.15, 1.0], [-0.15, 1.0]],
  tileScale: 1.0,
};

const FEATURES = [
  {
    title: 'Photoreal room preview',
    description: 'Project tiles into room perspective with natural light blending so customers see realistic finishes before buying.',
  },
  {
    title: 'Instant texture switching',
    description: 'Compare marble, wood, ceramic, and custom uploads in seconds without reloading the experience.',
  },
  {
    title: 'Sales-ready workflow',
    description: 'Send guided visual selections to clients and move from inspiration to quote faster.',
  },
];

const STEPS = [
  { title: '1. Upload texture', description: 'Add a tile image and metadata to your library in minutes.' },
  { title: '2. Preview in room', description: 'Apply materials to your scene and tune scale for accurate appearance.' },
  { title: '3. Convert to quote', description: 'Share approved visuals and generate sample or quote requests.' },
];

export default function Home() {
  const activeRoom = CLASSIC_BATHROOM;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f5f5,_#ffffff_40%,_#fafafa)] text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-semibold tracking-tight">TilePro Gen</p>
          </div>
          <Link
            href={`/visualization?room=${activeRoom.id}`}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Open App
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
              SaaS for tile showrooms and interior teams
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 md:text-6xl">
              Close sales faster with realistic tile previews.
            </h1>
            <p className="mt-5 max-w-xl text-base text-neutral-600 md:text-lg">
              Give clients instant confidence by visualizing flooring options in real rooms. TilePro Gen turns texture catalogs into a premium buying experience.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={`/visualization?room=${activeRoom.id}`}
                className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                Start Visualising
              </Link>
              <Link
                href="#features"
                className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Explore Features
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-neutral-500">
              <span>Fast setup</span>
              <span>Real-time switching</span>
              <span>Quote-ready workflow</span>
            </div>
          </div>

          <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_25px_70px_-45px_rgba(0,0,0,0.5)]">
            <div className="relative flex items-center justify-between border-b border-neutral-100 px-5 py-3 md:px-6">
              <p className="text-sm font-medium text-neutral-700">{activeRoom.title}</p>
              <Link
                href={`/visualization?room=${activeRoom.id}`}
                className="text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600"
              >
                Open visualiser →
              </Link>
            </div>
            <div className="relative aspect-[16/10] bg-neutral-100">
              <RoomViewer
                roomUrl={activeRoom.roomUrl}
                wallTextureUrl={null}
                floorTextureUrl={null}
                wallMaskUrl={activeRoom.wallMaskUrl}
                floorMaskUrl={activeRoom.floorMaskUrl}
                wallMaskInvert={activeRoom.floorMaskInvert}
                floorMaskInvert={activeRoom.floorMaskInvert}
                floorQuad={activeRoom.floorQuad}
                tileScale={activeRoom.tileScale}
              />
            </div>
          </section>
        </section>

        <section id="features" className="mt-16 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-neutral-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="rounded-xl bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-900">{step.title}</p>
                <p className="mt-2 text-sm text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl bg-neutral-900 px-6 py-10 text-center text-white md:px-12">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to modernize your tile sales?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-300 md:text-base">
            Launch interactive room previews for your clients and improve confidence before purchase.
          </p>
          <div className="mt-7">
            <Link
              href={`/visualization?room=${activeRoom.id}`}
              className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              Open Visualiser Now
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-neutral-200 pt-6 text-center">
          <p className="text-xs text-neutral-400">© TilePro Gen</p>
        </footer>
      </div>
    </main>
  );
}
