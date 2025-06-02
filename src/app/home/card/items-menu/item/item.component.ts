import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  closed = signal(true);

  onclick(){
    this.closed.set(!this.closed())
  }
}
