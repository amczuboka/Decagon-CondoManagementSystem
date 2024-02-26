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
});
