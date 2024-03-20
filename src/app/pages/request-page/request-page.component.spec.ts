import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPageComponent } from './request-page.component';

describe('RequestPageComponent', () => {
  let component: RequestPageComponent;
  let fixture: ComponentFixture<RequestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPageComponent]
    });
    fixture = TestBed.createComponent(RequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
