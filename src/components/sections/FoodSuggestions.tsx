"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getFoodSuggestions } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Suggestions...
        </>
      ) : (
        'Suggest Food'
      )}
    </Button>
  );
}

export default function FoodSuggestions() {
  const initialState = { data: null, error: null };
  const [state, formAction] = useActionState(getFoodSuggestions, initialState);

  return (
    <section id="suggestions" className="py-12">
      <Card className="max-w-2xl mx-auto shadow-lg overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-muted/50">
          <div className="flex items-center gap-3">
             <Sparkles className="h-8 w-8 text-primary" />
             <div>
                <CardTitle className="text-2xl font-headline">Climate-Aware Suggestions</CardTitle>
                <CardDescription>Get food ideas based on your local weather!</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form action={formAction} className="flex flex-col sm:flex-row gap-2">
            <Input
              name="location"
              placeholder="E.g., Chennai, India"
              required
              className="flex-grow"
              aria-label="Your location"
            />
            <SubmitButton />
          </form>

          {state.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.data && (
            <div className="mt-6 p-4 rounded-lg bg-secondary/50">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                Suggestions for your climate:
              </h3>
              <p className="mt-2 text-muted-foreground italic">"{state.data.reasoning}"</p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                {state.data.suggestions.map((food, index) => (
                  <li key={index} className="text-foreground">{food}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
