import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrainerService } from '../common_service/trainer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile-picture',
  templateUrl: './edit-profile-picture.component.html',
  styleUrls: ['./edit-profile-picture.component.css']
})
export class EditProfilePictureComponent implements OnInit {

  currentImage: string | null = null; 
  trainer_image: File | null = null;
  maxFileSizeMB: number = 2; // Limit file size to 2 MB
  allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'];
  minResolution = { width: 400, height: 400 };
  maxResolution = { width: 2000, height: 2000 };
  uploadAttempts = 0;
  maxAttempts = 5;

  constructor(private service: TrainerService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTrainerData();
  }

  loadTrainerData(): void {
    this.service.gettrainerbyID().subscribe((data: any) => {   
      this.currentImage = data.trainer_image;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      // Check file size
      if (file.size > this.maxFileSizeMB * 1024 * 1024) {
        Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
        return;
      }

      // Check file format
      if (!this.allowedFileTypes.includes(file.type)) {
        Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, PNG, or JPEG image.', 'error');
        return;
      }

      // Attempt to load the image to validate resolution
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Check image resolution
        if (width < this.minResolution.width || height < this.minResolution.height ||
            width > this.maxResolution.width || height > this.maxResolution.height) {
          Swal.fire('Invalid Resolution', `Please upload an image with a resolution between ${this.minResolution.width}x${this.minResolution.height} and ${this.maxResolution.width}x${this.maxResolution.height} pixels.`, 'error');
          return;
        }

        // If all checks pass, assign the image file
        this.trainer_image = file;
      };

      img.onerror = () => {
        Swal.fire('File Corrupted', 'The file appears to be corrupted. Please try a different image.', 'error');
      };

      img.src = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (!this.trainer_image) {
      Swal.fire('Error', 'Please select an image to upload.', 'error');
      return;
    }

    // Check if user has exceeded the maximum number of upload attempts
    if (this.uploadAttempts >= this.maxAttempts) {
      Swal.fire('Too Many Attempts', 'You’ve made too many upload attempts. Please wait a few minutes before trying again.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('trainer_image', this.trainer_image);

    this.service.updatetrainerDetails(formData).subscribe({
      next: (response: any) => {
        Swal.fire('Success', 'Image updated successfully.', 'success');
        this.loadTrainerData();
        this.cd.detectChanges();
        this.uploadAttempts = 0; // Reset attempts after successful upload
      },
      error: (error: any) => {
        // Handle specific network error scenario
        if (error.status === 0) {
          Swal.fire('Network Error', 'Network issue detected. Please check your connection and try again.', 'error');
        } else {
          Swal.fire('Upload Failed', 'There was an error uploading your profile image. Please try again or choose a different file.', 'error');
        }
        this.uploadAttempts++;
      }
    });
  }

  
}
