import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

interface StopwatchState {
  hours: WritableSignal<string>;
  minutes: WritableSignal<string>;
  seconds: WritableSignal<string>;
  StartBtn: WritableSignal<boolean>;
  elapsedTime: number;
  interval: any | null;
  startTime: number;
}
@Injectable({
  providedIn: 'root'
})
export class CardService {
  //remove card
  removeStopwatch(id: string) {
    const stopwatch = this.stopwatches.get(id);
    if (stopwatch?.interval) {
      clearInterval(stopwatch.interval);
    }
    this.stopwatches.delete(id);
  }

  //timer functionality
  private stopwatches = new Map<string, StopwatchState>();

  initStopwatch(id: string) {
    if (!this.stopwatches.has(id)) {
      this.stopwatches.set(id, {
        hours: signal('00'),
        minutes: signal('00'),
        seconds: signal('00'),
        StartBtn: signal(true),
        elapsedTime: 0,
        interval: null,
        startTime: 0
      });
    }
  }

  getHours(id: string): Signal<string> {
    this.initStopwatch(id);
    return this.stopwatches.get(id)!.hours;
  }

  getMinutes(id: string): Signal<string> {
    this.initStopwatch(id);
    return this.stopwatches.get(id)!.minutes;
  }

  getSeconds(id: string): Signal<string> {
    this.initStopwatch(id);
    return this.stopwatches.get(id)!.seconds;
  }

  getStartBtn(id: string): Signal<boolean> {
    this.initStopwatch(id);
    return this.stopwatches.get(id)!.StartBtn;
  }

  onStart(id: string) {
    this.initStopwatch(id);
    const stopwatch = this.stopwatches.get(id)!;

    if (stopwatch.interval) return;
    stopwatch.StartBtn.set(false);

    stopwatch.startTime = Date.now() - stopwatch.elapsedTime;
    stopwatch.interval = setInterval(() => {
      stopwatch.elapsedTime = Date.now() - stopwatch.startTime;
      const totalSeconds = Math.floor(stopwatch.elapsedTime / 1000);
      stopwatch.hours.set(String(Math.floor(totalSeconds / 3600)).padStart(2, '0'))
      stopwatch.minutes.set(String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'))
      stopwatch.seconds.set(String(totalSeconds % 60).padStart(2, '0'));
      console.log('from inside the interval', id, this.getMinutes(id)(), this.getSeconds(id)());
    }, 1000);
  }

  onEnd(id: string) {
    this.initStopwatch(id);
    const stopwatch = this.stopwatches.get(id)!;

    stopwatch.StartBtn.set(true);
    stopwatch.hours.set('00')
    stopwatch.minutes.set('00')
    stopwatch.elapsedTime = 0;
    clearInterval(stopwatch.interval)
    stopwatch.interval = null;
  }
}
