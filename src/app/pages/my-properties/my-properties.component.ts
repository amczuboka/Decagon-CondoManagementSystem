import { Component } from '@angular/core';
import { sourcePage } from 'src/app/models/properties';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.scss']
})
export class MyPropertiesComponent {
  sourcePage = sourcePage.propertiesPage;

}
