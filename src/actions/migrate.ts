'use server'

import { createClient } from '@/lib/supabase/server'

const menuItems = [
    {
        name: 'Paneer Butter Masala',
        price: 14.5,
        rating: 4.8,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'North Indian',
        category: 'Veg',
    },
    {
        name: 'Chicken Biryani',
        price: 18.0,
        rating: 4.9,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'Mughlai',
        category: 'Non-Veg',
    },
    {
        name: 'Masala Dosa',
        price: 10.0,
        rating: 4.7,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'South Indian',
        category: 'Veg',
    },
    {
        name: 'Fresh Lime Soda',
        price: 5.0,
        rating: 4.5,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'Beverage',
        category: 'Beverages',
    },
    {
        name: 'Gulab Jamun',
        price: 6.0,
        rating: 4.8,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'Dessert',
        category: 'Desserts',
    },
    {
        name: 'Margherita Pizza',
        price: 12.99,
        rating: 4.5,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'Italian',
        category: 'Veg',
    },
    {
        name: 'Spaghetti Carbonara',
        price: 15.5,
        rating: 4.6,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'Italian',
        category: 'Non-Veg',
    },
    {
        name: 'Chocolate Lava Cake',
        price: 8.5,
        rating: 4.9,
        image_url: 'https://placehold.co/600x400.png',
        cuisine: 'Dessert',
        category: 'Desserts',
    },
]

const hotels = [
    {
        name: 'The Grand Indian',
        cuisine: 'North Indian, Mughlai',
        image_url: 'https://placehold.co/600x400.png',
    },
    {
        name: "Italiano's",
        cuisine: 'Italian',
        image_url: 'https://placehold.co/600x400.png',
    },
    {
        name: 'South Spice',
        cuisine: 'South Indian',
        image_url: 'https://placehold.co/600x400.png',
    },
    {
        name: 'Global Bites',
        cuisine: 'Multi-Cuisine',
        image_url: 'https://placehold.co/600x400.png',
    },
]

export async function migrateData() {
    const supabase = await createClient()

    // 1. Insert Hotels
    const { data: insertedHotels, error: hotelError } = await supabase
        .from('hotels')
        .insert(hotels)
        .select()

    if (hotelError) throw new Error('Error inserting hotels: ' + hotelError.message)

    // 2. Insert Menu Items
    const { data: insertedMenuItems, error: menuError } = await supabase
        .from('menu_items')
        .insert(menuItems)
        .select()

    if (menuError) throw new Error('Error inserting menu items: ' + menuError.message)

    // 3. Link Hotels and Menu Items in hotel_menus
    const hotelMenusInserts = []

    if (insertedHotels && insertedMenuItems) {
        for (let i = 0; i < insertedMenuItems.length; i++) {
            // Assign each menu item to a hotel (round robin)
            const hotel = insertedHotels[i % insertedHotels.length];
            const menuItem = insertedMenuItems[i];

            hotelMenusInserts.push({
                hotel_id: hotel.id,
                menu_id: menuItem.id
            })
        }

        // Also add a few more random links to make menus richer
        for (const hotel of insertedHotels) {
            // Give every hotel the first 2 items (e.g. staples)
            for (let i = 0; i < 2; i++) {
                // Check if already added above
                const exists = hotelMenusInserts.find(hm => hm.hotel_id === hotel.id && hm.menu_id === insertedMenuItems[i].id);
                if (!exists) {
                    hotelMenusInserts.push({
                        hotel_id: hotel.id,
                        menu_id: insertedMenuItems[i].id
                    })
                }
            }
        }
    }

    const { error: linkError } = await supabase
        .from('hotel_menus')
        .insert(hotelMenusInserts)

    if (linkError) throw new Error('Error linking hotel menus: ' + linkError.message)

    return { success: true, message: 'Data migrated successfully!' }
}
