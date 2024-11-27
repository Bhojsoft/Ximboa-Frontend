import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent  implements OnInit{

  showeventdata:any;
  showCategorydata:any;
  selectedFile: File | null = null;
  showeventdatastudent:any[]=[];

  showIcon = false;
  toggleIcon() {
    this.showIcon = !this.showIcon;
  }

  isUser: boolean = true; 
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isInstitute : boolean = false;
  isAdmin : boolean = false;


  checkUserRole() {
    const role = this.auth.getUserRole();
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER'  || role === 'TRAINER' || role === 'SELF_EXPERT' || role === 'INSTITUTE' || role === 'SUPER_ADMIN' ;
  }

  event = {
    event_name: '',
    event_type: '',
    event_category: '',
    event_info:'',
    event_description:'',
    event_date:'',
    event_start_time: '',
    event_end_time: '',
    event_location:'',
    event_languages: '',
    estimated_seats:'',

    event_thumbnail:null,
  };

  formSubmitted: boolean = false;


  constructor(private service:TrainerService, private admin:AdminService, private auth: AuthServiceService){}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  ngOnInit(): void {
      
    this.checkUserRole();

    this.LoadMyEvent();

      this.admin.getcategorydata().subscribe( data =>{
        // console.log("data",data)
        this.showCategorydata = data;
      });

      this.service.getRegisteredEvents().subscribe((result:any) =>{
        console.log("Show My Events",result);
        this.showeventdatastudent = result.data;      
      })
  }

      LoadMyEvent(){
        this.service.gettrainerdatabyID().subscribe(data=>{
          // console.log(data);
          this.showeventdata = data.eventsWithThumbnailUrl;
        });
      }
      
  onSubmit(eventForm: any) {

    this.formSubmitted = true;
    if (eventForm.invalid) {
      Swal.fire('Validation Error', 'Please ensure all required fields are filled out correctly before submitting.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('event_name', this.event.event_name.trim());
    formData.append('event_type', this.event.event_type.trim());
    formData.append('event_category', this.event.event_category.trim());
    formData.append('event_info', this.event.event_info.trim());
    formData.append('event_description', this.event.event_description.trim());
    formData.append('event_date', this.event.event_date.trim());
    formData.append('event_start_time', this.event.event_start_time.trim());
    formData.append('event_end_time', this.event.event_end_time.trim());
    formData.append('event_location', this.event.event_location.trim());
    formData.append('event_languages', this.event.event_languages.trim());
    formData.append('estimated_seats', this.event.estimated_seats.trim());

  
    if (this.selectedFile) {
      formData.append('event_thumbnail', this.selectedFile, this.selectedFile.name);
    }
  
    this.service.AddEvent(formData).subscribe({
      next: (response) => {
        Swal.fire('Ohh...!', 'Event Added Successfully..!', 'success');
        this.LoadMyEvent();        
        bootstrap.Modal.getInstance(document.getElementById('AddEventModal'))?.hide();
      },
      error: (error) => {
        console.error("Error:", error);
        Swal.fire('Error', `Please fill the details. ${error.message}`, 'error');
      }
    });
  }
  
  onDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Event? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteEvent(id).subscribe(
          response => {
            Swal.fire('Deleted!','The event has been deleted successfully.','success' );
            this.LoadMyEvent();
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the course.','error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled','The event is safe :)', 'info');
      }
    });
  }

  showeventName = false;
  truneventName(name: string): string {
   return name.length > 14 ? name.slice(0, 12) + '...' : name;
 }
 showeventName1 = false;
  truneventName1(name: string): string {
   return name.length > 14 ? name.slice(0, 12) + '...' : name;
 }
  
}
