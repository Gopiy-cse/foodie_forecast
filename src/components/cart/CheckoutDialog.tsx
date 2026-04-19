"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, MapPin } from 'lucide-react';
import { placeOrder } from '@/actions/admin';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);

    // Save order to Supabase
    const result = await placeOrder({
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: totalPrice,
      deliveryAddress: deliveryAddress.trim() || undefined,
    });

    setIsProcessing(false);

    if (!result.success) {
      toast({
        title: 'Order Failed',
        description: result.message ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsSuccess(true);
    clearCart();
    setDeliveryAddress('');
    toast({
      title: 'Order Placed!',
      description: 'Your delicious food is on its way. Thank you for your order!',
    });
    setTimeout(() => {
      onOpenChange(false);
      setTimeout(() => setIsSuccess(false), 500);
    }, 3000);
  };

  const handleClose = () => {
    onOpenChange(false);
    if (isSuccess) {
      setTimeout(() => setIsSuccess(false), 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSuccess ? 'Payment Successful!' : 'Complete Your Order'}</DialogTitle>
          <DialogDescription>
            {isSuccess
              ? 'Your order has been confirmed and recorded.'
              : 'Review your order details and proceed to payment.'}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-4 my-8">
            <CheckCircle2 className="h-24 w-24 text-green-500" />
            <p className="text-lg font-medium">Thank you for your purchase!</p>
            <p className="text-muted-foreground text-center text-sm">
              Your order has been saved. This dialog will close automatically.
            </p>
          </div>
        ) : (
          <div className="my-4 space-y-4">
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2 rounded-md bg-muted p-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-1.5">
              <Label htmlFor="delivery-address" className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Delivery Address <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="delivery-address"
                placeholder="Enter your delivery address…"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
        )}

        {!isSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing || cart.length === 0}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                `Pay $${totalPrice.toFixed(2)}`
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
