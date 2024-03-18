import { Component, Input, SimpleChanges } from '@angular/core';
import { Locker } from 'src/app/models/properties';
import { UserDTO } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.scss'],
})
export class LockerComponent {
  authority!: string;
  users: { [key: string]: UserDTO } = {};
  myUser!: any;
  @Input() lockers!: Locker[];
  @Input() sourcePage!: string;

  constructor(
    private authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['lockers'] && changes['lockers'].currentValue) {
    // Fetch user information for each locker's occupant
      for (const locker of this.lockers) {
        console.log(locker.OccupantID);
        if (locker.OccupantID) {
          try {
            const user = await this.userService.getPublicUser(
              locker.OccupantID
            );
            if (user) {
              this.users[locker.OccupantID] = user;
            }
          } catch (error) {
            console.error('Failed to get user', error);
          }
        }
      }
    }
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
