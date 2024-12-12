import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';


declare var bootstrap: any;


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  isUser: boolean = true; // Example default value; adjust as needed
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isInstitute: boolean = false;
  isAdmin: boolean = false;

  showproductdatauser:any;
  showproductdata: any;
  selectedProduct: any;
  showCategorydata: any;
  starsArray: number[] = [1, 2, 3, 4, 5]; // 5 stars total
  id:any;
  Showproductdata:any;
  showpendingProducts:any;
  product_image: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null; 
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png']; 


  showIcon = false;
  toggleIcon() {
    this.showIcon = !this.showIcon;
  }

  checkUserRole() {
    const role = this.auth.getUserRole();
    console.log("product role", role);
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER' || role === 'TRAINER' || role === 'SELF_EXPERT' || role === 'INSTITUTE' || role === 'SUPER_ADMIN';
  }


  product = {
    product_name: '',
    product_prize: '',
    product_selling_prize: '',
    categoryid: '',
    sub_category:'',
    product_flag: '',
    tags: [],
    products_info: '',
    products_description: '',
    product_image: '',
    product_gallary: '',
  };

  // selectedFile: File | null = null;
  formSubmitted: boolean = false;

  constructor(private service: TrainerService, private admin: AdminService, private auth: AuthServiceService,
    private dashborad : DashboardService, private router:ActivatedRoute) { }

 

  ngOnInit(): void {

    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.ProductDetails(); // Fetch user details when 'id' is available
      }
    });

    this.getPendingProducts();

    this.checkUserRole();
    this.loadproduct();
    this.loadpurchaseProduct();

    this.dashborad.getcategoryname().subscribe(data => {
      this.showCategorydata = data;
    });

  }

  loadproduct() {
    this.service.GetAllProductbyTrainerID().subscribe(data => {
      this.showproductdata = data?.productsWithFullImageUrl;
    });
  }

  loadpurchaseProduct(){
    this.service.getproductdatabyID().subscribe((result:any) =>{
      this.showproductdatauser = result?.data;      
    })
  }

  getPendingProducts(){
    this.service.getAllProductRequest().subscribe(response => {
      console.log("requested courses",response);
      this.showpendingProducts = response.data;
    })
  }


  ProductDetails() {
    if (this.id) {
      this.service.ViewRequestProductbyID(this.id).subscribe(result => {
        this.Showproductdata = result;
        console.log("User Details:", this.Showproductdata);
      });
    }
  }

  openProductDetailsModal(userId: string): void {
    this.service.ViewRequestProductbyID(userId).subscribe(result => {
      this.Showproductdata = result;
      console.log("User Details:", this.Showproductdata);
    });
  }

  handleProductApproval(productId: string, Status: string) {
    if (Status === 'rejected') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to reject this Product? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.ProductrequestchangeStatus(productId, Status).subscribe(
            (response) => {
              this.getPendingProducts();
              Swal.fire('Request Rejected', 'The Trainer Product request Status has been successfully Rejected.', 'success');
            },
            (error) => {
              Swal.fire('Error', 'Failed to reject the request. Please try again later.', 'error');
            }
          );
        }
      });
    } else if (Status === 'approved') {
      this.service.ProductrequestchangeStatus(productId, Status).subscribe(
        (response) => {
          this.getPendingProducts();
          Swal.fire('Request Approved', 'The Trainer Product Status has been successfully updated.', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Failed to approve the request. Please try again later.', 'error');
        }
      );
    }
  }


  onSubmit(productForm: any) {

    this.formSubmitted = true;

    // Check if form is valid
    if (productForm.invalid) {
      Swal.fire('Validation Error', 'Please ensure all required fields are filled out correctly before submitting.', 'warning');
      return;
    }

    const formData = new FormData();

    formData.append('product_name', this.product.product_name);
    formData.append('product_prize', this.product.product_prize.toString());
    formData.append('product_selling_prize', this.product.product_selling_prize.toString());
    formData.append('categoryid', this.product.categoryid);
    formData.append('sub_category', this.product.sub_category);
    formData.append('products_info', this.product.products_info);
    formData.append('products_description', this.product.products_description);
    formData.append('product_flag', this.product.product_flag);

    if (Array.isArray(this.product.tags)) {
      const tagsArray = this.product.tags.map((tag: any) => tag.name); // Extract 'name' from each object
      formData.append('tags', tagsArray.join(', ')); // Join into a comma-separated string
    }


    if (this.product_image) {
      formData.append('product_image', this.product_image, this.product_image.name);
      // formData.append('product_gallary',this.selectedFile, this.selectedFile.name);
    }

    this.service.addProduct(formData).subscribe(
      response => {
        Swal.fire('Ohh...!', 'Product Added Successfully..!', 'success');
        this.loadproduct();
        bootstrap.Modal.getInstance(document.getElementById('AddProductModal'))?.hide();
      },
      error => {
        Swal.fire('Error', 'Please fill the details', 'error');
      }
    );
  }


  // async onFileSelected(event: any): Promise<void> {
  //   const file = event.target.files[0];
    
  //   if (!file) return;
  
  //   if (file.size > this.maxFileSizeMB * 1024 * 1024) {
  //     Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
  //     return;
  //   }
  
  //   if (!this.allowedFileTypes.includes(file.type)) {
  //     Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.', 'error');
  //     return;
  //   }
  
  //   try {
  //     const compressionOptions = {
  //       maxSizeMB: 5,
  //       maxWidthOrHeight: 1000,
  //       useWebWorker: true,
  //     };
  //     const compressedFile = await imageCompression(file, compressionOptions);
  
  //     // Convert to AVIF or WebP
  //     const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp'); // Change to 'image/avif' for AVIF format
  
  //     console.log('Original file size:', file.size / 1024 / 1024, 'MB');
  //     console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
  //     console.log('Converted file size:', convertedFile.size / 1024 / 1024, 'MB');
  
  //     this.product_image = convertedFile;
  
  //     // Preview the new image
  //     this.imageObjectURL = URL.createObjectURL(convertedFile);
  
  //   } catch (error) {
  //     console.error('Error during compression or conversion:', error);
  //     Swal.fire('Error', 'There was an error processing the image. Please try again.', 'error');
  //   }
  // }
  
  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
  
    if (!file) return;
  
    // Ensure course name is available before proceeding
    const productName = this.product.product_name.trim().replace(/\s+/g, '_'); // Replace spaces with underscores to make the filename valid
    if (!productName) {
      Swal.fire('Error', 'Course name is missing. Please ensure the course name is provided.', 'error');
      return;
    }
  
    // Check if the file is too large
    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
      return;
    }
  
    // Check if the file type is valid
    if (!this.allowedFileTypes.includes(file.type)) {
      Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.', 'error');
      return;
    }
  
    try {
      const compressionOptions = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, compressionOptions);
  
      // Convert the compressed image to desired format (e.g., WebP)
      const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp'); // Change to 'image/avif' if needed
  
      // Create a new file name by combining the course name and the original file extension
      const fileExtension = convertedFile.name.split('.').pop();
      const newFileName = `${productName}.${fileExtension}`;
  
      // Create a new File object with the updated name
      const renamedFile = new File([convertedFile], newFileName, {
        type: convertedFile.type,
        lastModified: Date.now(),
      });
  
      // Log the file information (optional)
      console.log('Original file size:', file.size / 1024 / 1024, 'MB');
      console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
      console.log('Converted file size:', convertedFile.size / 1024 / 1024, 'MB');
      console.log('Renamed file:', renamedFile);
  
      // Set the renamed file for uploading
      this.product_image = renamedFile;
  
      // Preview the renamed image
      this.imageObjectURL = URL.createObjectURL(renamedFile);
  
    } catch (error) {
      console.error('Error during compression or conversion:', error);
      Swal.fire('Error', 'There was an error processing the image. Please try again.', 'error');
    }
  }
 
  async convertImageFormat(file: File, format: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
  
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + `.${format.split('/')[1]}`, {
                  type: format,
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                reject(new Error('Canvas conversion failed.'));
              }
            },
            format, 0.9);
        };
        img.onerror = (err) => {
          reject(new Error('Error loading image for conversion: ' + err));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => {
        reject(new Error('Error reading file: ' + err));
      };
      reader.readAsDataURL(file);
    });
  }


  onDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Product? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteproductBYID(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The product has been deleted successfully.', 'success');
            this.loadproduct();
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the course.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The product is safe :)', 'info');
      }
    });
  }


  showproductName = false;
trunproductName(name: string): string {
 return name.length > 18 ? name.slice(0, 3) + '...' : name;
}
showproductName1 = false;
trunproductName1(name: string): string {
 return name.length > 18 ? name.slice(0, 3) + '...' : name;
}


subCategory: any = []; // Holds the subcategory data
    fetchcategoryID: string = ''; // Holds the selected category ID
    
    getsubcategory(): void {
      if (this.fetchcategoryID) {
        this.admin.getsubcategorybyCategoryID(this.fetchcategoryID).subscribe(result => {
          console.log("subcategoryyy",result);
          this.subCategory = result?.data;
        });
      } else {
        this.subCategory = []; // Clear subcategory data if no category selected
      }
    }



}