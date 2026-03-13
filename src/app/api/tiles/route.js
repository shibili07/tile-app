import { NextResponse } from 'next/server';

const tiles = [
    {
        id: 7,
        name: "Natural Stone Mosaic Floor",
        slug: "natural-stone-mosaic",
        textureUrl: "/images/tile-4.jpg",
        price: 48.00,
        category: "Floors",
        size: "30x30cm",
        finish: "Matt",
        material: "Stone",
    },
    {
        id: 13,
        name: "Marble Polished Floor",
        slug: "marble-polished-floor",
        textureUrl: "/textures/close-up-marble-textured-wall.jpg",
        price: 72.00,
        category: "Floors",
        size: "60x120cm",
        finish: "Polished",
        material: "Marble",
    },
    {
        id: 14,
        name: "White Marble Floor",
        slug: "white-marble-floor",
        textureUrl: "/textures/close-up-marble-textured-wall.jpg",
        price: 85.00,
        category: "Floors",
        size: "60x120cm",
        finish: "Polished",
        material: "Marble",
    },
];

export async function GET() {
    return NextResponse.json(tiles);
}
