"use client";

import { useEffect, useState } from 'react';
import HotelCard from '@/components/cards/HotelCard';
// import { hotels } from '@/lib/data';
import type { Hotel } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { getHotels } from '@/actions/hotels';

interface HotelSectionProps {
  searchTerm: string;
}

export default function HotelSection({ searchTerm }: HotelSectionProps) {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    fetchHotels();
    setTimeout(() => {
        setIsLoading(false);
    }, 300);
  },[]);

  const fetchHotels = async () => {
    const hotels = await getHotels();
    setFilteredHotels(hotels);
  };

  useEffect(() => {
    setIsLoading(true);
    const lowercasedFilter = searchTerm.toLowerCase();
    
    if (!lowercasedFilter) {
      setFilteredHotels(hotels);
    } else {
      const filtered = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(lowercasedFilter) ||
        hotel.cuisine.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredHotels(filtered);
    }
    
    // Simulate loading
    setTimeout(() => {
        setIsLoading(false);
    }, 300);

  }, [searchTerm]);

  return (
    <section id="hotels" className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 font-headline">Explore Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[225px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))
        ) : filteredHotels?.length > 0 ? (
          filteredHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-lg text-muted-foreground">No hotels found matching your search. Try something else!</p>
          </div>
        )}
      </div>
    </section>
  );
}
