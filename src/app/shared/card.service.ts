import {
  effect,
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from './setting.service';

interface cardState {
  hours: WritableSignal<string>;
  minutes: WritableSignal<string>;
  seconds: WritableSignal<string>;
  StartBtn: WritableSignal<boolean>;
  elapsedTime: number;
  interval: any | null;
  startTime: number;
  deviceType: string;
  orders: WritableSignal<order[]>;
  totalCost: WritableSignal<number>;
  multi: WritableSignal<boolean>;
}
interface order {
  item: string;
  price: number;
  quantity: number;
}
interface MenuItem {
  item: string;
  price: number;
}
@Injectable({
  providedIn: 'root',
})
export class CardService {
  private cards = new Map<string, cardState>();
  private settingsService = inject(SettingsService);
  private router = inject(Router);
  IDs = signal<string[]>([]);

  //add card & keep card data in local storage
  counter = 0;
  constructor() {
    // Load cards from localStorage
    const savedIDs = localStorage.getItem('cards-array');
    const savedCards = localStorage.getItem('cards-state');
    if (savedIDs !== null && savedCards !== null) {
      const parsedIDs = JSON.parse(savedIDs);
      const parsedCards = JSON.parse(savedCards);
      if (Array.isArray(parsedIDs) && typeof parsedCards === 'object') {
        this.IDs.set(parsedIDs);
        this.counter = Math.max(
          ...parsedIDs.map((id: string) => parseInt(id) || 0),
          0
        );
        // Restore card states
        for (const id of parsedIDs) {
          const state = parsedCards[id];
          if (state) {
            this.cards.set(id, {
              hours: signal(state.hours || '00'),
              minutes: signal(state.minutes || '00'),
              seconds: signal(state.seconds || '00'),
              StartBtn: signal(
                state.StartBtn !== undefined ? state.StartBtn : true
              ),
              elapsedTime: state.elapsedTime || 0,
              interval: null,
              startTime: state.startTime || 0,
              deviceType: state.deviceType || 'ps4',
              orders: signal(state.orders || []),
              totalCost: signal(state.totalCost || 0),
              multi: signal(state.multi !== undefined ? state.multi : false),
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
          deviceType: state.deviceType,
          orders: state.orders(),
          totalCost: state.totalCost(),
          multi: state.multi(),
        };
      });
      localStorage.setItem('cards-state', JSON.stringify(cardsState));
    });
  }

  addCard(deviceType: string) {
    this.counter++;
    const id = this.counter.toString();
    this.IDs.update(() => [...this.IDs(), this.counter.toString()]);
    this.initCard(id, deviceType);
  }
  getDeviceType(id: string) {
    return this.cards.get(id)!.deviceType;
  }
  getDeviceImage(id: string): string {
    this.initCard(id);
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
    this.IDs.update((ids) => ids.filter((existingId) => existingId !== id));
  }

  //card init
  initCard(id: string, deviceType?: string) {
    if (!this.cards.has(id)) {
      this.cards.set(id, {
        hours: signal('00'),
        minutes: signal('00'),
        seconds: signal('00'),
        StartBtn: signal(true),
        elapsedTime: 0,
        interval: null,
        startTime: 0,
        deviceType: deviceType || 'ps4',
        orders: signal([]),
        totalCost: signal(0),
        multi: signal(false),
      });
    }
  }

  getHours(id: string): Signal<string> {
    this.initCard(id);
    return this.cards.get(id)!.hours;
  }

  getMinutes(id: string): Signal<string> {
    this.initCard(id);
    return this.cards.get(id)!.minutes;
  }

  getSeconds(id: string): Signal<string> {
    this.initCard(id);
    return this.cards.get(id)!.seconds;
  }

  getStartBtn(id: string): Signal<boolean> {
    this.initCard(id);
    return this.cards.get(id)!.StartBtn;
  }

  onStart(id: string) {
    this.initCard(id);
    this.price(id);
    const stopwatch = this.cards.get(id)!;
    let price = this.price(id);

    if (stopwatch.interval) return;
    if (price == 0 || price == null || price == "" ) {
      alert('Please set the prices table first');
      this.router.navigate(['/setting']);
      return
    };
    stopwatch.StartBtn.set(false);
    this.updateTotalCost(id);

    stopwatch.startTime = Date.now() - stopwatch.elapsedTime;
    stopwatch.interval = setInterval(() => {
      stopwatch.elapsedTime = Date.now() - stopwatch.startTime;
      const totalSeconds = Math.floor(stopwatch.elapsedTime / 1000);
      stopwatch.hours.set(
        String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
      );
      stopwatch.minutes.set(
        String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
      );
      stopwatch.seconds.set(String(totalSeconds % 60).padStart(2, '0'));
      this.updateTotalCost(id);
      console.log(
        'from inside the interval',
        id,
        this.getMinutes(id)(),
        this.getSeconds(id)()
      );
    }, 1000);
  }

  onEnd(id: string) {
    this.initCard(id);
    const card = this.cards.get(id)!;

    card.StartBtn.set(true);
    card.hours.set('00');
    card.minutes.set('00');
    card.seconds.set('00');
    card.elapsedTime = 0;
    clearInterval(card.interval);
    card.interval = null;
    card.orders.set([]);
    card.multi.set(false);
    this.updateTotalCost(id);
  }

  private resumeStopwatch(id: string) {
    const card = this.cards.get(id);
    if (card && !card.StartBtn()) {
      card.startTime = Date.now() - card.elapsedTime;
      card.interval = setInterval(() => {
        card.elapsedTime = Date.now() - card.startTime;
        const totalSeconds = Math.floor(card.elapsedTime / 1000);
        card.hours.set(
          Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, '0')
        );
        card.minutes.set(
          Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0')
        );
        card.seconds.set((totalSeconds % 60).toString().padStart(2, '0'));
        this.updateTotalCost(id);
      }, 1000);
      this.updateTotalCost(id);
    }
  }

  // get orders

  addOrder(id: string, order: order) {
    const card = this.cards.get(id);
    if (card) {
      const currentOrders = card.orders();
      let newOrders: order[];
      if (order.quantity <= 0) {
        // Remove order if quantity is 0
        newOrders = currentOrders.filter((o) => o.item !== order.item);
      } else {
        const existingOrderIndex = currentOrders.findIndex(
          (o) => o.item === order.item
        );
        if (existingOrderIndex !== -1) {
          // Update quantity if item exists
          newOrders = currentOrders.map((o, index) =>
            index === existingOrderIndex
              ? { ...o, quantity: order.quantity }
              : o
          );
        } else {
          // Add new order
          newOrders = [...currentOrders, order];
        }
      }
      card.orders.set(newOrders);
      this.updateTotalCost(id);
    }
  }

  removeOrder(id: string, orderIndex: number) {
    const card = this.cards.get(id);
    if (card) {
      const newOrders = card
        .orders()
        .filter((_, index) => index !== orderIndex);
      card.orders.set(newOrders);
      this.updateTotalCost(id);
    }
  }

  getOrders(id: string): order[] {
    this.initCard(id);
    return this.cards.get(id)!.orders();
  }

  getMenuItems(): WritableSignal<MenuItem[]> {
    return this.settingsService.getMenuItems();
  }
  //Total cost
  private hourCost = 0;

  setMulti(id: string, multi: boolean) {
    this.initCard(id);
    const card = this.cards.get(id)!;
    card.multi.set(multi);
    this.updateTotalCost(id);
  }

  getMulti(id: string): WritableSignal<boolean> {
    this.initCard(id);
    return this.cards.get(id)!.multi;
  }


  price(id: string) {
    const prices = window.localStorage.getItem('prices');
    const card = this.cards.get(id);
    if (prices) {
      const Parsedprices = JSON.parse(prices);
      if (card?.deviceType == 'ps4') {
        return card.multi() ? Parsedprices.multi4 : Parsedprices.single4;
      } else if (card?.deviceType == 'ps5') {
        return card.multi() ? Parsedprices.multi5 : Parsedprices.single5;
      }
    }
    return 0;
  }

  getTotal(id: string): WritableSignal<number> {
    this.initCard(id);
    return this.cards.get(id)!.totalCost;
  }

  private updateTotalCost(id: string) {
    const card = this.cards.get(id);
    let price = this.price(id);
    if (card) {
      // Orders cost: sum of price * quantity
      const ordersCost = card
        .orders()
        .reduce((sum, order) => sum + order.price * order.quantity, 0);
      // Playtime cost: hours + minutes as fraction of hour
      const hours = parseInt(card.hours() || '0');
      const minutes = parseInt(card.minutes() || '0');
      const playtimeCost = (hours + minutes / 60) * price;
      // Total cost to 2 decimal places
      const total = Number((ordersCost + playtimeCost).toFixed(2));
      card.totalCost.set(total);
    }
  }
}
