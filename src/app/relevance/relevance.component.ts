import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../search.service';

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

  inputPlaceholder: string = 'Search';

  updatePlaceholder(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case 'Courses':
        this.inputPlaceholder = 'Search Courses';
        this.router.navigate(['/relevance/seeallcategory']); 
        break;
      case 'Trainers':
        this.inputPlaceholder = 'Search Trainers';
        this.router.navigate(['/relevance/trainer']); 
        break;
      case 'Products':
        this.inputPlaceholder = 'Search Products';
        this.router.navigate(['/relevance/userproduct']); 
        break;
      case 'Events':
        this.inputPlaceholder = 'Search Events';
        this.router.navigate(['/relevance/userevent']); 
        break;
    }
  }

  constructor(private service: DashboardService, private filter: FilterService,
     private route: ActivatedRoute, private router:Router,
     private searchService:SearchService) {}

  ngOnInit(): void {
    // Fetch category data
    this.service.getcategoryname().subscribe(data => {
      this.Showcategorydata = data;
      this.initializeSelectedCategory();  // Initialize category selection from query params
    });

    // Subscribe to route query parameters to detect changes
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';  
      this.initializeSelectedCategory();  // Apply category filter on route param change
    });
  }

  // Initialize selected category from query params
  initializeSelectedCategory(): void {
    if (this.category) {
      this.selectedCategories = [this.category];  
      this.filter.updateSelectedCategories(this.selectedCategories);  // Update FilterService with selected categories
      this.applyCategoryFilter();  // Apply the filter to the category data
    }
  }

  // Apply the filter to the category data
  applyCategoryFilter(): void {
    if (this.selectedCategories.length > 0) {
      this.filteredCategoryData = this.Showcategorydata.filter(cat =>
        this.selectedCategories.includes(cat.category_name)
      );
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
  
}


// import { Component, OnInit } from '@angular/core';
// import { DashboardService } from '../common_service/dashboard.service';
// import { FilterService } from '../common_service/filter.service';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-relevance',
//   templateUrl: './relevance.component.html',
//   styleUrls: ['./relevance.component.css']
// })
// export class RelevanceComponent implements OnInit {

//   Showcategorydata: any[] = [];
//   selectedCategories: string[] = [];
//   category: string = '';
//   id: string = '';

  

//   constructor(private service: DashboardService, private filter: FilterService, private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.service.getcategoryname().subscribe(data => {
//       this.Showcategorydata = data;
//       this.initializeSelectedCategory();
//     });

//     // Subscribe to route parameters
//     this.route.queryParams.subscribe(params => {
//       this.category = params['category'] || '';
//       console.log("category search",this.category);
//       this.id = params['id'] || '';
//       console.log("id",this.id);
//     });
//   }


//   initializeSelectedCategory() {
//     if (this.category) {
//       this.selectedCategories.push(this.category);
//       this.filter.updateSelectedCategories(this.selectedCategories);
//     }
//   }

//   onCategoryChange(categoryName: string, event: Event) {
//     const isChecked = (event.target as HTMLInputElement).checked;
//     if (isChecked) {
//       this.selectedCategories.push(categoryName);
//     } else {
//       const index = this.selectedCategories.indexOf(categoryName);
//       if (index > -1) {
//         this.selectedCategories.splice(index, 1);
//       }
//     }

//     this.filter.updateSelectedCategories(this.selectedCategories);
//     this.updateSelectAllCheckbox();
//   }

//   onSelectAll(event: Event): void {
//     const isChecked = (event.target as HTMLInputElement).checked;

//     if (isChecked) {
//       this.selectedCategories = this.Showcategorydata.map(cat => cat.category_name); 
//     } else {
//       this.selectedCategories = [];
//     }
//     this.filter.updateSelectedCategories(this.selectedCategories);
//   }

//   isCategorySelected(categoryName: string): boolean {
//     return this.selectedCategories.includes(categoryName);
    
//   }

//   areAllCategoriesSelected(): boolean {
//     return this.Showcategorydata.every(cat => this.selectedCategories.includes(cat.category_name));
//   }

//   updateSelectAllCheckbox(): void {
//     const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
//     if (selectAllCheckbox) {
//       selectAllCheckbox.checked = this.areAllCategoriesSelected();
      
//     }
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { DashboardService } from '../common_service/dashboard.service';
// import { FilterService } from '../common_service/filter.service';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-relevance',
//   templateUrl: './relevance.component.html',
//   styleUrls: ['./relevance.component.css']
// })
// export class RelevanceComponent implements OnInit {

//   Showcategorydata: any[] = [];
//   selectedCategories: string[] = [];
//   category: string='';
//   id: string='';

//   constructor(private service: DashboardService, private filter: FilterService,private route:ActivatedRoute) {}

//   ngOnInit(): void {
//     this.service.getcategoryname().subscribe(data => {
//       this.Showcategorydata = data;
//     });
  
//   }

//   onCategoryChange(categoryName: string, event: Event) {
//     const isChecked = (event.target as HTMLInputElement).checked;

//     if (isChecked) {
//       this.selectedCategories.push(categoryName);
//     } else {
//       const index = this.selectedCategories.indexOf(categoryName);
//       if (index > -1) {
//         this.selectedCategories.splice(index, 1);
//       }
//     }

//     this.filter.updateSelectedCategories(this.selectedCategories);
//     this.updateSelectAllCheckbox();
//   }

//   onSelectAll(event: Event): void {
//     const isChecked = (event.target as HTMLInputElement).checked;

//     if (isChecked) {
//       this.selectedCategories = this.Showcategorydata.map(cat => cat.category_name);
//     } else {
//       this.selectedCategories = [];
//     }

//     this.filter.updateSelectedCategories(this.selectedCategories);
//   }

//   isCategorySelected(categoryName: string): boolean {
//     return this.selectedCategories.includes(categoryName);
//   }

//   areAllCategoriesSelected(): boolean {
//     return this.Showcategorydata.every(cat => this.selectedCategories.includes(cat.category_name));
//   }

//   updateSelectAllCheckbox(): void {
//     const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
//     if (selectAllCheckbox) {
//       selectAllCheckbox.checked = this.areAllCategoriesSelected();
//     }
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { DashboardService } from '../common_service/dashboard.service';
// import { FilterService } from '../common_service/filter.service';

// @Component({
//   selector: 'app-relevance',
//   templateUrl: './relevance.component.html',
//   styleUrls: ['./relevance.component.css']
// })
// export class RelevanceComponent implements OnInit{

//   Showcategorydata:any[]=[];
//   selectedCategories: string[] = [];

//   constructor(private service:DashboardService, private filter:FilterService){}

// ngOnInit(): void {
//   this.service.getcategoryname().subscribe(data => {
//     this.Showcategorydata = data;
//   });
// }

// onCategoryChange(categoryName: string, event: Event) {
//   const isChecked = (event.target as HTMLInputElement).checked;

//   if (isChecked) {
//     this.selectedCategories.push(categoryName);
//   } else {
//     const index = this.selectedCategories.indexOf(categoryName);
//     if (index > -1) {
//       this.selectedCategories.splice(index, 1);
//     }
//   }
//   this.filter.updateSelectedCategories(this.selectedCategories);
// }

// onSelectAll(event: Event): void {
//   const isChecked = (event.target as HTMLInputElement).checked;

//   if (isChecked) {
//     this.selectedCategories = this.Showcategorydata.map(cat => cat.category_name);
//   } else {
//     this.selectedCategories = [];
//   }

//   // Ensure that all category checkboxes are updated
//   this.filter.updateSelectedCategories(this.selectedCategories);
// }

// }
