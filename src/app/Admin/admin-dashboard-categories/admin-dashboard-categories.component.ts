import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/common_service/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard-categories',
  templateUrl: './admin-dashboard-categories.component.html',
  styleUrls: ['./admin-dashboard-categories.component.css']
})
export class AdminDashboardCategoriesComponent implements OnInit {

  showIcon = false;
  toggleIcon() {
    this.showIcon = !this.showIcon;
  }
  showCategorydata: any[] = [];
  category_name: string = '';
  sub_title:string = '';
  category_image: File | null = null;

  constructor(private categoryService:AdminService  ){}

  ngOnInit(): void{
    this.categoryService.getcategorydata().subscribe( data =>{
      console.log('Data retrieved: ', data); 
      this.showCategorydata = data;
    });
  }


  onFileSelected(event: any): void {
    this.category_image = event.target.files[0];
  }

  onSubmit(): void {
    if (this.category_name && this.category_image) {
      this.categoryService.postCategory(this.category_name,this.sub_title, this.category_image).subscribe(
        response => {
          // console.log('Category posted successfully', response);
          this.successNotification();
          window.location.reload();
        },
        error => {
          console.error(alert("Category Allready Exit..!"),'Error posting category', error);
        }
      );
    }
  }


  onDelete(id: string): void {
    this.categoryService.deletecategorybyID(id).subscribe(
      response => {
        
        console.log(alert("Category deleted successfully"),'Data deleted successfully', response);
        window.location.reload();
      },
      error => {
        console.error(alert("Error"),'Error deleting data', error);
        // Handle error (e.g., show an error message)
      }
    );
    
  }


  

  successNotification() {
    Swal.fire('Ohh...!', 'Category Added Successfully..!', 'success');
  }

  
  

}
