import { Router, Request, Response } from 'express';
import { climateAwareFoodSuggestionsFlow } from '../ai/flows/climate-aware-food-suggestions';

const router = Router();

// POST /api/ai/suggestions
router.post('/suggestions', async (req: Request, res: Response) => {
  const { location } = req.body;

  if (!location || typeof location !== 'string' || location.trim() === '') {
    return res.status(400).json({ error: 'Location cannot be empty.' });
  }

  try {
    const suggestions = await climateAwareFoodSuggestionsFlow({ location });
    return res.json(suggestions);
  } catch (err: any) {
    console.error('Genkit AI flow error:', err);
    return res.status(500).json({ error: err.message || 'Failed to get AI food suggestions.' });
  }
});

export default router;
