import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/hotels
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select(`
        id, 
        name, 
        cuisine, 
        image_url, 
        hotel_menus(
          menu_items(
            id, 
            name, 
            price, 
            rating, 
            image_url, 
            cuisine, 
            category
          )
        )
      `);

    if (error) {
      console.error('Error fetching hotels:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err: any) {
    console.error('Server error fetching hotels:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select(`
        id, 
        name, 
        cuisine, 
        image_url, 
        hotel_menus(
          menu_items(
            id, 
            name, 
            price, 
            rating, 
            image_url, 
            cuisine, 
            category
          )
        )
      `)
      .eq('id', id);

    if (error) {
      console.error(`Error fetching hotel ${id}:`, error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err: any) {
    console.error(`Server error fetching hotel ${id}:`, err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
