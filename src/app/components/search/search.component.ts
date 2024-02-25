import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  
  enteredSearchValue: string = '';
  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>();

  onSearchTextChanged() {
    this.searchTextChanged.emit(this.enteredSearchValue);
    console.log(
      'yeah',
      this.searchTextChanged.emit(this.enteredSearchValue),
      ' and ',
      this.enteredSearchValue
    );
  }
}
