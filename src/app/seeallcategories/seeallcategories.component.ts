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
  itemsPerPage = 8; 
  ShowCourseData: any[] = [];   
  filteredCourses: any[] = [];  
  selectedCategories: string[] = []; 
  p: number = 1;
  term:any;
  courses: any[] = [];
  searchTerm: string = '';

  constructor(private service: DashboardService, private filter: FilterService,
    private http:HttpClient, private searchService: SearchService ) {}

  ngOnInit(): void {
    this.loadCourses(this.currentPage, this.itemsPerPage);

    // Subscribe to selected categories from FilterService
    this.filter.selectedCategories$.subscribe(selectedCategories => {
      this.selectedCategories = selectedCategories;
      // this.filteredCourses = this.ShowCourseData;
      this.applyFilter();
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
    });
  }

  // Apply filtering logic based on selected categories
  applyFilter(): void {
    // First, reset to full data
    this.filteredCourses = this.ShowCourseData;
  
    // Apply search term filter
    if (this.searchTerm) {
      this.filteredCourses = this.filteredCourses.filter(course =>
        course.course_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    // Apply category filter (if any categories are selected)
    if (this.selectedCategories.length > 0) {
      this.filteredCourses = this.filteredCourses.filter(course =>
        this.selectedCategories.includes(course.category_name)
      );
    }
    
    // this.totalItems = this.filteredCourses.length;
  
    console.log('Filtered Courses:', this.filteredCourses);  // Log filtered courses for debugging
  }
  
  

  // Handle page change for pagination
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCourses(this.currentPage, this.itemsPerPage); 
    this.p = page;
  }

  updateFilteredCourses() {
    if (this.term) {
      this.filteredCourses = this.ShowCourseData.filter(course =>
        course.course_name.toLowerCase().includes(this.term.toLowerCase())
      );
    } else {
      this.filteredCourses = this.ShowCourseData;
    }
  
    this.p = 1;  // Reset to the first page after filtering
  }
  

  fetchCourses() {
    if (this.searchTerm) {
      this.http.get<any>(`http://localhost:1000/search/courses?course_name=${this.searchTerm}`)
        .subscribe(
          (response) => {
            this.ShowCourseData = response.data;  // Store the received data in ShowCourseData
            console.log('Fetched Courses:', this.ShowCourseData);  // Log the received data
            this.applyFilter();  // Apply filter after fetching the data
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
