import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPageComponent } from './request-page.component';
import { AppModule } from 'src/app/app.module';

describe('RequestPageComponent', () => {
  let component: RequestPageComponent;
  let fixture: ComponentFixture<RequestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [RequestPageComponent]
    });
    fixture = TestBed.createComponent(RequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit() should open snack bar with error message', () => {
    spyOn(component, 'openSnackBar');
    component.onSubmit();
    expect(component.openSnackBar).toHaveBeenCalledWith('You must select a request type.');
  });

  it('onSubmit() should open snack bar with success message', () => {
    spyOn(component, 'openSnackBar');
    component.requestForm.controls['RequestType'].setValue('Move In / Move Out');
    component.onSubmit();
    expect(component.openSnackBar).toHaveBeenCalledWith('Your request has been submitted.');
  });

  it('openSnackBar() should open snack bar with message', () => {
    spyOn<any>(component['_snackBar'], 'open');
    component.openSnackBar('test');
    expect(component['_snackBar'].open).toHaveBeenCalledWith('test', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  });
});
