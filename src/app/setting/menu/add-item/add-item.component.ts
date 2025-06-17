import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MenuItem, SettingsService } from '../../../shared/setting.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css',
})
export class AddItemComponent {
  @Input() editingItem?: MenuItem;
  @Output() cancel = new EventEmitter<void>();

  private settingsService = inject(SettingsService);

  itemForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, this.uniqueNameValidator.bind(this)],
      nonNullable: true,
    }),
    price: new FormControl(0, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    image: new FormControl(''),
  });

  private originalName?: string;

  ngOnChanges() {
    if (this.editingItem) {
      this.originalName = this.editingItem.item;
      this.itemForm.setValue({
        name: this.editingItem.item,
        price: this.editingItem.price,
        image: this.editingItem.image || '',
      });
    } else {
      this.originalName = undefined;
      this.itemForm.reset({ name: '', price: 0, image: '' });
    }
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      const newItem: MenuItem = {
        item: formValue.name!,
        price: Number(formValue.price!),
        image: formValue.image || undefined,
      };
      if (this.editingItem && this.originalName) {
        this.settingsService.updateMenuItem(newItem, this.originalName);
      } else {
        this.settingsService.addMenuItem(newItem);
      }
      this.cancel.emit();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  private uniqueNameValidator(control: AbstractControl): ValidationErrors | null {
    const name = control.value?.trim();
    const menuItems = this.settingsService.getMenuItems()();
    const isDuplicate = menuItems.some((item) => item.item === name && item.item !== this.originalName);
    return isDuplicate ? { notUnique: true } : null;
  }
}
