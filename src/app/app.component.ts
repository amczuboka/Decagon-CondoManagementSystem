import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { BuildingService } from './services/building.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Decagon';
  constructor(private authService:AuthService, private userService:UserService, private buildingService:BuildingService) {
          (window as any).authService = this.authService;
          (window as any).userService = this.userService;
          (window as any).buildingService = this.buildingService;
  }
}
