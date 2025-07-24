'use server';

import {
  climateAwareFoodSuggestions,
  type ClimateAwareFoodSuggestionsOutput,
} from '@/ai/flows/climate-aware-food-suggestions';
import { z } from 'zod';

const locationSchema = z.string().min(1, { message: 'Location cannot be empty.' });

interface ActionState {
  data: ClimateAwareFoodSuggestionsOutput | null;
  error: string | null;
}

export async function getFoodSuggestions(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const location = formData.get('location');

  const validatedLocation = locationSchema.safeParse(location);

  if (!validatedLocation.success) {
    return { data: null, error: validatedLocation.error.errors[0].message };
  }

  try {
    const suggestions = await climateAwareFoodSuggestions({ location: validatedLocation.data });
    return { data: suggestions, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to get suggestions. Please try again.' };
  }
}
