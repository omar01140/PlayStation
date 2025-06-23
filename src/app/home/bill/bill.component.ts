import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardService } from '../../shared/card.service';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css',
})
export class BillComponent {
  @Input({required:true}) id!:string
  @Output() cancel = new EventEmitter<void>();

  cardService = inject(CardService);
  hours = this.cardService.getHours(this.id)
  minutes = this.cardService.getMinutes(this.id)
  playTimeCost = this.cardService.playtimeCost()
  deviceType = this.cardService.getDeviceType(this.id)
  multi = this.cardService.getMulti(this.id)
  orders = this.cardService.getOrders(this.id)
  total = this.cardService.getTotal(this.id)

  onCancel() {
    this.cancel.emit();
  }
}
