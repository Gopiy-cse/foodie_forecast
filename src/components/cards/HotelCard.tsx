import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import type { Hotel } from '@/lib/data';

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link href={`/hotel/${hotel.id}`} className="group">
        <Card className="flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl h-full">
        <CardHeader className="p-0">
            <div className="aspect-video overflow-hidden">
            <Image
                src={hotel.image_url}
                alt={hotel.name}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">{hotel.name}</CardTitle>
                <CardDescription>{hotel.cuisine}</CardDescription>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </CardContent>
        </Card>
    </Link>
  );
}
