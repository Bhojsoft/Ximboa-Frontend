import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-userside-product',
  templateUrl: './userside-product.component.html',
  styleUrls: ['./userside-product.component.css']
})
export class UsersideProductComponent implements OnInit {

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 9; 
  showproductdata: any[] = []; // Ensure it's an array
  filteredProducts: any[] = [];
  selectedCategories: any; 
  p: number = 1;
  term:any;
  products: any[] = [];
 
  starsArray: number[] = [1, 2, 3, 4, 5]; // 5 stars total
  searchTerm: string = ''; // New property for search term

  constructor(
    private service: DashboardService, 
    private filter: FilterService,
    private http: HttpClient, 
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.loadProducts(this.currentPage, this.itemsPerPage); // Load initial product data

    // Subscribe to category changes
    this.filter.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.applyFilter(); // Re-filter when categories change
      this.searchfilter();
    });

    // Subscribe to search term changes
    this.searchService.currentSearchData.subscribe(term => {
      this.searchTerm = term;
      console.log('Received search term in UsersideProductComponent:', this.searchTerm);
      this.fetchProducts(); // Fetch products based on search term
    });
  }

  loadProducts(page: number, limit: number): void {
    this.service.productdata(page, limit).subscribe(data => {
      // console.log(data);
      this.showproductdata = data?.productsWithFullImageUrls; // Ensure it’s an array
      this.filteredProducts = this.showproductdata;
      this.totalItems = data?.pagination.totalItems;
      this.applyFilter(); // Apply filter after fetching the product data
      this.searchfilter();
    });
  }

  searchfilter(): void{
    this.filteredProducts = this.showproductdata;

    if (this.searchTerm) {
      this.filteredProducts = this.filteredProducts.filter((product:any) =>
        product.products_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  applyFilter(): void {
    // Start with all products
    this.filteredProducts = this.showproductdata;

    if (this.selectedCategories.length > 0) {
      this.service.getproductdatacategory(this.currentPage, this.itemsPerPage, this.selectedCategories)
        .subscribe(result => {
          console.log("filtered category wise product", result);  
          this.filteredProducts = result.data.filter((product:any) =>
            this.selectedCategories.includes(product.products_category)
          );
          this.totalItems = result.pagination.totalItems;
        // }, error => {
        //     console.error('Error fetching category data:', error);
        //     const selectedCategoryNamesProduct = this.selectedCategories.join(', ');
        //     alert(`${selectedCategoryNamesProduct} category not found. Showing all Products.`);
            // Reset to full data if there's an error
            // this.filteredProducts = this.showproductdata;
            // this.totalItems = this.filteredProducts.length;

        });
    }else {
      this.service.productdata(this.currentPage, this.itemsPerPage).subscribe(data => {
        this.showproductdata = data?.productsWithFullImageUrls; // Ensure it’s an array
        this.totalItems = data?.pagination.totalItems;
       
      });
  }
}

  //  Handle page change for pagination
  
   onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts(this.currentPage, this.itemsPerPage); 
    this.p = page;
  }

  // updateFilteredCourses() {
  //   if (this.term) {
  //     this.filteredProducts = this.showproductdata.filter(product =>
  //       product.products_name.toLowerCase().includes(this.term.toLowerCase())
  //     );
  //   } else {
  //     this.filteredProducts = this.showproductdata;
  //   }
  
  //   this.p = 1;  // Reset to the first page after filtering
  // }

  fetchProducts(): void {
    if (this.searchTerm) {
      this.http.get<any>(`http://13.203.89.189/api/search/products?product_name=${this.searchTerm}`)
        .subscribe(
          response => {
            this.showproductdata = response.data; // Update showproductdata with search results
            console.log('Fetched Products:', this.showproductdata); // Log fetched data
            this.searchfilter(); // Apply filter after fetching products
            this.totalItems = response.pagination.totalItems;
          },
          error => {
            console.error('Error fetching products:', error);
          }
        );
    } else {
      this.loadProducts(this.currentPage, this.itemsPerPage); // Reload the product data if search term is empty
    }
  }

// conver Rupees K or laks
  getFormattedPrice(price: number): string {
    if (price >= 100000) {
      return '₹' + (price / 100000).toFixed(1) + 'L';  // For lakhs
    } else if (price >= 1000) {
      return '₹' + (price / 1000).toFixed(1) + 'K';  // For thousands
    } else {
      return '₹' + price.toString();  // For rupees
    }
  }

 
}




