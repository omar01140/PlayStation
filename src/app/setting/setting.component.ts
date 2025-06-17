import { Component } from '@angular/core';
import { DevicePricingComponent } from "./device-pricing/device-pricing.component";
import { MenuComponent } from "./menu/menu.component";
import { AddItemComponent } from "./menu/add-item/add-item.component";

import { MenuItem } from '../shared/setting.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [DevicePricingComponent, MenuComponent, AddItemComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  AddingTask = false;
  editingItem?: MenuItem;

  onAddingItem() {
    // console.log('opened');

    this.AddingTask = true;
    this.editingItem = undefined;
  }

  onEditItem(item: MenuItem) {
    this.AddingTask = true;
    this.editingItem = item;
  }

  onCancelAddingItem() {
    this.AddingTask = false;
    this.editingItem = undefined;
  }
}
