import { Component, computed, inject, input } from '@angular/core';
import { ItemComponent } from "./item/item.component";
import { CardService } from '../../../shared/card.service';

@Component({
  selector: 'app-items-menu',
  standalone: true,
  imports: [ItemComponent],
  templateUrl: './items-menu.component.html',
  styleUrl: './items-menu.component.css'
})
export class ItemsMenuComponent{
  closed = input.required();
  id = input.required<string>();

  cardService = inject(CardService);

  menuItems = computed(() => {
    const orders = this.cardService.getOrders(this.id());
    return this.cardService.getMenuItems().map(menuItem => {
      const order = orders.find(o => o.item === menuItem.item);
      return {
        item: menuItem.item,
        price: menuItem.price,
        quantity: order ? order.quantity : 0
      };
    });
  });
}
