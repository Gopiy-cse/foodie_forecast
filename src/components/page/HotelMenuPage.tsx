"use client";

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import MenuSection from '@/components/sections/MenuSection';
import CartSheet from '@/components/cart/CartSheet';
import type { Hotel } from '@/lib/data';

interface HotelMenuPageProps {
  hotel: Hotel;
}

export default function HotelMenuPage({ hotel }: HotelMenuPageProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header onCartClick={() => setIsCartOpen(true)} />
            <main className="flex-1">
                <section className="relative h-[30vh] w-full">
                    <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        data-ai-hint={hotel['data-ai-hint']}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                        <h1 className="text-4xl font-bold md:text-6xl font-headline">{hotel.name}</h1>
                        <p className="mt-2 text-lg md:text-xl text-neutral-200">{hotel.cuisine}</p>
                    </div>
                </section>
                <div className="container mx-auto px-4 py-8 md:py-12">
                   <MenuSection menu={hotel.menu} />
                </div>
            </main>
            <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
        </div>
    );
}
