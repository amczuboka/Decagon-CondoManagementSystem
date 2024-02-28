import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { AppModule } from 'src/app/app.module';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SearchComponent]
    });
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchTextChanged event with entered search value', () => {
    const enteredValue = 'testSearchValue';

    component.enteredSearchValue = enteredValue;

    component.onSearchTextChanged();

    component.searchTextChanged.subscribe((value) => {
      expect(value).toEqual(enteredValue);
    });
  });

});