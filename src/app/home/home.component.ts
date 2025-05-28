import { Component, OnDestroy, signal } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatMenuModule, MatSlideToggleModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {
  StartBtn = signal(true)
  minutes = signal('00')
  hours = signal('00')
  interval: any = null;
  startTime: number = 0;
  elapsedTime: number = 0;

  start(){
    if (this.interval) return;
    this.StartBtn.set(!this.StartBtn());

    this.startTime = Date.now() - this.elapsedTime;
    this.interval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      const totalSeconds = Math.floor(this.elapsedTime / 1000);
      this.hours.set(String(Math.floor(totalSeconds / 3600)).padStart(2, '0'))
      this.minutes.set(String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'))
      console.log(totalSeconds)
    }, 1000);
  }
  end(){
    this.StartBtn.set(!this.StartBtn());
    this.hours.set('00')
    this.minutes.set('00')
    this.elapsedTime = 0;
    clearInterval(this.interval)
    this.interval = null;
  }
    ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
