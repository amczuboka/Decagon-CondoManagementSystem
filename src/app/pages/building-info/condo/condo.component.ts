import { Component, Input } from '@angular/core';
import { Condo, Building } from 'src/app/models/properties';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-condo',
  templateUrl: './condo.component.html',
  styleUrls: ['./condo.component.scss'],
})
export class CondoComponent {
  @Input() condos!: Condo[];
  @Input() building!: Building;
  @Input() sourcePage!: string;
  myUser!: any;
  authority!: string;

  constructor(private router: Router, private authService: AuthService) {}

  requestOwnership() {
    // Navigate to the 'key-registration' page
    this.router.navigate(['/key-registration']);
  }

  async ngOnInit() {
    // Fetch the current user
    try {
      this.myUser = await this.authService.getUser();
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
      } else {
        this.authority = '';
      }
    } catch (error) {
      console.error(error);
      this.authority = '';
    }
  }

}
