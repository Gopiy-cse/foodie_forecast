"use client";

import Link from 'next/link';
import { ShoppingCart, UtensilsCrossed, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const { totalItems, isCartHydrated } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Foodie Forecast
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon" aria-label="Admin Panel">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
          <Button onClick={onCartClick} variant="ghost" size="icon" aria-label="Open shopping cart">
              <ShoppingCart className="h-6 w-6" />
              {isCartHydrated && totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground p-0">
                  {totalItems}
                </Badge>
              )}
          </Button>
        </div>
      </div>
    </header>
  );
}
