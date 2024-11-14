import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';



@Component({
  selector: 'app-seeallcategories',
  templateUrl: './seeallcategories.component.html',
  styleUrls: ['./seeallcategories.component.css']
})
export class SeeallcategoriesComponent implements OnInit {

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 9; 
  ShowCourseData: any[] = [];   
  filteredCourses: any;  
  selectedCategories: any; 
  p: number = 1;
  term:any;
  searchTerm: string = '';
  courses: any[] = [];

  constructor(private service: DashboardService, private filter: FilterService,
    private http:HttpClient, private searchService: SearchService) {}

  ngOnInit(): void {
    this.loadCourses(this.currentPage, this.itemsPerPage);

    // Subscribe to selected categories from FilterService
    this.filter.selectedCategories$.subscribe(selectedCategories => {
      this.selectedCategories = selectedCategories;
      this.filteredCourses = this.ShowCourseData;
      this.applyFilter();
      this.searchFilter();
    });
    
    this.searchService.currentSearchData.subscribe((term) => {
      this.searchTerm = term;
      console.log('Received search term in SeeAllCategoriesComponent:', this.searchTerm);  // Log the search term
      this.fetchCourses();
    });

    

}
  // Fetch courses from the backend
  loadCourses(page: number, limit: number): void {
    this.service.getcouserdata(page, limit).subscribe(result => {
      console.log(result);
      
      this.ShowCourseData = result.coursesWithFullImageUrl;
      this.filteredCourses = this.ShowCourseData;
      this.totalItems = result.pagination.totalItems;
      this.applyFilter();  // Apply the filter after loading courses
      this.searchFilter();
    });
  }

  // Apply filtering logic based on selected categories
  // applyFilter(): void {
  //   // First, reset to full data
  //   this.filteredCourses = this.ShowCourseData;
  
  //   // Apply search term filter
  //   if (this.searchTerm) {
  //     this.filteredCourses = this.filteredCourses.filter((course:any) =>
  //       course.course_name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     );
  //   }
    // if (this.selectedCategories.length > 0) {
    //   this.service.getcouserdatacategory(this.currentPage, this.itemsPerPage, this.selectedCategories)
    //     .subscribe(result => {
    //       console.log("filtered category wise course", result);  
    //       // Update filteredCourses directly with the result from API
    //       this.filteredCourses = result.data.filter((course:any) =>
    //         this.selectedCategories.includes(course.category_name)
    //       );
    //       this.totalItems = result.pagination.totalItems;
    //     });
    // }

    //   console.log('Filtered Courses:', this.filteredCourses);  // Log filtered courses for debugging
  //   this.filteredCourses = this.ShowCourseData;

  // }

  searchFilter(): void{
    // First, reset to full data
    this.filteredCourses = this.ShowCourseData;

    // Apply search term filter
    if (this.searchTerm) {
      this.filteredCourses = this.filteredCourses.filter((course: any) =>
        course.course_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.totalItems = this.filteredCourses.length;
    }
  }

  applyFilter(): void {
    // First, reset to full data
    this.filteredCourses = this.ShowCourseData;

    // Apply category filter if selected
    if (this.selectedCategories.length > 0) {
      this.service.getcouserdatacategory(this.currentPage, this.itemsPerPage, this.selectedCategories)
        .subscribe(result => {
          console.log("Filtered category-wise courses:", result);  
          // Update filteredCourses directly with the result from the API
          this.filteredCourses = result.data.filter((course: any) =>
            this.selectedCategories.includes(course.category_name)
          );
          this.totalItems = result.pagination.totalItems;
        // }, error => {
        //   console.error('Error fetching category data:', error);
        //   const selectedCategoryNames = this.selectedCategories.join(', ');
        //   alert(`${selectedCategoryNames} category not found. Showing all courses.`);
        //   // Reset to full data if there's an error
        //   this.filteredCourses = this.ShowCourseData;
        //   this.totalItems = this.filteredCourses.length; // Reset totalItems for all courses
        });
    } else {
      this.service.getcouserdata(this.currentPage, this.itemsPerPage).subscribe(result => {
        console.log(result);
        this.ShowCourseData = result.coursesWithFullImageUrl;
        this.totalItems = result.pagination.totalItems;
      });
    }

    console.log('Filtered Courses:', this.filteredCourses);  // Log filtered courses for debugging
}


  // Handle page change for pagination
  onPageChange(page: number): void {
    this.currentPage = page;
    this.p = page;
    this.loadCourses(this.currentPage, this.itemsPerPage); 
  }


  fetchCourses() {
    if (this.searchTerm) {
      this.http.get<any>(`http://13.203.89.189/api/search/courses?course_name=${this.searchTerm}`)
        .subscribe(
          (response) => {
            this.ShowCourseData = response.data;  // Store the received data in ShowCourseData
            console.log('Fetched Courses:', this.ShowCourseData);  // Log the received data
            // this.applyFilter();  
            this.searchFilter();
            this.totalItems = response.pagination.totalItems;
            // Apply filter after fetching the data
          },
          (error) => {
            console.error('Error fetching courses:', error);
          }
        );
    } else {
      this.loadCourses(this.currentPage, this.itemsPerPage);   // Clear data if no search term
    }
  }
  
    // conver Rupees K or laks
    getFormattedPrice(price: number): string {
      if (price >= 100000) {
        return '₹' + (price / 100000).toFixed(1) + 'L';  
      } else if (price >= 1000) {
        return '₹' + (price / 1000).toFixed(1) + 'K'; 
      } else {
        return '₹' + price.toString(); 
      }
    }
    
}
