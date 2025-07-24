"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MenuItem } from '@/hooks/use-cart';
import { categories } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  cuisine: z.string().min(2, 'Cuisine must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  rating: z.coerce.number().min(0).max(5),
  image: z.string().url(),
  'data-ai-hint': z.string().optional(),
});

interface FoodItemFormProps {
  onSubmit: (data: MenuItem) => void;
  itemToEdit?: MenuItem | null;
}

export default function FoodItemForm({
  onSubmit,
  itemToEdit,
}: FoodItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: itemToEdit?.name || '',
      cuisine: itemToEdit?.cuisine || '',
      price: itemToEdit?.price || 0,
      category: itemToEdit?.category || '',
      rating: itemToEdit?.rating || 4.5,
      image: itemToEdit?.image || 'https://placehold.co/600x400.png',
      'data-ai-hint': itemToEdit?.['data-ai-hint'] || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      id: itemToEdit?.id || '', // ID will be handled by the parent
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g. Paneer Butter Masala" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cuisine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. North Indian" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {itemToEdit ? 'Save Changes' : 'Create Item'}
        </Button>
      </form>
    </Form>
  );
}
