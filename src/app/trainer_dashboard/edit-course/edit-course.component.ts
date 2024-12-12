import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';


@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {

  showCategorydata: any[] = [];

  _id: any;
  uploadform!: FormGroup;
  thumbnail_image: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null; 
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png']; 


  constructor( 
    private router: ActivatedRoute,
    private admin: AdminService,
    private dashboard : DashboardService,
    private formb: FormBuilder,
    private route: Router
  ) {  
    this._id = this.router.snapshot.paramMap.get('_id');
  }

  ngOnInit() {
    this.uploadform = this.formb.group({
      _id: ['',Validators.required],
      course_name: ['',Validators.required],
      category_id: ['',Validators.required],
      online_offline: ['',Validators.required],
      trainer_id: ['',Validators.required],
      price: ['',Validators.required],
      offer_prize: ['',Validators.required],
      start_date: ['',Validators.required],
      end_date: ['',Validators.required],
      start_time: ['',Validators.required],
      end_time: ['',Validators.required],
      tags:['',Validators.required],
      course_information: ['',Validators.required],
      course_brief_info:['',Validators.required],
      thumbnail_image: ['',Validators.required] // This should be null for initialization
    });

    this.admin.getCourseById(this._id).subscribe(d => {
      console.log("Course Data",d);
      this.uploadform.patchValue({
        _id: d._id,
        course_name: d.course_name,
        category_id: d.category_id,
        online_offline: d.online_offline,
        trainer_id: d.trainer_id,
        price: d.price,
        offer_prize: d.offer_prize,
        start_date: d.start_date,
        end_date: d.end_date,
        start_time: d.start_time,
        end_time: d.end_time,
        tags: d.tags,
        course_information: d.course_information,
        course_brief_info:d.course_brief_info
      });
      this.thumbnail_image = d.thumbnail_image; // Clear previous image
    });

    this.dashboard.getcategoryname().subscribe(data => {
      console.log(data);
      this.showCategorydata = data;
    });
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
  
  //     this.thumbnail_image = convertedFile;
  
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
    const courseName = this.uploadform.get('course_name')?.value.trim().replace(/\s+/g, '_'); // Replace spaces with underscores to make the filename valid
    if (!courseName) {
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
      const newFileName = `${courseName}.${fileExtension}`;
  
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
      this.thumbnail_image = renamedFile;
  
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

  onSubmit() {
    const formData = new FormData();
        
    formData.append('_id',this.uploadform.get('_id')?.value);
    formData.append('course_name',this.uploadform.get('course_name')?.value);
    formData.append('category_id',this.uploadform.get('category_id')?.value);
    formData.append('online_offline',this.uploadform.get('online_offline')?.value);
    formData.append('price',this.uploadform.get('price')?.value);
    formData.append('offer_prize',this.uploadform.get('offer_prize')?.value);
    formData.append('start_date',this.uploadform.get('start_date')?.value);
    formData.append('end_date',this.uploadform.get('end_date')?.value);
    formData.append('start_time',this.uploadform.get('start_time')?.value);
    formData.append('end_time',this.uploadform.get('end_time')?.value);
    formData.append('tags',this.uploadform.get('tags')?.value);
    formData.append('course_information',this.uploadform.get('course_information')?.value);
    formData.append('course_brief_info',this.uploadform.get('course_brief_info')?.value);

      
    // Append file data if a file is selected
    if (this.thumbnail_image) {
      formData.append('thumbnail_image', this.thumbnail_image);
    }
  
  
    this.admin.updateCorseByID(this._id, formData).subscribe({
      next: response => {
        console.log('Update Response:', response); // Log response for debugging
        Swal.fire('Success', 'Course updated successfully!', 'success');
        this.route.navigate(['trainer/mycourse'])
      },
      error: error => {
        console.error('Update failed', error); // Log error for debugging
        Swal.fire('Error', 'Error updating course.', 'error');
      }
    });
  }

  subCategory: any = []; // Holds the subcategory data
  fetchcategoryID: string = ''; // Holds the selected category ID

  getsubcategory(): void {
    if (this.fetchcategoryID) {
      this.admin.getsubcategorybyCategoryID(this.fetchcategoryID).subscribe(result => {
        this.subCategory = result.data || [];
      });
    } else {
      this.subCategory = []; // Clear subcategory data if no category selected
    }
  }
  
}
