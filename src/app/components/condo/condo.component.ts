import { Component, Input, SimpleChanges } from '@angular/core';
import { Condo } from 'src/app/models/properties';
import { Router } from '@angular/router';

@Component({
  selector: 'app-condo',
  templateUrl: './condo.component.html',
  styleUrls: ['./condo.component.scss'],
})
export class CondoComponent {
  @Input() condos!: Condo[];

  constructor(private router: Router) {}

  requestOwnership() {
    // Navigate to the 'key-registration' page
    this.router.navigate(['/key-registration']);
  }
}
