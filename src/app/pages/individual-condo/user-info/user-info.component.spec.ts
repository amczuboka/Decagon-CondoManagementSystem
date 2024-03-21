import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { UserDTO, Authority } from '../../../models/users';
import { Condo, CondoStatus, CondoType } from '../../../models/properties';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let mockUserInfo: UserDTO; 
  let mockCondo: Condo; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;

    // Initialize mock data with all required fields
    mockUserInfo = {
      ID: 'user1',
      Authority: Authority.Employee,
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      PhoneNumber: '123-456-7890',
      ProfilePicture: 'assets/profile.jpg',
      UserName: 'johndoe',
    };

    mockCondo = {
      ID: 'condo1',
      Type: CondoType.Sale,
      OccupantID: 'user1',
      UnitNumber: '101',
      Fee: 1000,
      Picture: 'assets/condo.jpg',
      Description: 'A beautiful condo',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 1,
      Status: CondoStatus.Vacant,
      SquareFootage: 750,
    };

    component.userInfo = mockUserInfo;
    component.condo = mockCondo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 
});
