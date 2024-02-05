import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile.component';
import { AppModule } from 'src/app/app.module';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, ReactiveFormsModule],
      declarations: [UserProfileComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUser: () => of({ uid: 'testUid', photoURL: 'testPhotoURL' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', () => {
    const mockUser = {
      FirstName: 'John',
      LastName: 'Doe',
      PhoneNumber: '1234567890',
      UserName: 'johndoe',
    };

    component.ngOnInit();
    component.myUser = mockUser;
    fixture.detectChanges();

    expect(component.profileForm.value.FirstName).toEqual(mockUser.FirstName);
    expect(component.profileForm.value.LastName).toEqual(mockUser.LastName);
    expect(component.profileForm.value.PhoneNumber).toEqual(
      mockUser.PhoneNumber
    );
    expect(component.profileForm.value.UserName).toEqual(mockUser.UserName);
  });
});
