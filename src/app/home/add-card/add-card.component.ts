import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../shared/card.service';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent {
  @Output() cancel = new EventEmitter<void>();

  deviceType ="";
  customPrice: number | null = null;
  custom=false;

  cardService= inject(CardService);

    onCancel(){
      this.deviceType = '';
      this.custom = false;
      this.customPrice = null;
      this.cancel.emit()
    }
  onSubmit(){
    if (this.deviceType) {
      this.cardService.addCard(this.deviceType);
      this.cancel.emit();
    }
  }
}
