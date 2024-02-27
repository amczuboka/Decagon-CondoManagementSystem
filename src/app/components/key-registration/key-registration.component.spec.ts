import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyRegistrationComponent } from './key-registration.component';
import { AppModule } from 'src/app/app.module';

describe('KeyRegistrationComponent', () => {
  let component: KeyRegistrationComponent;
  let fixture: ComponentFixture<KeyRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [KeyRegistrationComponent]
    });
    fixture = TestBed.createComponent(KeyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
