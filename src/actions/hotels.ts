"use server";
import { supabase } from "@/lib/supabase";
import type { Hotel } from "@/lib/data";
import type { MenuItem } from "@/hooks/use-cart";

export const getHotels = async () => {
    const { data, error } = await supabase.from("hotels")
    .select(`id, name, cuisine, image_url, 
        hotel_menus(
            menu_items(
                id, name, price, rating, image_url, cuisine, category
            )
        )`);
    return data as Hotel[];
};

export const getHotelById = async (id: string) => {
    const { data, error } = await supabase.from("hotels")
    .select(`id, name, cuisine, image_url, 
        hotel_menus(
            menu_items(
                id, name, price, rating, image_url, cuisine, category
            )
        )`)
    .eq("id", id);
    return data as Hotel[];
};