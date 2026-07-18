import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/offers
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err: any) {
    console.error('Server error fetching offers:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
