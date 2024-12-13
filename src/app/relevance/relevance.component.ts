import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../search.service';
import { AdminService } from '../common_service/admin.service';

@Component({
  selector: 'app-relevance',
  templateUrl: './relevance.component.html',
  styleUrls: ['./relevance.component.css']
})
export class RelevanceComponent implements OnInit {

  Showcategorydata: any[] = [];
  filteredCategoryData: any[] = [];  
  selectedCategories: string[] = [];
  
  category: string = '';
  categoryID : string = '';
  selectedSortOption: string = '';

  inputPlaceholder: string = 'Search';

  updatePlaceholder(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case 'Courses':
        this.inputPlaceholder = 'Search Courses';
        this.router.navigate(['/relevance/Allcourses']); 
        break;
      case 'Trainers':
        this.inputPlaceholder = 'Search Trainers';
        this.router.navigate(['/relevance/alltrainer']); 
        break;
      case 'Products':
        this.inputPlaceholder = 'Search Products';
        this.router.navigate(['/relevance/allproducts']); 
        break;
      case 'Events':
        this.inputPlaceholder = 'Search Events';
        this.router.navigate(['/relevance/allevents']); 
        break;
    }
  }

  constructor(private service: DashboardService, private filter: FilterService,
     private route: ActivatedRoute, private router:Router,
     private searchService:SearchService, private admin:AdminService) {}

  ngOnInit(): void {
    this.service.getcategoryname().subscribe(data => {
      this.Showcategorydata = data;
    });

    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';  
      this.categoryID = params['id'] || '';  
      console.log("category id",this.categoryID);
      this.getsubcategory();      
    });

    this.initializeSelectedCategory();  // Apply category filter on route param change
  }

  subCategory: any = []; // Holds the subcategory data
  fetchcategoryID: string = ''; // Holds the selected category ID

  getsubcategory(): void {
    if (this.categoryID) {
      this.admin.getsubcategorybyCategoryID(this.categoryID).subscribe(result => {
        this.subCategory = result.data || [];
        console.log("lkjhgfcvbnjuhygtfv",result);
        
      });
    } else {
      this.subCategory = []; // Clear subcategory data if no category selected
    }
  }

  // Initialize selected category from query params
  initializeSelectedCategory(): void {
    if (this.category) {
      this.selectedCategories = [this.category];  
      console.log("what are the category",this.selectedCategories);      
      this.filter.updateSelectedCategories(this.selectedCategories);  // Update FilterService with selected categories
      this.applyCategoryFilter();  // Apply the filter to the category data
    }
  }

  // Apply the filter to the category data
  applyCategoryFilter(): void {
    if (this.selectedCategories.length > 0) {
      this.filteredCategoryData = this.Showcategorydata.filter(cat =>
        this.selectedCategories.includes(cat.category_name));
    } else {
      this.filteredCategoryData = this.Showcategorydata;
    }
  }

  // Handle category selection change
  onCategoryChange(categoryName: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories.push(categoryName);
    } else {
      const index = this.selectedCategories.indexOf(categoryName);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }

    this.filter.updateSelectedCategories(this.selectedCategories);
    this.applyCategoryFilter();
  }

  // Handle "Select All" checkbox
  onSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories = this.Showcategorydata.map(cat => cat.category_name);  
    } else {
      this.selectedCategories = [];
    }

    this.filter.updateSelectedCategories(this.selectedCategories);
    this.applyCategoryFilter();
  }

  // Check if category is selected
  isCategorySelected(categoryName: string): boolean {
    return this.selectedCategories.includes(categoryName);
  }

  // Check if all categories are selected
  areAllCategoriesSelected(): boolean {
    return this.Showcategorydata.every(cat => this.selectedCategories.includes(cat.category_name));
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    console.log('Search Term:', searchTerm);  // Log search term
    this.searchService.changeSearchData(searchTerm);  // Update the search term in the service
  }

  onSortOptionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedSortOption = selectedValue;
    console.log('Selected Sort Option:', this.selectedSortOption);
    this.searchService.setSortOption(this.selectedSortOption);
  }
  
}

