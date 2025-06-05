import { effect, Injectable, signal, Signal, WritableSignal } from '@angular/core';

interface cardState {
  hours: WritableSignal<string>;
  minutes: WritableSignal<string>;
  seconds: WritableSignal<string>;
  StartBtn: WritableSignal<boolean>;
  elapsedTime: number;
  interval: any | null;
  startTime: number;
  deviceType: string;
}
@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cards = new Map<string, cardState>();
  IDs= signal<string[]>([]);

  //add card
  counter= 0;
  constructor() {
    const saved = localStorage.getItem('cards-array');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        this.IDs.set(parsed); // Set initial IDs from localStorage
        // Update counter to avoid duplicate IDs
        this.counter = Math.max(...parsed.map(id => parseInt(id) || 0), 0);
      }
    }
    effect(() => {
      localStorage.setItem('cards-array', JSON.stringify(this.IDs()));
    });
  }

  addCard(deviceType:string){
    this.counter++;
    const id = this.counter.toString();
    this.IDs.update(()=>[...this.IDs(),this.counter.toString()])
    this.initStopwatch(id, deviceType);
  }
  getDeviceImage(id: string): string {
    this.initStopwatch(id); // Ensure card exists
    const deviceType = this.cards.get(id)!.deviceType;
    const imageMap: { [key: string]: string } = {
      ps4: '/assets/ps4.png',
      ps5: '/assets/ps5.png',
    };
    return imageMap[deviceType];
  }

  //remove card
  removeStopwatch(id: string) {
    const card = this.cards.get(id);
    if (card?.interval) {
      clearInterval(card.interval);
    }
    this.cards.delete(id);
    this.IDs.update(ids => ids.filter(existingId => existingId !== id));
  }

  //timer functionality
  initStopwatch(id: string, deviceType: string = 'ps4') {
    if (!this.cards.has(id)) {
      this.cards.set(id, {
        hours: signal('00'),
        minutes: signal('00'),
        seconds: signal('00'),
        StartBtn: signal(true),
        elapsedTime: 0,
        interval: null,
        startTime: 0,
        deviceType
      });
    }
  }

  getHours(id: string): Signal<string> {
    this.initStopwatch(id);
    return this.cards.get(id)!.hours;
  }

  getMinutes(id: string): Signal<string> {
    this.initStopwatch(id);
    return this.cards.get(id)!.minutes;
  }

  getSeconds(id: string): Signal<string> {
    this.initStopwatch(id);
    return this.cards.get(id)!.seconds;
  }

  getStartBtn(id: string): Signal<boolean> {
    this.initStopwatch(id);
    return this.cards.get(id)!.StartBtn;
  }

  onStart(id: string) {
    this.initStopwatch(id);
    const stopwatch = this.cards.get(id)!;

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
    const stopwatch = this.cards.get(id)!;

    stopwatch.StartBtn.set(true);
    stopwatch.hours.set('00')
    stopwatch.minutes.set('00')
    stopwatch.elapsedTime = 0;
    clearInterval(stopwatch.interval)
    stopwatch.interval = null;
  }
}
