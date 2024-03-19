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


@Component({
  selector: 'app-key-registration',
  templateUrl: './key-registration.component.html',
  styleUrls: ['./key-registration.component.scss']
})
export class KeyRegistrationComponent {
constructor(private buildingService: BuildingService,
  private authService: AuthService,
  private userService: UserService,  ) { }

  @ViewChild('inputRef') inputElement!: ElementRef<HTMLInputElement>;

async getAllBuildings() {
  try {
    const buildingsWithCondos = await this.buildingService.getAllBuildingsWithCondos();
    console.log(buildingsWithCondos);
  } catch (error) {
    console.error('Error fetching buildings with condos:', error);
  }
}

async handleButtonClick() {
  const value = this.inputElement.nativeElement.value.trim();
  if (!value) {
    alert('Input value is empty!');
    return;
  }

  try {
    const user = await this.authService.getUser();
    if(!user) {
      console.error('No user is currently logged in');
      return;
    }
    const currentID = user.uid;
    const buildingsWithCondos = await this.buildingService.getAllBuildingsWithCondos();
    let found = false;
    for (const building of buildingsWithCondos) {
      for (const condo of building.Condos) { 
       
        if (condo.ID === value) {
          condo.OccupantID = currentID;
          this.buildingService.updateCondo(building.ID,condo.ID,currentID)
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
  } catch (error) {
    console.error('Error fetching buildings with condos:', error);
  }
}
}