import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchData = new BehaviorSubject<string>('');  // This will store the search term
  currentSearchData = this.searchData.asObservable();

  constructor() {}

  changeSearchData(data: string) {
    this.searchData.next(data);  // This method updates the search term
  }
}
