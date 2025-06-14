import { Component, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-device-pricing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './device-pricing.component.html',
  styleUrl: './device-pricing.component.css'
})
export class DevicePricingComponent {
  private formData = viewChild.required<NgForm>('form')
  edit= signal(false);

  constructor(){
    this.getPrices()
  }
  onEdit(){
    this.edit.set(true)
  }
  onCancel(){
    this.edit.set(false)
    this.getPrices()
  }
  onSubmit(){
    window.localStorage.setItem('prices', JSON.stringify(this.formData()?.value))
    this.edit.set(false)
  }
  getPrices(){
    const getPrices = window.localStorage.getItem('prices');
    if (getPrices) {
      const prices = JSON.parse(getPrices)
      console.log(prices.multi4);
      setTimeout(() => {
        this.formData().setValue({
          single4: prices.single4,
          multi4: prices.multi4,
          single5: prices.single5,
          multi5: prices.multi5,
        })
      }, 1);
    }
  }
}
