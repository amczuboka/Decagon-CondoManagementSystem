import { Component, Input } from '@angular/core';
import { CondoDTO } from '../../../models/properties';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent {
  @Input() condo!: CondoDTO;

  constructor() {}

}
