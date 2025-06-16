import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SettingsService } from '../../shared/setting.service';
import { MenuItem } from '../../shared/setting.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  settingsService = inject(SettingsService);
  menuItems = this.settingsService.getMenuItems();

  @Output() open = new EventEmitter<void>();
  @Output() edit = new EventEmitter<MenuItem>();

  onAdding() {
    this.open.emit();
  }

  onEdit(item: MenuItem) {
    this.edit.emit(item);
  }

  onDelete(itemName: string) {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      this.settingsService.deleteMenuItem(itemName);
    }
  }
}
