import { Component, Input } from '@angular/core';
import { UserDTO, Authority } from '../../../models/users';
import { Condo } from '../../../models/properties';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  @Input() userInfo!: UserDTO;
  @Input() condo!: Condo;

  constructor() {}
}
