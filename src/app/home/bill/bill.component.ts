import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { CardService } from '../../shared/card.service';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css',
})
export class BillComponent {
  @Input({ required: true }) id!: string;
  @Output() cancel = new EventEmitter<void>();

  cardService = inject(CardService);

  hours = this.cardService.getHours(this.id)
  minutes = this.cardService.getMinutes(this.id)
  hourPrice = this.cardService.price(this.id)
  deviceType = this.cardService.getDeviceType(this.id)
  multi = this.cardService.getMulti(this.id)
  orders = this.cardService.getOrders(this.id)
  total = this.cardService.getTotal(this.id)
  ngOnInit(){
    this.hours = this.cardService.getHours(this.id)
    this.minutes = this.cardService.getMinutes(this.id)
    this.hourPrice = this.cardService.price(this.id)
    this.deviceType = this.cardService.getDeviceType(this.id)
    this.multi = this.cardService.getMulti(this.id)
    this.orders = this.cardService.getOrders(this.id)
    this.total = this.cardService.getTotal(this.id)
  }

  get playCost(){
    const playtimeCost = (+this.hours() + +this.minutes() / 60) * this.hourPrice
    return playtimeCost.toFixed(2)
  }
  onCancel() {
    this.cancel.emit();
  }
  onPrint(){
    window.print()
  }
}
