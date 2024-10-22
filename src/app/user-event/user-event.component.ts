import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-user-event',
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.css']
})
export class UserEventComponent implements OnInit {

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 8; 
  showeventdata: any[] = [];
  filteredEvent: any[] = [];
  selectedCategories: any; 
  p: number = 1;
  searchTerm: string = ''; // New property for search term
  term:any;
  constructor(private Dservice: DashboardService, private filter: FilterService, private http: HttpClient, private searchService: SearchService) { }

  ngOnInit(): void {
    
    this.loadEvents(this.currentPage, this.itemsPerPage);

    this.filter.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.filterEvents(); // Re-filter on category selection
    });

    // Subscribe to search term changes
    this.searchService.currentSearchData.subscribe(term => {
      this.searchTerm = term;
      console.log('Received search term in UserEventComponent:', this.searchTerm);
      this.fetchEvents(); // Fetch events based on search term
    });
  }

  loadEvents(page: number, limit: number):void{
    this.Dservice.Eventdata(page, limit).subscribe(Response => {
      console.log(Response);
      this.showeventdata = Response.data;
      this.filteredEvent = this.showeventdata;
      this.totalItems = Response.pagination.totalItems;
      this.filterEvents(); // Initial filter
    });
  }

  filterEvents(): void {
    this.filteredEvent = this.showeventdata;

    // Apply search term filter
    if (this.searchTerm) {
      this.filteredEvent = this.filteredEvent.filter(event =>
        event.event_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    // if (this.selectedCategories.length > 0) {
    //   this.filteredEvent = this.filteredEvent.filter(event =>
    //     this.selectedCategories.includes(event?.event_category)
    //   );
    // }
    if (this.selectedCategories.length > 0) {
      this.Dservice.getEventdatacategory(this.currentPage, this.itemsPerPage, this.selectedCategories)
        .subscribe(result => {
          console.log("filtered category wise Events", result);  
          this.filteredEvent = result.data.filter((event:any) =>
            this.selectedCategories.includes(event.event_category)
          );
        });
    }

    // console.log('Filtered Events:', this.filteredEvent); // Log filtered events for debugging
  }

   // Handle page change for pagination
   onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents(this.currentPage, this.itemsPerPage); 
    this.p = page;
  }

  fetchEvents(): void {
    if (this.searchTerm) {
      this.http.get<any>(`http://localhost:1000/search/events?event_name=${this.searchTerm}`)
        .subscribe(
          (response) => {
            this.showeventdata = response.data; // Update showeventdata with search results
            console.log('Fetched Events:', this.showeventdata); // Log fetched data
            this.filterEvents(); // Apply filter after fetching events
          },
          (error) => {
            console.error('Error fetching events:', error);
          }
        );
    } else {
      this.loadEvents(this.currentPage,this.itemsPerPage);
    }
  }
}



