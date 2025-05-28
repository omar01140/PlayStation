import { Component, effect, signal } from '@angular/core';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-side',
  standalone: true,
  imports: [MatSidenavContainer, MatSidenav, MatSidenavContent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent {
  small = signal(false);

  constructor() {
    // Initialize from localStorage
    const saved = localStorage.getItem('sidebar-small');
    if (saved !== null) {
      this.small.set(saved === 'true');
    }

    // Sync with localStorage whenever it changes
    effect(() => {
      localStorage.setItem('sidebar-small', String(this.small()));
    });
  }
}
