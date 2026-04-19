"use server";
import { createClient } from "@/lib/supabase/server";
import type { MenuItem } from "@/hooks/use-cart";

export const getmenuItems = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('menu_items').select('*');
    return data as MenuItem[];
}

export const updateMenuItems = async (menuItems: MenuItem[]) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('menu_items').upsert(menuItems);
    return error?.message;
}

export const addMenuItems = async (menuItems: MenuItem[]) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('menu_items').insert(menuItems);
    return error?.message;
}

export const deleteMenuItem = async (id: string) => {
    const supabase = await createClient();
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    return error?.message;
}

export const getOrders = async () => {
    const supabase = await createClient();
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
    if (error) console.error('Error fetching orders:', error);
    return data ?? [];
}

export const placeOrder = async ({
    items,
    totalAmount,
    deliveryAddress,
}: {
    items: { id: string; name: string; price: number; quantity: number }[];
    totalAmount: number;
    deliveryAddress?: string;
}) => {
    const supabase = await createClient();

    // Get current logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('orders').insert({
        user_id: user?.id ?? null,
        status: 'pending',
        total_amount: totalAmount,
        delivery_address: deliveryAddress ?? null,
        items,                  // stored as JSONB column — add this column if not present
    });

    if (error) {
        console.error('Error placing order:', error);
        return { success: false, message: error.message };
    }

    return { success: true };
}

