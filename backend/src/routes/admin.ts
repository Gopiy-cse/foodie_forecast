import { Router, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Apply requireAdmin middleware to protect all admin endpoints
router.use(requireAdmin);

// GET /api/admin/menu-items - List all menu items
router.get('/menu-items', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('name');

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.error('Error fetching admin menu items:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/menu-items - Create single menu item
router.post('/menu-items', async (req: AuthenticatedRequest, res: Response) => {
  const item = req.body;
  try {
    // Exclude id so DB autogenerates if empty string
    const insertObj = { ...item };
    if (!insertObj.id) {
      delete insertObj.id;
    }
    const { data, error } = await supabase
      .from('menu_items')
      .insert(insertObj)
      .select();

    if (error) throw error;
    return res.json({ success: true, item: data[0] });
  } catch (err: any) {
    console.error('Error creating menu item:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/menu-items - Update menu item
router.put('/menu-items', async (req: AuthenticatedRequest, res: Response) => {
  const item = req.body;
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .upsert(item)
      .select();

    if (error) throw error;
    return res.json({ success: true, item: data[0] });
  } catch (err: any) {
    console.error('Error updating menu item:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/menu-items/:id - Delete menu item
router.delete('/menu-items/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true });
  } catch (err: any) {
    console.error(`Error deleting menu item ${id}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders - Get all orders + profiles details
router.get('/orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.error('Error fetching admin orders:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/migrate - Seeds initial database data
router.post('/migrate', async (req: AuthenticatedRequest, res: Response) => {
  const menuItems = [
    { name: 'Paneer Butter Masala', price: 14.5, rating: 4.8, image_url: 'https://placehold.co/600x400.png', cuisine: 'North Indian', category: 'Veg' },
    { name: 'Chicken Biryani', price: 18.0, rating: 4.9, image_url: 'https://placehold.co/600x400.png', cuisine: 'Mughlai', category: 'Non-Veg' },
    { name: 'Masala Dosa', price: 10.0, rating: 4.7, image_url: 'https://placehold.co/600x400.png', cuisine: 'South Indian', category: 'Veg' },
    { name: 'Fresh Lime Soda', price: 5.0, rating: 4.5, image_url: 'https://placehold.co/600x400.png', cuisine: 'Beverage', category: 'Beverages' },
    { name: 'Gulab Jamun', price: 6.0, rating: 4.8, image_url: 'https://placehold.co/600x400.png', cuisine: 'Dessert', category: 'Desserts' },
    { name: 'Margherita Pizza', price: 12.99, rating: 4.5, image_url: 'https://placehold.co/600x400.png', cuisine: 'Italian', category: 'Veg' },
    { name: 'Spaghetti Carbonara', price: 15.5, rating: 4.6, image_url: 'https://placehold.co/600x400.png', cuisine: 'Italian', category: 'Non-Veg' },
    { name: 'Chocolate Lava Cake', price: 8.5, rating: 4.9, image_url: 'https://placehold.co/600x400.png', cuisine: 'Dessert', category: 'Desserts' }
  ];

  const hotels = [
    { name: 'The Grand Indian', cuisine: 'North Indian, Mughlai', image_url: 'https://placehold.co/600x400.png' },
    { name: "Italiano's", cuisine: 'Italian', image_url: 'https://placehold.co/600x400.png' },
    { name: 'South Spice', cuisine: 'South Indian', image_url: 'https://placehold.co/600x400.png' },
    { name: 'Global Bites', cuisine: 'Multi-Cuisine', image_url: 'https://placehold.co/600x400.png' }
  ];

  try {
    // 1. Insert Hotels
    const { data: insertedHotels, error: hotelError } = await supabase
      .from('hotels')
      .insert(hotels)
      .select();

    if (hotelError) throw new Error('Error inserting hotels: ' + hotelError.message);

    // 2. Insert Menu Items
    const { data: insertedMenuItems, error: menuError } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select();

    if (menuError) throw new Error('Error inserting menu items: ' + menuError.message);

    // 3. Link Hotels and Menu Items in hotel_menus
    const hotelMenusInserts = [];

    if (insertedHotels && insertedMenuItems) {
      for (let i = 0; i < insertedMenuItems.length; i++) {
        // Assign each menu item to a hotel (round robin)
        const hotel = insertedHotels[i % insertedHotels.length];
        const menuItem = insertedMenuItems[i];

        hotelMenusInserts.push({
          hotel_id: hotel.id,
          menu_id: menuItem.id
        });
      }

      for (const hotel of insertedHotels) {
        // Give every hotel the first 2 items (staples)
        for (let i = 0; i < 2; i++) {
          const exists = hotelMenusInserts.find(hm => hm.hotel_id === hotel.id && hm.menu_id === insertedMenuItems[i].id);
          if (!exists) {
            hotelMenusInserts.push({
              hotel_id: hotel.id,
              menu_id: insertedMenuItems[i].id
            });
          }
        }
      }
    }

    const { error: linkError } = await supabase
      .from('hotel_menus')
      .insert(hotelMenusInserts);

    if (linkError) throw new Error('Error linking hotel menus: ' + linkError.message);

    return res.json({ success: true, message: 'Data migrated successfully!' });
  } catch (err: any) {
    console.error('Migration error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
