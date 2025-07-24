"use client";

import { TicketPercent, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { offers } from '@/lib/data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function OffersSection() {
  const { toast } = useToast();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: `Coupon code "${code}" has been copied to your clipboard.`,
    });
  };

  return (
    <section id="offers" className="py-12 bg-secondary/30 rounded-lg my-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">Special Offers</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {offers.map((offer, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full bg-background shadow-md transform transition-transform duration-300 hover:scale-105">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <TicketPercent className="h-6 w-6" />
                        <span>{offer.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-full">
                      <p className="text-muted-foreground mb-4">{offer.description}</p>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <span className="font-mono text-sm font-bold text-foreground flex-1">{offer.code}</span>
                        <Button
                          variant="ghost"
                          size="icon"
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
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
