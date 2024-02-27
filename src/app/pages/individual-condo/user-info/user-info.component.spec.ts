import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { UserDTO } from '../../../models/users';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let mockUserInfo: Partial<UserDTO>; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;

    // Initialize mock data
    mockUserInfo = {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      PhoneNumber: '123-456-7890',
      ProfilePicture: 'assets/profile.jpg'
    };

    component.userInfo = mockUserInfo as UserDTO; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
