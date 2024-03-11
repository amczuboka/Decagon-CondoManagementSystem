import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { CondoComponent } from './condo.component';

describe('CondoComponent', () => {
  let component: CondoComponent;
  let fixture: ComponentFixture<CondoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [CondoComponent],
    });
    fixture = TestBed.createComponent(CondoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to key-registration page when requestOwnership() is called', () => {
    const routerSpy = spyOn(component['router'], 'navigate'); 
    component.requestOwnership();
    expect(routerSpy).toHaveBeenCalledWith(['/key-registration']);
  });
  
});
