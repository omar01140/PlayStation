import { Component } from '@angular/core';
import { SideComponent } from "./side/side.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SideComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'playstation';
}
