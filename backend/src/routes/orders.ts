import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  const { items, totalAmount, deliveryAddress } = req.body;

  if (!items || !totalAmount) {
    return res.status(400).json({ error: 'Missing items or totalAmount' });
  }

  // Attempt to resolve user if auth header exists
  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    } catch (err) {
      console.warn('Failed to resolve authenticated user for order, placing as guest:', err);
    }
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total_amount: totalAmount,
        delivery_address: deliveryAddress || null,
        items: items,
      })
      .select();

    if (error) {
      console.error('Error inserting order:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, order: data[0] });
  } catch (err: any) {
    console.error('Server error placing order:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
