"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Building, Utensils, Pizza } from 'lucide-react';
import type { Hotel } from '@/lib/data';
import { getHotels } from '@/actions/hotels';

interface HeroProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

type Suggestion = 
  | { name: string; type: 'hotel'; id: string; }
  | { name: string; type: 'cuisine'; }
  | { name: string; type: 'dish'; hotelName: string; hotelId: string; };


export default function Hero({ searchTerm, onSearchTermChange }: HeroProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchHotels();
  },[]);

  const fetchHotels = async () => {
    const hotels = await getHotels();
    setHotels(hotels);
  };

  const { allCuisines, allDishes } = useMemo(() => {
    const cuisines = new Set<string>();
    const dishes: { name: string; hotelName: string; hotelId: string }[] = [];
    hotels.forEach(hotel => {
      hotel.cuisine.split(',').forEach(c => cuisines.add(c.trim()));
      hotel.hotel_menus.flatMap(menu => menu.menu_items).forEach(item => {
        dishes.push({ name: item.name, hotelName: hotel.name, hotelId: hotel.id });
      });
    });
    return { 
      allCuisines: Array.from(cuisines),
      allDishes: dishes,
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const hotelSuggestions = hotels
        .filter(hotel => hotel.name.toLowerCase().includes(lowercasedTerm))
        .map(h => ({ name: h.name, type: 'hotel' as const, id: h.id }));

      const cuisineSuggestions = allCuisines
        .filter(cuisine => cuisine.toLowerCase().includes(lowercasedTerm))
        .map(c => ({ name: c, type: 'cuisine' as const }));
        
      const dishSuggestions = allDishes
        .filter(dish => dish.name.toLowerCase().includes(lowercasedTerm))
        .map(d => ({ name: d.name, type: 'dish' as const, hotelName: d.hotelName, hotelId: d.hotelId }));
      
      const combined = [...dishSuggestions, ...hotelSuggestions, ...cuisineSuggestions].slice(0, 7); // Limit suggestions
      setSuggestions(combined);
      setIsSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  }, [searchTerm, allCuisines, allDishes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'dish') {
      router.push(`/hotel/${suggestion.hotelId}`);
    } else {
      onSearchTermChange(suggestion.name);
    }
    setIsSuggestionsVisible(false);
  };

  return (
    <section className="relative h-[40vh] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')", backgroundAttachment: 'fixed' }} data-ai-hint="food platter">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h2 className="text-4xl font-bold md:text-6xl font-headline">Find Your Next Craving</h2>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200">
          From local delights to global cuisines, we've got you covered. What are you in the mood for today?
        </p>
        <div className="mt-8 w-full max-w-lg px-4" ref={searchContainerRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for dishes, hotels or cuisines..."
              className="w-full rounded-full bg-background/90 py-6 pl-10 text-lg text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onFocus={() => setIsSuggestionsVisible(searchTerm.length > 1)}
            />
            {isSuggestionsVisible && suggestions.length > 0 && (
              <ul className="absolute top-full mt-2 w-full rounded-lg bg-background shadow-lg z-20 text-left overflow-hidden">
                {suggestions.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center px-4 py-3 cursor-pointer text-foreground hover:bg-muted"
                        onMouseDown={() => handleSuggestionClick(item)} // use onMouseDown to fire before onBlur
                    >
                        {item.type === 'hotel' && <Building className="mr-3 h-4 w-4 text-muted-foreground" />}
                        {item.type === 'cuisine' && <Utensils className="mr-3 h-4 w-4 text-muted-foreground" />}
                        {item.type === 'dish' && <Pizza className="mr-3 h-4 w-4 text-muted-foreground" />}

                        <div className="flex flex-col">
                            <span>{item.name}</span>
                            {item.type === 'dish' && <span className="text-xs text-muted-foreground">{item.hotelName}</span>}
                        </div>
                    </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
