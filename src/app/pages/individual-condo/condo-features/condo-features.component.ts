import { Component, Input } from '@angular/core';
import { BuildingDTO, CondoDTO } from '../../../models/properties';

@Component({
  selector: 'app-condo-features',
  templateUrl: './condo-features.component.html',
  styleUrls: ['./condo-features.component.scss'],
})
export class CondoFeaturesComponent {
  @Input() condo!: CondoDTO;
  @Input() building!: BuildingDTO;

  constructor() {}
}
