import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  showpendingEvents:any;
  ShowEvent:any;
  id:any;

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


  constructor(private service:TrainerService, private admin:AdminService, private auth: AuthServiceService,private router: ActivatedRoute){}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  ngOnInit(): void {

    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.EventsDetails(); // Fetch user details when 'id' is available
      }
    });
    this.getPendingEvents();
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
          this.showeventdata = data.eventsWithThumbnailUrl;
        });
      }

      getPendingEvents(){
        this.service.getAllEventsRequest().subscribe(response => {
          console.log("requested Events",response);
          this.showpendingEvents = response.data;
        })
      }
    
      EventsDetails() {
        if (this.id) {
          console.log();
          
          this.service.ViewRequestEventsbyID(this.id).subscribe(result => {
            this.ShowEvent = result;
            console.log("Event by ID Details:", this.ShowEvent);
          });
        }
      }
    
      openEventsDetailsModal(eventId: string): void {
        this.service.ViewRequestEventsbyID(eventId).subscribe(result => {
          this.ShowEvent = result;
          console.log("Event by ID Details:", this.ShowEvent);
        });
      }
    
      handleEventsApproval(Eventid: string, Status: string) {
        if (Status === 'rejected') {
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to reject this Event? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reject it',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              this.service.EventsrequestchangeStatus(Eventid, Status).subscribe(
                (response) => {
                  this.getPendingEvents();
                  Swal.fire('Request Rejected', 'The Trainer Course request Status has been successfully Rejected.', 'success');
                },
                (error) => {
                  Swal.fire('Error', 'Failed to reject the request. Please try again later.', 'error');
                }
              );
            }
          });
        } else if (Status === 'approved') {
          this.service.EventsrequestchangeStatus(Eventid, Status).subscribe(
            (response) => {
              this.getPendingEvents();
              Swal.fire('Request Approved', 'The Trainer Course Status has been successfully updated.', 'success');
            },
            (error) => {
              Swal.fire('Error', 'Failed to approve the request. Please try again later.', 'error');
            }
          );
        }
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
