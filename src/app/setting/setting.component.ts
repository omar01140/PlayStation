import { Component } from '@angular/core';
import { DevicePricingComponent } from "./device-pricing/device-pricing.component";
import { MenuComponent } from "./menu/menu.component";
import { AddItemComponent } from "./menu/add-item/add-item.component";

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [DevicePricingComponent, MenuComponent, AddItemComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  AddingTask = false;

  onAddingItem(){
    this.AddingTask = true;
  }
  onCancelAddingItem(){
    this.AddingTask = false;
  }
}
