'use client';
import { getHotelById } from '@/actions/hotels';
import HotelMenuPage from '@/components/page/HotelMenuPage';
import { notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import type { Hotel } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

interface HotelPageParams {
  id: string;
}

export default function HotelPage({ params }: { params: any }) {
  const resolvedParams = use(params) as HotelPageParams;
  const hotelId = resolvedParams.id; // use directly in client component
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      const hotelData = await getHotelById(hotelId); // fetch single hotel
      if (!hotelData || hotelData.length === 0) {
        setLoading(false);
        return;
      }
      setHotel(hotelData[0]); // assuming getHotelById returns array
      setLoading(false);
    };

    fetchHotel();
  }, [hotelId]); // re-run when hotelId changes

  if (loading) return <Skeleton className="h-4 w-3/4" />
  if (!hotel) return notFound();

  return <HotelMenuPage hotel={hotel} />;
}
