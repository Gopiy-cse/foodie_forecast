"use server";
import {supabase} from "@/lib/supabase";
import type { MenuItem } from "@/hooks/use-cart";

export const getmenuItems = async() => {
    const {data, error} = await supabase.from('menu_items').select('*');
    return data as MenuItem[];
}

export const updateMenuItems = async(menuItems: MenuItem[]) => {
    const {data, error} = await supabase.from('menu_items').upsert(menuItems);
    return error?.message;
}

export const addMenuItems = async(menuItems: MenuItem[]) => {
    const {data, error} = await supabase.from('menu_items').insert(menuItems);
    return error?.message;
}