import { Component, Input } from '@angular/core';
import { Building, Condo } from '../../../models/properties';

@Component({
  selector: 'app-condo-features',
  templateUrl: './condo-features.component.html',
  styleUrls: ['./condo-features.component.scss'],
})
export class CondoFeaturesComponent {
  @Input() condo!: Condo;
  @Input() building!: Building;

  constructor() {}
}
