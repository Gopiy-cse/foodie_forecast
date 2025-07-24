import HotelMenuPage from '@/components/page/HotelMenuPage';
import { hotels } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function HotelPage({ params }: { params: { id: string } }) {
  const hotel = hotels.find((h) => h.id === params.id);

  if (!hotel) {
    notFound();
  }
  return <HotelMenuPage hotel={hotel} />;
}
