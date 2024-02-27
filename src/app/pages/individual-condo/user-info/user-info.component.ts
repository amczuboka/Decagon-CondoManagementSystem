import { Component, Input } from '@angular/core';
import { UserDTO } from '../../../models/users';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  @Input() userInfo!: UserDTO;

  constructor() {}
}
