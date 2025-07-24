"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      toast({
        title: "Order Placed!",
        description: "Your delicious food is on its way. Thank you for your order!",
        variant: "default",
      });
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => setIsSuccess(false), 500);
      }, 3000)
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    if(isSuccess) {
        setTimeout(() => setIsSuccess(false), 500);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSuccess ? "Payment Successful!" : "Complete Your Order"}</DialogTitle>
          <DialogDescription>
            {isSuccess ? "Your order has been confirmed." : "Review your order details and proceed to payment."}
          </DialogDescription>
        </DialogHeader>
        {isSuccess ? (
             <div className="flex flex-col items-center justify-center space-y-4 my-8">
                <CheckCircle2 className="h-24 w-24 text-green-500" />
                <p className="text-lg font-medium">Thank you for your purchase!</p>
                <p className="text-muted-foreground text-center">You'll receive an email confirmation shortly. This dialog will close automatically.</p>
            </div>
        ) : (
            <div className="my-4">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2 rounded-md bg-muted p-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t border-border my-2 !mt-4 !pt-4"></div>
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        )}
        {!isSuccess && (
            <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
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
