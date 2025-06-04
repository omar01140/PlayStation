import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  custom="";


  onCancel(){
    this.cancel.emit()
  }
  onSubmit(){
    console.log('deviceType',this.deviceType);
    console.log(this.custom);
    console.log(this.customPrice);

    this.cancel.emit()
  }
}
