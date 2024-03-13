import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionComponent } from './description.component';
import { Condo } from '../../../models/properties';

describe('DescriptionComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;
  let mockCondo: Partial<Condo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;

    // Initialize mock data
    mockCondo = {
      Description: 'Spacious condo with great amenities',
    };

    component.condo = mockCondo as Condo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
