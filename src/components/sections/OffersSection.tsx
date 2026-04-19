"use client";

import { useEffect, useState } from 'react';
import { TicketPercent, Copy, Tag, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { createClient } from '@/lib/supabase/client';
import type { Offer } from '@/actions/offers';

// Skeleton card shown while loading
function OfferSkeleton() {
  return (
    <div className="p-1">
      <Card className="h-full animate-pulse bg-background shadow-md">
        <CardHeader>
          <div className="h-5 w-3/4 rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-9 w-full rounded bg-muted mt-4" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function OffersSection() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('offers')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOffers(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: `Coupon code "${code}" copied to clipboard.`,
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <section id="offers" className="py-12 bg-secondary/30 rounded-lg my-12">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Tag className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold text-center font-headline">Special Offers</h2>
        </div>

        {loading ? (
          /* Skeleton grid while loading */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
            {[1, 2, 3].map((i) => <OfferSkeleton key={i} />)}
          </div>
        ) : offers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No active offers right now. Check back soon!</p>
        ) : (
          <Carousel
            opts={{ align: 'start', loop: offers.length > 3 }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {offers.map((offer) => (
                <CarouselItem key={offer.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full bg-background shadow-md transform transition-transform duration-300 hover:scale-[1.02] flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-primary text-base">
                          <TicketPercent className="h-5 w-5 shrink-0" />
                          <span className="line-clamp-2">{offer.title}</span>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex flex-col flex-1 justify-between gap-3">
                        {offer.description && (
                          <p className="text-muted-foreground text-sm">{offer.description}</p>
                        )}

                        {/* Validity badge */}
                        {(offer.valid_from || offer.valid_to) && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            {offer.valid_from && <span>From {formatDate(offer.valid_from)}</span>}
                            {offer.valid_from && offer.valid_to && <span>–</span>}
                            {offer.valid_to && <span>Until {formatDate(offer.valid_to)}</span>}
                          </div>
                        )}

                        {/* Coupon code row */}
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted mt-auto">
                          <span className="font-mono text-sm font-bold text-foreground flex-1 tracking-widest">
                            {offer.code}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => handleCopyCode(offer.code)}
                            aria-label={`Copy coupon code ${offer.code}`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Only show arrows when there are enough offers to scroll */}
            {offers.length > 3 && (
              <>
                <CarouselPrevious className="left-0 -translate-x-1/2" />
                <CarouselNext className="right-0 translate-x-1/2" />
              </>
            )}
          </Carousel>
        )}
      </div>
    </section>
  );
}
