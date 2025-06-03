import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  @Input() menuType: 'items' | 'orders' = 'items';
  quantity: number = 0;

  increment(): void {
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  remove(){
    console.log('removed');
  }
}
