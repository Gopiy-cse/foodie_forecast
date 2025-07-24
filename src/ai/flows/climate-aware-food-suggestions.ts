// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides climate-aware food suggestions based on the user's location and weather conditions.
 *
 * - climateAwareFoodSuggestions - A function that takes location data and returns food suggestions.
 * - ClimateAwareFoodSuggestionsInput - The input type for the climateAwareFoodSuggestions function.
 * - ClimateAwareFoodSuggestionsOutput - The return type for the climateAwareFoodSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClimateAwareFoodSuggestionsInputSchema = z.object({
  location: z
    .string()
    .describe('The user location. Example: city, country. e.g. Chennai, India'),
});

export type ClimateAwareFoodSuggestionsInput = z.infer<
  typeof ClimateAwareFoodSuggestionsInputSchema
>;

const ClimateAwareFoodSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested food items based on the climate.'),
  reasoning: z
    .string()
    .describe(
      'A short explanation of why these foods are suggested, related to the weather.'
    ),
});

export type ClimateAwareFoodSuggestionsOutput = z.infer<
  typeof ClimateAwareFoodSuggestionsOutputSchema
>;

export async function climateAwareFoodSuggestions(
  input: ClimateAwareFoodSuggestionsInput
): Promise<ClimateAwareFoodSuggestionsOutput> {
  return climateAwareFoodSuggestionsFlow(input);
}

const weatherApiTool = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Get the current weather conditions for a given location.',
    inputSchema: z.object({
      location: z
        .string()
        .describe('The location to get weather information for.'),
    }),
    outputSchema: z.object({
      temperature: z.number().describe('The current temperature in Celsius.'),
      condition: z
        .string()
        .describe('A short description of the weather condition (e.g., sunny, rainy, cloudy).'),
    }),
  },
  async function (input) {
    // Replace with actual weather API call
    // For demo purposes, return hardcoded data depending on the location.
    if (input.location.toLowerCase().includes('chennai')) {
      return {
        temperature: 32,
        condition: 'hot and humid',
      };
    } else if (input.location.toLowerCase().includes('london')) {
      return {
        temperature: 12,
        condition: 'rainy',
      };
    } else if (input.location.toLowerCase().includes('tokyo')) {
      return {
        temperature: 8,
        condition: 'cold',
      };
    } else {
      return {
        temperature: 20,
        condition: 'sunny',
      };
    }
  }
);

const prompt = ai.definePrompt({
  name: 'climateAwareFoodSuggestionsPrompt',
  input: {schema: ClimateAwareFoodSuggestionsInputSchema},
  output: {schema: ClimateAwareFoodSuggestionsOutputSchema},
  tools: [weatherApiTool],
  prompt: `You are a food suggestion expert.  Given the user's location, you will use the getWeather tool to find the current weather conditions, and suggest foods that are appropriate for that weather. The food suggestions should be tailored to the local cuisine of the provided location.

Location: {{{location}}}

Based on this weather, suggest food items that would be appropriate, providing a short reasoning.

Format your response as a JSON object with 'suggestions' (an array of food items) and 'reasoning' fields.`,
});

const climateAwareFoodSuggestionsFlow = ai.defineFlow(
  {
    name: 'climateAwareFoodSuggestionsFlow',
    inputSchema: ClimateAwareFoodSuggestionsInputSchema,
    outputSchema: ClimateAwareFoodSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
