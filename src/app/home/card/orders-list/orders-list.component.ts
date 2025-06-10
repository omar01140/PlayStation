import { Component, inject, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ItemComponent } from "../items-menu/item/item.component";
import { CardService } from '../../../shared/card.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [MatExpansionModule, ItemComponent],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent {
  @Input({ required: true }) id!: string;

  cardService = inject(CardService);

  removeOrder(orderIndex: number) {
    this.cardService.removeOrder(this.id, orderIndex);
  }
}
