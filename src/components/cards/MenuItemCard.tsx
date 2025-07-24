"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, PlusCircle } from 'lucide-react';
import { useCart, type MenuItem } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(item);
    toast({
      title: `Added to cart!`,
      description: `${item.name} is waiting for you.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="aspect-video overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            width={600}
            height={400}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            data-ai-hint={item['data-ai-hint']}
          />
        </div>
        <div className="p-4">
            <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                <Badge variant="outline" className="shrink-0">
                    <Star className="h-3 w-3 mr-1 text-accent fill-accent" /> {item.rating}
                </Badge>
            </div>
            <CardDescription>{item.cuisine}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
          
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-muted/30">
        <p className="text-xl font-bold text-foreground">${item.price.toFixed(2)}</p>
        <Button onClick={handleAddToCart} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
