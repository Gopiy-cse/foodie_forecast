"use client";

import MenuItemCard from '@/components/cards/MenuItemCard';
import type { MenuItem } from '@/hooks/use-cart';

interface MenuSectionProps {
  menu: MenuItem[];
}

export default function MenuSection({ menu }: MenuSectionProps) {
  return (
    <section id="menu" className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 font-headline">Our Menu</h2>
      {menu.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menu.map((item) => <MenuItemCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="col-span-full text-center py-16">
            <p className="text-lg text-muted-foreground">No dishes found for this hotel.</p>
        </div>
      )}
    </section>
  );
}
