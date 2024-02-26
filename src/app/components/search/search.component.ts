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

  // Event handler for when search text changes
  // Emits the entered search value and logs it to the console
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
