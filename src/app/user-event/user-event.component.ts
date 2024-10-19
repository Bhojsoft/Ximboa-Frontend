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
  showeventdata: any[] = [];
  filteredEvent: any[] = [];
  selectedCategories: string[] = []; 
  // selectedEvent: any;
  p: number = 1;
  searchTerm: string = ''; // New property for search term
  term:any;
  constructor(private Dservice: DashboardService, private filter: FilterService, private http: HttpClient, private searchService: SearchService) { }

  ngOnInit(): void {
    this.Dservice.Eventdata().subscribe(Response => {
      console.log(Response);
      this.showeventdata = Response;
      this.filterEvents(); // Initial filter
    });

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

  filterEvents(): void {
    this.filteredEvent = this.showeventdata;

    // Apply search term filter
    if (this.searchTerm) {
      this.filteredEvent = this.filteredEvent.filter(event =>
        event.event_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (this.selectedCategories.length > 0) {
      this.filteredEvent = this.filteredEvent.filter(event =>
        this.selectedCategories.includes(event?.event_category)
      );
    }

    // console.log('Filtered Events:', this.filteredEvent); // Log filtered events for debugging
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
      // If no search term, reload all events
      this.Dservice.Eventdata().subscribe(Response => {
        this.showeventdata = Response;
        this.filterEvents(); // Filter with all events
      });
    }
  }
}



// import { Component, OnInit } from '@angular/core';
// import { DashboardService } from '../common_service/dashboard.service';
// import { FilterService } from '../common_service/filter.service';

// @Component({
//   selector: 'app-user-event',
//   templateUrl: './user-event.component.html',
//   styleUrls: ['./user-event.component.css']
// })
// export class UserEventComponent implements OnInit {

//   showeventdata: any[] = [];
//   filteredEvent: any[] = [];
//   selectedCategories: string[] = []; 
//   selectedEvent: any;
//   p: number = 1;



//   constructor(private Dservice: DashboardService, private filter: FilterService) { }

//   ngOnInit(): void {
//     this.Dservice.Eventdata().subscribe(Response => {
//       console.log(Response);
//       this.showeventdata = Response;
//       // this.filteredEvent = this.showeventdata;
//       this.filterEvents()
//     });

//     this.filter.selectedCategories$.subscribe(categories => {
//       this.selectedCategories = categories;
//       this.filterEvents();
//     });
//     // this.filter.selectedCategories$.subscribe(selectedCategories => {
//     //   if (selectedCategories.length > 0) {
//     //     this.filteredEvent = this.showeventdata.filter((event: any) =>
//     //       selectedCategories.includes(event.event_category.category_name)
//     //     );
//     //   } else {
//     //     this.filteredEvent = this.showeventdata; // Show all courses if no category is selected
//     //   }
//     // });
//   }

//   filterEvents(): void {
//     if (this.selectedCategories.length > 0) {
//       this.filteredEvent = this.showeventdata.filter((Events: any) => 
//         this.selectedCategories.includes(Events.event_category?.category_name)
//       );
//     } else {
//       this.filteredEvent = this.showeventdata;  // No filtering if no categories selected
//     }
//   }
// }
