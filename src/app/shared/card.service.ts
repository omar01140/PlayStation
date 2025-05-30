import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  StartBtn = signal(true)
  minutes = signal('00')
  hours = signal('00')
  interval: any = null;
  startTime: number = 0;
  elapsedTime: number = 0;

  onStart() {
    if (this.interval) return;
    this.StartBtn.set(false);

    this.startTime = Date.now() - this.elapsedTime;
    this.interval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      const totalSeconds = Math.floor(this.elapsedTime / 1000);
      this.hours.set(String(Math.floor(totalSeconds / 3600)).padStart(2, '0'))
      this.minutes.set(String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'))
      console.log(totalSeconds)
    }, 1000);
  }

  onEnd() {
      console.log('end');

    this.StartBtn.set(true);
    this.hours.set('00')
    this.minutes.set('00')
    this.elapsedTime = 0;
    clearInterval(this.interval)
    this.interval = null;
  }
}
