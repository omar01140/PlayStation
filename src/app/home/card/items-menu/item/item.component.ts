import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardService } from '../../../../shared/card.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  @Input() menuType: 'items' | 'orders' = 'items';
  @Input() itemData: { item: string; price: number; quantity: number } = { item: '', price: 0, quantity: 0 };
  @Output() quantityChange = new EventEmitter<{ item: string; price: number; quantity: number }>();
  @Output() remove = new EventEmitter<void>();

  increment(): void {
    this.quantityChange.emit({
      ...this.itemData,
      quantity: this.itemData.quantity + 1
    });
  }

  decrement(): void {
    if (this.itemData.quantity > 0) {
      this.quantityChange.emit({
        ...this.itemData,
        quantity: this.itemData.quantity - 1
      });
    }
  }

  onRemove(){
    this.remove.emit();
  }
}
