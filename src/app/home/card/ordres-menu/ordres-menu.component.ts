import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ItemComponent } from "../items-menu/item/item.component";

@Component({
  selector: 'app-ordres-menu',
  standalone: true,
  imports: [MatExpansionModule, ItemComponent],
  templateUrl: './ordres-menu.component.html',
  styleUrl: './ordres-menu.component.css'
})
export class OrdresMenuComponent {

}
