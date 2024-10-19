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

  showproductdata: any[] = []; // Ensure it's an array
  selectedProduct: any;
  selectedCategories: string[] = []; 
  filteredProduct: any[] = [];
  p: number = 1;
  starsArray: number[] = [1, 2, 3, 4, 5]; // 5 stars total
  searchTerm: string = ''; // New property for search term

  constructor(
    private service: DashboardService, 
    private filter: FilterService,
    private http: HttpClient, 
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.loadProducts(); // Load initial product data

    // Subscribe to category changes
    this.filter.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.filterProducts(); // Re-filter when categories change
    });

    // Subscribe to search term changes
    this.searchService.currentSearchData.subscribe(term => {
      this.searchTerm = term;
      console.log('Received search term in UsersideProductComponent:', this.searchTerm);
      this.fetchProducts(); // Fetch products based on search term
    });
  }

  loadProducts(): void {
    this.service.productdata().subscribe(data => {
      console.log(data);
      this.showproductdata = data?.productsWithFullImageUrls; // Ensure it’s an array
      this.filterProducts(); // Apply filter after fetching the product data
    });
  }

  filterProducts(): void {
    // Start with all products
    this.filteredProduct = this.showproductdata;

    // Apply search term filter
    if (this.searchTerm) {
      this.filteredProduct = this.filteredProduct.filter(product =>
        product.products_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (this.selectedCategories.length > 0) {
      this.filteredProduct = this.filteredProduct.filter(product => 
        this.selectedCategories.includes(product?.products_category)
      );
    }

    // console.log('Filtered Products:', this.filteredProduct);
  }

  fetchProducts(): void {
    if (this.searchTerm) {
      this.http.get<any>(`http://localhost:1000/search/products?product_name=${this.searchTerm}`)
        .subscribe(
          response => {
            this.showproductdata = response.data; // Update showproductdata with search results
            console.log('Fetched Products:', this.showproductdata); // Log fetched data
            this.filterProducts(); // Apply filter after fetching products
          },
          error => {
            console.error('Error fetching products:', error);
          }
        );
    } else {
      this.loadProducts(); // Reload the product data if search term is empty
    }
  }

 
}




