import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPropertiesComponent } from './my-properties.component';
import { AppModule } from 'src/app/app.module';

describe('MyPropertiesComponent', () => {
  let component: MyPropertiesComponent;
  let fixture: ComponentFixture<MyPropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [MyPropertiesComponent]
    });
    fixture = TestBed.createComponent(MyPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
