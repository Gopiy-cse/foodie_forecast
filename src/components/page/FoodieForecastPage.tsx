"use client";

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import FoodSuggestions from '@/components/sections/FoodSuggestions';
import CategoryCards from '@/components/sections/CategoryCards';
import OffersSection from '@/components/sections/OffersSection';
import HotelSection from '@/components/sections/HotelSection';
import CartSheet from '@/components/cart/CartSheet';

export default function FoodieForecastPage() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header onCartClick={() => setIsCartOpen(true)} />
            <main className="flex-1">
                <Hero searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <FoodSuggestions />
                    <CategoryCards />
                    <OffersSection />
                    <HotelSection searchTerm={searchTerm} />
                </div>
            </main>
            <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
        </div>
    );
}
