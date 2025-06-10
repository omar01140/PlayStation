import { Component, inject, input } from '@angular/core';
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

  // menuItems =this.cardService.getMenuItems()
}
