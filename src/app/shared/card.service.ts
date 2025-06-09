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
    // Load cards from localStorage
    const savedIDs = localStorage.getItem('cards-array');
    const savedCards = localStorage.getItem('cards-state');
    if (savedIDs !== null && savedCards !== null) {
      const parsedIDs = JSON.parse(savedIDs);
      const parsedCards = JSON.parse(savedCards);
      if (Array.isArray(parsedIDs) && typeof parsedCards === 'object') {
        this.IDs.set(parsedIDs);
        this.counter = Math.max(...parsedIDs.map((id: string) => parseInt(id) || 0), 0);
        // Restore card states
        for (const id of parsedIDs) {
          const state = parsedCards[id];
          if (state) {
            this.cards.set(id, {
              hours: signal(state.hours || '00'),
              minutes: signal(state.minutes || '00'),
              seconds: signal(state.seconds || '00'),
              StartBtn: signal(state.StartBtn !== undefined ? state.StartBtn : true),
              elapsedTime: state.elapsedTime || 0,
              interval: null, // Will be reinitialized for running stopwatches
              startTime: state.startTime || 0,
              deviceType: state.deviceType || 'ps4' // Fallback, should be set by addCard
            });
            // Resume running stopwatch
            if (!state.StartBtn) {
              this.resumeStopwatch(id);
            }
          }
        }
      }
    }
    // Save cards to localStorage on change
    effect(() => {
      localStorage.setItem('cards-array', JSON.stringify(this.IDs()));
      const cardsState: { [key: string]: any } = {};
      this.cards.forEach((state, id) => {
        cardsState[id] = {
          hours: state.hours(),
          minutes: state.minutes(),
          seconds: state.seconds(),
          StartBtn: state.StartBtn(),
          elapsedTime: state.elapsedTime,
          startTime: state.startTime,
          deviceType: state.deviceType
        };
      });
      localStorage.setItem('cards-state', JSON.stringify(cardsState));
    });
  }

  addCard(deviceType:string){
    this.counter++;
    const id = this.counter.toString();
    this.IDs.update(()=>[...this.IDs(),this.counter.toString()])
    this.initStopwatch(id, deviceType);
  }
  getDeviceType(id: string){
    return this.cards.get(id)!.deviceType;
  }
  getDeviceImage(id: string): string {
    this.initStopwatch(id);
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
  initStopwatch(id: string, deviceType?: string) {
    if (!this.cards.has(id)) {
      this.cards.set(id, {
        hours: signal('00'),
        minutes: signal('00'),
        seconds: signal('00'),
        StartBtn: signal(true),
        elapsedTime: 0,
        interval: null,
        startTime: 0,
        deviceType: deviceType || 'ps4'
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

  private resumeStopwatch(id: string) {
    const card = this.cards.get(id);
    if (card && !card.StartBtn()) {
      card.startTime = Date.now() - card.elapsedTime;
      card.interval = setInterval(() => {
        card.elapsedTime = Date.now() - card.startTime;
        const totalSeconds = Math.floor(card.elapsedTime / 1000);
        card.hours.set(Math.floor(totalSeconds / 3600).toString().padStart(2, '0'));
        card.minutes.set(Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0'));
        card.seconds.set((totalSeconds % 60).toString().padStart(2, '0'));
      }, 1000);
    }
  }
}
