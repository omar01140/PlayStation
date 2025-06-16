import { Injectable, signal, WritableSignal, effect } from '@angular/core';

export interface MenuItem {
  item: string;
  price: number;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private menuItems: WritableSignal<MenuItem[]> = signal([]);

  constructor() {
    // Load menu items from localStorage or seed with defaults
    const savedMenuItems = localStorage.getItem('menu-items');
    if (savedMenuItems) {
      try {
        const parsedItems = JSON.parse(savedMenuItems);
        if (Array.isArray(parsedItems)) {
          this.menuItems.set(parsedItems);
          console.log('Loaded menu-items:', parsedItems);
        }
      } catch (error) {
        console.error('Error parsing menu-items from localStorage:', error);
      }
    } else {
      // Seed with default menu items (migrated from CardService)
      const defaultItems: MenuItem[] = [];
      this.menuItems.set(defaultItems);
      console.log('Seeded menu-items:', defaultItems);
    }

    // Persist menu items to localStorage on change
    effect(() => {
      localStorage.setItem('menu-items', JSON.stringify(this.menuItems()));
      console.log('Saved menu-items:', this.menuItems());
    });
  }

  getMenuItems(): WritableSignal<MenuItem[]> {
    return this.menuItems;
  }

  addMenuItem(item: MenuItem): void {
    this.menuItems.update((items) => [...items, item]);
  }

  updateMenuItem(updatedItem: MenuItem, oldName: string): void {
    this.menuItems.update((items) =>
      items.map((item) => (item.item === oldName ? { ...updatedItem } : item))
    );
  }

  deleteMenuItem(itemName: string): void {
    this.menuItems.update((items) =>
      items.filter((item) => item.item !== itemName)
    );
  }
}
