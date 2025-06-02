import { Component, input } from '@angular/core';
import { ItemComponent } from "./item/item.component";

@Component({
  selector: 'app-items-menu',
  standalone: true,
  imports: [ItemComponent],
  templateUrl: './items-menu.component.html',
  styleUrl: './items-menu.component.css'
})
export class ItemsMenuComponent{
  closed = input.required();
}
