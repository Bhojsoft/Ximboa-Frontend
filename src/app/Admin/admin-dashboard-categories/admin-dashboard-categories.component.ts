import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/common_service/admin.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;


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
    this.getallcategory();
  }

    getallcategory(){
      this.categoryService.getcategorydata().subscribe( data =>{
        console.log('Data retrieved: ', data); 
        this.showCategorydata = data;
      });
    }

  onFileSelected(event: any): void {
    this.category_image = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.category_name || !this.sub_title || !this.category_image) {
      Swal.fire('Validation Error', 'All fields are required!', 'error');
      return;
    }

    if (this.category_name && this.category_image) {
      this.categoryService.postCategory(this.category_name,this.sub_title, this.category_image).subscribe(
        response => {
          // console.log('Category posted successfully', response);
          Swal.fire('Ohh...!', 'Category Added Successfully..!', 'success');
          bootstrap.Modal.getInstance(document.getElementById('AddcategoryModal'))?.hide();
          this.getallcategory();
        },
        error => {
          console.error(alert("Category Allready Exit..!"),'Error posting category', error);
        }
      );
    }
  }


    onDelete(id: string): void {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this Category? This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.categoryService.deletecategorybyID(id).subscribe(
            response => {
              Swal.fire('Deleted!','The category has been deleted successfully.','success' );
              this.getallcategory();
            },
            error => {
              Swal.fire('Error!', 'An error occurred while deleting the category.','error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled','The category is safe :)', 'info');
        }
      });
    }
    
  


  



  
  

}
