import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrainerService } from '../common_service/trainer.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile-picture',
  templateUrl: './edit-profile-picture.component.html',
  styleUrls: ['./edit-profile-picture.component.css']
})
export class EditProfilePictureComponent implements OnInit {

  currentImage: string | null = null; 
  trainer_image: File | null = null;
  

  constructor( private service: TrainerService, private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTrainerData();  // Call function to load trainer data on init
  }

  loadTrainerData(): void {
    this.service.gettrainerbyID().subscribe((data: any) => {
      console.log("Trainer Details", data);     
      this.currentImage = data.trainer_image; 
    });
  }

  onFileSelected(event: any): void {
    this.trainer_image = event.target.files[0];
  }

  onSubmit() {
   
    if (!this.trainer_image) {
      alert("Please select an image to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append('trainer_image', this.trainer_image);
  
    this.service.updatetrainerDetails( formData).subscribe({
      next: (response: any) => {
        console.log(response);
        alert("Image Updated");
        this.loadTrainerData();
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
        alert("Error updating image.");
      }
    });
  }
  
}



