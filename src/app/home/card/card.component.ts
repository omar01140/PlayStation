import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CardService } from '../../shared/card.service';
import { ItemsMenuComponent } from './items-menu/items-menu.component';
import { NgClass } from '@angular/common';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { FormsModule } from '@angular/forms';
import { BillComponent } from '../bill/bill.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatMenuModule,
    MatSlideToggleModule,
    ItemsMenuComponent,
    OrdersListComponent,
    NgClass,
    FormsModule,
    BillComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) index!: string;
  @Output() remove = new EventEmitter<string>();

  private cardService = inject(CardService);

  StartBtn = this.cardService.getStartBtn(this.id);
  minutes = this.cardService.getMinutes(this.id);
  hours = this.cardService.getHours(this.id);
  cost = this.cardService.getTotal(this.id);
  multi = this.cardService.getMulti(this.id);
  deviceImage: string = '';
  deviceType: string = '';
  image: boolean = true;

  closed = signal(true);

  ngOnInit() {
    this.cardService.initCard(this.id);

    this.StartBtn = this.cardService.getStartBtn(this.id);
    this.minutes = this.cardService.getMinutes(this.id);
    this.hours = this.cardService.getHours(this.id);
    this.cost = this.cardService.getTotal(this.id);
    this.deviceImage = this.cardService.getDeviceImage(this.id);
    this.deviceType = this.cardService.getDeviceType(this.id);
    this.multi = this.cardService.getMulti(this.id);
  }

  start() {
    this.cardService.onStart(this.id);
    console.log(this.deviceType);
  }
  isEndInitiated = false;
  end() {
    this.bill = true;
    this.isEndInitiated = true;
  }
  onRemove() {
    this.remove.emit(this.id);
  }

  onOpenMenu() {
    this.closed.set(!this.closed());
  }

  toggleMulti() {
    this.cardService.setMulti(this.id, this.multi());
  }

  bill = false;
  onOpenBill() {
    this.bill = true;
    this.isEndInitiated = false;
  }

  onCancelBill() {
    if (this.isEndInitiated) {
      const confirmed = window.confirm(
        'If you close the bill now, you will not be able to retrieve this data again. Are you sure?'
      );
      if (confirmed) {
        this.bill = false;
        this.isEndInitiated = false;
        this.cardService.onEnd(this.id);
      }
    } else {
      this.bill = false;
    }
  }
}
