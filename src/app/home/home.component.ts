import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatMenuModule, MatSlideToggleModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
