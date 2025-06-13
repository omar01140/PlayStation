import { Component } from '@angular/core';
import { DevicePricingComponent } from "./device-pricing/device-pricing.component";

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [DevicePricingComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {

}
