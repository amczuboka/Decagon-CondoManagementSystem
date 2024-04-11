import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Condo } from 'src/app/models/properties';

import { DatabaseReference,
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
  onValue,} from 'firebase/database';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyDTO, UserDTO } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { BuildingService } from 'src/app/services/building.service';
import { User } from 'firebase/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-key-registration',
  templateUrl: './key-registration.component.html',
  styleUrls: ['./key-registration.component.scss'],
})
export class KeyRegistrationComponent {
  @ViewChild('inputRef') inputElement!: ElementRef<HTMLInputElement>;
  registrationType: 'condo' | 'parking' | 'locker' = 'condo';
  KeyReg!: FormGroup;

  constructor(
    private buildingService: BuildingService,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.KeyReg = this.formBuilder.group({
      registrationType: ['', Validators.required],
    });
  }

  async handleButtonClick() {
    const value = this.inputElement.nativeElement.value.trim();
    if (!value) {
      alert('Input value is empty!');
      return;
    }

    try {
      const user = await this.authService.getUser();
      if (!user) {
        console.error('No user is currently logged in');
        return;
      }
      const currentID = user.uid;
      console.log('this.KeyReg.value', this.KeyReg.value);
      console.log('this.KeyReg', this.KeyReg);

      switch (this.KeyReg.value.registrationType) {
        case 'condo':
          await this.registerForItem(value, currentID, 'Condos');
          break;
        case 'parking':
          await this.registerForItem(value, currentID, 'Parkings');
          break;
        case 'locker':
          await this.registerForItem(value, currentID, 'Lockers');
          break;
        default:
          console.error('Invalid registration type');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  }

  async registerForItem(
    itemId: string,
    currentUserId: string,
    itemType: 'Condos' | 'Parkings' | 'Lockers'
  ) {
    const buildingsWithItems =
      await this.buildingService.getAllBuildingsWithItems(itemType);
    for (const building of buildingsWithItems) {
      for (const item of building[itemType]) {
        if (item.ID === itemId) {
          item.OccupantID = currentUserId;

          await this.buildingService.updateItem(
            building.ID,
            itemType,
            item.ID,
            currentUserId
          );
          alert('Successfully registered!');
          return;
        }
      }
    }
    alert(`${itemType.slice(0, -1)} not found!`);
  }
}