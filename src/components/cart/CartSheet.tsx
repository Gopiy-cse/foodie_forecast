
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import CheckoutDialog from './CheckoutDialog';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems, isCartHydrated } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleQuantityChange = (itemId: string, value: string | number) => {
    const quantity = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(quantity) || quantity < 1) {
      updateQuantity(itemId, 1);
    } else {
      updateQuantity(itemId, quantity);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
          <SheetHeader className="px-6">
            <SheetTitle>Your Cart ({isCartHydrated ? totalItems : 0})</SheetTitle>
            <SheetDescription>Review your items before checkout.</SheetDescription>
          </SheetHeader>
          <Separator />
          {isCartHydrated && cart.length > 0 ? (
            <>
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-4 p-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        <div className="mt-2 flex items-center gap-2">
                           <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    className="h-8 w-14 border-x-0 text-center"
                                    aria-label={`Quantity for ${item.name}`}
                                />
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator />
              <SheetFooter className="p-6">
                <div className="w-full space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => {
                      onOpenChange(false);
                      setIsCheckoutOpen(true);
                    }}>
                        Proceed to Checkout
                    </Button>
                </div>
              </SheetFooter>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some delicious food to get started!</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <CheckoutDialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}
