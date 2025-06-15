import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent {
  @Output() cancel = new EventEmitter<void>();

  onCancel(){
    this.cancel.emit()
  }
  onSubmit(){
    this.cancel.emit();
  }
}
