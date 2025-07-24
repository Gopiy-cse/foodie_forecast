"use client";

import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/data';

export default function CategoryCards() {
  return (
    <section id="categories" className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 font-headline">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <Card key={category.name} className="group overflow-hidden text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <category.icon className="h-8 w-8 text-primary transition-all duration-300 group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
