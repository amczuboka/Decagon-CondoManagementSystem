import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from 'src/app/services/building.service'; // Import BuildingService
import { Building, Operation } from 'src/app/models/properties'; // Import Building interface
import { Authority} from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-add-new-building-operation',
  templateUrl: './add-new-building-operation.component.html',
  styleUrls: ['./add-new-building-operation.component.scss'],
})
export class AddNewBuildingOperationComponent implements OnInit {
  operationForm!: FormGroup;
  submitted: boolean = false;
  buildings: Building[] = []; // Array to hold fetched buildings
  myUser!: any;
  authority!: string;
  propertiesID!: any;
  private buildingsSubscription: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private buildingService: BuildingService, // Inject BuildingService
    private userService: UserService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}


  async ngOnInit(): Promise<void> {
    // Initialize the form
    this.operationForm = this.formBuilder.group({
      operationName: ['', Validators.required],
      description: ['', Validators.required],
      cost: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      building: ['', Validators.required],
    });
    // Fetch the current Company
    try {
      this.myUser = await this.authService.getUser();
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
      }
      if (this.authority == Authority.Company) {
        this.userService.getCompanyUser(this.myUser.uid).then((user) => {
          this.myUser = user;
        });
      }
    } catch (error) {
      console.error(error);
      this.authority = '';
    }
    //fetch buildings from the current company
    this.buildingsSubscription = this.buildingService.buildings$.subscribe(
      (buildings) => {
        if (buildings) {
          if (this.authority == Authority.Company) {
            const availableBuildings = Object.values(buildings).filter(
              (building: Building) => building.CompanyID === this.myUser.uid
            );
            this.buildings = availableBuildings;
          } else {
            this.buildings = [];
          }
        } else {
          // Handle case when buildings array is null
          this.buildings = [];
          console.log('Buildings array is null');
        }
      }
    );
  }

  get f() {
    return this.operationForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    if (this.operationForm.invalid) {
      return;
    }

    //Create an operation object with form data
    const operation: Operation = {
      name: this.operationForm.get('operationName')?.value,
      description: this.operationForm.get('description')?.value,
      cost: parseFloat(this.operationForm.get('cost')?.value),
    };

    const selectedBuildingId = this.f['building'].value;

    //Call the addOperation function from BuildingService
    this.buildingService
      .addOperation(selectedBuildingId, operation)
      .then(() => {
        this.notification.sendNotification('Operation added successfully!');
        this.operationForm.reset();
        this.submitted = false;
      })
      .catch((error) => {
        this.notification.sendNotification(`Error adding operation: ${error}`);
       
      });
  }
}
