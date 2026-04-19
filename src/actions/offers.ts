'use server';

import { createClient } from '@/lib/supabase/server';

export interface Offer {
    id: string;
    title: string;
    description: string | null;
    code: string;
    active: boolean;
    valid_from: string | null;
    valid_to: string | null;
}

export const getOffers = async (): Promise<Offer[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching offers:', error);
        return [];
    }

    return data ?? [];
};
